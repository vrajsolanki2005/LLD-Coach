import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

export const registerUser = async (name: string, email: string, password: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new Error("EMAIL_TAKEN");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });

  return { user: { id: user._id, name: user.name, email: user.email }, token: generateToken(user._id.toString()) };
};

export const loginUser = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("INVALID_CREDENTIALS");

  return { user: { id: user._id, name: user.name, email: user.email }, token: generateToken(user._id.toString()) };
};
