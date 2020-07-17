const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const ApplicationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organizations",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admins",
      required: true,
    },
  },
  { timestamps: true }
);

ApplicationSchema.index(
  {
    organizationId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

ApplicationSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

const Application = mongoose.model("Applications", ApplicationSchema);
module.exports = Application;
