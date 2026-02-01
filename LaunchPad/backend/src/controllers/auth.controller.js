// controllers/authController.js

import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/token.js';

export const signUp = async (req, res) => {
    const { fullName, email, password, role, contactNo } = req.body;

    try {
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role,
            contactNo
        });

        await newUser.save();

        generateToken(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            role: newUser.role,
            contactNo: newUser.contactNo,
            message: "User created successfully"
        });

    } catch (error) {
        console.error("Error in signUp controller:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isPassCorrect = await bcrypt.compare(password, user.password);
        if (!isPassCorrect) return res.status(401).json({ message: "Invalid credentials" });

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            contactNo: user.contactNo,
            message: "User logged in successfully"
        });

    } catch (error) {
        console.error("Error in login controller:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
