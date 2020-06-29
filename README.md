# Comments Microservice

[![Build Status](https://travis-ci.org/microapidev/comment-microapi.svg?branch=develop)](https://travis-ci.org/microapidev/comment-microapi) [![Coverage Status](https://coveralls.io/repos/github/microapidev/comment-microapi/badge.svg?branch=develop)](https://coveralls.io/github/microapidev/comment-microapi?branch=develop)

This is a microservice that allows user to create comments, edit comments and also flags comment. Users can also reply comments, flag reply and also upvote and downvote comments and replies. Also, origin of these comments are tracked.

For quick navigation:

- [How it Works](#how-it-works)
- [Getting Started](#getting-started)
- [Linting Your Code](#linting-your-code)
- [Testing Your Code](#testing-your-code)
- [Contributing Your Code](#contributing-your-code)
- [Endpoints Documentation](#endpoints-documentation)
- [Schema Design Explanation](#schema-design-explanation)


## <a name="how-it-works"></a> How it works



## <a name="getting-started"></a> Getting Started

Ensure that your local machine has all the required software, listed below, before setting up your local environment.

### Requirements

- [Node](https://nodejs.org/en/download/)

### Setup Local Environment

You will first need to setup your local environment and ensure that all configuration files are correctly configured.

1. Fork the repo.
2. Clone your forked repo to you local environment.
3. In your terminal, run `npm install`.
4. In your terminal, run `cp .env.example .env`.
5. In your terminal, run `npm run startDev`.

## <a name="linting-your-code"></a> Linting Your Code

1. Run `npm run lint:fix` to fix all fixable errors in source code and format with prettier
2. Run `npm run lint` to find errors that still remain in your code syntax/format
3. Ensure you fix any remaining linting errors displayed.
   Run npm run test:ci to ensure your code matches the test

## <a name="linting-your-code"></a> Testing Your Code

1. Run `npm run test` to ensure your code passes all tests

## <a name="contributing-your-code"></a> Contributing Your Code

Are you willing to contribute to this project? You can contribute in many areas but primarily in the following areas

1. Implementing endpoints and controllers
2. Writing unit tests for endpoints and controllers. 
3. Documentation 
4. Creating middleware and their consumables
5. Fixing/pointing out bugs
6. We could use a boost in our code coverage, so any tests to cover untested fucntions is highly welcome

### Quick Reference

- All responses must follow the format specified in the online [swagger documentation](https://comments-microservice.herokuapp.com/). To facilitate this a few utility functions have been provided and you should use them to send your responses to stay consistent. 
   + **responseHandler** for sending responses with custom response code, optional data and a message 
   + **customError** for error responses with custom error response code, message and optional data. To use this in a try..catch block, create a new instance of the customError class with the above properties. Pass this new error object to the `next` callback in your controller znd that is it. An **errorHandler** utility will send the necessary response

- A validation middleware is created to validate all endpoints using the `Joi` validation package. Validation rules are available for every endpoint and you must use a validation middleware when implementing an endpoint. If the validation rule/middleware for the endpoint you are not working on has not been implemented then contact the maintainers. 

- Some endpoints are guarded and require authenication via JWT tokens. These endpoints are indicated in the swagger documentation. Authentication middleware have been provided for these endpoints. Make use of appropriate auth middleware, where required, when implementing these endpoints.

- To enable this project move swiftly. In the initial stages, tests were not written alongside implementation. For this reason, tests and implementation are separate. To enable tests not fail for non-exiatent endpoints, a helper method, **describeIfEndpoint**, has been created to defer running of tests until the endpoint itself has been created. Please use when necessary. When writing tests, for a minimum, test for a valid request's response, auth error response (if auth required), and validation error response.

- If for any reason, your contribution is impeded because some component mentioned above is not available, kindly reach out to the maintainers so that you will be advised on how to proceed.

- Always lint your code using `npm run lint:fix` to catch and fix any sysntax errors, format your code with our code style choice, `prettier`. Do this also before pushing your commits to a new or an existing PR. If your code fails linting, it will not be accepted.

- Ensure you rebase/sync your local repo with the latest updates from the original repo to prevent merge conflicts. Your PR will not be attended to until you have resolved all merge conflicts

- When making a pull request, make use of the PR template and edit the placeholders with relevant information. PR descriptions must include reference to the issue being fixed using: fixes/resolves #issue_number e.g `fixes #12` or `resolves #25` linking to the original issue number.

### Futher details

Ensure that you lint and test your code before submitting a pull request (PR). For more information on the contributing guidelines and tips on certain implementation details, please see the [contributing documentation](https://github.com/microapi/comment-microapi/tree/master/CONTRIBUTING.md).

## <a name="endpoints-documentation"></a> Endpoints Documentation

There are two options that you can choose from when you would like to view the endpoints' Swagger documentation.

The first option is online and should be your first go to as this will be the live server with the most trustworthy documentation.

The second option is local and should be used as a last resort when the online option is unavailable.

### Online

Visit the [online server](https://comments-microservice.herokuapp.com/) to see the live Swagger documentation.

### Locally

After setting up your local environment (see above), please visit the `localhost:4000` or the `localhost:4000/documentation` route to see the local Swagger documentation.

## <a name="schema-design-explanation"></a> Schema Design Explanation

### Comments

This model contains the following fields

```
comment_body: string (the body of the comment)
comment_origin: string ( the origin of the comment; Bot or Reports from FE)
isFlagged: boolean( if the comment has been flagged for sensitive words)
upVotes: number
downVotes:  number
user: schema ref ( the details of the person that commented);

```

### Replies

This model contains the following fields

```
reply_body: string (the body of the comment)
comment_id: schema ref ( the id of the comment)
isFlagged: boolean( if the comment has been flagged for sensitive words)
upVotes: number
downVotes:  number

```

### Users

This model contains the following fields

```
name: string (name of the person comment)
email: string (email address of the person commenting)

```

## License

MIT License

Copyright (c) 2020, Team Justice League. All rights reserved.
