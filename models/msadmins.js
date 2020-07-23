const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseDelete = require("mongoose-delete");

//static roles for now will be dynamic in future iterations
const ROLES = ["admin", "superadmin"];

const MsAdminSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    sysdefined: {
      // system-generated can't delete
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      enum: ROLES,
      default: "admin",
    },
  },
  { timestamps: true }
);

//Add soft delete plugin
MsAdminSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

//plug in the pagination package
MsAdminSchema.plugin(mongoosePaginate);

//create model
const MsAdmin = mongoose.model("MsAdmins", MsAdminSchema);
module.exports = MsAdmin;
