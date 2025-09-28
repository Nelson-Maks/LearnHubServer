import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";
import courseRouter from "./routes/courseRoutes.js";



dotenv.config()
connectDB()


// MIDDLEWARE
const app = express()
app.use(cors({
  origin: "https://learn-hub-flame.vercel.app", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json())


app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))

