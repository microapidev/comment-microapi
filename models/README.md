# Schema Design

## Admins

```yaml
fullname: String # required
email: String # required, composite key
password: String # required
organizationId: ObjectId # required, ref: Organizations, composite key
```

## Applications

```yaml
name: String # required
organizationId: ObjectId # required, ref: Organizations
```

## Comments

```yaml
refId: String # optional
applicationId: ObjectId # required, ref: Applications
ownerId: String # required
content: String # required
origin:  String # optional
replies: [ObjectId] # optional, ref: Replies
flags: [String] # optional, ref: ownerId
upVotes: [String] # optional, ref: ownerId
downVotes: [String] # optional, ref: ownerId
```

## Replies

This model contains the following fields

```yaml
ownerId: String # required
content: String # required
flags: [String] # optional, ref: ownerId
upVotes: [String] # optional, ref: ownerId
downVotes: [String] # optional, ref: ownerId
commentId: ObjectId # required, ref: Comments
```

## Users

This model contains the following fields

```yaml
name: String # required
email: String # required
```
