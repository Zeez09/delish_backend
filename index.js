import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import orderRoutes from "./routes/orderRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", userRoute);
app.use("/api/orders", orderRoutes);

// Database + Server startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`✅ Server running on Render (port ${PORT})`)
    );
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
};

startServer();
