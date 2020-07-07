const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

exports.comparePassword = async (password, hashed) => {
  const isValid = await bcrypt.compare(password, hashed);
  return isValid;
};
