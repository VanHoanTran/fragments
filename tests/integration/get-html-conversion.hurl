# tests/integration/get-html-conversion.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a markdown text fragment
Content-Type: text/html
# Include HTTP Basic Auth credentials
#Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
```<h1>This is a fragment!</h1>```

[Captures]
url: header "Location"

# Try to convert that fragment to text
GET {{url}}.txt
[BasicAuth]
user1@email.com:password1

# 200 HTML response , content-type should be text/plain
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "<h1>This is a fragment!</h1>"

# Try to convert that fragment to markdown
GET {{url}}.md
[BasicAuth]
user1@email.com:password1

# 415 HTML response 
HTTP/1.1 415