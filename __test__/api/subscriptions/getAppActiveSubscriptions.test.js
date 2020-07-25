const getActiveSubscriptions = require("../../../utils/getActiveSubscription");

test("should log active subs", async () => {
  const getSubs = await getActiveSubscriptions(global.application._id);

  console.log(getSubs);
});
