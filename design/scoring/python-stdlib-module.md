# Scoring: python-stdlib-module (Name a Python standard library module)

265 answers (Bit Flip and Works on my machine left out); 25 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 10 (4%) | 10 | 0 |
| npe | 100 (38%) | 100 | 0 |
| leak | 46 (17%) | 37 | 0 |
| race | 6 (2%) | 10 | 0 |
| heisenbug | 103 (39%) | 108 | 0 |

Same tier as today: 249/265 (94%).

## Off-by-one (10)

math 6.2 [0c 0q 1f], sys 5.7 [0c 1101q 1f], os 5.6 [0c 0q 0f], json 5.5 [0c 361184q 5f], time 5.5 [0c 0q 41f], random 5.4 [0c 0q 1f], datetime 5.3 [0c 71571q 0f], tkinter 5.0* [0c 52094q 0f], string 4.7 [0c 0q 0f], logging 4.5 [0c 0q 0f]

## Null pointer exception (100)

argparse 4.3 [0c 3591q 0f], urllib 4.3 [0c 3967q 0f], collections 4.2 [0c 24059q 0f], csv 4.2 [0c 92306q 0f], re 4.2 [0c 0q 0f], unittest 4.2 [0c 85406q 1f], threading 4.1 [0c 140269q 0f], pathlib 4.1 [0c 658q 0f], typing 4.0* [0c 1467q 0f], itertools 4.0* [0c 3113q 0f], dataclasses 4.0* [0c 9q 0f], sqlite3 4.0* [0c 94845q 0f], os.path 4.0* [0c 500q 0f], turtle 4.0* [0c 0q 0f], pickle 4.0 [0c 0q 0f], socket 3.9 [0c 0q 7f], gzip 3.7 [0c 7075q 53f], subprocess 3.6 [0c 12290q 3f], hashlib 3.6 [0c 433q 0f], glob 3.6 [0c 4357q 2f], base64 3.5 [0c 11368q 14f], venv 3.5 [0c 7q 1f], shutil 3.4 [0c 1184q 0f], zipfile 3.4 [0c 0q 0f], ssl 3.4 [0c 60998q 0f], multiprocessing 3.4 [0c 14628q 0f], uuid 3.3 [0c 3581q 7f], tempfile 3.3 [0c 1055q 0f], asyncio 3.2 [0c 7574q 1f], xml 3.2 [0c 215657q 0f], io 3.2 [0c 0q 7f], pdb 3.2 [0c 890q 0f], traceback 3.1 [0c 735q 0f], queue 3.1 [0c 0q 1f], http 3.0* [0c 71956q 0f], email 3.0* [0c 73597q 7f], urllib.request 3.0* [0c 0q 0f], enum 3.0* [0c 22549q 5f], functools 3.0 [0c 393q 0f], copy 3.0 [0c 0q 1f], configparser 2.9 [0c 684q 3f], zlib 2.9 [0c 2394q 56f], pydoc 2.8 [0c 172q 0f], pprint 2.8 [0c 139q 3f], smtplib 2.8 [0c 1312q 0f], unittest.mock 2.8 [0c 0q 0f], calendar 2.8 [0c 0q 0f], stat 2.8 [0c 1071q 1f], statistics 2.8 [0c 0q 0f], xml.etree.ElementTree 2.8 [0c 0q 0f], cmath 2.7 [0c 269q 0f], platform 2.7 [0c 0q 0f], struct 2.7 [0c 30555q 1f], readline 2.7 [0c 2649q 59f], concurrent 2.7 [0c 0q 2f], types 2.7 [0c 28889q 0f], warnings 2.7 [0c 5864q 0f], webbrowser 2.7 [0c 30729q 2f], array 2.7 [0c 0q 0f], http.server 2.7 [0c 1328q 2f] ...

## Memory leak (46)

optparse 2.0 [0c 288q 0f], lzma 2.0 [0c 257q 19f], html.parser 2.0 [0c 5971q 0f], zoneinfo 1.9 [0c 61q 0f], doctest 1.9 [0c 451q 28f], mmap 1.9 [0c 2061q 0f], ftplib 1.9 [0c 679q 13f], selectors 1.9 [0c 15378q 0f], shlex 1.9 [0c 95q 0f], curses 1.8 [0c 1022q 0f], abc 1.8 [0c 267q 0f], difflib 1.8 [0c 342q 0f], telnetlib 1.8 [0c 317q 0f], nis 1.8 [0c 174q 1f], fnmatch 1.8 [0c 60q 0f], imaplib 1.8 [0c 691q 0f], fileinput 1.8 [0c 21140q 0f], gc 1.8 [0c 12167q 0f], numbers 1.7 [0c 12189q 0f], cgi 1.7 [0c 5567q 0f], xmlrpc 1.6 [0c 1736q 4f], tty 1.6 [0c 2235q 0f], atexit 1.6 [0c 171q 0f], winreg 1.6 [0c 163q 3f], xml.dom 1.5 [0c 271q 0f], termios 1.5 [0c 317q 0f], pty 1.5 [0c 559q 0f], fcntl 1.4 [0c 236q 0f], xmlrpc.client 1.4 [0c 87q 0f], html.entities 1.4 [0c 1364q 0f], winsound 1.3 [0c 79q 0f], posix 1.3 [0c 6916q 1f], smtpd 1.3 [0c 117q 0f], dbm 1.3 [0c 95q 1f], binascii 1.3 [0c 51q 0f], _thread 1.2 [0c 140523q 0f], netrc 1.2 [0c 60q 1f], poplib 1.2 [0c 62q 0f], keyword 1.0* [0c 2483q 0f], pwd 1.0* [0c 257q 0f], pipes 1.0* [0c 9917q 3f], asyncore 1.0 [0c 127q 0f], linecache 0.9 [0c 54q 0f], msvcrt 0.9 [0c 488q 0f], bdb 0.7 [0c 491q 0f], __main__ 0.0* [0c 3006q 0f]

## Race condition (6)

wsgiref 1.3 [0c 39q 0f], tkinter.scrolledtext 1.3 [0c 27q 0f], tracemalloc 1.2 [0c 26q 0f], runpy 0.9 [0c 31q 0f], zipapp 0.8 [0c 24q 0f], mailcap 0.6 [0c 0q 21f]

## Heisenbug (103)

urllib.error 2.0 [0c 0q 0f], tkinter.ttk 2.0 [0c 0q 0f], crypt 1.9 [0c 0q 3f], weakref 1.9 [0c 0q 0f], site 1.9 [0c 0q 0f], bisect 1.9 [0c 0q 1f], imp 1.8 [0c 0q 0f], email.message 1.8 [0c 0q 0f], trace 1.8 [0c 0q 1f], email.mime 1.7 [0c 0q 0f], collections.abc 1.7 [0c 0q 0f], shelve 1.7 [0c 0q 0f], importlib.metadata 1.7 [0c 0q 1f], tomllib 1.6 [0c 0q 0f], textwrap 1.6 [0c 0q 0f], http.cookies 1.5 [0c 0q 0f], dis 1.5 [0c 0q 1f], importlib.resources 1.5 [0c 0q 2f], sched 1.5 [0c 12q 0f], email.utils 1.5 [0c 0q 0f], plistlib 1.5 [0c 9q 0f], xml.dom.minidom 1.4 [0c 0q 0f], xml.sax 1.4 [0c 0q 0f], contextvars 1.4 [0c 0q 0f], marshal 1.4 [0c 0q 0f], sysconfig 1.4 [0c 0q 3f], email.parser 1.4 [0c 0q 0f], tkinter.colorchooser 1.4 [0c 0q 0f], grp 1.4 [0c 0q 1f], nntplib 1.4 [0c 0q 0f], filecmp 1.3 [0c 0q 0f], http.cookiejar 1.3 [0c 0q 0f], concurrent.interpreters 1.3 [0c 0q 0f], py_compile 1.3 [0c 0q 1f], pkgutil 1.3 [0c 0q 0f], wave 1.3 [0c 0q 3f], pstats 1.3 [0c 13q 0f], multiprocessing.shared_memory 1.2 [0c 0q 0f], tkinter.font 1.2 [0c 0q 0f], colorsys 1.2 [0c 1q 0f], compileall 1.2 [0c 0q 0f], cgitb 1.2 [0c 7q 0f], chunk 1.2 [0c 0q 2f], email.errors 1.1 [0c 0q 0f], spwd 1.1 [0c 0q 1f], email.policy 1.1 [0c 0q 0f], faulthandler 1.1 [0c 8q 1f], email.encoders 1.1 [0c 0q 0f], string.templatelib 1.1 [0c 0q 0f], email.header 1.1 [0c 0q 0f], xmlrpc.server 1.0 [0c 0q 0f], graphlib 1.0 [0c 0q 1f], resource 1.0* [0c 0q 0f], code 1.0* [0c 0q 0f], logging.config 1.0* [0c 0q 0f], test 1.0* [0c 0q 1f], token 1.0* [0c 0q 3f], uu 1.0 [0c 0q 0f], rlcompleter 1.0 [0c 0q 0f], reprlib 1.0 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
