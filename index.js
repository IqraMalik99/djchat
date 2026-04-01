import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import chat from "./routes/chat.js";
import { initSocket } from "./socket/index.js"; 
import dotenv from "dotenv";

dotenv.config();

const app = express();

console.log("process.env.FRONTENED_URL",process.env.FRONTENED_URL);

app.use(cors({
  origin: process.env.FRONTENED_URL, // ✅ Allow Next.js
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-user"], // ✅ Allow x-user header
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/chat",chat);


// DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);



// 👇 CREATE HTTP SERVER
const server = http.createServer(app);

// 👇 INIT SOCKET HERE
const { io, userSocketMap } = initSocket(server);

// START SERVER
server.listen(3001, () => {
  console.log("Server running on port 3001");
});