# tests/integration/delete-fragment.hurl
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
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# DELETE request with authorization
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# GOT response 200 successfully DELETE request
HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"

# Try to delete the second time 
DELETE {{url}} 
[BasicAuth]
user1@email.com:password1

# GET 404 response because no such fragment exists with the given id
HTTP/1.1 404

