# tests/integration/get-markdown-conversion.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a markdown text fragment
Content-Type: text/markdown
# Include HTTP Basic Auth credentials
#Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
```# This is a fragment!```

HTTP/1.1 201
[Captures]
url: header "Location"

# Try to convert that fragment to text html
GET {{url}}.html
[BasicAuth]
user1@email.com:password1

# 200 HTML response , content-type should be text/html
HTTP/1.1 200
Content-Type: text/html
[Asserts]
body == "<h1>This is a fragment!</h1>\n"

# Try to convert that fragment to text
GET {{url}}.txt
[BasicAuth]
user1@email.com:password1

# 200 HTML response , content-type should be text/plain
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "# This is a fragment!"

# Try to convert that fragment to pdf
GET {{url}}.pdf
[BasicAuth]
user1@email.com:password1

# 415 HTML response , type-conversion is not supported.
HTTP/1.1 415
