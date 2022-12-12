# Include HTTP Basic Auth credentials
#Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
[BasicAuth]
user1@email.com:password1
# Body of the request is a json object
{"json": "true"}

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# Try to convert that fragment to text
GET {{url}}.txt
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body contains "{\"json\": \"true\"}"

# Try to convert that fragment to json
GET {{url}}.json
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json
[Asserts]
body contains "{\"json\": \"true\"}"

# Try to convert that fragment to markdown
GET {{url}}.md
[BasicAuth]
user1@email.com:password1

HTTP/1.1 415
