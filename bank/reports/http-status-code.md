# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: http.

## http-status-code

62 candidates; 43 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| 404 Not Found | 2 | 1 | 20 | 0.60 | npe | counts | off-by-one | — |
| 304 Not Modified | 1 | 0 | 13 | 0.53 | leak | counts | npe | — |
| 406 Not Acceptable | 2 | 0 | 3 | 0.41 | leak | judge | leak | — |
| 300 Multiple Choices | 0 | 0 | 354 | 0.40 | leak | counts | leak | — |
| 508 Loop Detected ⚠ counts said leak | 0 | 0 | 12 | 0.39 | heisenbug | judge (override) | heisenbug | — |
| 425 Too Early | 0 | 0 | 10 | 0.36 | leak | counts | race | — |
| 510 Not Extended ⚠ counts said leak | 0 | 0 | 10 | 0.36 | heisenbug | judge (override) | heisenbug | — |
| 501 Not Implemented | 0 | 0 | 9 | 0.35 | npe | judge | npe | — |
| 411 Length Required | 0 | 0 | 6 | 0.29 | leak | judge | leak | — |
| 206 Partial Content | 0 | 0 | 4 | 0.24 | leak | judge | leak | — |
| 200 OK | 0 | 1 | 3 | 0.21 | off-by-one | judge | off-by-one | — |
| 402 Payment Required | 0 | 0 | 3 | 0.21 | npe | judge | npe | — |
| 500 Internal Server Error | 0 | 0 | 3 | 0.21 | off-by-one | judge | off-by-one | — |
| 208 Already Reported | 2 | 0 | 0 | 0.20 | heisenbug | judge | heisenbug | — |
| 100 Continue | 0 | 0 | 1 | 0.11 | npe | judge | npe | — |
| 204 No Content | 0 | 0 | 1 | 0.11 | off-by-one | judge | off-by-one | — |
| 400 Bad Request | 0 | 0 | 1 | 0.11 | off-by-one | judge | off-by-one | — |
| 426 Upgrade Required | 0 | 0 | 1 | 0.11 | leak | judge | leak | — |
| 503 Service Unavailable | 0 | 0 | 1 | 0.11 | off-by-one | judge | off-by-one | — |
| 101 Switching Protocols ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| 103 Early Hints ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 201 Created ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| 202 Accepted ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| 203 Non-Authoritative Information ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 205 Reset Content ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 207 Multi-Status ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 226 IM Used | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| 301 Moved Permanently ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| 302 Found ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| 303 See Other ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| 307 Temporary Redirect ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| 308 Permanent Redirect ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| 401 Unauthorized ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| 403 Forbidden ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| 405 Method Not Allowed ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| 407 Proxy Authentication Required ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 408 Request Timeout ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| 409 Conflict ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| 410 Gone ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| 412 Precondition Failed ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| 413 Content Too Large ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| 414 URI Too Long ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| 415 Unsupported Media Type ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| 416 Range Not Satisfiable ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 417 Expectation Failed ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 418 I'm a teapot | 0 | 0 | 0 | 0.00 | womm | pin | — | — |
| 421 Misdirected Request ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 422 Unprocessable Content ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| 423 Locked ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 424 Failed Dependency ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 428 Precondition Required ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 429 Too Many Requests ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| 431 Request Header Fields Too Large ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 451 Unavailable For Legal Reasons ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| 502 Bad Gateway ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| 504 Gateway Timeout ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| 505 HTTP Version Not Supported ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| 506 Variant Also Negotiates ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| 507 Insufficient Storage ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 511 Network Authentication Required ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 102 Processing ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| 305 Use Proxy ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): 508 Loop Detected (counts said leak, now heisenbug), 510 Not Extended (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.
