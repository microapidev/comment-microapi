module.exports = {
  moduleFileExtensions: ["js", "json"],
  testRegex: [".spec.js$", ".test.js$"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  globalSetup: "./__test__/config/globalSetup.js",
  globalTeardown: "./__test__/config/globalTeardown.js",
};

// setupFilesAfterEnv: ["./__tests__/config/setup.js"],
