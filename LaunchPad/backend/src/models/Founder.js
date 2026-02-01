import mongoose from 'mongoose';

const founderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: {type: String, required: true},
  bio: {type: String, required: true},
  websiteUrl: String,
  BussinessNumber: {type: String, required: true},
}, { timestamps: true });

export const Founder = mongoose.model('Founder', founderSchema);
