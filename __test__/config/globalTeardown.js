// empty mongoDB and disconnect
const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.disconnect();
};
