# Utility Functions

If for any reason, your contribution is impeded because some component mentioned below is not available, kindly reach out to the maintainers so that you will be advised on how to proceed.

## Endpoint Responses

All responses must follow the format specified in the online [swagger documentation](https://comments-microservice.herokuapp.com/). To facilitate this a few utility functions have been provided and you should use them to send your responses to stay consistent.

### Response Handler

For sending responses with custom response code, optional data and a message

### Custom Error

For error responses with custom error response code, message and optional data. To use this in a `try..catch` block:

- Create a new instance of the customError class with the above properties.
- Pass this new error object to the `next` callback in your controller and that is it.

### Error Handler

This utility will send the necessary error response.

## Validation Middleware

A validation middleware is created to validate all endpoints using the `Joi` validation package. Validation rules are available for every endpoint and you must use a validation middleware when implementing an endpoint.

> If the validation rule/middleware for the endpoint you are working on has not been implemented then open a new issue requesting to create the validatiion rule/middleware.

## Authentication Middleware

Some endpoints are guarded and require authenication via JWT tokens. These endpoints are indicated in the swagger documentation. Authentication middleware have been provided for these endpoints.

> Make use of appropriate authentication middleware, where required, when implementing these endpoints.

## Testing

To enable this project move swiftly. In the initial stages, tests were not written alongside implementation. For this reason, tests and implementation are separate.

To enable tests not fail for non-existent endpoints, a helper method, **describeIfEndpoint**, has been created to defer running of tests until the endpoint itself has been created. Please use when necessary.

When writing tests, for a minimum, test for a valid request's response, auth error response (if auth required), and validation error response.
