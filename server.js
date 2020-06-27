const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const commentRoutes = require("./routes/comments");
const repliesRoutes = require("./routes/replies");
const documentationRoutes = require("./routes/documentation");
const CustomError = require("./utils/customError");
const errorHandler = require("./utils/errorhandler");

require("dotenv").config();
const app = express();

//connect to mongodb
mongoose
  .connect(
    "mongodb+srv://fg-expense-tracker:backend@fg-expense-tracker-c1uom.mongodb.net/comments-service?retryWrites=true&w=majority",
    {
      useNewUrlParser: true, // for connection warning
      useUnifiedTopology: true,
    },
    () => {
      console.log(
        "\n \t Database connection has been established successfully"
      );
    }
  )
  .catch((err) => {
    console.error("App starting error:", err.stack);
    process.exit(1);
  });

// setup middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//setup app routes
app.use("/", commentRoutes);
app.use("/report/comments", commentRoutes);
app.use("/reports/comments/replies", repliesRoutes);
app.use(["/", "/documentation"], documentationRoutes);

// Invalid route error handler
app.use("*", (req, res, next) => {
  const error = new CustomError(
    404,
    `Oops. The route ${req.method} ${req.originalUrl} is not recognised.`
  );
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

module.exports = app;
