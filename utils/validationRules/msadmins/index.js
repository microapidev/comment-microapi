exports.createSingleMsAdminSchema = require("./createSingleMsAdminSchema");
exports.loginAdminSchema = require("./loginAdminSchema");
exports.changeMsAdminPasswordSchema = require("./changeMsAdminPasswordSchema");
exports.getAllMsAdminsSchema = require("./getAllMsAdminsSchema");
exports.getSingleMsAdminSchema = require("./getSingleMsAdminSchema");
exports.updateSingleMsAdminSchema = require("./updateSingleMsAdminSchema");
exports.enableDisableMsAdminSchema = require("./enableDisableMsAdminSchema");
exports.deleteSingleMsAdminSchema = require("./deleteSingleMsAdminSchema");
exports.getSelfMsAdminSchema = require("./getSelfMsAdminSchema");

//Application Schema
exports.getAllApplicationsSchema = require("./applicationsSchema/getAllApplicationsSchema");
exports.getSingleApplicationSchema = require("./applicationsSchema/getSingleApplicationSchema");
exports.deleteApplicationSchema = require("./applicationsSchema/deleteApplicationSchema");
exports.blockApplicationSchema = require("./applicationsSchema/blockSingleApplicationSchema");

//Organization Schema
exports.organizationsSchema = require("./organzationsSchema/organizationsSchema");
exports.getAllOrganizationsSchema = require("./organzationsSchema/getAllOrganizationsSchema");

//Settings Schema
exports.updateSystemSettingsSchema = require("./settings/updateSystemSettingsSchema");
exports.getSystemSettingsSchema = require("./settings/getSystemSettingsSchema");
exports.updateSystemSettingsSchema = require("./settings/updateSystemSettingsSchema");

//plans Schema
exports.createNewPlanSchema = require("./planSchema/createNewPlanSchema");
exports.plansSchema = require("./planSchema/plansSchema");
