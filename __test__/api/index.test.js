const app = require("../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("GET /", () => {
  test("Should return status 200 and render Swagger docs", async () => {
    const res = await request.get("/");
    expect(res.status).toBe(200);
    expect(res.text).toMatchSnapshot();
<<<<<<< HEAD
=======
    done();
>>>>>>> 2010a29cabdc39ef3503f4a4930767536316c3af
  });
});

describe("Invalid routes '/xyz'", () => {
  test("Requests should return status 404 and error message", async () => {
    const res = await request.post("/xyz");
    expect(res.status).toBe(404);
    expect({
      message: `Oops. The route ${res.method} ${res.originalUrl} is not recognised.`,
    });
  });
});
