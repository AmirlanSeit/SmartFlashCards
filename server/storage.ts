import { 
  Topic, InsertTopic, 
  Flashcard, InsertFlashcard, 
  QuizQuestion, InsertQuizQuestion, 
  QuizQuestionWithOptions, Option,
  User, InsertUser,
  UserProgress, InsertUserProgress,
  UserAchievement, InsertUserAchievement,
  UserSettings, InsertUserSettings,
  StudySession, InsertStudySession
} from "@shared/schema";
import session from "express-session";

// Storage interface that defines all storage operations
export interface IStorage {
  // Topic operations
  getAllTopics(): Promise<Topic[]>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;

  // Flashcard operations
  getAllFlashcards(): Promise<Flashcard[]>;
  getFlashcardsByTopic(topicId: number): Promise<Flashcard[]>;
  getFlashcard(id: number): Promise<Flashcard | undefined>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;

  // Quiz operations
  getAllQuizQuestions(): Promise<QuizQuestionWithOptions[]>;
  getQuizQuestionsByTopic(topicId: number): Promise<QuizQuestionWithOptions[]>;
  getQuizQuestion(id: number): Promise<QuizQuestionWithOptions | undefined>;
  createQuizQuestion(quizQuestion: InsertQuizQuestion): Promise<QuizQuestionWithOptions>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // User progress operations
  getUserProgress(userId: number, topicId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, topicId: number, progress: Partial<UserProgress>): Promise<UserProgress>;
  
  // Achievement operations
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  addUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // User settings operations
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings>;
  
  // Study session operations
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  updateStudySession(id: number, session: Partial<StudySession>): Promise<StudySession | undefined>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

// Import the storage implementations
import { MemStorage } from "./mem-storage";
import { DatabaseStorage } from "./db-storage";

// Choose which storage implementation to use
export const storage = process.env.NODE_ENV === 'test' 
  ? new MemStorage() 
  : new DatabaseStorage();