const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
    },
    secret: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);
const Organization = mongoose.model("Organizations", OrganizationSchema);
module.exports = Organization;
