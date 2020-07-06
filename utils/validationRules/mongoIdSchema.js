const mongoose = require("mongoose");

const mongoIdSchema = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid mongo ObjectID");
  }

  return value;
};

module.exports = mongoIdSchema;
