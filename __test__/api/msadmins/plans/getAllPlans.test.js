const app = require("../../../../server");
const supertest = require("supertest");
const PlanModel = require("../../../../models/plans");
const request = supertest(app);
let plan;

describe("GET /msadmins/plans", () => {
  it("Should get all plans", async () => {
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
    const expected = [];
    expected.push({
      planId: plan._id.toString(),
      planName: plan.name,
      maxLogRetentionPeriod: plan.maxLogRetentionPeriod,
      maxRequestPerMin: plan.maxRequestPerMin,
      maxRequestPerDay: plan.maxRequestPerDay,
      periodWeight: plan.periodWeight,
      logging: plan.logging,
    });
    //make request call to endpoint
    let res = await request
      .get(`/v1/msadmin/plans`)
      .set("Authorization", `bearer ${global.sysToken}`);

    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual(expected);
    //remove plan from db and cache
    await PlanModel.findById(plan._id);
    plan = null;
  });

  it("Should return a 401 error when authorization token is unauthorized", async () => {
    const url = `/v1/msadmins/plans`;
    const bearerToken = `bearer `;

    const res = await request.get(url).set("Authorization", bearerToken);

    expect(res.status).toEqual(401);
    expect(res.body.status).toEqual("error");
    expect(res.body.data).toEqual([]);
  });
});
