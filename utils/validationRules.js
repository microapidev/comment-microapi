const Joi = require("@hapi/joi");

const voteTypes = ["upvote", "downvote"];

module.exports = {
  /**
   * Schema validation for GET '/comments'
   */
  getAllCommentsSchema: {
    query: Joi.object({
      isFlagged: Joi.boolean(),
    }),
  },

  /**
   * Schema validation for POST '/comments'
   */
  createCommentSchema: {
    body: Joi.object().keys({
      refId: Joi.string().min(1),
      commentBody: Joi.string().min(1).required(),
      commentOwnerName: Joi.string().min(1).required(),
      commentOwnerEmail: Joi.string().email().required(),
      coomentOrigin: Joi.string().required(),
    }),
  },

  /**
   * Schema validation for GET '/comments/refs/{refId}'
   */
  getAllCommentsOfReferenceSchema: {
    query: Joi.object({
      isFlagged: Joi.boolean(),
    }),
    params: Joi.object({
      refId: Joi.string().required(),
    }),
  },

  /**
   * Schema validation for PATCH '/comments/{commentId}'
   */
  updateCommentSchema: {
    params: Joi.object({
      commentId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      commentBody: Joi.string().min(1).required(),
      commentOwnerEmail: Joi.string().email().required(),
    }),
  },

  /**
   * Schema validation for DELETE '/comments/{commentId}'
   */
  deleteCommentSchema: {
    params: Joi.object({
      commentId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      commentOwnerEmail: Joi.string().email().required(),
    }),
  },

  /**
   * Schema validation for PATCH '/comments/{commentId}/votes'
   */
  updateCommentVoteSchema: {
    params: Joi.object({
      commentId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      voteType: Joi.string().allow(voteTypes).required(),
    }),
  },

  /**
   * Schema validation for PATCH '/comments/{commentId}/flag'
   */
  updateCommentFlagSchema: {
    params: Joi.object({
      commentId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      isFlagged: Joi.boolean().required(),
    }),
  },

  /**
   * Schema validation for GET '/comments/{commentId}/replies'
   */
  getAllCommentRepliesSchema: {
    query: Joi.object({
      isFlagged: Joi.boolean(),
    }),
    params: Joi.object({
      commentId: Joi.string().required(),
    }),
  },

  /**
   * Schema validation for POST '/comments/{commentId}/replies'
   */
  createCommentReplySchema: {
    params: Joi.object({
      commentId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      replyBody: Joi.string().min(1).required(),
      replyOwnerName: Joi.string().min(1).required(),
      replyOwnerEmail: Joi.string().email().required(),
    }),
  },

  /**
   * Schema validation for PATCH '/comments/{commentId}/replies/{replyId}'
   */
  updateCommentReplySchema: {
    params: Joi.object({
      commentId: Joi.string().required(),
      replyId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      replyBody: Joi.string().min(1).required(),
      replyOwnerEmail: Joi.string().email().required(),
    }),
  },

  /**
   * Schema validation for DELETE '/comments/{commentId}/replies/{replyId}'
   */
  deleteCommentReplySchema: {
    params: Joi.object({
      commentId: Joi.string().required(),
      replyId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      replyOwnerEmail: Joi.string().email().required(),
    }),
  },

  /**
   * Schema validation for PATCH '/comments/{commentId}/replies/{replyId}/votes'
   */
  updateCommentReplyVoteSchema: {
    params: Joi.object({
      commentId: Joi.string().required(),
      replyId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      voteType: Joi.string().allow(voteTypes).required(),
    }),
  },

  /**
   * Schema validation for PATCH '/comments/{commentId}/replies/{replyId}/flag'
   */
  updateCommentReplyFlagSchema: {
    params: Joi.object({
      commentId: Joi.string().required(),
      replyId: Joi.string().required(),
    }),
    body: Joi.object().keys({
      isFlagged: Joi.boolean().required(),
    }),
  },
};
