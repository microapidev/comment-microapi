## ENDPOINTS AND RESPONSE FORMAT

### POST: `/comments`

This endpoint will be used to save new comment coming from a particular report on the web

> Body

```
{
    "refId": string,
    "commentBody": string,
    "commentOwnerName": string,
    "commentOwnerEmail": string,
    "commentOrigin": string,
    "applicationId": string
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
            "refId": string, #e.g the reportId value
            "commentBody": string,
            "commentOwnerName": string,
            "commentOwnerEmail": string,
            "commentOrigin": string, #e.g Expenditure Report
        }]
}
```

> Example Error Responses

> Validation Error

> StatusCode `422`

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode `401`

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

### GET: `comments/refs/{refId}`

This endpoint returns all comments on a particular from a reference() on the web

> Param
`"refId": string #required`

> Status Code `200`

> Example Success Response

```
{
    "message": "Comments Successfully Retrieved",
    "response": "Ok",
    "data": [{
            "_id": "514eac214dca41",
            "refId": number,
            "commentBody": string,
            "commentOwnerName": string,
            "commentOwnerEmail": string,
            "commentOrigin": string, #e.g Expenditure Report
            "totalVotes": number, #(upvotes + downvotes)
            "upvotes": number,
            "downvotes": number,
            "replies": [
                {
                    "replyId": "551eacf45241edd4",
                    "commentId": string
                    "replyBody": string,
                    "replyOownerName": string,
                    "replyOwnerEmail": string,
                    "upvotes": number,
                    "downvotes": number,
                }
            ],
            "repliesCount": number,
            "applicationId": string
        }]
}
```

> Example Error Responses

> Validation Error

> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid RefId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Comment not found"
}
```



### PATCH: `comments/{commentId}`

This endpoint allows edit of a comment

> Param
`"commentId": string #required`

> Body

```
{
    "commentBody": string, #optional
    "commentOwnerEmail": string #optional
}
```

> Status Code `200`

> Example Success Response

```
{
    "message": "Comment Editted Successfully",
    "response": "Ok",
    "data": {
        "commentBody": string,
        "commentOwnerEmail": string
    }
}
```


> Example Error Responses

> Validation Error 
> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid CommentId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Comment not found"
}
```

### DELETE: `comments/{commentId}`

This endpoint deletes a comment.
Request Body must contain email address of user and Comment ID as request parameter

> Body
```
{
    "email": string #required
}
```

> Param 
`commentId: string #required`

> Status Code `200`

> Example Success Response

```
{
    "message": "Comment Deleted Successfully",
    "response": "Ok",
    "data": []
}
```


> Example Error Responses

> Validation Error

> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid CommentId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Comment not found"
}
```

### PATCH: `comments/{commentId}/votes`

This endpoint modifies votes of a comment.
Request Body must contain the type of vote `upvote` or `downvote` and Comment ID as request parameter

> Param
`commentId: string #required`

> Body

`vote: string "upvote || downvote"`
{
    "voteType": enum["upvote", "downvote"]
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

> Example Error Responses

> Validation Error 
> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid CommentId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Comment not found"
}
```



### PATCH: `comments/{commentId}/flag`

This endpoint flags a comment.

> Body

> Param
`commentId: string #required`

```
{
    "isFlagged": boolean,
    "email": string #required
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
            "commentId": string,
            "isFlagged": boolean,
        }
    ]
}
```

> Example Error Responses

> Validation Error 
> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid CommentId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Comment not found"
}
```

### POST: `comments/{commentId}/replies`

This endpoint creates a comment reply.

> Body

```
{
    "commentId": string,
    "replyBody": string,
    "replyOwnerName": string,
    "replyOwnerEmail": string,
    "applicationId": string
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

> Example Error Responses

> Validation Error 
> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid CommentId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Comment not found"
}
```



### GET: `comments/{commentId}/replies`

This endpoint gets all comment reply.

> Parameter

```
{
    "commentId": string,
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
                    "replyId": "551eacf45241edd4",
                    "commentId": string
                    "replyBody": string,
                    "replyOwnerName": string,
                    "replyOwnerEmail": string,
                    "upvotes": number,
                    "downvotes": number,
                    "repliesCount": number
                    "flagsCount": number,
                    "applicationId": string
                }
            ]
}

```

> Example Error Responses

> Validation Error 
> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid CommentId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Comment not found"
}
```

### PATCH: `comments/replies/{replyId}`

This endpoint allows edit of a comment reply

> Body

```
{
    "commentId": string,
    "replyBody": string,
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

> Example Error Responses

> Validation Error 
> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid ReplyId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Reply not found"
}
```



### DELETE: `comments/replies/{replyId}`

This endpoint allows delete of a comment reply

> Body

```
{
    "commentId": string,
    "replyOwnerEmail": string
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

> Example Error Responses

> Validation Error 
> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid ReplyId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Reply not found"
}
```



### PATCH: `comments/replies/{replyId}/vote`

This endpoint allows voting (upvote or downvote) of a comment reply

> Body

```
{
    "commentId": string,
    "voteType": string #(upvote or downvote)
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
                    "replyId": string,
                    "commentId": string,
                    "totalVotes": number,
                    "upvotes": number,
                    "downvotes": number,
                }
    ]
}
```

> Example Error Responses

> Validation Error 
> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid ReplyId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Reply not found"
}
```



### PATCH: `comments/replies/{replyId}/vote`

This endpoint allows flagging of a comment reply

> Body

```
{
    "commentId": string,
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
            "commentId": string,
            "replyId": string,
            "isFlagged": boolean,
        }
    ]
}
```

> Example Error Responses

> Validation Error 
> StatusCode 422

```
{
  "status": "failed",
  "data": [],
  "message": "Return validation errors from middleware""
}
```

> Authentication Error

> StatusCode 401

```
{
  "status"": "failed",
  "data": [],
  "message": "Invalid token or not authorized to access resource"
}
```

> Invalid ReplyId Error

> StatusCode 404

```
{
  "status"": "failed",
  "data": [],
  "message": "Reply not found"
}
```


