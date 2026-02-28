import Url from "../models/Url.js";
import crypto from "crypto";

// Generate short code
const generateShortCode = () => {
  return crypto.randomBytes(4).toString('hex');
};

// @desc    Create short URL
// @route   POST /api/urls/shorten
export const shortenUrl = async (req, res) => {
  console.log("\n📝 ===== SHORTEN URL REQUEST =====");
  console.log("Request body:", req.body);
  console.log("User from token:", req.user);
  console.log("User ID:", req.user?._id);
  
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      console.log("❌ No URL provided");
      return res.status(400).json({ message: "URL is required" });
    }

    // Validate URL
    try {
      new URL(originalUrl);
      console.log("✅ URL is valid:", originalUrl);
    } catch (err) {
      console.log("❌ Invalid URL:", originalUrl);
      return res.status(400).json({ message: "Invalid URL format" });
    }

    const userId = req.user?._id;
    
    if (!userId) {
      console.log("❌ No user ID found in token");
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("✅ User authenticated:", userId);

    // Generate unique short code
    let shortCode;
    let exists = true;
    while (exists) {
      shortCode = generateShortCode();
      exists = await Url.findOne({ shortUrl: shortCode });
    }
    console.log("✅ Generated short code:", shortCode);

    // Create new short URL with user ID
    const url = await Url.create({
      shortUrl: shortCode,
      originalUrl,
      user: userId,
      clicks: 0
    });

    console.log("✅ URL saved to database:", url);
    console.log("================================\n");

    res.status(201).json({
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      id: url.shortUrl
    });

  } catch (error) {
    console.error("❌ Error in shortenUrl:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all URLs for logged-in user
// @route   GET /api/urls/user/me
export const getUserUrls = async (req, res) => {
  console.log("\n📋 ===== GET USER URLS REQUEST =====");
  console.log("User from token:", req.user);
  console.log("User ID:", req.user?._id);
  
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      console.log("❌ No user ID found");
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    console.log("🔍 Fetching URLs for user:", userId);
    
    const urls = await Url.find({ user: userId })
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${urls.length} URLs for user`);
    console.log("URLs:", urls);
    console.log("================================\n");
    
    res.json(urls);
  } catch (error) {
    console.error("❌ Error fetching user URLs:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Redirect to original URL
// @route   GET /api/urls/:shortCode
export const getUrl = async (req, res) => {
  console.log("\n🔗 ===== REDIRECT REQUEST =====");
  console.log("Short code:", req.params.shortCode);
  
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOne({ shortUrl: shortCode });

    if (!url) {
      console.log("❌ URL not found for code:", shortCode);
      return res.status(404).json({ message: "URL not found" });
    }

    console.log("✅ Found URL:", url.originalUrl);
    console.log("Current clicks:", url.clicks);

    // Increment clicks
    url.clicks = (url.clicks || 0) + 1;
    await url.save();
    
    console.log("✅ Clicks incremented to:", url.clicks);
    console.log("================================\n");

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("❌ Redirect error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all URLs (admin only)
// @route   GET /api/urls/admin/all
export const getAllUrls = async (req, res) => {
  console.log("\n👑 ===== ADMIN GET ALL URLS =====");
  
  try {
    const urls = await Url.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${urls.length} total URLs`);
    console.log("================================\n");
    
    res.json(urls);
  } catch (error) {
    console.error("❌ Error fetching all URLs:", error);
    res.status(500).json({ message: error.message });
  }
};