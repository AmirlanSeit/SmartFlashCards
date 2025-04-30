import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertFlashcardSchema, insertQuizQuestionSchema, insertTopicSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication system
  setupAuth(app);
  
  const apiRouter = express.Router();

  // Get all topics
  apiRouter.get("/topics", async (req: Request, res: Response) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  // Get topic by slug
  apiRouter.get("/topics/:slug", async (req: Request, res: Response) => {
    try {
      const topic = await storage.getTopicBySlug(req.params.slug);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

  // Create topic
  apiRouter.post("/topics", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTopicSchema.parse(req.body);
      const topic = await storage.createTopic(validatedData);
      res.status(201).json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid topic data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create topic" });
    }
  });

  // Get all flashcards
  apiRouter.get("/flashcards", async (req: Request, res: Response) => {
    try {
      let flashcards;
      if (req.query.topicId) {
        const topicId = parseInt(req.query.topicId as string);
        flashcards = await storage.getFlashcardsByTopic(topicId);
      } else {
        flashcards = await storage.getAllFlashcards();
      }
      res.json(flashcards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flashcards" });
    }
  });

  // Get flashcard by id
  apiRouter.get("/flashcards/:id", async (req: Request, res: Response) => {
    try {
      const flashcardId = parseInt(req.params.id);
      const flashcard = await storage.getFlashcard(flashcardId);
      if (!flashcard) {
        return res.status(404).json({ message: "Flashcard not found" });
      }
      res.json(flashcard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flashcard" });
    }
  });

  // Create flashcard
  apiRouter.post("/flashcards", async (req: Request, res: Response) => {
    try {
      const validatedData = insertFlashcardSchema.parse(req.body);
      const flashcard = await storage.createFlashcard(validatedData);
      res.status(201).json(flashcard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid flashcard data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create flashcard" });
    }
  });

  // Get all quiz questions
  apiRouter.get("/quiz", async (req: Request, res: Response) => {
    try {
      let quizQuestions;
      if (req.query.topicId) {
        const topicId = parseInt(req.query.topicId as string);
        quizQuestions = await storage.getQuizQuestionsByTopic(topicId);
      } else {
        quizQuestions = await storage.getAllQuizQuestions();
      }
      res.json(quizQuestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz questions" });
    }
  });

  // Get quiz question by id
  apiRouter.get("/quiz/:id", async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.getQuizQuestion(questionId);
      if (!question) {
        return res.status(404).json({ message: "Quiz question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz question" });
    }
  });

  // Create quiz question
  apiRouter.post("/quiz", async (req: Request, res: Response) => {
    try {
      const validatedData = insertQuizQuestionSchema.parse(req.body);
      const question = await storage.createQuizQuestion(validatedData);
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quiz question data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quiz question" });
    }
  });

  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
