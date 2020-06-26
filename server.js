const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const commentRoutes = require("./routes/comments");
const documentationRoutes = require("./routes/documentation");
const CustomError = require("./utils/customError");
const errorHandler = require("./utils/errorhandler");

require("dotenv").config();
const app = express();

// setup middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//setup app routes
app.use("/comments", commentRoutes);
app.use(["/", "/documentation"], documentationRoutes);

// Invalid route error handler
<<<<<<< HEAD
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
=======
app.use("*", (req, res) => {
  res.status(404).send({
    message: `Oops. The route ${req.method} ${req.originalUrl} is not recognised.`,
  });
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
  res.send("error");
>>>>>>> ft: add success responseHandler
});

module.exports = app;
