exports.updateEnvSystemSettings = (systemSettings) => {
  for (const [setting, value] of Object.entries(systemSettings._doc)) {
    if (["_id", "createdAt", "updatedAt", "__v"].indexOf(setting) > -1) {
      continue;
    }
    // console.log(`${setting}: ${value}`);
    process.env[setting] = value;
  }
};
