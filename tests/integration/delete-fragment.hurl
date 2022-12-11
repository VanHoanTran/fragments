# tests/integration/delete-fragment.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
#Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

[Captures]
url: header "Location"

# DELETE request with authorization
DELETE {{url}} 
[BasicAuth]
user1@email.com:password1

# GOT response 200 successfully DELETE request
HTTP/1.1 200
jsonpath "$.status" == "ok"

# Try to delete the second time 
DELETE {{url}} 
[BasicAuth]
user1@email.com:password1

# GET 404 response because no such fragment exists with the given id
HTTP/1.1 404

