import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  clicks: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: null,
  },
  tags: [{
    type: String
  }],
  title: {
    type: String,
    default: null
  },
  previewImage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Url = mongoose.model("Url", urlSchema);
export default Url;