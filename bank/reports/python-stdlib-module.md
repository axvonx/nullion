# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: python.

## python-stdlib-module

267 candidates; 179 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| test ⚠ counts said off-by-one | 15 | 148 | 1726 | 0.99 | leak | judge (override) | leak | — |
| code ⚠ counts said off-by-one | 5 | 415 | 3509 | 0.94 | leak | judge (override) | leak | — |
| time | 2 | 182 | 2221 | 0.89 | off-by-one | counts | off-by-one | — |
| typing | 3 | 106 | 915 | 0.84 | npe | counts | off-by-one | — |
| types | 3 | 106 | 915 | 0.84 | npe | counts | npe | — |
| operator | 1 | 49 | 1104 | 0.73 | npe | counts | npe | — |
| this | 13 | 4 | 6110 | 0.73 | womm | pin | — | — |
| select | 1 | 48 | 735 | 0.71 | npe | counts | npe | — |
| platform | 0 | 91 | 752 | 0.71 | npe | counts | npe | — |
| collections | 1 | 31 | 642 | 0.67 | npe | counts | off-by-one | — |
| statistics | 0 | 60 | 497 | 0.65 | npe | counts | npe | — |
| signal | 0 | 63 | 363 | 0.64 | npe | counts | npe | — |
| http | 11 | 1 | 1473 | 0.63 | npe | counts | off-by-one | — |
| locale | 0 | 40 | 613 | 0.63 | npe | counts | npe | — |
| random | 0 | 32 | 384 | 0.59 | npe | counts | off-by-one | — |
| resource | 0 | 19 | 579 | 0.57 | npe | counts | leak | — |
| numbers | 0 | 12 | 763 | 0.55 | leak | counts | npe | — |
| profile | 0 | 26 | 174 | 0.53 | leak | counts | npe | — |
| array | 0 | 21 | 174 | 0.52 | leak | counts | npe | — |
| trace | 0 | 16 | 248 | 0.51 | leak | counts | leak | — |
| logging ⚠ counts said leak | 2 | 5 | 179 | 0.50 | off-by-one | judge (override) | off-by-one | — |
| wave | 0 | 25 | 76 | 0.49 | leak | counts | leak | — |
| re ⚠ counts said leak | 1 | 6 | 185 | 0.48 | off-by-one | judge (override) | off-by-one | — |
| __future__ | 0 | 5 | 578 | 0.47 | leak | counts | npe | — |
| compression ⚠ counts said leak | 0 | 11 | 116 | 0.45 | heisenbug | judge (override) | heisenbug | — |
| token | 0 | 4 | 329 | 0.43 | leak | counts | leak | — |
| tokenize | 0 | 4 | 329 | 0.43 | leak | counts | leak | — |
| site | 0 | 9 | 91 | 0.42 | leak | counts | leak | — |
| __main__ | 0 | 3 | 358 | 0.42 | leak | counts | npe | — |
| string | 0 | 9 | 86 | 0.42 | leak | counts | npe | — |
| math ⚠ counts said leak | 1 | 4 | 73 | 0.41 | off-by-one | judge (override) | off-by-one | — |
| json ⚠ counts said leak | 1 | 3 | 98 | 0.41 | off-by-one | judge (override) | off-by-one | — |
| html | 3 | 2 | 46 | 0.40 | leak | counts | npe | — |
| concurrent | 0 | 6 | 83 | 0.39 | leak | counts | leak | — |
| dis | 7 | 2 | 10 | 0.38 | leak | counts | npe | — |
| xml | 1 | 5 | 21 | 0.36 | leak | counts | npe | — |
| inspect | 0 | 2 | 171 | 0.36 | leak | counts | npe | — |
| fractions | 0 | 4 | 62 | 0.34 | leak | counts | npe | — |
| threading ⚠ counts said leak | 0 | 3 | 87 | 0.34 | off-by-one | judge (override) | off-by-one | — |
| _thread | 0 | 3 | 87 | 0.34 | leak | counts | leak | — |
| ast | 0 | 3 | 69 | 0.33 | leak | counts | npe | — |
| os ⚠ counts said race | 1 | 2 | 26 | 0.31 | off-by-one | judge (override) | off-by-one | — |
| email ⚠ counts said race | 0 | 6 | 16 | 0.30 | npe | judge (override) | npe | — |
| warnings ⚠ counts said race | 1 | 2 | 18 | 0.30 | npe | judge (override) | npe | — |
| multiprocessing ⚠ counts said race | 0 | 6 | 14 | 0.30 | off-by-one | judge (override) | off-by-one | — |
| io ⚠ counts said race | 0 | 0 | 187 | 0.27 | off-by-one | judge (override) | off-by-one | — |
| copy ⚠ counts said race | 0 | 1 | 56 | 0.27 | off-by-one | judge (override) | off-by-one | — |
| keyword ⚠ counts said race | 0 | 1 | 54 | 0.26 | npe | judge (override) | npe | — |
| queue ⚠ counts said race | 0 | 2 | 23 | 0.25 | npe | judge (override) | npe | — |
| pickle | 0 | 5 | 6 | 0.24 | off-by-one | judge | off-by-one | — |
| chunk | 0 | 1 | 30 | 0.23 | race | counts | race | — |
| unittest | 4 | 0 | 6 | 0.23 | off-by-one | judge | off-by-one | — |
| curses | 0 | 2 | 13 | 0.22 | race | counts | leak | — |
| secrets ⚠ counts said heisenbug | 0 | 1 | 19 | 0.21 | npe | judge (override) | npe | — |
| pdb | 0 | 3 | 5 | 0.20 | off-by-one | judge | off-by-one | — |
| turtle | 0 | 2 | 7 | 0.20 | off-by-one | judge | off-by-one | — |
| abc | 0 | 2 | 6 | 0.19 | npe | judge | npe | — |
| socket ⚠ counts said heisenbug | 0 | 1 | 12 | 0.19 | off-by-one | judge (override) | off-by-one | — |
| selectors ⚠ counts said heisenbug | 0 | 1 | 12 | 0.19 | leak | judge (override) | leak | — |
| csv ⚠ counts said heisenbug | 0 | 0 | 35 | 0.19 | off-by-one | judge (override) | off-by-one | — |
| ssl ⚠ counts said heisenbug | 0 | 1 | 10 | 0.18 | npe | judge (override) | npe | — |
| struct | 1 | 1 | 2 | 0.17 | npe | judge | npe | — |
| gc | 0 | 1 | 7 | 0.16 | npe | judge | npe | — |
| tkinter | 0 | 1 | 6 | 0.16 | off-by-one | judge | off-by-one | — |
| enum | 0 | 1 | 5 | 0.15 | off-by-one | judge | off-by-one | — |
| dbm | 0 | 1 | 5 | 0.15 | leak | judge | leak | — |
| codecs ⚠ counts said heisenbug | 0 | 0 | 15 | 0.14 | npe | judge (override) | npe | — |
| pipes | 0 | 0 | 14 | 0.14 | heisenbug | counts | race | — |
| venv | 4 | 0 | 0 | 0.13 | off-by-one | judge | off-by-one | — |
| gzip | 0 | 1 | 2 | 0.11 | npe | judge | npe | — |
| cgi | 0 | 1 | 2 | 0.11 | leak | judge | leak | — |
| nis | 0 | 1 | 2 | 0.11 | race | judge | race | — |
| asyncio | 0 | 0 | 7 | 0.11 | off-by-one | judge | off-by-one | — |
| subprocess | 0 | 0 | 6 | 0.10 | off-by-one | judge | off-by-one | — |
| decimal | 0 | 0 | 6 | 0.10 | npe | judge | npe | — |
| hmac | 0 | 0 | 6 | 0.10 | npe | judge | npe | — |
| traceback | 0 | 0 | 5 | 0.09 | off-by-one | judge | off-by-one | — |
| cmd | 1 | 0 | 1 | 0.09 | leak | judge | leak | — |
| glob | 0 | 1 | 1 | 0.09 | off-by-one | judge | off-by-one | — |
| stat | 0 | 0 | 4 | 0.08 | npe | judge | npe | — |
| dataclasses | 0 | 0 | 3 | 0.07 | off-by-one | judge | off-by-one | — |
| builtins | 0 | 0 | 3 | 0.07 | npe | judge | npe | — |
| calendar | 0 | 0 | 3 | 0.07 | npe | judge | npe | — |
| doctest | 0 | 0 | 3 | 0.07 | npe | judge | npe | — |
| sys | 0 | 0 | 2 | 0.06 | off-by-one | judge | off-by-one | — |
| ctypes | 0 | 0 | 2 | 0.06 | npe | judge | npe | — |
| http.server | 0 | 0 | 2 | 0.06 | npe | judge | npe | — |
| mailbox | 0 | 0 | 2 | 0.06 | leak | judge | leak | — |
| marshal | 0 | 0 | 2 | 0.06 | leak | judge | leak | — |
| posix | 0 | 0 | 2 | 0.06 | leak | judge | leak | — |
| shelve | 0 | 0 | 2 | 0.06 | leak | judge | leak | — |
| unittest.mock | 1 | 0 | 0 | 0.06 | off-by-one | judge | off-by-one | — |
| itertools | 0 | 0 | 1 | 0.04 | off-by-one | judge | off-by-one | — |
| functools | 0 | 0 | 1 | 0.04 | off-by-one | judge | off-by-one | — |
| argparse | 0 | 0 | 1 | 0.04 | off-by-one | judge | off-by-one | — |
| sqlite3 | 0 | 0 | 1 | 0.04 | off-by-one | judge | off-by-one | — |
| base64 | 0 | 0 | 1 | 0.04 | off-by-one | judge | off-by-one | — |
| bisect | 0 | 0 | 1 | 0.04 | npe | judge | npe | — |
| heapq | 0 | 0 | 1 | 0.04 | npe | judge | npe | — |
| mmap | 0 | 0 | 1 | 0.04 | npe | judge | npe | — |
| pwd | 0 | 0 | 1 | 0.04 | npe | judge | npe | — |
| uuid | 0 | 0 | 1 | 0.04 | off-by-one | judge | off-by-one | — |
| zlib | 0 | 0 | 1 | 0.04 | npe | judge | npe | — |
| pty | 0 | 0 | 1 | 0.04 | leak | judge | leak | — |
| readline | 0 | 0 | 1 | 0.04 | leak | judge | leak | — |
| xmlrpc | 0 | 0 | 1 | 0.04 | leak | judge | leak | — |
| crypt | 0 | 0 | 1 | 0.04 | race | judge | race | — |
| email.generator | 0 | 0 | 1 | 0.04 | race | judge | race | — |
| imp | 0 | 0 | 1 | 0.04 | race | judge | race | — |
| datetime ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| pathlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| shutil ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| tempfile ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| urllib ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| hashlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| os.path ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| atexit ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| bz2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| cmath ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| collections.abc ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| concurrent.futures ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| configparser ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| contextlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| difflib ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| errno ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| fnmatch ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| getopt ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| getpass ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| gettext ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| http.client ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| importlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| ipaddress ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| lzma ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| mimetypes ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| optparse ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| pprint ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| pstats ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| shlex ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| smtplib ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| socketserver ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| tarfile ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| textwrap ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| timeit ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| tomllib ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| urllib.parse ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| urllib.request ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| weakref ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| webbrowser ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| xml.etree.ElementTree ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| zipfile ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| zoneinfo ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| binascii ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| colorsys ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| compileall ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| contextvars ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| distutils ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ensurepip ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| faulthandler ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fcntl ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| filecmp ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fileinput ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ftplib ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| graphlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| grp ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| html.parser ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| http.cookiejar ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| http.cookies ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| imaplib ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| importlib.metadata ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| importlib.resources ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| linecache ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| logging.config ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| logging.handlers ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| msvcrt ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| multiprocessing.shared_memory ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| netrc ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| pkgutil ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| plistlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| poplib ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| py_compile ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| pydoc ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| quopri ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| reprlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| runpy ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sched ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sysconfig ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| syslog ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| termios ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tkinter.messagebox ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tkinter.ttk ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tracemalloc ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tty ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| unicodedata ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| urllib.error ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| urllib.robotparser ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| winreg ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| wsgiref ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| xml.dom ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| xml.dom.minidom ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| xml.sax ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| xmlrpc.client ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| xmlrpc.server ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| zipapp ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| zipimport ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| aifc ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| asynchat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| asyncore ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| audioop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| bdb ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| cgitb ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| codeop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| curses.ascii ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| curses.panel ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.charset ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.encoders ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.errors ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.header ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.headerregistry ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.iterators ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.message ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.mime ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.parser ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.policy ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| email.utils ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| html.entities ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| imghdr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mailcap ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| modulefinder ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| msilib ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| nntplib ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ossaudiodev ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pickletools ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pyclbr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pyexpat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rlcompleter ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| smtpd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| sndhdr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| spwd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| stringprep ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| sunau ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| symtable ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| tabnanny | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| telnetlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tkinter.colorchooser ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| tkinter.font ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| tkinter.scrolledtext ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| uu ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| winsound ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| xdrlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| xml.dom.pulldom ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| xml.sax.handler ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| xml.sax.reader ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| xml.sax.utils ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| annotationlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| compression.zstd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| concurrent.interpreters ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| importlib.resources.abc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| profiling.sampling ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| profiling.tracing ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| string.templatelib ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| sys.monitoring ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| copyreg ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| email.contentmanager ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tkinter.dnd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| math.integer ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tkinter.fontchooser ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tkinter.systray ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): os (counts said race, now off-by-one), json (counts said leak, now off-by-one), math (counts said leak, now off-by-one), re (counts said leak, now off-by-one), logging (counts said leak, now off-by-one), threading (counts said leak, now off-by-one), multiprocessing (counts said race, now off-by-one), csv (counts said heisenbug, now off-by-one), io (counts said race, now off-by-one), socket (counts said heisenbug, now off-by-one), copy (counts said race, now off-by-one), codecs (counts said heisenbug, now npe), email (counts said race, now npe), keyword (counts said race, now npe), queue (counts said race, now npe), secrets (counts said heisenbug, now npe), ssl (counts said heisenbug, now npe), warnings (counts said race, now npe), code (counts said off-by-one, now leak), selectors (counts said heisenbug, now leak), test (counts said off-by-one, now leak), compression (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

