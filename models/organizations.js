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
      unique: true,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Organization = mongoose.model("Organizations", OrganizationSchema);
module.exports = Organization;
