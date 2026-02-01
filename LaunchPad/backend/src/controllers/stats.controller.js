import { Startup } from '../models/Startup.js';
import { Investor } from '../models/Investor.js';
import { Founder } from '../models/Founder.js';

export const getStats = async (req, res) => {
    try {
        const [TotalFounders, TotalInvestors, TotalStartups] = await Promise.all([
            Founder.countDocuments(),
            Investor.countDocuments(),
            Startup.countDocuments({ pitch: { $ne: "" } })
        ]);

        
        return res.status(200).json({
            success: true,
            data: {
                TotalFounders,
                TotalInvestors,
                TotalStartups
            }
        });
    } catch (error) {
        console.error('Stats Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};