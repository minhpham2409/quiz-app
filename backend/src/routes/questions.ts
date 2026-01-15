import { Router } from 'express';
import {
  getAllQuestions,
  createQuestion,
  bulkCreateQuestions,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllQuestions);
router.post('/', createQuestion);
router.post('/bulk', bulkCreateQuestions);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
