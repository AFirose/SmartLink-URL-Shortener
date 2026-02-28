import express from "express";
import { protect } from "../middleware/admin.js";
import Link from "../models/Url.js";
import User from "../models/User.js";
import axios from "axios";
import * as cheerio from "cheerio";  // ✅ FIXED IMPORT

const router = express.Router();

// ========================================
// US3: Get all links for logged-in user
// ========================================
router.get("/", protect, async (req, res) => {
  try {
    const links = await Link.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// US5: Get link analytics
// ========================================
router.get("/:id/analytics", protect, async (req, res) => {
  try {
    const link = await Link.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    res.json({
      _id: link._id,
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      clicks: link.clicks || 0,
      createdAt: link.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// US6: Auto-categorize link using AI
// ========================================
router.post("/:id/categorize", protect, async (req, res) => {
  try {
    const link = await Link.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    let category = "other";
    const url = link.originalUrl.toLowerCase();
    
    if (url.includes("youtube") || url.includes("vimeo")) {
      category = "video";
    } else if (url.includes("twitter") || url.includes("facebook") || url.includes("instagram")) {
      category = "social";
    } else if (url.includes("amazon") || url.includes("ebay") || url.includes("shop")) {
      category = "shopping";
    } else if (url.includes("blog") || url.includes("medium") || url.includes("wordpress")) {
      category = "blog";
    } else if (url.includes("news") || url.includes("cnn") || url.includes("bbc")) {
      category = "news";
    } else if (url.includes("github") || url.includes("gitlab") || url.includes("stackoverflow")) {
      category = "development";
    }
    
    link.category = category;
    await link.save();
    
    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// US8: Add tag to link
// ========================================
router.post("/:id/tags", protect, async (req, res) => {
  try {
    const { tag } = req.body;
    
    if (!tag || tag.trim() === "") {
      return res.status(400).json({ message: "Tag is required" });
    }
    
    const link = await Link.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    if (!link.tags) {
      link.tags = [];
    }
    
    if (!link.tags.includes(tag)) {
      link.tags.push(tag);
      await link.save();
    }
    
    res.json({ tags: link.tags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// US8: Remove tag from link
// ========================================
router.delete("/:id/tags/:tag", protect, async (req, res) => {
  try {
    const link = await Link.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    if (link.tags) {
      link.tags = link.tags.filter(t => t !== req.params.tag);
      await link.save();
    }
    
    res.json({ tags: link.tags || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// US9: Get link preview
// ========================================
router.get("/:id/preview", protect, async (req, res) => {
  try {
    const link = await Link.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    try {
      const response = await axios.get(link.originalUrl, { 
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)'
        }
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      const title = 
        $('meta[property="og:title"]').attr('content') ||
        $('title').text() ||
        link.originalUrl;
        
      const description = 
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        '';
        
      const image = 
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        '';
      
      res.json({
        url: link.originalUrl,
        title: title,
        description: description,
        image: image,
        siteName: $('meta[property="og:site_name"]').attr('content') || ''
      });
    } catch (error) {
      res.json({
        url: link.originalUrl,
        title: link.originalUrl,
        description: "No preview available",
        image: null
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========================================
// Delete a link
// ========================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const link = await Link.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    });
    
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    await link.deleteOne();
    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;