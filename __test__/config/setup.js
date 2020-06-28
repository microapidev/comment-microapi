const { connect, disconnect } = require("./db");

beforeAll(async () => {
  connect();
});

afterAll(async () => {
  disconnect();
});
