# Schema Design

## Comments

This model contains the following fields

```yaml
comment_body: string # the body of the comment
comment_origin: string # the origin of the comment; Bot or Reports from FE
isFlagged: boolean # if the comment has been flagged for sensitive words
upVotes: number
downVotes:  number
user: schema ref # the details of the person that commented
```

## Replies

This model contains the following fields

```yaml
reply_body: string # the body of the comment
comment_id: schema ref # the id of the comment
isFlagged: boolean # if the comment has been flagged for sensitive words
upVotes: number
downVotes:  number
```

## Users

This model contains the following fields

```yaml
name: string # name of the person comment
email: string # email address of the person commenting
```
