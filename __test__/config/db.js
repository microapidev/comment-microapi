const mongoose = require("mongoose");

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  const regex = /^(?<protocol>mongodb(?:\+srv)?:(?:\/{2})?)(?:(?<user>[\w-.]+?):(?<password>[\w-.]+?)@|:?@?)(?<host>[\w-.]+?)(?::(?<port>\d+))?\/(?<dbname>[\w-.]+)(?:\/)?/;

  //extract values and store in environment variables
  const connectionParams = global.__MONGO_URI__.match(regex).groups;

  connectionParams.uri = `${connectionParams.protocol}${connectionParams.host}${
    connectionParams.port ? ":" + connectionParams.port : ""
  }/${connectionParams.dbname}`;

  process.env.DB_USER = connectionParams.user || "";
  process.env.DB_PASSWORD = connectionParams.password || "";
  process.env.DB_URI = connectionParams.uri;
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
