 import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: { 
    type: String, 
    required: true 
  },
  shortUrl: { 
    type: String, 
    required: true, 
    unique: true 
  },
  clicks: { 
    type: Number, 
    default: 0 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  
  // AI FIELDS
  category: { 
    type: String, 
    default: 'Uncategorized',
    enum: ['Video', 'Social', 'Article', 'Shopping', 'Education', 'Entertainment', 'Development', 'News', 'Other', 'Uncategorized']
  },
  title: { 
    type: String, 
    default: '' 
  },
  description: { 
    type: String, 
    default: '' 
  },
  imageUrl: { 
    type: String, 
    default: '' 
  },
  keywords: [{ 
    type: String 
  }],
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastAccessed: { 
    type: Date, 
    default: Date.now 
  }
});

// ✅ Add indexes for frequently queried fields
urlSchema.index({ user: 1, createdAt: -1 }); // For user's URLs sorted by date
urlSchema.index({ category: 1 }); // For category-based queries
urlSchema.index({ keywords: 1 }); // For keyword search

// ✅ Optional: Add a method to update lastAccessed
urlSchema.methods.updateLastAccessed = function() {
  this.lastAccessed = new Date();
  return this.save();
};

const Url = mongoose.model('Url', urlSchema);
export default Url;