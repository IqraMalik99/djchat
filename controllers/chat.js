import Chat from "../models/chat.js";
import User from "../models/user.js";
import Booking from "../models/booking.js";
// ✅ GET /api/chat
export const getChats = async (req, res) => {
    try {
        const userId = req.user.id;

        const chats = await Chat.find({
            $or: [{ dj: userId }, { client: userId }],
        })
            .sort({ lastMessageAt: -1 })
            .lean();

        return res.json(chats);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ✅ POST /api/chat
export const createChat = async (req, res) => {
    try {
        const { bookingId } = req.body;
        console.log(bookingId,"bookingId");

        if (!bookingId) {
            return res.status(400).json({ error: "bookingId is required" });
        }

        // 🔥 get booking
        const booking = await Booking.findById(bookingId)
            .populate("client")
            .populate("dj")
            .lean();

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const clientId = booking.client._id;
        const djId = booking.dj._id;


        let chat = await Chat.findOne({
            dj: djId, client: clientId
        }).populate("messages")
            .lean();
       if(chat){
         chat.messages = chat.messages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
       }



        if (!chat) {
            chat = await Chat.create({
                client: clientId,
                dj: djId,
                clientname: booking.client.name,
                djname: booking.dj.name,
                clientavatar: booking.client.profilePicture || "/avatar.png",
                djavatar: booking.dj.profilePicture || "/avatar.png",
                messages: []
            });
        }

        return res.json(chat);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

//by job

export const createChatByJob = async (req, res) => {
    try {
        let { djId } = req.body;

        if (!djId) {
            return res.status(400).json({ error: "djId is required" });
        }

        // 🔥 get booking
        const dj = await User.findById(djId);
        const user = req.user;
    

        if (!dj) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const clientId = user.id;
         djId =dj._id;


        let chat = await Chat.findOne({
            dj: djId, client: clientId
        }).populate("messages")
            .lean();
       if(chat){
         chat.messages = chat.messages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
       }



        if (!chat) {
            chat = await Chat.create({
                client: clientId,
                dj: djId,
                clientname:user.name,
                djname: dj.name,
                clientavatar:user.profilePicture || "/avatar.png",
                djavatar: dj.profilePicture || "/avatar.png",
                messages: []
            });
        }

        return res.json(chat);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ✅ GET /api/chat/:chatId
export const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId)
            .populate("messages")
            .lean();

        if (!chat) return res.status(404).json({ error: "Chat not found" });

         chat.messages = chat.messages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        

        const isMember =
            chat.dj.toString() === userId || chat.client.toString() === userId;
        if (!isMember) return res.status(403).json({ error: "Forbidden" });

        // ✅ change 2 - sort messages here
        chat.messages = chat.messages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        return res.json(chat);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// ✅ POST /api/chat/:chatId
export const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { content } = req.body;
        const {sender} = req.body;

        let userId= sender;

        if (!content) return res.status(400).json({ error: "Message is required" });

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ error: "Chat not found" });

        const isMember =
            chat.dj.toString() === userId || chat.client.toString() === userId;
        if (!isMember) return res.status(403).json({ error: "Forbidden" });

        chat.messages.push({ sender: userId, content, seen: false });
        chat.lastMessage = content;
        chat.lastMessageAt = new Date();

        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];

        return res.status(201).json(savedMessage);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};