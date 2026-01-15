import { Router } from 'express';
import {
  getNextQuestion,
  submitAnswer,
  getStats,
  resetProgress,
} from '../controllers/practiceController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/next', getNextQuestion);
router.post('/submit', submitAnswer);
router.get('/stats', getStats);
router.post('/reset', resetProgress);

export default router;
