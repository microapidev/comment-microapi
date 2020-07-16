const MsAdmin = require("../../models/msadmins");
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");

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
        //promisify the callback
        //const deleteByIdPromise = promisify(MsAdmin.deleteById);
        // msAdmin = await deleteByIdPromise(targetAdminId, msAdminId);
        msAdmin = await MsAdmin.findById(targetAdminId);

        if (!msAdmin) {
          next(new CustomError(404, "MsAdmin account not found"));
          return;
        }

        //promisify it!
        msAdmin = await (async () => {
          return new Promise((resolve) => {
            msAdmin.delete(msAdminId, (err, doc) => {
              resolve(doc);
            });
          });
        })();
      }
      //if enable restore msAdmin
      else {
        msAdmin = await MsAdmin.findOneDeleted({ _id: targetAdminId });

        if (!msAdmin) {
          next(new CustomError(404, "MsAdmin account not found"));
          return;
        }

        //promisify it!
        msAdmin = await (async () => {
          return new Promise((resolve) => {
            msAdmin.restore((err, doc) => {
              console.log(doc);
              resolve(doc);
            });
          });
        })();
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
