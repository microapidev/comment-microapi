const Applications = require('../../../models/applications');
const MsAdmin = require('../../../models/msadmins');
const CommentModel = require('../../../models/comments');
const CustomError = require('../../../utils/customError');
const responseHandler = require('../../../utils/responseHandler');

/**
 * @author Ekeyekwu Oscar
 *
 * Gets all applications using the microservice.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const getSingleApplication = async (req, res, next) => {
  //get msAdminId from token
  const { msAdminId } = req.token;
  const { applicationId } = req.params;

  //get single application, map field names appropriately
  let application;
  try {
    //check if msAdmin exists
    const msAdmin = await MsAdmin.findById(msAdminId);
    if (!msAdmin) {
      next(new CustomError(404, 'MsAdmin account not found'));
      return;
    }

    //get  applications
    const singleApplication = await Applications.findById(
      applicationId
    ).populate('organizationId');

    if (!singleApplication) {
      next(new CustomError(404, 'Application not Found'));
      return;
    }

    // let commentsCount, repliesCount;
    // const comments = await CommentModel.find({applicationId:applicationId});
    // console.log(comments)
    // if (!comments || comments === []) {
    //   commentsCount = 0;
    //   repliesCount = 0;
    // } else {
    //   commentsCount = comments.records.length;
    //   repliesCount = comments.records.reduce((acc, curr) => {
    //     return acc + curr.numOfReplies;
    //   }, 0);
    // }
    // console.log(commentsCount, repliesCount);
    application = {
      applicationId: singleApplication._id,
      applicationName: singleApplication.name,
      organizationId: singleApplication.organizationId,
      organizationName: singleApplication.organizationId.name,
    //   totalNumOfComments: commentsCount,
    //   totalNumOfReplies: repliesCount,
    };
  } catch (error) {
    console.log(error.message);
    next(new CustomError(400, 'An error occured retrieving Application'));
    return;
  }
  return responseHandler(
    res,
    200,
    application,
    'Application retrieved successfully'
  );
};

module.exports = getSingleApplication;
