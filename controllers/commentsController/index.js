// POST
const createSingleComment = require("./createSingleComment");

// DELETE
const deleteSingleComment = require("./deleteSingleComment");

// GET
const getAllComments = require("./getAllComments");
const getSingleComment = require("./getSingleComment");
const getSingleCommentVotes = require("./getSingleCommentVotes.js");

// PATCH
const updateSingleComment = require("./updateSingleComment");
const updateSingleCommentUpVotes = require("./updateSingleCommentUpVotes");
const updateSingleCommentDownVotes = require("./updateSingleCommentDownVotes");
const updateSingleCommentFlags = require("./updateSingleCommentFlags");

module.exports = {
  createSingleComment,
  deleteSingleComment,
  getAllComments,
  getSingleComment,
  getSingleCommentVotes,
  updateSingleComment,
  updateSingleCommentUpVotes,
  updateSingleCommentDownVotes,
  updateSingleCommentFlags,
};
