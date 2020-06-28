// connect to mongoDB and prolly seed here

require("dotenv").config();
const mongoose = require("mongoose");

module.exports = async () => {
  console.log("\n Attempting to connect to database...");
  try {
    await mongoose.connect(
      "mongodb+srv://fg-expense-tracker:backend@fg-expense-tracker-c1uom.mongodb.net/comments-service?retryWrites=true&w=majority",
      {
        useNewUrlParser: true, // for connection warning
        useUnifiedTopology: true,
      },
      () => {
        console.log("\n Database connection has been established successfully");
      }
    );
  } catch (err) {
    console.error("Error connecting to database", err.stack);
    process.exit(1);
  }
};
