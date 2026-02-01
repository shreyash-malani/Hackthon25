import { Investor } from '../models/Investor.js';

// @desc Create investor profile
// @route POST /api/investor
export const createInvestorProfile = async (req, res) => {
  const { organizationName, bio, type, preferredDomain, linkedin } = req.body;

  try {
    if (req.user.role !== 'investor') {
      return res.status(403).json({ message: 'Only investors can create a profile' });
    }

    const existingProfile = await Investor.findOne({ userId: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Investor profile already exists' });
    }

    const investor = new Investor({
      userId: req.user._id,
      organizationName,
      bio,
      type,
      preferredDomain,
      linkedin
    });

    await investor.save();

    return res.status(201).json({
      message: 'Investor profile created successfully',
      investor
    });
  } catch (error) {
    console.error('Error in createInvestorProfile:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// @desc Get current investor profile
// @route GET /api/investor/me
export const getMyInvestorProfile = async (req, res) => {
  try {
    const investor = await Investor.findOne({ userId: req.user._id }).populate('userId', 'fullName email role');
    if (!investor) {
      return res.status(404).json({ message: 'Investor profile not found' });
    }

    return res.status(200).json(investor);
  } catch (error) {
    console.error('Error in getMyInvestorProfile:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// @desc Update investor profile
// @route PUT /api/investor
export const updateInvestorProfile = async (req, res) => {
  const { organizationName, bio, type, preferredDomain, linkedin } = req.body;

  try {
    const investor = await Investor.findOne({ userId: req.user._id });
    if (!investor) {
      return res.status(404).json({ message: 'Investor profile not found' });
    }

    investor.organizationName = organizationName || investor.organizationName;
    investor.bio = bio || investor.bio;
    investor.type = type || investor.type;
    investor.preferredDomain = preferredDomain || investor.preferredDomain;
    investor.linkedin = linkedin || investor.linkedin;

    await investor.save();

    return res.status(200).json({
      message: 'Investor profile updated successfully',
      investor
    });
  } catch (error) {
    console.error('Error in updateInvestorProfile:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
