import express from "express";
import { shortenUrl, getUrl, getUserUrls, getAllUrls } from "../controllers/urlController.js";
import { protect, admin } from "../middleware/admin.js";

const router = express.Router();

// Public routes
router.get("/:shortCode", getUrl);

// Protected routes - require authentication
router.post("/shorten", protect, shortenUrl);  // ✅ Must have 'protect'
router.get("/user/me", protect, getUserUrls);
router.get("/admin/all", protect, admin, getAllUrls);

export default router;