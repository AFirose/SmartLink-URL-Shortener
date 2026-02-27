 import express from "express";
import { protect } from "../middleware/auth.js";
import { 
  categorizeUrl, 
  generatePreview, 
  getInsights,
  categorizeAllUrls,
  getPreviewById 
} from "../controllers/aiController.js";

const router = express.Router();

// ========== AI CATEGORIZATION ==========
router.post("/categorize/:urlId", protect, categorizeUrl);
router.post("/categorize-all", protect, categorizeAllUrls);

// ========== SMART PREVIEWS ==========
router.post("/preview", protect, generatePreview);
router.get("/preview/:id", protect, getPreviewById);

// ========== INSIGHTS ==========
router.get("/insights/:id", protect, getInsights);

export default router;