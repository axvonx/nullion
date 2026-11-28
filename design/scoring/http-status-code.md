# Scoring: http-status-code (Name an HTTP status code)

60 answers (Bit Flip and Works on my machine left out); 8 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 9 (15%) | 9 | 0 |
| npe | 14 (23%) | 14 | 0 |
| leak | 0 (0%) | 0 | 0 |
| race | 1 (2%) | 1 | 0 |
| heisenbug | 36 (60%) | 36 | 0 |

Same tier as today: 60/60 (100%).

## Off-by-one (9)

404 Not Found 6.6 [92780c 0q 0f 0s], 200 OK 6.3 [0c 0q 0f 0s], 500 Internal Server Error 5.8 [0c 1051q 0f 0s], 400 Bad Request 5.2 [0c 658q 0f 0s], 401 Unauthorized 5.2 [0c 0q 0f 0s], 302 Found 5.0* [0c 0q 0f 0s], 429 Too Many Requests 5.0* [0c 0q 0f 0s], 403 Forbidden 4.8 [14183c 0q 2f 258s], 301 Moved Permanently 4.5 [1716c 0q 0f 0s]

## Null pointer exception (14)

503 Service Unavailable 4.4 [0c 0q 0f 0s], 502 Bad Gateway 4.2 [0c 177q 0f 0s], 409 Conflict 4.0* [0c 0q 6f 0s], 201 Created 4.0* [0c 0q 0f 0s], 204 No Content 4.0* [0c 0q 0f 0s], 504 Gateway Timeout 4.0* [0c 0q 0f 0s], 304 Not Modified 4.0* [0c 0q 0f 0s], 405 Method Not Allowed 3.0* [0c 0q 0f 0s], 501 Not Implemented 2.9 [0c 0q 0f 0s], 202 Accepted 2.8 [0c 0q 1f 0s], 408 Request Timeout 2.7 [0c 0q 0f 0s], 422 Unprocessable Content 2.6 [0c 0q 0f 0s], 410 Gone 2.4 [0c 0q 2f 0s], 206 Partial Content 2.0 [0c 0q 0f 0s]

## Memory leak (0)



## Race condition (1)

451 Unavailable For Legal Reasons 1.5 [2906c 0q 0f 0s]

## Heisenbug (36)

300 Multiple Choices 2.0 [0c 0q 0f 0s], 413 Content Too Large 1.9 [0c 0q 0f 0s], 307 Temporary Redirect 1.9 [0c 0q 0f 0s], 406 Not Acceptable 1.8 [0c 0q 0f 0s], 415 Unsupported Media Type 1.8 [0c 0q 0f 0s], 303 See Other 1.8 [0c 0q 0f 0s], 100 Continue 1.7 [0c 0q 0f 0s], 414 URI Too Long 1.7 [0c 0q 0f 0s], 412 Precondition Failed 1.5 [0c 0q 0f 0s], 101 Switching Protocols 1.5 [0c 0q 0f 0s], 402 Payment Required 1.5 [0c 0q 0f 0s], 416 Range Not Satisfiable 1.4 [0c 0q 0f 0s], 407 Proxy Authentication Required 1.3 [0c 0q 0f 0s], 505 HTTP Version Not Supported 1.3 [0c 0q 0f 0s], 421 Misdirected Request 1.3 [0c 0q 0f 0s], 507 Insufficient Storage 1.2 [0c 0q 0f 0s], 411 Length Required 1.2 [0c 0q 0f 0s], 308 Permanent Redirect 1.1 [0c 0q 0f 0s], 426 Upgrade Required 1.1 [0c 0q 0f 0s], 428 Precondition Required 1.1 [0c 0q 0f 0s], 417 Expectation Failed 1.0 [0c 0q 0f 0s], 423 Locked 1.0 [0c 0q 0f 0s], 431 Request Header Fields Too Large 0.9 [0c 0q 0f 0s], 103 Early Hints 0.9 [0c 0q 0f 0s], 205 Reset Content 0.8 [0c 0q 0f 0s], 203 Non-Authoritative Information 0.8 [0c 0q 0f 0s], 424 Failed Dependency 0.8 [0c 0q 0f 0s], 511 Network Authentication Required 0.8 [0c 0q 0f 0s], 207 Multi-Status 0.8 [0c 0q 0f 0s], 102 Processing 0.7 [0c 0q 0f 0s], 508 Loop Detected 0.6 [0c 0q 0f 0s], 425 Too Early 0.6 [0c 0q 0f 0s], 510 Not Extended 0.6 [0c 0q 0f 0s], 506 Variant Also Negotiates 0.5 [0c 0q 0f 0s], 208 Already Reported 0.5 [0c 0q 0f 0s], 305 Use Proxy 0.4 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
