# Post fragments without Authentication
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain; charset=utf-8
# Include HTTP Basic Auth credentials
#Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
#[BasicAuth]
#user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

#we expect to get back an HTTP 401
HTTP/1.1 401