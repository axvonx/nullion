# Scoring: python-stdlib-module (Name a Python standard library module)

265 answers (Bit Flip and Works on my machine left out); 25 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 10 (4%) | 10 | 0 |
| npe | 100 (38%) | 100 | 0 |
| leak | 39 (15%) | 39 | 0 |
| race | 7 (3%) | 7 | 0 |
| heisenbug | 109 (41%) | 109 | 0 |

Same tier as today: 265/265 (100%).

## Off-by-one (10)

math 6.2 [0c 0q 1f 0s], sys 5.7 [0c 0q 0f 0s], os 5.6 [0c 0q 0f 0s], json 5.5 [0c 361184q 5f 0s], time 5.5 [0c 0q 41f 0s], random 5.4 [0c 0q 1f 0s], datetime 5.3 [0c 71571q 0f 0s], tkinter 5.0* [0c 52094q 0f 0s], string 4.7 [0c 0q 0f 0s], logging 4.5 [0c 0q 0f 0s]

## Null pointer exception (100)

argparse 4.3 [0c 3591q 0f 0s], urllib 4.3 [0c 3967q 0f 0s], collections 4.2 [0c 24059q 0f 0s], csv 4.2 [0c 0q 0f 0s], re 4.2 [0c 0q 0f 0s], unittest 4.2 [0c 85406q 1f 0s], threading 4.1 [0c 140269q 0f 0s], pathlib 4.1 [0c 658q 0f 0s], typing 4.0* [0c 1467q 0f 0s], itertools 4.0* [0c 3113q 0f 0s], dataclasses 4.0* [0c 9q 0f 0s], sqlite3 4.0* [0c 94845q 0f 0s], os.path 4.0* [0c 500q 0f 0s], turtle 4.0* [0c 0q 0f 0s], pickle 4.0 [0c 0q 0f 0s], socket 3.9 [0c 0q 7f 0s], gzip 3.7 [0c 7075q 53f 0s], subprocess 3.6 [0c 12290q 3f 212s], hashlib 3.6 [0c 433q 0f 0s], glob 3.6 [0c 4357q 2f 0s], base64 3.5 [0c 11368q 14f 0s], venv 3.5 [0c 7q 1f 0s], shutil 3.4 [0c 1184q 0f 0s], zipfile 3.4 [0c 0q 0f 0s], ssl 3.4 [0c 0q 0f 0s], multiprocessing 3.4 [0c 14628q 0f 0s], uuid 3.3 [0c 3581q 7f 147s], tempfile 3.3 [0c 1055q 0f 0s], asyncio 3.2 [0c 7574q 1f 0s], xml 3.2 [0c 0q 0f 0s], io 3.2 [0c 0q 0f 0s], pdb 3.2 [0c 0q 0f 0s], traceback 3.1 [0c 735q 0f 0s], queue 3.1 [0c 0q 1f 0s], http 3.0* [0c 71956q 0f 0s], email 3.0* [0c 73597q 7f 0s], urllib.request 3.0* [0c 0q 0f 0s], enum 3.0* [0c 22549q 5f 0s], functools 3.0 [0c 393q 0f 0s], copy 3.0 [0c 0q 1f 0s], configparser 2.9 [0c 684q 3f 0s], zlib 2.9 [0c 2394q 56f 7273s], pydoc 2.8 [0c 172q 0f 0s], pprint 2.8 [0c 139q 3f 0s], smtplib 2.8 [0c 1312q 0f 0s], unittest.mock 2.8 [0c 0q 0f 0s], calendar 2.8 [0c 0q 0f 0s], stat 2.8 [0c 1071q 1f 0s], statistics 2.8 [0c 0q 0f 0s], xml.etree.ElementTree 2.8 [0c 0q 0f 0s], cmath 2.7 [0c 269q 0f 0s], platform 2.7 [0c 0q 0f 0s], struct 2.7 [0c 30555q 1f 0s], readline 2.7 [0c 2649q 59f 0s], concurrent 2.7 [0c 0q 2f 0s], types 2.7 [0c 28889q 0f 0s], warnings 2.7 [0c 5864q 0f 0s], webbrowser 2.7 [0c 30729q 2f 0s], array 2.7 [0c 0q 0f 0s], http.server 2.7 [0c 1328q 2f 0s] ...

## Memory leak (39)

optparse 2.0 [0c 288q 0f 0s], lzma 2.0 [0c 257q 19f 0s], html.parser 2.0 [0c 5971q 0f 0s], zoneinfo 1.9 [0c 61q 0f 0s], doctest 1.9 [0c 451q 28f 0s], mmap 1.9 [0c 2061q 0f 0s], ftplib 1.9 [0c 679q 13f 0s], selectors 1.9 [0c 15378q 0f 0s], shlex 1.9 [0c 95q 0f 0s], curses 1.8 [0c 1022q 0f 0s], difflib 1.8 [0c 342q 0f 0s], telnetlib 1.8 [0c 317q 0f 0s], fnmatch 1.8 [0c 60q 0f 0s], imaplib 1.8 [0c 691q 0f 0s], fileinput 1.8 [0c 21140q 0f 0s], numbers 1.7 [0c 12189q 0f 0s], xmlrpc 1.6 [0c 1736q 4f 0s], atexit 1.6 [0c 171q 0f 0s], winreg 1.6 [0c 163q 3f 0s], xml.dom 1.5 [0c 271q 0f 0s], termios 1.5 [0c 317q 0f 0s], fcntl 1.4 [0c 236q 0f 0s], xmlrpc.client 1.4 [0c 87q 0f 0s], html.entities 1.4 [0c 1364q 0f 0s], winsound 1.3 [0c 79q 0f 0s], wsgiref 1.3 [0c 39q 0f 0s], posix 1.3 [0c 6916q 1f 0s], smtpd 1.3 [0c 117q 0f 0s], binascii 1.3 [0c 51q 0f 0s], _thread 1.2 [0c 140523q 0f 0s], netrc 1.2 [0c 60q 1f 0s], poplib 1.2 [0c 62q 0f 0s], keyword 1.0* [0c 2483q 0f 0s], pipes 1.0* [0c 9917q 3f 0s], asyncore 1.0 [0c 127q 0f 0s], linecache 0.9 [0c 54q 0f 0s], runpy 0.9 [0c 31q 0f 0s], msvcrt 0.9 [0c 488q 0f 0s], __main__ 0.0* [0c 3006q 0f 0s]

## Race condition (7)

sched 1.5 [0c 12q 0f 0s], tkinter.scrolledtext 1.3 [0c 27q 0f 0s], pstats 1.3 [0c 13q 0f 0s], tracemalloc 1.2 [0c 26q 0f 0s], imghdr 0.9 [0c 17q 0f 0s], zipapp 0.8 [0c 24q 0f 0s], mailcap 0.6 [0c 0q 21f 0s]

## Heisenbug (109)

urllib.error 2.0 [0c 0q 0f 0s], tkinter.ttk 2.0 [0c 0q 0f 0s], crypt 1.9 [0c 0q 3f 0s], weakref 1.9 [0c 0q 0f 0s], site 1.9 [0c 0q 0f 0s], bisect 1.9 [0c 0q 1f 0s], imp 1.8 [0c 0q 0f 0s], abc 1.8 [0c 0q 0f 0s], email.message 1.8 [0c 0q 0f 0s], trace 1.8 [0c 0q 1f 0s], nis 1.8 [0c 0q 0f 0s], gc 1.8 [0c 0q 0f 0s], email.mime 1.7 [0c 0q 0f 0s], collections.abc 1.7 [0c 0q 0f 0s], shelve 1.7 [0c 0q 0f 0s], importlib.metadata 1.7 [0c 0q 1f 144s], cgi 1.7 [0c 0q 0f 0s], tomllib 1.6 [0c 0q 0f 0s], tty 1.6 [0c 0q 0f 0s], textwrap 1.6 [0c 0q 0f 0s], http.cookies 1.5 [0c 0q 0f 0s], dis 1.5 [0c 0q 0f 0s], pty 1.5 [0c 0q 0f 0s], importlib.resources 1.5 [0c 0q 2f 76s], email.utils 1.5 [0c 0q 0f 0s], plistlib 1.5 [0c 9q 0f 0s], xml.dom.minidom 1.4 [0c 0q 0f 0s], xml.sax 1.4 [0c 0q 0f 0s], contextvars 1.4 [0c 0q 0f 0s], marshal 1.4 [0c 0q 0f 0s], sysconfig 1.4 [0c 0q 3f 0s], email.parser 1.4 [0c 0q 0f 0s], tkinter.colorchooser 1.4 [0c 0q 0f 0s], grp 1.4 [0c 0q 0f 0s], nntplib 1.4 [0c 0q 0f 0s], filecmp 1.3 [0c 0q 0f 0s], http.cookiejar 1.3 [0c 0q 0f 0s], concurrent.interpreters 1.3 [0c 0q 0f 0s], py_compile 1.3 [0c 0q 1f 0s], pkgutil 1.3 [0c 0q 0f 0s], wave 1.3 [0c 0q 3f 0s], dbm 1.3 [0c 0q 0f 0s], multiprocessing.shared_memory 1.2 [0c 0q 0f 0s], tkinter.font 1.2 [0c 0q 0f 0s], colorsys 1.2 [0c 1q 0f 0s], compileall 1.2 [0c 0q 0f 0s], cgitb 1.2 [0c 7q 0f 0s], chunk 1.2 [0c 0q 2f 0s], email.errors 1.1 [0c 0q 0f 0s], spwd 1.1 [0c 0q 1f 0s], email.policy 1.1 [0c 0q 0f 0s], faulthandler 1.1 [0c 8q 1f 0s], email.encoders 1.1 [0c 0q 0f 0s], string.templatelib 1.1 [0c 0q 0f 0s], email.header 1.1 [0c 0q 0f 0s], xmlrpc.server 1.0 [0c 0q 0f 0s], graphlib 1.0 [0c 0q 1f 0s], resource 1.0* [0c 0q 0f 0s], code 1.0* [0c 0q 0f 0s], logging.config 1.0* [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
