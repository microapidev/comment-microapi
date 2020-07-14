const { updateEnvSystemSettings } = require("../../utils/settings");
describe("Update Environment System settings function", () => {
  it("should update undefined environment variables", () => {
    const oldSetting = {
      _doc: {
        setting1: "hello",
      },
    };

    const newSetting = {
      _doc: {
        setting2: "world",
        setting3: "haha",
      },
    };

    process.env["setting1"] = oldSetting._doc.setting1;

    //update setting
    updateEnvSystemSettings(newSetting);

    expect(process.env["setting1"]).toEqual("hello");
    expect(process.env["setting2"]).toEqual("world");
    expect(process.env["setting3"]).toEqual("haha");
  });
  it("should update existing environment variables", () => {
    const oldSetting = {
      _doc: {
        setting1: "hello",
        setting2: "world",
        setting3: "haha",
      },
    };

    const newSetting = {
      _doc: {
        setting2: "africa",
      },
    };

    process.env["setting1"] = oldSetting._doc.setting1;
    process.env["setting2"] = oldSetting._doc.setting2;
    process.env["setting3"] = oldSetting._doc.setting3;

    //update setting
    updateEnvSystemSettings(newSetting);

    expect(process.env["setting1"]).toEqual("hello");
    expect(process.env["setting2"]).toEqual("africa");
    expect(process.env["setting3"]).toEqual("haha");
  });
});
