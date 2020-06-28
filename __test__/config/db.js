const mongoose = require("mongoose");

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

const truncate = async (Model) => {
  if (mongoose.connection.readyState !== 0) {
    await Model.deleteMany({}, (err) => err);
  }
};

const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = {
  connect,
  truncate,
  disconnect,
};
