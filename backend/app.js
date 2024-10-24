// Importing dependencies
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

// Importing custom modules
import userRouter from "./routes/user.js";
import { scriptRouter } from "./routes/script.js";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./data/database.js";

// Initialize environment variables
config({ path: "./data/config.env" });

// Create an Express application
const app = express();
const port = process.env.PORT;

// Database connection
connectDB();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/script", scriptRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Nicely working");
});

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});

export default app;
