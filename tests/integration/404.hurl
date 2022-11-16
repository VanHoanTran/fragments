# Check not found response.
GET http://localhost:8080/no-such-route

# We should get back an HTTP 1.1 404 response
HTTP/1.1 404

# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with {status: error,...}
jsonpath "$.status" == "error"
# we expect to get back a JSON response with {..., error{.., message}}}
jsonpath "$.error.message" isString
# We expect to get back a JSON response with {..., error{code,...}}
jsonpath "$.error.code" == 404
