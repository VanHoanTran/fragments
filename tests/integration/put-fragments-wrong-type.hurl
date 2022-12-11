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

# PUT request to update fragment's data
PUT {{url}} 
[BasicAuth]
user1@email.com:password1
Content-Type: text/markdown
```# An alternative fragment``` 

# GOT response 400
HTTP/1.1 400