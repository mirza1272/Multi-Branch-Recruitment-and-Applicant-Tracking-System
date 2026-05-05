import jwt from "jsonwebtoken";
import { COOKIE_OPTIONS } from "../constants.js";

/**
 * Signs a JWT and sets it as an httpOnly cookie on the response.
 * @param {object} res      - Express response object
 * @param {object} payload  - data to encode (userId, role)
 * @returns {string}        - signed token
 */
export const generateTokenAndSetCookie = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, COOKIE_OPTIONS);
  return token;
};
