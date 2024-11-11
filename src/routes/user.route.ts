import express, { Request, Response } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import User from "../models/user.model";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post(
  "/register",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        createdAt: new Date(),
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

userRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get(
  "/profile",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await User.findOne({ email: req.body.user.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ username: user.username, email: user.email });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default userRouter;
