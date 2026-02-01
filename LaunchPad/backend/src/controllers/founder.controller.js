import { Founder } from '../models/Founder.js';

// @desc Create founder profile
// @route POST /api/founder
export const createFounderProfile = async (req, res) => {
    const { companyName, bio, websiteUrl, BussinessNumber } = req.body;

    try {
        if (req.user.role !== 'founder') {
            return res.status(403).json({ message: "Only users with founder role can create a founder profile" });
        }

        const existingProfile = await Founder.findOne({ userId: req.user._id });
        if (existingProfile) {
            return res.status(400).json({ message: "Founder profile already exists" });
        }

        const founder = new Founder({
            userId: req.user._id,
            companyName,
            bio,
            websiteUrl,
            BussinessNumber
        });

        await founder.save();

        return res.status(201).json({
            message: "Founder profile created successfully",
            founder
        });

    } catch (error) {
        console.error("Error in createFounderProfile:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// @desc Get current founder profile
// @route GET /api/founder/me
export const getMyFounderProfile = async (req, res) => {
    try {
        const founder = await Founder.findOne({ userId: req.user._id }).populate('userId', 'fullName email role');
        if (!founder) {
            return res.status(404).json({ message: "Founder profile not found" });
        }

        return res.status(200).json(founder);

    } catch (error) {
        console.error("Error in getMyFounderProfile:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// @desc Update founder profile
// @route PUT /api/founder
export const updateFounderProfile = async (req, res) => {
    const { companyName, bio, websiteUrl, BussinessNumber } = req.body;

    try {
        const founder = await Founder.findOne({ userId: req.user._id });
        if (!founder) {
            return res.status(404).json({ message: "Founder profile not found" });
        }

        founder.companyName = companyName || founder.companyName;
        founder.bio = bio || founder.bio;
        founder.websiteUrl = websiteUrl || founder.websiteUrl;
        founder.BussinessNumber = BussinessNumber || founder.BussinessNumber;

        await founder.save();

        return res.status(200).json({
            message: "Founder profile updated successfully",
            founder
        });

    } catch (error) {
        console.error("Error in updateFounderProfile:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
