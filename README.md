# Comments Microservice

[![Build Status](https://travis-ci.org/microapidev/comment-microapi.svg?branch=develop)](https://travis-ci.org/microapidev/comment-microapi) [![Coverage Status](https://coveralls.io/repos/github/microapidev/comment-microapi/badge.svg?branch=develop)](https://coveralls.io/github/microapidev/comment-microapi?branch=develop) ![Issues](https://img.shields.io/github/issues/microapidev/comment-microapi) ![Forks](https://img.shields.io/github/forks/microapidev/comment-microapi) ![MIT License](https://img.shields.io/github/license/microapidev/comment-microapi)

This is a microservice that allows user to create comments, edit comments and also flags comment. Users can also reply comments, flag reply and also upvote and downvote comments and replies. Also, origin of these comments are tracked.

For quick navigation:

- [How it Works](#how-it-works)
- [Getting Started](#getting-started)
- [Linting Your Code](#linting-your-code)
- [Testing Your Code](#testing-your-code)
- [Contributing Your Code](#contributing-your-code)
- [Endpoints Documentation](#endpoints-documentation)
- [Schema Design](#schema-design)

## How it works

## Getting Started

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

## Linting Your Code

1. Run `npm run lint:fix` to fix all fixable errors in source code and format with prettier
2. Run `npm run lint` to find errors that still remain in your code syntax/format
3. Ensure you fix any remaining linting errors displayed.
   Run npm run test:ci to ensure your code matches the test

## Testing Your Code

1. Run `npm run test` to ensure your code passes all tests

## Contributing Your Code

Are you willing to contribute to this project? You can contribute in many areas but primarily in the following areas

1. Implementing endpoints and controllers
2. Writing unit tests for endpoints and controllers.
3. Documentation
4. Creating middleware and their consumables
5. Fixing/pointing out bugs
6. We could use a boost in our code coverage, so any tests to cover untested fucntions is highly welcome

### Endpoint Documentation

All responses must follow the format specified in the online [swagger documentation](https://comments-microservice.herokuapp.com/). This should be your first go to as this will be the live server with the most trustworthy documentation.

### Utility Functions

To facilitate consistent code, a few [Utility Functions](utils/README.md) have been provided and you should use them to send your responses to maintain consistent implementation.

### Before Submitting Pull Request

- Always lint and test your code as stated [above](#linting-your-code)

- Make use of the PR template and edit the placeholders with relevant information. PR descriptions must reference the issue number being fixed, e.g `fix #12` or `resolve #25`.

- Before pushing your commits, ensure your local/forked repo is synced with the latest updates from the original repo to avoid merge conflicts. You can safely do this with a fast-forwards merge.

```bash
git remote add upstream https://github.com/microapidev/comment-microapi.git
git fetch upstream
git merge upstream/develop
git commit
git push origin <branch-name>
```

> For more information on the contributing guidelines and implementation details, please see the [contributing documentation](https://github.com/microapi/comment-microapi/tree/master/CONTRIBUTING.md).

## Schema Design

- Comments Model
- Replies Model
- Users Model

> Please see the [complete Schema Design Document](models/README.md).

## License

![MIT License](https://img.shields.io/github/license/microapidev/comment-microapi)

Copyright (c) 2020, Team Justice League. All rights reserved.
