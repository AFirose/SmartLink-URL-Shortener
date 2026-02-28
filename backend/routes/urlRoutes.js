import express from "express";
import { shortenUrl, getUrl, getUserUrls, getAllUrls } from "../controllers/urlController.js";
import { protect, admin } from "../middleware/admin.js";  // Make sure this path is correct

const router = express.Router();

// Public routes - no authentication needed
router.post("/shorten", shortenUrl);  // Create short URL
router.get("/:shortCode", getUrl);    // Redirect to original URL

// Protected routes - require authentication
router.get("/user/me", protect, getUserUrls);        // Get user's URLs
router.get("/admin/all", protect, admin, getAllUrls); // Admin get all URLs

export default router;