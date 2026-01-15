import { Router } from 'express';
import {
  getAllFlashcards,
  getFlashcardByIndex,
} from '../controllers/flashcardController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/all', getAllFlashcards);
router.get('/:index', getFlashcardByIndex);

export default router;
