const database = require("../../db/database");

beforeAll(() => {
  return database.connect();
});

beforeEach(() => {
  return database.truncate();
});

afterAll(() => {
  return database.disconnect();
});
