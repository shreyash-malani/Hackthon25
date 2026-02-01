import mongoose from 'mongoose';

const investorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  organizationName: {type: String, required: true},
  bio: {type: String, required: true},
  type: { type: String, enum: ['Angel', 'VC', 'Institutional', 'Incubator', 'Other'],required: true},
  preferredDomain: {type: String, required: true},
  linkedin: String,
  savedStartups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Startup' }]
}, { timestamps: true });

export const Investor = mongoose.model('Investor', investorSchema);
