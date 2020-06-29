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
      lowercase: true,
      required: true,
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
AdminSchema.index({
  organizationId: 1,
  email: 1,
});
const Admin = mongoose.model("Admins", AdminSchema);
module.exports = Admin;
