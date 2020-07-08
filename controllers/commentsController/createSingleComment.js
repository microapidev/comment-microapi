// Models
const Applications = require("../../models/applications");
const Comments = require("../../models/comments");

// Utilities
const CustomError = require("../../utils/customError");
const responseHandler = require("../../utils/responseHandler");
const commentHandler = require("../../utils/commentHandler");

/**
 * @author Clish Illa
 *
 * Creates a single comment.
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @param {*} next - The function executed to call the next middleware
 */
const createSingleComment = async (req, res, next) => {
  //validate request
  const { applicationId } = req.token;
  //extra check to make sure the application id exists in the db
  try {
    await Applications.findById(applicationId);
  } catch (err) {
    return next(new CustomError(400, "Invalid application id"));
  }
  //create a new comment
  const comment = new Comments({
    refId: req.body.refId,
    applicationId: applicationId,
    ownerId: req.body.ownerId,
    content: req.body.content,
    origin: req.body.origin,
  });
  //save comment
  try {
    const savedComment = await comment.save();
    return responseHandler(
      res,
      201,
      commentHandler(savedComment),
      "Comment created successfully"
    );
  } catch (err) {
    return next(
      new CustomError(
        500,
        "Something went wrong, please try again",
        err.message
      )
    );
  }
};

module.exports = createSingleComment;
