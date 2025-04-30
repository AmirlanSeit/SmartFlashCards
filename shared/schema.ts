import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Topic table
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

// Flashcard table
export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  topicId: integer("topic_id").references(() => topics.id),
});

// Quiz question table
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options").notNull(), // For multiple choice options
  topicId: integer("topic_id").references(() => topics.id),
});

// Define zod schemas
export const insertTopicSchema = createInsertSchema(topics).omit({ id: true });
export const insertFlashcardSchema = createInsertSchema(flashcards).omit({ id: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true });

// Define types
export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

// Option type for multiple choice questions
export type Option = {
  id: string;
  text: string;
  correct: boolean;
};

// Export a custom QuizQuestionWithOptions type that includes typechecking for options
export const quizQuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  correctAnswer: z.string(),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    correct: z.boolean()
  })),
  topicId: z.number().nullable()
});

export type QuizQuestionWithOptions = z.infer<typeof quizQuestionSchema>;
