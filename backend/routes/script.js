import express from "express";
import multer from "multer";
import {
  fileUpload1,
  fileUpload2,
  fileUpload3,
} from "../controllers/upload.js";
import { isAuthenticated } from "../middlewares/auth.js";

// Configure multer to handle file uploads
const upload = multer({ dest: "uploads/", filename: "uploaded_file.csv" });

export const scriptRouter = express.Router();

// Route to handle file uploads from the frontend
scriptRouter.post(
  "/jmxupload",
  isAuthenticated,
  upload.single("file"),
  fileUpload1
);
scriptRouter.post(
  "/scalaupload",
  isAuthenticated,
  upload.single("file"),
  fileUpload2
);
scriptRouter.post(
  "/k6upload",
  isAuthenticated,
  upload.single("file"),
  fileUpload3
);
