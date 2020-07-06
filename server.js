const express = require("express");
const cors = require("cors");
const commentRoutes = require("./routes/comments");
const organizationsRoutes = require("./routes/organizations");
const applicationsRoutes = require("./routes/application");
const documentationRoutes = require("./routes/documentation");
const adminsRoutes = require("./routes/admins");
const CustomError = require("./utils/customError");
const errorHandler = require("./utils/errorhandler");

require("dotenv").config();
const app = express();

// setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//setup app routes
app.use("/v1/comments", commentRoutes);
app.use("/v1/organizations", organizationsRoutes);
app.use("/v1/applications", applicationsRoutes);
app.use("/v1/admins", adminsRoutes);
app.use(["/v1", "/"], documentationRoutes);

// Invalid route error handler
app.use("*", (req, res, next) => {
  const error = new CustomError(
    404,
    `Oops. The route ${req.method} ${req.originalUrl} is not recognised`
  );
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

module.exports = app;
