export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Question {
  id: string;
  questionText: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  createdAt: string;
  updatedAt?: string;
  incorrectCount?: number;
}

export interface QuestionInput {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct: 'A' | 'B' | 'C' | 'D';
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  incorrectCount: number;
  explanation: string;
}

export interface PracticeStats {
  total: number;
  correct: number;
  remaining: number;
  totalIncorrectAttempts: number;
}

export interface FlashcardResponse {
  flashcards: Question[];
  total: number;
}
