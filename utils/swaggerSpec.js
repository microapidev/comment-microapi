const swaggerJSDoc = require("swagger-jsdoc");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.3", // Version of swagger
  info: {
    title: "REST API for Comments MicroAPI", // Title of the documentation
    version: "1.0.0", // Version of the app
    description:
      "This is the REST API Documentation for the Comments MicroAPI created by the MicroAPI team", // short description of the app
  },
  basePath: "/", // the basepath of your endpoint
  components: {
    securitySchemes: {
      Bearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["docs/**/*.yaml"],
};
// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);
