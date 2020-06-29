const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
    },
  },
  { timestamps: true }
);
const Admin = mongoose.model("Admins", AdminSchema);
module.exports = Admin;
