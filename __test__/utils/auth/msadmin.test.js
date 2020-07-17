const { createDefaultAdmin } = require("../../../utils/auth/msadmin");
const MsAdmin = require("../../../models/msadmins");

describe("MsAdmin auth utils", () => {
  describe("createDefaultAdmin", () => {
    it.skip("should throw error if SUPER_ADMIN_EMAIL not found", async () => {
      process.env.SUPER_ADMIN_PASSWORD = "password";
      process.env.SUPER_ADMIN_EMAIL = "";
      await expect(createDefaultAdmin()).rejects.toThrow();
    });

    it.skip("should throw error if SUPER_ADMIN_PASSWORD not found", async () => {
      process.env.SUPER_ADMIN_EMAIL = "test@email.com";
      process.env.SUPER_ADMIN_PASSWORD = "";
      await expect(createDefaultAdmin()).rejects.toThrow();
    });

    it("should create default admin", async () => {
      process.env.SUPER_ADMIN_EMAIL = "test@email.com";
      process.env.SUPER_ADMIN_PASSWORD = "password";
      //hacky I know  but can refactor to check valid mongo object ID later
      const admin = await createDefaultAdmin();
      await expect(admin.sysdefined).toBe(true);

      const msAdmin = await MsAdmin.findOne({
        sysdefined: true,
        role: "superadmin",
      });
      // check DB
      expect(msAdmin.sysdefined).toBe(true);
      await MsAdmin.findByIdAndDelete(msAdmin.id);
    });

    it("should return if default account already created", async () => {
      process.env.SUPER_ADMIN_EMAIL = "test@email.com";
      process.env.SUPER_ADMIN_PASSWORD = "password";

      //hacky I know  but can refactor to check valid mongo object ID later
      const admin = await createDefaultAdmin();
      await expect(admin.sysdefined).toBe(true);

      const msAdmin = await MsAdmin.findOne({
        sysdefined: true,
        role: "superadmin",
      });
      // check DB
      expect(msAdmin.sysdefined).toBe(true);

      //try to create again
      //hacky I know  but can refactor to check valid mongo object ID later
      await expect(createDefaultAdmin()).resolves.toBeTruthy();
      await MsAdmin.findByIdAndDelete(msAdmin.id);
    });
  });
});
