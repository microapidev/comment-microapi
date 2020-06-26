# Comments Microservice

This is a microservice that allows user to create comments, edit comments and also flags comment. Users can also reply comments, flag reply and also upvote and downvote comments and replies. Also, origin of these comments are tracked.

For quick navigation:

- [Getting Started](#getting-started)
- [Linting Your Code](#linting-your-code)
- [Testing Your Code](#testing-your-code)
- [Contributing Your Code](#contributing-your-code)
- [Endpoints Documentation](#endpoints-documentation)
- [Schema Design Explanation](#schema-design-explanation)

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
5. In your terminal, run `npm start`.

## <a name="linting-your-code"></a> Linting Your Code

1. Run `npm run lint:fix` to fix all fixable errors in source code and format with prettier
2. Run `npm run lint` to find errors that still remain in your code syntax/format
3. Ensure you fix any remaining linting errors displayed.
   Run npm run test:ci to ensure your code matches the test

## <a name="linting-your-code"></a> Testing Your Code

1. Run `npm run test:ci` to ensure your code passes all tests

## <a name="contributing-your-code"></a> Contributing Your Code

Ensure that you lint and test your code before submitting a pull request (PR). For more information on the contributing guidelines and tips on certain implementation details, please see the [contributing documentation](https://github.com/microapi/comment-microapi/tree/master/CONTRIBUTING.md).

## <a name="endpoints-documentation"></a> Endpoints Documentation

There are two options that you can choose from when you would like to view the endpoints' Swagger documentation.

The first option is online and should be your first go to as this will be the live server with the most trustworthy documentation.

The second option is local and should be used as a last resort when the online option is unavailable.

### Online

Visit the [online server](https://comments-microservice.herokuapp.com/) to see the live Swagger documentation.

### Locally

After setting up your local environment (see above), please visit the `localhost:4000` or `localhost:4000/documentation` route to see the local Swagger documentation.

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
