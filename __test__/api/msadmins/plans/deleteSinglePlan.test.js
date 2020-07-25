const app = require("../../../../server");
const supertest = require("supertest");
const PlanModel = require("../../../../models/plans");
const request = supertest(app);
let plan;

describe("DELETE /msadmins/plans/:planId", () => {
  beforeEach(async () => {
    const mockPlan = new PlanModel({
      name: "Basic",
      logging: true,
      maxLogRetentionPeriod: 10,
      maxRequestPerMin: 100,
      maxRequestPerDay: 100,
      periodWeight: 12,
    });

    //save plan doc
    plan = await mockPlan.save();
  });

  afterEach(async () => {
    //remove plan from db and cache
    await PlanModel.findById(plan._id);
    plan = null;
  });

  it("Should delete a single plan", async () => {
    const expected = {
      planId: plan._id.toString(),
      planName: plan.name,
    };
    //make request call to endpoint
    let res = await request
      .delete(`/v1/msadmins/plans/${plan._id}`)
      .set("Authorization", `bearer ${global.sysToken}`);

    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual(expected);
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/msadmins/plans/${plan._id}`;
    const bearerToken = `bearer `;

    const res = await request.delete(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
  it("Should return a 404 if plan is not found", async () => {
    const url = `/v1/msadmins/plans/5f1bc90705867065c4cf0607`;
    const bearerToken = `bearer ${global.sysToken}`;

    const res = await request.delete(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(404);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
});
