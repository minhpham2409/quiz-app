import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, PracticeStats } from '../types';

const prisma = new PrismaClient();

const submitAnswerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.enum(['A', 'B', 'C', 'D']),
});

export const getNextQuestion = async (req: AuthRequest, res: Response) => {
  try {
    // Get all questions that haven't been answered correctly
    const questions = await prisma.question.findMany({
      where: {
        userId: req.userId,
        OR: [
          {
            progress: {
              none: {},
            },
          },
          {
            progress: {
              some: {
                userId: req.userId,
                isCorrect: false,
              },
            },
          },
        ],
      },
      include: {
        progress: {
          where: {
            userId: req.userId,
          },
        },
      },
    });

    if (questions.length === 0) {
      return res.json({
        message: 'All questions completed!',
        question: null,
      });
    }

    // Random select one question
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    // Return without showing correct answer
    res.json({
      question: {
        id: selectedQuestion.id,
        questionText: selectedQuestion.questionText,
        answerA: selectedQuestion.answerA,
        answerB: selectedQuestion.answerB,
        answerC: selectedQuestion.answerC,
        answerD: selectedQuestion.answerD,
        incorrectCount: selectedQuestion.progress[0]?.incorrectCount || 0,
      },
    });
  } catch (error) {
    console.error('Get next question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { questionId, answer } = submitAnswerSchema.parse(req.body);

    // Get question
    const question = await prisma.question.findFirst({
      where: {
        id: questionId,
        userId: req.userId,
      },
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = answer === question.correctAnswer;

    // Update or create progress
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_questionId: {
          userId: req.userId!,
          questionId: questionId,
        },
      },
      update: {
        isCorrect: isCorrect,
        incorrectCount: isCorrect
          ? { set: 0 }
          : { increment: 1 },
        lastAttempted: new Date(),
      },
      create: {
        userId: req.userId!,
        questionId: questionId,
        isCorrect: isCorrect,
        incorrectCount: isCorrect ? 0 : 1,
        lastAttempted: new Date(),
      },
    });

    res.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      incorrectCount: progress.incorrectCount,
      explanation: !isCorrect
        ? `Đáp án đúng là ${question.correctAnswer}`
        : 'Chính xác!',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    // Total questions
    const total = await prisma.question.count({
      where: { userId: req.userId },
    });

    // Correct answers
    const correct = await prisma.userProgress.count({
      where: {
        userId: req.userId,
        isCorrect: true,
      },
    });

    // Sum of incorrect attempts
    const incorrectAttempts = await prisma.userProgress.aggregate({
      where: {
        userId: req.userId,
      },
      _sum: {
        incorrectCount: true,
      },
    });

    const stats: PracticeStats = {
      total,
      correct,
      remaining: total - correct,
      totalIncorrectAttempts: incorrectAttempts._sum.incorrectCount || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetProgress = async (req: AuthRequest, res: Response) => {
  try {
    // Reset all progress for user
    await prisma.userProgress.updateMany({
      where: { userId: req.userId },
      data: {
        isCorrect: false,
        incorrectCount: 0,
        lastAttempted: null,
      },
    });

    const total = await prisma.question.count({
      where: { userId: req.userId },
    });

    res.json({
      message: 'Progress reset successfully',
      total,
    });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
