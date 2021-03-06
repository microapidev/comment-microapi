/**
 * Module dependencies.
 */
const log = require("debug")("log");
const http = require("http");
const { createDefaultAdmin } = require("../utils/auth/msadmin");
const SystemSettings = require("../models/systemSettings");

/**
 * Module to allow usage of process.env
 */
require("dotenv").config();

let server, port;

//connect to mongodb
log("Attempting to connect to database...");

//connect to mongodb
const database = require("../db/database");
database.connect().then(() => {
  log("Database connected successfully");
  createDefaultAdmin()
    .then(async () => {
      //Initialize system settings by triggering dummy update with empty values
      //if any setting is not set defaults kick in
      log(`Updating system settings ....`);
      await SystemSettings.findOneAndUpdate({}, {}, { upsert: true });
      log(`System settings updated!`);
    })
    .catch((error) => {
      log(`${error.message}`);
      process.exit(1);
    });

  const app = require("../server");

  /**
   * Get port from environment and store in Express.
   */

  var port = normalizePort(process.env.PORT || 4000);
  app.set("port", port);

  /**
   * Create HTTP server.
   */

  server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port, () => {
    // log(`Server listening on port ${port}`);
    log("Server Time: " + Date());
  });
  server.on("error", onError);
  server.on("listening", onListening);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  log("Listening on " + bind);
}
