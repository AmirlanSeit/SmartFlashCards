import { 
  Topic, InsertTopic, 
  Flashcard, InsertFlashcard, 
  QuizQuestion, InsertQuizQuestion, 
  QuizQuestionWithOptions, Option,
  User, InsertUser,
  UserProgress, InsertUserProgress,
  UserAchievement, InsertUserAchievement,
  UserSettings, InsertUserSettings,
  StudySession, InsertStudySession,
  topics, flashcards, quizQuestions, users, userProgress, 
  achievements, userAchievements, userSettings, studySessions
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from './db';
import { eq, and } from 'drizzle-orm';
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // In development, we'll use a memory store for sessions
    // In production, use PostgreSQL session store
    if (process.env.NODE_ENV === 'production') {
      const PgStore = connectPgSimple(session);
      this.sessionStore = new PgStore({
        conObject: { connectionString: process.env.DATABASE_URL },
        createTableIfMissing: true,
      });
    } else {
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    }
  }

  // Topic operations
  async getAllTopics(): Promise<Topic[]> {
    return db.select().from(topics);
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.slug, slug));
    return topic;
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const [newTopic] = await db.insert(topics).values(topic).returning();
    return newTopic;
  }

  // Flashcard operations
  async getAllFlashcards(): Promise<Flashcard[]> {
    return db.select().from(flashcards);
  }

  async getFlashcardsByTopic(topicId: number): Promise<Flashcard[]> {
    return db.select().from(flashcards).where(eq(flashcards.topicId, topicId));
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    const [flashcard] = await db.select().from(flashcards).where(eq(flashcards.id, id));
    return flashcard;
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const [newFlashcard] = await db.insert(flashcards).values(flashcard).returning();
    return newFlashcard;
  }

  // Quiz operations
  async getAllQuizQuestions(): Promise<QuizQuestionWithOptions[]> {
    const questions = await db.select().from(quizQuestions);
    return questions.map(q => ({
      ...q,
      options: q.options as Option[]
    }));
  }

  async getQuizQuestionsByTopic(topicId: number): Promise<QuizQuestionWithOptions[]> {
    const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.topicId, topicId));
    return questions.map(q => ({
      ...q,
      options: q.options as Option[]
    }));
  }

  async getQuizQuestion(id: number): Promise<QuizQuestionWithOptions | undefined> {
    const [question] = await db.select().from(quizQuestions).where(eq(quizQuestions.id, id));
    if (!question) return undefined;
    
    return {
      ...question,
      options: question.options as Option[]
    };
  }

  async createQuizQuestion(quizQuestion: InsertQuizQuestion): Promise<QuizQuestionWithOptions> {
    const [newQuestion] = await db.insert(quizQuestions).values(quizQuestion).returning();
    return {
      ...newQuestion,
      options: newQuestion.options as Option[]
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // User progress operations
  async getUserProgress(userId: number, topicId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId), 
          eq(userProgress.topicId, topicId)
        )
      );
    return progress;
  }

  async updateUserProgress(userId: number, topicId: number, progressData: Partial<UserProgress>): Promise<UserProgress> {
    // Check if progress exists
    const existingProgress = await this.getUserProgress(userId, topicId);
    
    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db
        .update(userProgress)
        .set({
          ...progressData,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.topicId, topicId)
          )
        )
        .returning();
        
      return updatedProgress;
    } else {
      // Create new progress
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          topicId,
          ...progressData
        })
        .returning();
        
      return newProgress;
    }
  }

  // Achievement operations
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async addUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    const [newAchievement] = await db
      .insert(userAchievements)
      .values(achievement)
      .returning();
      
    return newAchievement;
  }

  // User settings operations
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
      
    return settings;
  }

  async updateUserSettings(userId: number, settingsData: Partial<UserSettings>): Promise<UserSettings> {
    // Check if settings exist
    const existingSettings = await this.getUserSettings(userId);
    
    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(userSettings)
        .set({
          ...settingsData,
          updatedAt: new Date()
        })
        .where(eq(userSettings.userId, userId))
        .returning();
        
      return updatedSettings;
    } else {
      // Create new settings
      const [newSettings] = await db
        .insert(userSettings)
        .values({
          userId,
          ...settingsData
        })
        .returning();
        
      return newSettings;
    }
  }

  // Study session operations
  async createStudySession(sessionData: InsertStudySession): Promise<StudySession> {
    const [newSession] = await db
      .insert(studySessions)
      .values(sessionData)
      .returning();
      
    return newSession;
  }

  async updateStudySession(id: number, sessionData: Partial<StudySession>): Promise<StudySession | undefined> {
    const [updatedSession] = await db
      .update(studySessions)
      .set(sessionData)
      .where(eq(studySessions.id, id))
      .returning();
      
    return updatedSession;
  }
}