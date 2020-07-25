const swaggerJSDoc = require("swagger-jsdoc");

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.21", // Version of swagger
  info: {
    title: "Comment MicroAPI", // Title of the documentation
    version: "1.0.0", // Version of the app
    termsOfService: "https://microapi.dev/terms-of-service",
    contact: {
      name: "API Support",
      url: "https://microapi.dev/contact",
      email: "api@comment.microapi.dev",
    },
    license: {
      name: "MIT",
      url:
        "https://github.com/microapidev/comment-microapi/blob/develop/LICENSE",
    },
    description:
      "### Overview" +
      "\n\n" +
      "The Comment API gives the developer access to built-in functionalities for when they want to " +
      "implement comments and replies within their own application. " +
      "\n\n" +
      "Basic functionalities are available for creation, update, and deletion of " +
      "comments and replies while ensuring that only users authorized are allowed " +
      "to use such functionalities." +
      "\n\n" +
      "Additionally, there are extra features such as filtering, sorting, voting, and " +
      "flagging available." +
      "\n\n" +
      "## HOW TO USE" +
      "\n\n" +
      "- Create new Organization to get token. (On creating a new organization, a new admin account is created)." +
      "\n\n" +
      "- All Administration related endpoints requires the `orgToken` (i.e organziations,admins & application endpoints)." +
      "\n\n" +
      "- Create a new Application that Comments and Replies will be tied to." +
      "\n" +
      "- Use `appToken` generated when creating application on all Comments and Repies endpoints",
  },
  servers: [
    {
      url: "https://comment.microapi.dev/v1",
      description: "Production server (uses live data)",
    },
    {
      url: "https://comments-microservice.herokuapp.com/v1",
      description: "Staging server (uses test data)",
    },
    {
      url: "http://localhost:4000/v1",
      description: "Local server (uses test data)",
    },
  ],
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
