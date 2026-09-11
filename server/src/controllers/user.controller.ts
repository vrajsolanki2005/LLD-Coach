import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};
