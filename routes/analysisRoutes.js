import express from 'express';
import {
  createAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
  getAnalysisStats,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResume, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create new analysis (with file upload)
router.post('/', uploadResume, handleUploadError, createAnalysis);

// Get analysis history
router.get('/history', getAnalysisHistory);

// Get statistics
router.get('/stats', getAnalysisStats);

// Get single analysis
router.get('/:id', getAnalysisById);

// Delete analysis
router.delete('/:id', deleteAnalysis);

export default router;