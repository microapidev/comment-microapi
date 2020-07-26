// POST
const createSingleApplication = require("./createSingleApplication");
const getApplicationToken = require("./getApplicationToken");
// DELETE
const deleteSingleApplication = require("./deleteSingleApplication");

// GET
const getAllApplications = require("./getAllApplications");
const getSingleApplication = require("./getSingleApplication");
const getSingleApplicationLog = require("./getSingleApplicationLog");

// PATCH
const updateSingleApplication = require("./updateSingleApplication");

module.exports = {
  getAllApplications,
  createSingleApplication,
  getApplicationToken,
  deleteSingleApplication,
  getSingleApplication,
  updateSingleApplication,
  getSingleApplicationLog,
};
