import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomErrorHandler } from "../middlewares/error.js";
import { sendCookie } from "../utils/feature.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

// Function to get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return next(new CustomErrorHandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    sendCookie(user, res, "Registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new CustomErrorHandler("Invalid email/password", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new CustomErrorHandler("Invalid email/password", 400));
    }

    sendCookie(user, res, `Welcome back ${user.name}`, 201);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Login First",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    sendCookie(user, res, `Welcome back ${user.name}`, 201);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const uploadDir = join(__dirname, "../uploads");

    // Check if the uploads directory exists
    if (fs.existsSync(uploadDir)) {
      // Read the contents of the uploads directory
      fs.readdirSync(uploadDir).forEach((file) => {
        // Delete each file within the directory
        const filePath = join(uploadDir, file);
        fs.unlinkSync(filePath);
      });
    }

    res
      .cookie("token", null, {
        httpOnly: true,
        expires: new Date(0),
        // sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        // secure: process.env.NODE_ENV === "development" ? false : true,
      })
      .status(201)
      .json({
        success: true,
        message: "Logout successfully",
      });
  } catch (error) {
    next(error);
  }
};
