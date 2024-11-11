import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error: Error, decoded: any) => {
    if (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.body.user = decoded;
    next();
  });
};
