<<<<<<< HEAD
const { connect, disconnect } = require("./db");

beforeAll(async () => {
  connect();
});

afterAll(async () => {
  disconnect();
=======
const database = require("../../db/database");

beforeAll(() => {
  return database.connect();
});

beforeEach(() => {
  return database.truncate();
});

afterAll(() => {
  return database.disconnect();
>>>>>>> 2010a29cabdc39ef3503f4a4930767536316c3af
});
