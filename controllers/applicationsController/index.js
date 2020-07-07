// POST
const createSingleApplication = require("./createSingleApplication");
const getApplicationToken = require("./getApplicationToken");
// DELETE
const deleteSingleApplication = require("./deleteSingleApplication");

// GET
const getAllApplications = require("./getAllApplications");
const getSingleApplication = require("./getSingleApplication");

// PATCH

module.exports = {
  getAllApplications,
  createSingleApplication,
  getApplicationToken,
  deleteSingleApplication,
  getSingleApplication,
};
