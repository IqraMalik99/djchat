import { getToken } from "next-auth/jwt";
import User from "../models/user.js";


const protect = async (req, res, next) => {
  try {
    const token = await getToken({
      req,
      secret: "supersecret",
    });

    console.log("token:", token);

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // token contains user data from NextAuth session
    req.user = await User.findOne({ email: token.email });

 console.log("req.user",req.user,"req.user");
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