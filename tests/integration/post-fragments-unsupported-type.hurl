# Unsupported type Test
POST http://localhost:8080/v1/fragments
# We're sending an audio/mpeg
Content-Type: audio/mpeg
# Include HTTP Basic Auth credentials
#Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
[BasicAuth]
user1@email.com:password1

# We should get back an HTTP 1.1 415 response
HTTP/1.1 415

# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with {status: error,...}
jsonpath "$.status" == "error"
# we expect to get back a JSON response with {..., error{.., message}}}
jsonpath "$.error.message" isString
# We expect to get back a JSON response with {..., error{code,...}}
jsonpath "$.error.code" == 415