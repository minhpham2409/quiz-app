import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, QuestionInput } from '../types';

const prisma = new PrismaClient();

// Validation schemas
const questionSchema = z.object({
  question: z.string().min(1),
  a: z.string().min(1),
  b: z.string().min(1),
  c: z.string().min(1),
  d: z.string().min(1),
  correct: z.enum(['A', 'B', 'C', 'D']),
});

const bulkQuestionsSchema = z.array(questionSchema);

export const getAllQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const questions = await prisma.question.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
    });

    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const data = questionSchema.parse(req.body);

    const question = await prisma.question.create({
      data: {
        userId: req.userId!,
        questionText: data.question,
        answerA: data.a,
        answerB: data.b,
        answerC: data.c,
        answerD: data.d,
        correctAnswer: data.correct,
      },
    });

    res.status(201).json(question);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const bulkCreateQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const questionsData = bulkQuestionsSchema.parse(req.body);

    const questions = await prisma.$transaction(
      questionsData.map((data: QuestionInput) =>
        prisma.question.create({
          data: {
            userId: req.userId!,
            questionText: data.question,
            answerA: data.a,
            answerB: data.b,
            answerC: data.c,
            answerD: data.d,
            correctAnswer: data.correct,
          },
        })
      )
    );

    res.status(201).json({
      message: `Successfully created ${questions.length} questions`,
      count: questions.length,
      questions,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Bulk create error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = questionSchema.parse(req.body);

    // Check ownership
    const existingQuestion = await prisma.question.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const question = await prisma.question.update({
      where: { id },
      data: {
        questionText: data.question,
        answerA: data.a,
        answerB: data.b,
        answerC: data.c,
        answerD: data.d,
        correctAnswer: data.correct,
      },
    });

    res.json(question);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check ownership
    const existingQuestion = await prisma.question.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    await prisma.question.delete({
      where: { id },
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
