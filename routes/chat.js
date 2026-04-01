import express from "express";
import protect from "../middleware/middleware.js";
import {
  getChats,
  createChat,
  getChatById,
  sendMessage,
  createChatByJob
} from "../controllers/chat.js";

const chat = express.Router();

chat.get("/",    protect, getChats);
chat.post("/create-chat",   protect, createChat);
chat.post("/create-chat/job",   protect, createChatByJob);
chat.get("/:chatId",  protect, getChatById);
chat.post("/:chatId", sendMessage);

export default chat;