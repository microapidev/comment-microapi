const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const softDelete = require("../../utils/softDelete");

/**
 * @author David Okanlawon
 *
 * Disables/enables an admin account
 *
 * @param {*} req - request object
 * @param {*} res - response object
 * @param {*} next - next middleware function
 * @returns
 */
const enableDisableAdmin = (disabled = true) => {
  return async (req, res, next) => {
    //get msAdminId from token
    const { msAdminId } = req.token;
    const { msAdminId: targetAdminId } = req.params;

    //can't enable/disable your own account
    if (targetAdminId === msAdminId) {
      next(new CustomError(400, "Invalid operation: Self-reference"));
      return;
    }

    try {
      let msAdmin;

      //if disable then soft-delete msAdmin
      if (disabled) {
        msAdmin = await softDelete.deleteById(
          MsAdmin,
          targetAdminId,
          msAdminId
        );
      }
      //if enable restore msAdmin
      else {
        msAdmin = await softDelete.restoreById(MsAdmin, targetAdminId);
      }

      if (!msAdmin) {
        next(new CustomError(404, "MsAdmin account not found"));
        return;
      }

      return responseHandler(
        res,
        200,
        {
          email: msAdmin.email,
          fullname: msAdmin.fullname,
        },
        `MsAdmin account ${disabled ? "disabled" : "enabled"} successfully`
      );
    } catch (error) {
      console.log(error.message);
      next(error);
      return;
    }
  };
};

module.exports = enableDisableAdmin;
