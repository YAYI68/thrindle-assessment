import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../error/CustomError.js";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  return bcrypt.hash(password, salt);
};
export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

// CREATE JWT TOKEN
export const createJwt = (user, options) => {
  const token = jwt.sign(
    { userId: user.userId, role: user.role },
    process.env.JWT_SECRET,
    options
  );
  return token;
};

export const verifyJwt = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new CustomError("Invalid Token", 403);
  }
};
