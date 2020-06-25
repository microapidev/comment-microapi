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
