const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const MsAdmin = mongoose.model("MsAdmins", MsAdminSchema);
module.exports = MsAdmin;
