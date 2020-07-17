const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

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

OrganizationSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

const Organization = mongoose.model("Organizations", OrganizationSchema);
module.exports = Organization;
