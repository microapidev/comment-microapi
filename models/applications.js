const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");
const comments = require("./comments");

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

ApplicationSchema.post("findOneAndDelete", async (application) => {
  if (application) {
    //delete any existing comment
    await comments.deleteMany({ applicationId: application._id });
  }
});

ApplicationSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

const Application = mongoose.model("Applications", ApplicationSchema);
module.exports = Application;
