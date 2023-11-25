import { tryCatch } from "../utils/helpers/tryCatch.js";
import {
  comparePassword,
  createJwt,
  hashPassword,
} from "../utils/helpers/auth.js";
import {
  loginBodySchema,
  registerBodySchema,
} from "../validators/authValidators.js";
import CustomError from "../utils/error/CustomError.js";
import { UserModel } from "../models/userModel.js";

export const registerUser = tryCatch(async (req, res) => {
  const { name, email, password } = registerBodySchema.parse(req.body);

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists,Pls Kindly Login", 400);
  }

  // Hash password
  const passwordHash = await hashPassword(password);
  // Create user
  const user = await UserModel.create({
    name,
    email,
    password: passwordHash,
  });
  res
    .status(201)
    .json({ status: "success", message: "User created successfully" });
});

export const loginUser = tryCatch(async (req, res) => {
  const data = loginBodySchema.parse(req.body);
  const { email, password } = data;
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials", 400);
  }
  const accessToken = createJwt(
    {
      userId: user._id,
    },
    { expiresIn: 20 * 60 } //expire in 20 minute
  );

  const refreshToken = createJwt(
    {
      userId: user._id,
    },
    { expiresIn: 24 * 60 * 60 }
  ); //expire in 1day

  res.cookie("refresh", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  const userData = {
    name: user.name,
    email: user.email,
    accessToken,
  };
  user.refreshToken = refreshToken;
  await user.save();
  return res.status(201).json({ status: "success", user: userData });
});
