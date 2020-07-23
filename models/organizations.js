const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
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

//plug in the pagination package
OrganizationSchema.plugin(mongoosePaginate);

const Organization = mongoose.model("Organizations", OrganizationSchema);
module.exports = Organization;
