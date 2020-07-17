exports.createSingleMsAdminSchema = require("./createSingleMsAdminSchema");
exports.loginAdminSchema = require("./loginAdminSchema");
exports.changeMsAdminPasswordSchema = require("./changeMsAdminPasswordSchema");
exports.getAllMsAdminsSchema = require("./getAllMsAdminsSchema");
exports.getSingleMsAdminSchema = require("./getSingleMsAdminSchema");
exports.updateSingleMsAdminSchema = require("./updateSingleMsAdminSchema");
exports.enableDisableMsAdminSchema = require("./enableDisableMsAdminSchema");
exports.deleteSingleMsAdminSchema = require("./deleteSingleMsAdminSchema");
//Application Schema
exports.getAllApplicationsSchema = require("./applicationsSchema/getAllApplicationsSchema");
exports.getSingleApplicationSchema = require("./applicationsSchema/getSingleApplicationSchema");

//Organization Schema
exports.getOrganizationsApps = require("./organzationsSchema/getOrganizationsApps");

//Settings Schema
exports.updateSystemSettingsSchema = require("./settings/updateSystemSettingsSchema");
exports.getSystemSettingsSchema = require("./settings/getSystemSettingsSchema");
exports.updateSystemSettingsSchema = require("./settings/updateSystemSettingsSchema");
