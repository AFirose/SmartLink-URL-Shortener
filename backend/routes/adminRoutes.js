import express from "express";
import { protect, admin } from "../middleware/admin.js";  // This is correct
import User from "../models/User.js";  // This is correct (../models)
import Url from "../models/Url.js";    // This is correct (../models)

const router = express.Router();

// Get all users
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    await Url.deleteMany({ user: req.params.id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get system stats
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUrls = await Url.countDocuments();
    const totalClicks = await Url.aggregate([
      { $group: { _id: null, total: { $sum: "$clicks" } } }
    ]);
    
    res.json({
      totalUsers,
      totalUrls,
      totalClicks: totalClicks[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all URLs
router.get("/urls", protect, admin, async (req, res) => {
  try {
    const urls = await Url.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete URL
router.delete("/urls/:id", protect, admin, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }
    await url.deleteOne();
    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;