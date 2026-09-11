import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "Name, email and password are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      return;
    }

    const data = await registerUser(name, email, password);
    res.status(201).json({ success: true, message: "Account created successfully", data });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      res.status(409).json({ success: false, message: "An account with this email already exists" });
      return;
    }
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Failed to create account" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    const data = await loginUser(email, password);
    res.status(200).json({ success: true, message: "Login successful", data });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};
