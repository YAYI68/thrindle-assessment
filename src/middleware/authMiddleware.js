import { verifyJwt } from "../utils/helpers/auth.js";

export const protectUser = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res
      .status(401)
      .json({ status: "error", message: "UnAuthorized User" });
  }
  const [, token] = bearer.split(" ");
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "UnAuthorized User" });
  }
  try {
    const payload = verifyJwt(token);
    req.user = payload;
    return next();
  } catch (e) {
    return res
      .status(401)
      .json({ status: "error", message: "UnAuthorized User" });
  }
};
