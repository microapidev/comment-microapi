const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../utils/swaggerSpec");

// use swagger-ui-express for your app documentation endpoint
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerSpec));
router.get("/v1", swaggerUi.setup(swaggerSpec));
router.get("/documentation", swaggerUi.setup(swaggerSpec));
router.get("/v1/documentation", swaggerUi.setup(swaggerSpec));

module.exports = router;
