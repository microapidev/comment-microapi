module.exports = {
  moduleFileExtensions: ["js", "json"],
  testRegex: [".spec.js$", ".test.js$"],
  coverageDirectory: "./coverage",
  //testEnvironment: "node",
  setupFilesAfterEnv: ["./__test__/config/setup.js"],
  preset: "@shelf/jest-mongodb",
};
