 import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  clickedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  country: String,
  device: {
    type: String,
    enum: ['Desktop', 'Mobile', 'Tablet', 'Unknown'],
    default: 'Unknown'
  },
  browser: String
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;