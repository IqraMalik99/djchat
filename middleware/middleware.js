import { getToken } from "next-auth/jwt";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  try {
    const token = await getToken({
      req,
      secret: "supersecret",
    });

    console.log("token:", token);

    // ✅ get userId from header as fallback
    const headerUserId = req.headers["x-user-id"];

    if (!token && !headerUserId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (token) {
      // normal flow — session cookie worked
      req.user = await User.findOne({ email: token.email });
    } else {
      // fallback — use header id (prod cross-origin case)
      req.user = await User.findById(headerUserId);
    }

    console.log("req.user", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid session" });
  }
};

export default protect;