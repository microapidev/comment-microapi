const { connect, disconnect } = require("./db");

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});
