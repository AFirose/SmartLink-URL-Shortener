import Url from "../models/Url.js";
import crypto from "crypto";

// Generate short code
const generateShortCode = () => {
  return crypto.randomBytes(4).toString('hex'); // 8 character code
};

// @desc    Create short URL
// @route   POST /api/urls/shorten
export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "URL is required" });
    }

    // Validate URL
    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Check if URL already exists (optional)
    let url = await Url.findOne({ originalUrl });
    
    if (url) {
      return res.json({
        shortUrl: url.shortUrl,
        originalUrl: url.originalUrl,
        id: url.shortUrl
      });
    }

    // Generate unique short code
    let shortCode;
    let exists = true;
    while (exists) {
      shortCode = generateShortCode();
      exists = await Url.findOne({ shortUrl: shortCode });
    }

    // Create new short URL
    url = await Url.create({
      shortUrl: shortCode,
      originalUrl,
      clicks: 0
    });

    res.status(201).json({
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      id: url.shortUrl
    });

  } catch (error) {
    console.error("Shorten error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Redirect to original URL
// @route   GET /api/urls/:shortCode
export const getUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOne({ shortUrl: shortCode });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Increment clicks
    url.clicks = (url.clicks || 0) + 1;
    await url.save();

    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all URLs for logged-in user
// @route   GET /api/urls/user/me
export const getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all URLs (admin only)
// @route   GET /api/urls/admin/all
export const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};