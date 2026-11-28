"""LLM calls for the content pipeline (scripts/bank/pipeline.py). Stdlib only.

Two backends, both headless:
  gemini  `agy -p <prompt> --model gemini-4-hydrogen-low --dangerously-skip-permissions`, cwd = the repo. The
          prompt tells the model to WRITE a JSON file; we read and validate that file (stdout is the fallback).
  haiku   `claude -p --model haiku --tools ""`, prompt on stdin, JSON on stdout. No tools means no permission
          prompts; we write any files ourselves.

Every output is validated by a caller-supplied function (raises ValueError with a message that says what is
wrong). On a failure the call is retried ONCE with that message appended to the prompt, then LLMError is raised.
Nothing about the user or their machine is added to a prompt: callers pass category data and repo-relative paths.

The "gemini" role (filter pass A, plan, escalate) can run on Claude instead: NULLION_A_BACKEND=claude runs
`claude -p --model $NULLION_A_MODEL --tools Read,Write --permission-mode acceptEdits`, so the same write-a-file
prompts work. Both passes on one model family are no longer independent (their errors correlate): a run says so in
its log, and precision samples from such a run are optimistic.

Environment overrides: NULLION_GEMINI_MODEL, NULLION_HAIKU_MODEL, NULLION_A_BACKEND (agy | claude), NULLION_A_MODEL,
NULLION_LLM_TIMEOUT (seconds per call).
"""
import json
import os
import pathlib
import re
import signal
import subprocess
import time
from typing import Any, Callable

REPO = pathlib.Path(__file__).resolve().parent.parent.parent
GEMINI_MODEL = os.environ.get("NULLION_GEMINI_MODEL", "gemini-4-hydrogen-low")
HAIKU_MODEL = os.environ.get("NULLION_HAIKU_MODEL", "haiku")
A_BACKEND = os.environ.get("NULLION_A_BACKEND", "agy")
A_MODEL = os.environ.get("NULLION_A_MODEL", "sonnet")
if A_BACKEND not in ("agy", "claude"):
    raise SystemExit(f"NULLION_A_BACKEND must be agy or claude, got {A_BACKEND!r}")
TIMEOUT = int(os.environ.get("NULLION_LLM_TIMEOUT", "1800"))


class LLMError(RuntimeError):
    """An LLM call failed or kept returning output that does not validate."""


def run_group(cmd: list[str], *, stdin: str | None = None, cwd: pathlib.Path = REPO, timeout: int = TIMEOUT) -> subprocess.CompletedProcess:
    """subprocess.run in its own process group, so a timeout, Ctrl-C or SIGTERM kills the whole tree (agy spawns helpers)."""
    p = subprocess.Popen(cmd, cwd=cwd, stdin=subprocess.PIPE if stdin is not None else subprocess.DEVNULL,
                         stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
    try:
        out, err = p.communicate(stdin, timeout=timeout)
    except BaseException as e:  # TimeoutExpired, KeyboardInterrupt, SystemExit from the SIGTERM handler
        try:
            os.killpg(p.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        p.wait()
        if isinstance(e, subprocess.TimeoutExpired):
            raise LLMError(f"{cmd[0]} timed out after {timeout}s") from e
        raise
    return subprocess.CompletedProcess(cmd, p.returncode, out, err)


def extract_json(text: str) -> Any:
    """The first JSON object or array in a reply, tolerating code fences, log prefixes and trailing prose."""
    text = re.sub(r"```(?:json)?", "", text)
    dec = json.JSONDecoder()
    for m in re.finditer(r"[\[{]", text):
        try:
            return dec.raw_decode(text, m.start())[0]
        except json.JSONDecodeError:
            continue
    raise ValueError("no JSON found in the reply")


def _log(log: pathlib.Path | None, text: str) -> None:
    if log:
        log.parent.mkdir(parents=True, exist_ok=True)
        with log.open("a") as f:
            f.write(text + "\n")


def _once(model: str, prompt: str, out_path: pathlib.Path | None, log: pathlib.Path | None) -> Any:
    t0 = time.time()
    if model == "gemini":
        if out_path:
            out_path.unlink(missing_ok=True)
        if A_BACKEND == "claude":
            r = run_group(["claude", "-p", "--model", A_MODEL, "--tools", "Read,Write", "--permission-mode", "acceptEdits",
                           "--no-session-persistence", "--disable-slash-commands"], stdin=prompt)
        else:
            r = run_group(["agy", "-p", prompt, "--model", GEMINI_MODEL, "--dangerously-skip-permissions"])
    elif model == "haiku":
        r = run_group(["claude", "-p", "--model", HAIKU_MODEL, "--tools", "", "--no-session-persistence",
                       "--disable-slash-commands"], stdin=prompt)
    else:
        raise LLMError(f"unknown model backend {model!r}")
    who = f"{model} via claude:{A_MODEL}" if model == "gemini" and A_BACKEND == "claude" else model
    _log(log, f"--- {who} call, {time.time() - t0:.0f}s, exit {r.returncode}, prompt {len(prompt)} chars, "
              f"stdout {len(r.stdout)} chars\n{r.stdout[-1500:]}\n{('stderr: ' + r.stderr[-800:]) if r.stderr.strip() else ''}")
    if r.returncode != 0:
        raise LLMError(f"{model} exited {r.returncode}: {(r.stderr or r.stdout).strip()[-400:]}")
    if out_path and out_path.exists() and out_path.stat().st_size:
        return json.loads(out_path.read_text())  # a malformed file raises ValueError (JSONDecodeError): retried
    return extract_json(r.stdout)


def call(model: str, prompt: str, validate: Callable[[Any], Any], *, out_path: pathlib.Path | None = None,
         log: pathlib.Path | None = None, retries: int = 1) -> Any:
    """Ask `model`, validate, retry once with the complaint appended. Returns validate()'s return value (or the raw
    object when it returns None). For gemini, out_path is where the prompt tells the model to write its JSON."""
    err = ""
    for attempt in range(retries + 1):
        p = prompt if not err else (
            f"{prompt}\n\nYOUR PREVIOUS ANSWER WAS REJECTED: {err}\nFix exactly that and answer again in the same format.")
        try:
            obj = _once(model, p, out_path, log)
            checked = validate(obj)
            return obj if checked is None else checked
        except (ValueError, KeyError, TypeError) as e:  # bad output: expected, retried once, then loud
            err = f"{type(e).__name__}: {e}"[:600]
            _log(log, f"!!! attempt {attempt + 1} rejected: {err}")
        except LLMError as e:
            err = str(e)[:600]
            _log(log, f"!!! attempt {attempt + 1} failed: {err}")
    raise LLMError(f"{model} failed after {retries + 1} attempts: {err}")


def call_text(model: str, prompt: str, validate: Callable[[str], Any], *, log: pathlib.Path | None = None,
              retries: int = 1) -> Any:
    """Like call(), for a prose reply: validate() gets the reply text (the claude CLI's timestamp prefix stripped),
    raises ValueError on a bad one (retried once with the complaint), and returns what the caller keeps."""
    if model != "haiku":
        raise LLMError("call_text supports the haiku backend (claude -p) only")
    err = ""
    for attempt in range(retries + 1):
        p = prompt if not err else f"{prompt}\n\nYOUR PREVIOUS ANSWER WAS REJECTED: {err}\nFix exactly that and answer again."
        t0 = time.time()
        r = run_group(["claude", "-p", "--model", HAIKU_MODEL, "--tools", "", "--no-session-persistence",
                       "--disable-slash-commands"], stdin=p)
        _log(log, f"--- haiku text call, {time.time() - t0:.0f}s, exit {r.returncode}\n{r.stdout[-1500:]}")
        if r.returncode != 0:
            err = f"exit {r.returncode}: {(r.stderr or r.stdout).strip()[-300:]}"
            continue
        text = re.sub(r"^\[\d\d:\d\d:\d\d\] ", "", r.stdout.strip())
        try:
            return validate(text)
        except ValueError as e:
            err = str(e)[:600]
            _log(log, f"!!! attempt {attempt + 1} rejected: {err}")
    raise LLMError(f"{model} failed after {retries + 1} attempts: {err}")
