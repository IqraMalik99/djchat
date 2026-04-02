import { Server } from "socket.io";
import Chat from "../models/chat.js";
import dotenv from "dotenv";

dotenv.config();

const userSocketMap = new Map();

export function initSocket(server) {
  console.log("socj");
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTENED_URL, // ✅ Allow Next.js
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log("token:", token);
    console.log("token received:", JSON.stringify(token)); // 👈 add this
  console.log("token.id:", token?.id);       

    if (!token) return next(new Error("No token"));

    socket.user = token;
    console.log("token:", token);
    next();
  });
  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // 🔥 map userId -> socketId
    userSocketMap.set(userId, socket.id);

    console.log("User connected:", userId, socket.id);

    socket.on("send_message", async (data) => {
      try {
        const { chatId, sender, content } = data;

        // ✅ push message into chat
        const chat = await Chat.findById(chatId);
        console.log("chatzz",chat);
        if (!chat) return;

        const newMsg = {
          _id: Math.random(),
          sender,
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await Chat.findByIdAndUpdate(chatId, {
          $push: {
            messages: {
              sender,
              content,
            },
          },
        });

        let clientsocket = await userSocketMap.get(String(chat.client));
        let djsocket = await userSocketMap.get(String(chat.dj));
        let users = [clientsocket, djsocket];
        console.log(chat.client,chat.dj );
        // ✅ emit to all users in room
        console.log("userss",users)
        if (clientsocket) io.to(clientsocket).emit("receive_message", newMsg);
    if (djsocket) io.to(djsocket).emit("receive_message", newMsg);

      } catch (err) {
        console.error("Socket send error:", err);
      }
    });

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
      console.log("User disconnected:", userId);
    });
  });

  return { io, userSocketMap };
}