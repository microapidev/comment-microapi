const mongoose = require("mongoose");

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
  DOCKER_MONGO,
} = process.env;
const dockerUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
const connectionUri =
  process.env.NODE_ENV === "test"
    ? global.__MONGO_URI__
    : DOCKER_MONGO === "true"
    ? dockerUrl
    : process.env.DB_URL;

const regex = /^(?<protocol>mongodb(?:\+srv)?:(?:\/{2})?)(?:(?<user>[\w-.]+?):(?<password>[\w-.]+?)@|:?@?)(?<host>[\w-.]+?)(?::(?<port>\d+))?\/(?<dbname>[\w-.]+)(?:\/)?/;

//extract values and store in environment variables
const connectionParams = connectionUri.match(regex).groups;

connectionParams.uri = `${connectionParams.protocol}${connectionParams.host}${
  connectionParams.port ? ":" + connectionParams.port : ""
}/${connectionParams.dbname}`;

process.env.DB_USER = connectionParams.user || "";
process.env.DB_PASSWORD = connectionParams.password || "";
process.env.DB_URI = connectionParams.uri;

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(connectionUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error("App starting error:", err.stack);
      process.exit(1);
    }
  }
};

const truncate = async () => {
  if (mongoose.connection.readyState !== 0) {
    const { collections } = mongoose.connection;

    const promises = Object.keys(collections).map((collection) =>
      mongoose.connection.collection(collection).deleteMany({})
    );

    await Promise.all(promises);
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
