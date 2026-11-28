# Scoring: http-status-code (Name an HTTP status code)

60 answers (Bit Flip and Works on my machine left out); 8 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 9 (15%) | 13 | 0 |
| npe | 14 (23%) | 12 | 0 |
| leak | 35 (58%) | 15 | 0 |
| race | 0 (0%) | 16 | 0 |
| heisenbug | 2 (3%) | 4 | 0 |

Same tier as today: 24/60 (40%).

## Off-by-one (9)

404 Not Found 6.6 [92780c 7388q 0f], 200 OK 6.3 [99099c 0q 0f], 500 Internal Server Error 5.8 [99099c 1069q 0f], 400 Bad Request 5.2 [99099c 685q 0f], 401 Unauthorized 5.2 [99099c 509q 0f], 429 Too Many Requests 5.0* [99099c 0q 0f], 302 Found 5.0* [0c 0q 0f], 403 Forbidden 4.8 [14183c 245q 2f], 301 Moved Permanently 4.5 [1716c 542q 0f]

## Null pointer exception (14)

503 Service Unavailable 4.4 [99099c 0q 0f], 502 Bad Gateway 4.2 [99099c 226q 0f], 201 Created 4.0* [99099c 0q 0f], 204 No Content 4.0* [99099c 0q 0f], 504 Gateway Timeout 4.0* [99099c 36q 0f], 409 Conflict 4.0* [99099c 1656q 6f], 304 Not Modified 4.0* [99099c 0q 0f], 405 Method Not Allowed 3.0* [99099c 0q 0f], 501 Not Implemented 2.9 [99099c 0q 0f], 202 Accepted 2.8 [99099c 0q 1f], 408 Request Timeout 2.7 [99099c 0q 0f], 422 Unprocessable Content 2.6 [99099c 0q 0f], 410 Gone 2.4 [99099c 0q 2f], 206 Partial Content 2.0 [99099c 0q 0f]

## Memory leak (35)

300 Multiple Choices 2.0 [99099c 0q 0f], 413 Content Too Large 1.9 [99099c 0q 0f], 307 Temporary Redirect 1.9 [99099c 0q 0f], 415 Unsupported Media Type 1.8 [99099c 0q 0f], 406 Not Acceptable 1.8 [99099c 0q 0f], 100 Continue 1.7 [99099c 732q 0f], 414 URI Too Long 1.7 [99099c 0q 0f], 412 Precondition Failed 1.5 [99099c 0q 0f], 101 Switching Protocols 1.5 [99099c 0q 0f], 402 Payment Required 1.5 [99099c 0q 0f], 416 Range Not Satisfiable 1.4 [99099c 0q 0f], 407 Proxy Authentication Required 1.3 [99099c 0q 0f], 505 HTTP Version Not Supported 1.3 [99099c 0q 0f], 421 Misdirected Request 1.3 [99099c 0q 0f], 507 Insufficient Storage 1.2 [99099c 0q 0f], 411 Length Required 1.2 [99099c 0q 0f], 308 Permanent Redirect 1.1 [99099c 0q 0f], 426 Upgrade Required 1.1 [99099c 0q 0f], 428 Precondition Required 1.1 [99099c 0q 0f], 417 Expectation Failed 1.0 [99099c 0q 0f], 423 Locked 1.0 [99099c 0q 0f], 431 Request Header Fields Too Large 0.9 [99099c 0q 0f], 103 Early Hints 0.9 [99099c 0q 0f], 205 Reset Content 0.8 [99099c 0q 0f], 203 Non-Authoritative Information 0.8 [99099c 0q 0f], 424 Failed Dependency 0.8 [99099c 0q 0f], 511 Network Authentication Required 0.8 [99099c 0q 0f], 207 Multi-Status 0.8 [99099c 0q 0f], 102 Processing 0.7 [99099c 0q 0f], 508 Loop Detected 0.6 [99099c 0q 0f], 425 Too Early 0.6 [99099c 0q 0f], 510 Not Extended 0.6 [99099c 0q 0f], 506 Variant Also Negotiates 0.5 [99099c 0q 0f], 208 Already Reported 0.5 [99099c 0q 0f], 305 Use Proxy 0.4 [99099c 0q 0f]

## Race condition (0)



## Heisenbug (2)

303 See Other 1.8 [0c 0q 0f], 451 Unavailable For Legal Reasons 1.5 [2906c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
