# Comments Microservice

## Introduction

This is a microservice that allows user to create comments, edit comments and also flags comment. Users can also reply comments, flag reply and also upvote and downvote comments and replies. Also, origin of these comments are tracked.

## Overview

All responses are to be returned in JSON format

## Error Codes

```
400 404 401
```

## Success Codes

```
200 201
```

### Setup Local Environment

You will first need to setup your local environment and ensure that all configuration files are correctly configured.

1. Fork the repo.
2. Clone into your local
3. Checkout to the Develop branch
4. In your terminal, run `npm install`.
5. In your terminal, run `cp .env.example .env`.

```
BASE_URL=
```

## Schema Design Explanation

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
comment_id: schema ref ( the details of the person that commented)
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
