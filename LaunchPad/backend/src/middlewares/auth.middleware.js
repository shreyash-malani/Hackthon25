import jwt from 'jsonwebtoken';
import {User} from '../models/User.js'; 

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired. Please log in again." });
            }
            return res.status(403).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyToken middleware:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
