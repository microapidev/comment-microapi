## ENDPOINTS

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
            "replies": [],
            "replies_count": number,
            "flags_count": number

        }]
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
                    "comment_id": string
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

This endpoint allows edit of a comment

> Body

```
{
    "comment_body": string,
    "comment_owner_email": string
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Comment Editted Successfully",
    "response": "Ok",
    "data": [#return the updated record]
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
    "data": [#return the updated record]
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
            "isFlagged": boolean,
        }
    ]
}
```

### POST: `report/comment/{comment_id}/reply/create`

This endpoint creates a comment reply.

> Body

```
{
    "comment_id": string,
    "reply_body": string,
    "reply_owner_name": string,
    "reply_owner_email": string
}
```

> Status Code `200`

> Example Success Response

```

{
    "message": "Reply Posted Successfully",
    "response": "Ok",
    "data": [#return the updated record]
}

```

### GET: `report/comment/{comment_id}/reply/all`

This endpoint gets all comment reply.

> Parameter

```
{
    "comment_id": string,
}
```

> Status Code `200`

> Example Success Response

```

{
    "message": "Comment Replies Returned Successfully",
    "response": "Ok",
    "data": [
                {
                    "reply_id": "551eacf45241edd4",
                    "comment_id": string
                    "reply_body": string,
                    "reply_owner_name": string,
                    "reply_owner_email": string,
                    "upvotes": number,
                    "downvotes": number,
                    "replies_count": number
                }
            ]
}

```

### PATCH: `report/comment/reply/edit/{reply_id}`

This endpoint allows edit of a comment reply

> Body

```
{
    "comment_id": string,
    "reply_body": string,
    "email": string
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Reply Editted Successfully",
    "response": "Ok",
    "data": [#return the updated record]
}
```

### DELETE: `report/comment/reply/delete/{reply_id}`

This endpoint allows delete of a comment reply

> Body

```
{
    "comment_id": string,
    "reply_owner_email": string
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Reply Deleted Successfully",
    "response": "Ok",
    "data": [#return the updated record]
}
```

### PATCH: `report/comment/reply/vote/{reply_id}`

This endpoint allows voting (upvote or downvote) of a comment reply

> Body

```
{
    "comment_id": string,
    "vote_type": string #(upvote or downvote)
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Reply Voted Successfully",
    "response": "Ok",
    "data": [
                {
                    "reply_id": string,
                    "comment_id": string,
                    "total_votes": number,
                    "upvotes": number,
                    "downvotes": number,
                }
    ]
}
```

### PATCH: `report/comment/reply/flag/{reply_id}`

This endpoint allows flagging of a comment reply

> Body

```
{
    "comment_id": string,
    "isFlagged": boolean
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Reply flagged Successfully",
    "response": "Ok",
    "data": [
                {
            "comment_id": string,
            "reply_id": string,
            "isFlagged": boolean,
        }
    ]
}
```
