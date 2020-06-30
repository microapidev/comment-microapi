import jwt from "jsonwebtoken";
export const generateToken = (payload, secret, duration = "24h") => {
  const secretPhrase = Buffer.from(secret, "base64");
  const token = jwt.sign(payload, secretPhrase, {
    expiresIn: duration,
  });

  return token;
};
