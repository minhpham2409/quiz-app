import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getAllFlashcards = async (req: AuthRequest, res: Response) => {
  try {
    // Get all questions in order (by creation date)
    const questions = await prisma.question.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        questionText: true,
        answerA: true,
        answerB: true,
        answerC: true,
        answerD: true,
        correctAnswer: true,
        createdAt: true,
      },
    });

    res.json({
      flashcards: questions,
      total: questions.length,
    });
  } catch (error) {
    console.error('Get flashcards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFlashcardByIndex = async (req: AuthRequest, res: Response) => {
  try {
    const index = parseInt(req.params.index);

    if (isNaN(index) || index < 0) {
      return res.status(400).json({ error: 'Invalid index' });
    }

    // Get all questions to determine total count
    const questions = await prisma.question.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
      skip: index,
      take: 1,
      select: {
        id: true,
        questionText: true,
        answerA: true,
        answerB: true,
        answerC: true,
        answerD: true,
        correctAnswer: true,
        createdAt: true,
      },
    });

    if (questions.length === 0) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    const total = await prisma.question.count({
      where: { userId: req.userId },
    });

    res.json({
      flashcard: questions[0],
      currentIndex: index,
      total,
    });
  } catch (error) {
    console.error('Get flashcard by index error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
