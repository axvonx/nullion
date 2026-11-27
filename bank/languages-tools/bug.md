# Name a type of bug
id: bug · domain: languages-tools · status: approved
> Any named kind of software bug or defect.

## Off-by-one
- off-by-one | off by one error | obo | fencepost error
- null pointer dereference | null pointer | null pointer exception | npe | null dereference
- memory leak
- infinite loop
- segfault | segmentation fault

## Works on my machine
- heisenbug
- bit flip | cosmic ray | cosmic ray bit flip
- Y2K | y2k bug | millennium bug

## Null pointer exception
- race condition | data race
- buffer overflow
- deadlock
- stack overflow
- Out-of-bounds array index | index-out-of-range | array index underflow (auto)
- Prompt injection (auto)
- Uncaught exception (auto)
- Divide by zero (auto)
- Use of uninitialized variable | uninitialized variable (auto)
- Assertion failure | reachable assertion (auto)
- Command injection | OS command injection | shell injection (auto)
- Cross-site scripting | XSS | HTML injection (auto)
- SQL injection | SQLi (auto)
- Code injection (auto)

## Memory leak
- use-after-free | uaf
- double free
- integer overflow
- Clickjacking | UI Redress Attack | Tapjacking (auto)
- Stack-based buffer overflow | stack buffer overflow (auto)
- Heap-based buffer overflow | heap overflow | heap buffer overflow (auto)
- Buffer underwrite | buffer underrun | buffer underflow (auto)
- Out-of-bounds read | OOB read (auto)
- Buffer over-read (auto)
- Prototype pollution (auto)
- ReDoS | catastrophic backtracking | inefficient regular expression complexity (auto)
- Improper null termination (auto)
- Integer underflow (auto)
- Numeric truncation error (auto)
- Information disclosure | information leak (auto)
- Path traversal | directory traversal (auto)
- Unchecked return value (auto)
- Resource exhaustion | uncontrolled resource consumption (auto)
- Resource leak (auto)
- File descriptor leak (auto)
- Deserialization of untrusted data | PHP object injection (auto)
- Open redirect | cross-site redirect | cross-domain redirect | unvalidated redirect (auto)
- XXE (auto)
- Uncontrolled recursion (auto)
- Out-of-bounds write | memory corruption (auto)
- Dangling pointer | expired pointer dereference (auto)
- Server-side request forgery | SSRF | XSPA (auto)
- NoSQL injection | NoSQLi (auto)
- Remote file inclusion | remote file include | RFI | local file inclusion (auto)
- Insecure direct object reference | IDOR (auto)
- Bit rot | software rot (auto)

## Race condition
- TOCTOU | time-of-check to time-of-use
- priority inversion
- ABA problem | aba
- Y2038 | year 2038 problem | y2k38
- Bohrbug
- Tabnabbing (auto)
- HTTP request splitting | HTTP response splitting (auto)
- Log forging (auto)
- Write-what-where condition | write-what-where (auto)
- CSV injection | formula injection | Excel macro injection (auto)
- Buffer under-read (auto)
- Cross-site WebSocket hijacking | CSWSH (auto)
- Parser differential | insufficiently controlled parser differential (auto)
- ANSI injection (auto)
- Unexpected sign extension (auto)
- Zip Slip (auto)
- Signal handler race condition (auto)
- DLL preloading | binary planting (auto)
- Dependency confusion (auto)
- Confused deputy (auto)
- HTTP request smuggling | HTTP response smuggling | HTTP smuggling (auto)
- Reflection injection | unsafe reflection (auto)
- HQL injection (auto)
- Double-checked locking (auto)
- XPath injection (auto)
- XQuery injection (auto)
- Algorithm downgrade (auto)
- Mismatched memory management routines (auto)
- Billion laughs attack | XML bomb | XEE (auto)
- Type confusion | object type confusion (auto)
- Argument injection (auto)
- LDAP injection (auto)
- XML injection (auto)
- Stale file descriptor (auto)
- Mass assignment | AutoBinding (auto)
- EL injection | expression language injection (auto)
- Intent spoofing (auto)
- CRLF injection (auto)
- Eval injection (auto)

## Heisenbug
- Mandelbug
- Schrödinbug | schrodinbug
- Hindenbug
- false sharing
- torn write | torn read
- Higgs-bugson (auto)
- Loch Ness monster bug (auto)

## Bit Flip
- moth | the moth
  note: 1947: the Harvard Mark II logbook, "first actual case of bug being found".
