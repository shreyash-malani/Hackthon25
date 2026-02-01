import { Startup } from '../models/Startup.js';
import { Founder } from '../models/Founder.js';
import { Investor } from '../models/Investor.js'; // Import Investor model
import cloudinary from '../utils/cloudinary.js'; // Import Cloudinary configuration

// @desc Create startup profile
// @route POST /api/startup
export const createStartupProfile = async (req, res) => {
  const { title, domain, stage, location, description } = req.body;

  // Handle PDF file upload to Cloudinary
  let startupPdfUrl = null;
  if (req.files && req.files.startupPdf) {
    try {
      const result = await cloudinary.uploader.upload(req.files.startupPdf[0].path, {
        resource_type: 'raw', // For non-image/video files like PDF
      });
      startupPdfUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading PDF to Cloudinary', error: error.message });
    }
  }

  // Handle pitch video upload to Cloudinary
  let pitchUrl = null;
  if (req.files && req.files.pitch) {
    try {
      const result = await cloudinary.uploader.upload(req.files.pitch[0].path, {
        resource_type: 'video',
      });
      pitchUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading pitch video to Cloudinary', error: error.message });
    }
  }

  try {
    const founder = await Founder.findOne({ userId: req.user._id });
    if (!founder) {
      return res.status(404).json({ message: 'Founder profile not found' });
    }

    const startup = new Startup({
      founderId: founder._id,
      title,
      domain,
      stage,
      location,
      description,
      startupPdf: startupPdfUrl,
      pitch: pitchUrl,
    });

    await startup.save();

    return res.status(201).json({
      message: 'Startup profile created successfully',
      startup
    });
  } catch (error) {
    console.error('Error in createStartupProfile:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// @desc Get current startup profile
// @route GET /api/startup/me
export const getMyStartupProfile = async (req, res) => {
  try {
    const founder = await Founder.findOne({ userId: req.user._id });
    if (!founder) {
      return res.status(404).json({ message: 'Founder profile not found' });
    }

    const startup = await Startup.find({ founderId: founder._id }).populate('founderId', 'companyName bio');
    if (!startup) {
      return res.status(404).json({ message: 'Startup profile not found' });
    }

    return res.status(200).json(startup);
  } catch (error) {
    console.error('Error in getMyStartupProfile:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// GET getStartupById:/startupId
export const getStartupById = async (req, res) => {
  try {
    const { startupId } = req.params; // Extract the startup ID from the URL

    const startup = await Startup.findById(startupId)
      .populate({
        path: 'founderId',  // Populate the founderId field
        select: 'companyName bio',  // Select the fields from the Founder model you want
        populate: {
          path: 'userId',  // Nested population of the userId
          select: 'fullName'  // Select only the fullName field from the User model
        }
      });

    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    return res.status(200).json({ startup });  // Return the populated startup data
  } catch (error) {
    console.error('Error in getStartupById:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// @desc Update startup profile
// @route PUT /api/startup

export const updateStartupProfile = async (req, res) => {
  const { title, domain, stage, location, description } = req.body;
  const { startupId } = req.params;

  try {
    const founder = await Founder.findOne({ userId: req.user._id });
    if (!founder) {
      return res.status(404).json({ message: 'Founder profile not found' });
    }

    const startup = await Startup.findOne({ _id: startupId, founderId: founder._id });
    if (!startup) {
      return res.status(404).json({ message: 'Startup profile not found' });
    }

    // Handle PDF update (if new PDF uploaded)
    if (req.file) {
      if (startup.startupPdf && fs.existsSync(startup.startupPdf)) {
        fs.unlinkSync(startup.startupPdf);
      }
      startup.startupPdf = req.file.path;
    }

    // Handle pitch video update (if new pitch uploaded)
    if (req.files && req.files.pitch) {
      try {
        const result = await cloudinary.uploader.upload(req.files.pitch[0].path, {
          resource_type: 'video',
        });
        startup.pitch = result.secure_url;
      } catch (error) {
        return res.status(500).json({
          message: 'Error uploading updated pitch video to Cloudinary',
          error: error.message,
        });
      }
    }

    // Update fields
    startup.title = title || startup.title;
    startup.domain = domain || startup.domain;
    startup.stage = stage || startup.stage;
    startup.location = location || startup.location;
    startup.description = description || startup.description;

    await startup.save();

    return res.status(200).json({
      message: 'Startup profile updated successfully',
      startup,
    });
  } catch (error) {
    console.error('Error in updateStartupProfile:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// @desc Get all startups
// @route GET /api/startups
export const getAllStartups = async (req, res) => {
  try {
    // const startups = await Startup.find().populate('founderId', 'companyName bio');
    const startups = await Startup.find()
    .populate('founderId', 'companyName bio')
    .populate({
    path: 'founderId',
    populate: {
      path: 'userId',
      select: 'fullName'
    }
    });

    return res.status(200).json(startups);
  } catch (error) {
    console.error('Error in getAllStartups:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// @desc Like a startup
// @route POST /api/startup/like/:id
export const likeStartup = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Get the logged-in user's ID

  try {
    const startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    const hasLiked = startup.likedBy.includes(userId);
    const hasDisliked = startup.dislikedBy.includes(userId);

    // If the user already liked, we remove the like (toggle off)
    if (hasLiked) {
      // Remove the user from likedBy and decrease likes count
      startup.likedBy = startup.likedBy.filter(id => id.toString() !== userId.toString());
      startup.likes = Math.max(0, startup.likes - 1);
    } else {
      // Add the user to likedBy and increase likes count
      startup.likedBy.push(userId);
      startup.likes += 1;

      // Remove the user from dislikedBy if they had previously disliked
      if (hasDisliked) {
        startup.dislikedBy = startup.dislikedBy.filter(id => id.toString() !== userId.toString());
        startup.dislikes = Math.max(0, startup.dislikes - 1);
      }
    }

    // Track interaction for analytics
    if (!startup.interactions) startup.interactions = [];
    startup.interactions.push({
      userId,
      action: hasLiked ? 'remove_like' : 'like',
      timestamp: new Date()
    });

    await startup.save();

    return res.status(200).json({
      message: hasLiked ? 'Like removed successfully' : 'Startup liked successfully',
      likes: startup.likes,
      dislikes: startup.dislikes,
      userState: {
        hasLiked: startup.likedBy.includes(userId),
        hasDisliked: startup.dislikedBy.includes(userId)
      }
    });
  } catch (error) {
    console.error('Error in likeStartup:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const dislikeStartup = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Get the logged-in user's ID

  try {
    const startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    const hasDisliked = startup.dislikedBy.includes(userId);
    const hasLiked = startup.likedBy.includes(userId);

    // If the user already disliked, we remove the dislike (toggle off)
    if (hasDisliked) {
      // Remove the user from dislikedBy and decrease dislikes count
      startup.dislikedBy = startup.dislikedBy.filter(id => id.toString() !== userId.toString());
      startup.dislikes = Math.max(0, startup.dislikes - 1);
    } else {
      // Add the user to dislikedBy and increase dislikes count
      startup.dislikedBy.push(userId);
      startup.dislikes += 1;

      // Remove the user from likedBy if they had previously liked
      if (hasLiked) {
        startup.likedBy = startup.likedBy.filter(id => id.toString() !== userId.toString());
        startup.likes = Math.max(0, startup.likes - 1);
      }
    }

    // Track interaction for analytics
    if (!startup.interactions) startup.interactions = [];
    startup.interactions.push({
      userId,
      action: hasDisliked ? 'remove_dislike' : 'dislike',
      timestamp: new Date()
    });

    await startup.save();

    return res.status(200).json({
      message: hasDisliked ? 'Dislike removed successfully' : 'Startup disliked successfully',
      likes: startup.likes,
      dislikes: startup.dislikes,
      userState: {
        hasLiked: startup.likedBy.includes(userId),
        hasDisliked: startup.dislikedBy.includes(userId)
      }
    });
  } catch (error) {
    console.error('Error in dislikeStartup:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Toggle Save/Unsave Startup
export const saveStartup = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const investor = await Investor.findOne({ userId });

    if (!investor) {
      return res.status(403).json({ message: 'Only investors can save startups' });
    }

    const isSaved = investor.savedStartups?.includes(id);

    if (isSaved) {
      investor.savedStartups = investor.savedStartups.filter(startupId => startupId.toString() !== id);
    } else {
      investor.savedStartups.push(id);
    }

    await investor.save();

    return res.status(200).json({ isSaved: !isSaved });
  } catch (error) {
    console.error('Error in saveStartup:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get Saved Startups
export const getSavedStartups = async (req, res) => {
  try {
    const investor = await Investor.findOne({ userId: req.user._id }).populate({
      path: 'savedStartups',
      populate: {
        path: 'founderId',
        populate: {
          path: 'userId', // If founder has reference to User
        },
      },
    });

    if (!investor) {
      return res.status(403).json({ message: 'Only investors can view saved startups' });
    }

    return res.status(200).json(investor.savedStartups);
  } catch (error) {
    console.error('Error in getSavedStartups:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
