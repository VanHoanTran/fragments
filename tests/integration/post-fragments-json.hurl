# Post fragments charset Test
POST http://localhost:8080/v1/fragments
# We're sending an application/json
Content-Type: application/json
# Include HTTP Basic Auth credentials
#Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
[BasicAuth]
user1@email.com:password1
# Body of the request is a json object
{"json": "true"}

#we expect to get back an HTTP 201
HTTP/1.1 201
#we the created fragment's type should be "application/json"
[Asserts]
jsonpath "$.fragment.type" == "application/json"
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json
[Asserts]
body contains "{\"json\": \"true\"}"