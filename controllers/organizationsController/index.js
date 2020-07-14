// POST
const createSingleOrganization = require("./createSingleOrganization");
const getSingleOrganizationToken = require("./getSingleOrganizationToken");

//DELETE
const deleteSingleOrganization = require("./deleteSingleOrganization");
module.exports = {
  createSingleOrganization,
  getSingleOrganizationToken,
  deleteSingleOrganization,
};
