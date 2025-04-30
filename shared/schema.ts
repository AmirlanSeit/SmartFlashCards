import { pgTable, text, serial, integer, boolean, jsonb, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Topics
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  difficulty: text("difficulty").default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Flashcards
export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  topicId: integer("topic_id").references(() => topics.id).notNull(),
  difficulty: text("difficulty").default("medium").notNull(),
  hint: text("hint"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options").notNull(),
  topicId: integer("topic_id").references(() => topics.id).notNull(),
  difficulty: text("difficulty").default("medium").notNull(),
  hint: text("hint"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// User Progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  topicId: integer("topic_id").references(() => topics.id).notNull(),
  flashcardsCompleted: integer("flashcards_completed").default(0).notNull(),
  quizQuestionsCompleted: integer("quiz_questions_completed").default(0).notNull(),
  correctAnswers: integer("correct_answers").default(0).notNull(),
  lastStudied: timestamp("last_studied").defaultNow().notNull(),
  masteryLevel: integer("mastery_level").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  iconUrl: text("icon_url"),
  requiredValue: integer("required_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// User Achievements
export const userAchievements = pgTable("user_achievements", {
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// User settings
export const userSettings = pgTable("user_settings", {
  userId: integer("user_id").references(() => users.id).primaryKey(),
  difficultyPreference: text("difficulty_preference").default("medium").notNull(),
  darkMode: boolean("dark_mode").default(false).notNull(),
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  autoPlay: boolean("auto_play").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Study sessions
export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  topicId: integer("topic_id").references(() => topics.id),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  cardsStudied: integer("cards_studied").default(0).notNull(),
  questionsAnswered: integer("questions_answered").default(0).notNull(),
  correctAnswers: integer("correct_answers").default(0).notNull(),
  mode: text("mode").notNull()
});

// Define relations after all tables are defined
export const topicsRelations = relations(topics, ({ many }) => ({
  flashcards: many(flashcards),
  quizQuestions: many(quizQuestions)
}));

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  topic: one(topics, {
    fields: [flashcards.topicId],
    references: [topics.id]
  })
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  topic: one(topics, {
    fields: [quizQuestions.topicId],
    references: [topics.id]
  })
}));

export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  achievements: many(userAchievements),
  settings: many(userSettings),
  sessions: many(studySessions)
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id]
  }),
  topic: one(topics, {
    fields: [userProgress.topicId],
    references: [topics.id]
  })
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id]
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id]
  })
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id]
  })
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id]
  }),
  topic: one(topics, {
    fields: [studySessions.topicId],
    references: [topics.id]
  })
}));

// Define zod schemas
export const insertTopicSchema = createInsertSchema(topics).omit({ id: true, createdAt: true });
export const insertFlashcardSchema = createInsertSchema(flashcards).omit({ id: true, createdAt: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, updatedAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, createdAt: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements);
export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ updatedAt: true });
export const insertStudySessionSchema = createInsertSchema(studySessions).omit({ id: true });

// Define types
export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

// Option type for multiple choice questions
export type Option = {
  id: string;
  text: string;
  correct: boolean;
};

// Custom schema for quiz questions with options
export const quizQuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  correctAnswer: z.string(),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    correct: z.boolean()
  })),
  topicId: z.number(),
  difficulty: z.string().optional().default("medium"),
  hint: z.string().optional(),
  createdAt: z.date().optional()
});

export type QuizQuestionWithOptions = z.infer<typeof quizQuestionSchema>;