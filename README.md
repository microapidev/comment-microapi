# Comments Microservice

## Introduction

This is a microservice that allows user to create comments, edit comments and also flags comment. Users can also reply comments, flag reply and also upvote and downvote comments and replies. Also, origin of these comments are tracked.

## Overview

All responses are to be returned in JSON format

## Error Codes

```
400 404 401
```

> Example Error Response

```
{
    "status": 400,
    "message": "Invalid Request",
    "response": "Bad Request",
    "data": []
}
```

> Example Error Response

```
{
    "status": 404,
    "message": "Sorry, the requested page is not available",
    "response": "Page Not Found",
    "data": []
}
```

> Example Error Response

```
{
    "status": 401,
    "message": "Sorry, you cannot perform this action",
    "response": "Unauthorized",
    "data": []
}
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
6. In your terminal, run `npm start`.

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

## Endpoints

### POST: `report/comment/create`

This endpoint will be used to save new comment coming from a particular report on the web

> Body

```
{
    "report_id": number,
    "comment_body": string,
    "comment_owner_name": string,
    "comment_owner_email": string,
    "comment_origin": string
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Comment Saved Successfully",
    "response": "Ok",
    "data": []
}
```

### GET: `report/comments/{report_id}`

This endpoint returns all comments on a particular report on the web

> Status Code `200`

> Example Success Response

```
{
    "message": "Comments Successfully Retrieved",
    "response": "Ok",
    "data": [{
            "_id": "514eac214dca41",
            "report_id": number,
            "comment_body": string,
            "comment_owner_name": string,
            "comment_owner_email": string,
            "comment_origin": string, #e.g Expenditure Report
            "total_votes": number, #(upvotes + downvotes)
            "upvotes": number,
            "downvotes": number,
            "replies": [
                {
                    "reply_id": "551eacf45241edd4",
                    "reply_body": string,
                    "reply_owner_name": string,
                    "reply_owner_email": string,
                    "upvotes": number,
                    "downvotes": number,
                }
            ],
            "replies_count": number
        }]
}
```

### PATCH: `report/comment/edit/{comment_id}`

This endpoint will be used to return all comments on a report on the web

> Body

```
{
    "comment_body": string,
    "email": string
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Comment Editted Successfully",
    "response": "Ok",
    "data": []
}
```

### DELETE: `report/comment/delete/{comment_id}`

This endpoint deletes a comment.
Request Body must contain email address of user and Comment ID as request parameter

> Body

```
{
    "email": string
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Comment Deleted Successfully",
    "response": "Ok",
    "data": []
}
```

### PATCH: `report/comment/vote/{comment_id}`

This endpoint modifies votes of a comment.
Request Body must contain the type of vote `upvote` or `downvote` and Comment ID as request parameter

> Body

```
{
    "vote_type": enum["upvote", "downvote"]
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Comment Voted Successfully",
    "response": "Ok",
    "data": [
        {
            "total_votes": number,
            "upvotes": number,
            "downvotes": number,
        }
    ]
}
```

### PATCH: `report/comment/flag/{comment_id}`

This endpoint flags a comment.

> Body

```
{
    "isFlagged": boolean
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Comment Flagged Successfully",
    "response": "Ok",
    "data": [
        {
            "comment_id": string,
            "isFlagged": boolean
        }
    ]
}
```

## License

MIT License

Copyright (c) 2020, Team Justice League. All rights reserved.
