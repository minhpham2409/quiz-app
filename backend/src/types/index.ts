import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export interface QuestionInput {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct: 'A' | 'B' | 'C' | 'D';
}

export interface SubmitAnswerInput {
  questionId: string;
  answer: 'A' | 'B' | 'C' | 'D';
}

export interface PracticeStats {
  total: number;
  correct: number;
  remaining: number;
  totalIncorrectAttempts: number;
}
