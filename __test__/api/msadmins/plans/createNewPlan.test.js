const app = require("../../../../server");
const supertest = require("supertest");
const request = supertest(app);

describe("POST /msadmins/plans", () => {
  it("should create a new plan", async () => {
    const mockPlan = {
      name: "Basic",
      loggingEnabled: true,
      maxLogRetentionPeriod: 10,
      requestPerMin: 100,
      maxRequestPerDay: 100,
    };
    const url = `/v1/msadmins/plans`;
    const bearerToken = `bearer ${global.sysToken}`;
    const res = await request
      .post(url)
      .set("Authorization", bearerToken)
      .send(mockPlan);
    expect(res.status).toEqual(200);
    console.log(res.body);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.planName).toEqual(mockPlan.name);
    expect(res.body.data.loggingEnabled).toEqual(mockPlan.loggingEnabled);
    expect(res.body.data.logRetentionPeriod).toEqual(
      mockPlan.maxLogRetentionPeriod
    );
    expect(res.body.data.requestPerMin).toEqual(mockPlan.requestPerDay);
    expect(res.body.data.requestPerDay).toEqual(mockPlan.requestPerDay);
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/msadmins/plans`;
    const bearerToken = `bearer `;
    const res = await request
      .post(url)
      .set("Authorization", bearerToken)
      .send({});
    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
  it("Should return a 422 error when validation fails", async () => {
    const url = `/v1/msadmins/plans`;
    const bearerToken = `bearer ${global.sysToken}`;
    const res = await request.post(url).set("Authorization", bearerToken);
    expect(res.status).toEqual(422);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toBeTruthy();
  });
});
