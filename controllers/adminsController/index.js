// POST
const createSingleAdmin = require("./createSingleAdmin");

// DELETE
const deleteSingleAdmin = require("./deleteSingleAdmin");

// GET
const getAllAdmins = require("./getAllAdmins");
const getSingleAdmin = require("./getSingleAdmin");

// PATCH
const updateSingleAdmin = require("./updateSingleAdmin");
const changeAdminPassword = require("./changeAdminPassword");

module.exports = {
  createSingleAdmin,
  getAllAdmins,
  updateSingleAdmin,
  deleteSingleAdmin,
  getSingleAdmin,
  changeAdminPassword,
};
