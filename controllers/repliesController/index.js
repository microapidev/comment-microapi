// CREATE
const createSingleReply = require("./createSingleReply");

// DELETE
const deleteSingleReply = require("./deleteSingleReply");

// GET
const getAllReplies = require("./getAllReplies");
const getSingleReply = require("./getSingleReply");
const getSingleReplyVotes = require("./getSingleReplyVotes.js");

// PATCH
const updateSingleReply = require("./updateSingleReply");
const updateSingleReplyUpVotes = require("./updateSingleReplyUpVotes");
const updateSingleReplyDownVotes = require("./updateSingleReplyDownVotes");
const updateSingleReplyFlags = require("./updateSingleReplyFlags");

module.exports = {
  createSingleReply,
  deleteSingleReply,
  getAllReplies,
  getSingleReply,
  getSingleReplyVotes,
  updateSingleReply,
  updateSingleReplyUpVotes,
  updateSingleReplyDownVotes,
  updateSingleReplyFlags,
};
