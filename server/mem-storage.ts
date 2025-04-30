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
import { IStorage } from "./storage";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private topics: Map<number, Topic>;
  private flashcards: Map<number, Flashcard>;
  private quizQuestions: Map<number, QuizQuestionWithOptions>;
  private users: Map<number, User>;
  private userProgressMap: Map<string, UserProgress>;
  private userAchievementsMap: Map<string, UserAchievement>;
  private userSettingsMap: Map<number, UserSettings>;
  private studySessionsMap: Map<number, StudySession>;
  
  private currentTopicId: number;
  private currentFlashcardId: number;
  private currentQuizQuestionId: number;
  private currentUserId: number;
  private currentUserProgressId: number;
  private currentStudySessionId: number;
  
  sessionStore: session.Store;

  constructor() {
    this.topics = new Map();
    this.flashcards = new Map();
    this.quizQuestions = new Map();
    this.users = new Map();
    this.userProgressMap = new Map();
    this.userAchievementsMap = new Map();
    this.userSettingsMap = new Map();
    this.studySessionsMap = new Map();
    
    this.currentTopicId = 1;
    this.currentFlashcardId = 1;
    this.currentQuizQuestionId = 1;
    this.currentUserId = 1;
    this.currentUserProgressId = 1;
    this.currentStudySessionId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Initialize with default data
    this.initializeData();
  }

  async getAllTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    return Array.from(this.topics.values()).find(
      (topic) => topic.slug === slug
    );
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.currentTopicId++;
    const topic: Topic = { 
      ...insertTopic, 
      id,
      difficulty: insertTopic.difficulty || 'medium',
      createdAt: new Date()
    };
    this.topics.set(id, topic);
    return topic;
  }

  async getAllFlashcards(): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values());
  }

  async getFlashcardsByTopic(topicId: number): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values()).filter(
      (flashcard) => flashcard.topicId === topicId
    );
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    return this.flashcards.get(id);
  }

  async createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard> {
    const id = this.currentFlashcardId++;
    const flashcard: Flashcard = { 
      ...insertFlashcard, 
      id,
      difficulty: insertFlashcard.difficulty || 'medium',
      createdAt: new Date()
    };
    this.flashcards.set(id, flashcard);
    return flashcard;
  }

  async getAllQuizQuestions(): Promise<QuizQuestionWithOptions[]> {
    return Array.from(this.quizQuestions.values());
  }

  async getQuizQuestionsByTopic(topicId: number): Promise<QuizQuestionWithOptions[]> {
    return Array.from(this.quizQuestions.values()).filter(
      (quizQuestion) => quizQuestion.topicId === topicId
    );
  }

  async getQuizQuestion(id: number): Promise<QuizQuestionWithOptions | undefined> {
    return this.quizQuestions.get(id);
  }

  async createQuizQuestion(insertQuizQuestion: InsertQuizQuestion): Promise<QuizQuestionWithOptions> {
    const id = this.currentQuizQuestionId++;
    const options = insertQuizQuestion.options as Option[];
    const quizQuestion: QuizQuestionWithOptions = { 
      ...insertQuizQuestion, 
      id,
      options,
      difficulty: insertQuizQuestion.difficulty || 'medium',
      createdAt: new Date()
    };
    this.quizQuestions.set(id, quizQuestion);
    return quizQuestion;
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // User progress operations
  async getUserProgress(userId: number, topicId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${topicId}`;
    return this.userProgressMap.get(key);
  }

  async updateUserProgress(userId: number, topicId: number, progressData: Partial<UserProgress>): Promise<UserProgress> {
    const key = `${userId}-${topicId}`;
    const existingProgress = this.userProgressMap.get(key);
    
    if (existingProgress) {
      const updatedProgress: UserProgress = {
        ...existingProgress,
        ...progressData,
        updatedAt: new Date()
      };
      this.userProgressMap.set(key, updatedProgress);
      return updatedProgress;
    } else {
      const id = this.currentUserProgressId++;
      const newProgress: UserProgress = {
        id,
        userId,
        topicId,
        flashcardsCompleted: 0,
        quizQuestionsCompleted: 0,
        correctAnswers: 0,
        lastStudied: new Date(),
        masteryLevel: 0,
        ...progressData,
        updatedAt: new Date()
      };
      this.userProgressMap.set(key, newProgress);
      return newProgress;
    }
  }
  
  // Achievement operations
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievementsMap.values())
      .filter(achievement => achievement.userId === userId);
  }

  async addUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    const key = `${achievement.userId}-${achievement.achievementId}`;
    const newAchievement: UserAchievement = {
      ...achievement,
      earnedAt: achievement.earnedAt || new Date()
    };
    this.userAchievementsMap.set(key, newAchievement);
    return newAchievement;
  }
  
  // User settings operations
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return this.userSettingsMap.get(userId);
  }

  async updateUserSettings(userId: number, settingsData: Partial<UserSettings>): Promise<UserSettings> {
    const existingSettings = this.userSettingsMap.get(userId);
    
    if (existingSettings) {
      const updatedSettings: UserSettings = {
        ...existingSettings,
        ...settingsData,
        updatedAt: new Date()
      };
      this.userSettingsMap.set(userId, updatedSettings);
      return updatedSettings;
    } else {
      const newSettings: UserSettings = {
        userId,
        difficultyPreference: 'medium',
        darkMode: false,
        emailNotifications: true,
        autoPlay: false,
        ...settingsData,
        updatedAt: new Date()
      };
      this.userSettingsMap.set(userId, newSettings);
      return newSettings;
    }
  }
  
  // Study session operations
  async createStudySession(sessionData: InsertStudySession): Promise<StudySession> {
    const id = this.currentStudySessionId++;
    const newSession: StudySession = {
      ...sessionData,
      id,
      startTime: sessionData.startTime || new Date()
    };
    this.studySessionsMap.set(id, newSession);
    return newSession;
  }

  async updateStudySession(id: number, sessionData: Partial<StudySession>): Promise<StudySession | undefined> {
    const session = this.studySessionsMap.get(id);
    if (!session) return undefined;
    
    const updatedSession: StudySession = {
      ...session,
      ...sessionData
    };
    this.studySessionsMap.set(id, updatedSession);
    return updatedSession;
  }

  private initializeData() {
    // Create topics
    const topics: InsertTopic[] = [
      { name: "Algebra", slug: "algebra", difficulty: "medium" },
      { name: "Trigonometry", slug: "trigonometry", difficulty: "medium" },
      { name: "Statistics", slug: "statistics", difficulty: "medium" }
    ];

    const createdTopics: Topic[] = [];
    topics.forEach(topic => {
      const id = this.currentTopicId++;
      const newTopic: Topic = { 
        ...topic, 
        id, 
        createdAt: new Date() 
      };
      this.topics.set(id, newTopic);
      createdTopics.push(newTopic);
    });

    // Create algebra flashcards
    const algebraFlashcards: InsertFlashcard[] = [
      { question: "Solve 2x+3=7. x=?", answer: "2", topicId: 1, difficulty: "easy" },
      { question: "Solve x²-9=0. x=?", answer: "±3", topicId: 1, difficulty: "medium" },
      { question: "Factor x²-4x+4", answer: "(x-2)²", topicId: 1, difficulty: "medium" },
      { question: "Solve 2x+3=7. x=?", answer: "2", topicId: 1, difficulty: "easy" },
      { question: "Solve 5x-2=13. x=?", answer: "3", topicId: 1, difficulty: "easy" },
      { question: "Expand (x+3)(x-2)", answer: "x²+x-6", topicId: 1, difficulty: "medium" },
      { question: "Solve x²-4=0. x=?", answer: "±2", topicId: 1, difficulty: "medium" },
      { question: "Find the domain of f(x)=1/(x-3)", answer: "All real numbers except x=3", topicId: 1, difficulty: "hard" },
      { question: "Factor x²-25", answer: "(x+5)(x-5)", topicId: 1, difficulty: "medium" },
      { question: "Solve 3x+7=2x-4. x=?", answer: "-11", topicId: 1, difficulty: "medium" },
      { question: "Simplify (2x³y²)/(4xy)", answer: "x²y/2", topicId: 1, difficulty: "hard" },
      { question: "Find the inverse of f(x)=3x+6", answer: "f⁻¹(x)=(x-6)/3", topicId: 1, difficulty: "hard" },
      { question: "Solve the inequality 2x-5>7. x>?", answer: "6", topicId: 1, difficulty: "medium" },
      { question: "Find the slope of line passing through (2,3) and (5,7)", answer: "4/3", topicId: 1, difficulty: "medium" },
      { question: "Simplify √75", answer: "5√3", topicId: 1, difficulty: "hard" },
      { question: "Solve x²+6x+9=0. x=?", answer: "-3", topicId: 1, difficulty: "medium" },
      { question: "Simplify 3(x-2)-2(x+5)", answer: "x-16", topicId: 1, difficulty: "medium" }
    ];

    algebraFlashcards.forEach(flashcard => {
      const id = this.currentFlashcardId++;
      const newFlashcard: Flashcard = { 
        ...flashcard, 
        id,
        createdAt: new Date()
      };
      this.flashcards.set(id, newFlashcard);
    });

    // Create trigonometry flashcards
    const trigFlashcards: InsertFlashcard[] = [
      { question: "What is sin(30°)?", answer: "1/2", topicId: 2, difficulty: "easy" },
      { question: "What is cos(60°)?", answer: "1/2", topicId: 2, difficulty: "easy" },
      { question: "What is tan(45°)?", answer: "1", topicId: 2, difficulty: "easy" },
      { question: "What is sec(0°)?", answer: "1", topicId: 2, difficulty: "medium" },
      { question: "What is csc(30°)?", answer: "2", topicId: 2, difficulty: "medium" },
      { question: "What is cot(45°)?", answer: "1", topicId: 2, difficulty: "medium" },
      { question: "sin²θ + cos²θ = ?", answer: "1", topicId: 2, difficulty: "easy" },
      { question: "sin(A+B) = ?", answer: "sinA·cosB + cosA·sinB", topicId: 2, difficulty: "hard" },
      { question: "cos(A+B) = ?", answer: "cosA·cosB - sinA·sinB", topicId: 2, difficulty: "hard" },
      { question: "sin(2θ) = ?", answer: "2sinθ·cosθ", topicId: 2, difficulty: "medium" },
      { question: "cos(2θ) = ?", answer: "cos²θ - sin²θ", topicId: 2, difficulty: "medium" },
      { question: "What is sin(90°-θ)?", answer: "cosθ", topicId: 2, difficulty: "medium" },
      { question: "What is cos(90°-θ)?", answer: "sinθ", topicId: 2, difficulty: "medium" },
      { question: "What is sin(-θ)?", answer: "-sinθ", topicId: 2, difficulty: "medium" },
      { question: "What is cos(-θ)?", answer: "cosθ", topicId: 2, difficulty: "medium" }
    ];

    trigFlashcards.forEach(flashcard => {
      const id = this.currentFlashcardId++;
      const newFlashcard: Flashcard = { 
        ...flashcard, 
        id,
        createdAt: new Date()
      };
      this.flashcards.set(id, newFlashcard);
    });

    // Create statistics flashcards
    const statsFlashcards: InsertFlashcard[] = [
      { question: "Mean of [2,4,6,8] is?", answer: "5", topicId: 3, difficulty: "easy" },
      { question: "Median of [1,3,5,7,9] is?", answer: "5", topicId: 3, difficulty: "easy" },
      { question: "Sample variance formula?", answer: "s² = Σ(x-x̄)²/(n-1)", topicId: 3, difficulty: "medium" },
      { question: "Population variance formula?", answer: "σ² = Σ(x-μ)²/N", topicId: 3, difficulty: "medium" },
      { question: "Standard deviation is?", answer: "Square root of variance", topicId: 3, difficulty: "easy" },
      { question: "Range of [3,7,2,9,5] is?", answer: "7", topicId: 3, difficulty: "easy" },
      { question: "Mode of [2,3,4,2,5,2,6] is?", answer: "2", topicId: 3, difficulty: "easy" },
      { question: "IQR stands for?", answer: "Interquartile Range", topicId: 3, difficulty: "medium" },
      { question: "Formula for z-score?", answer: "z = (x-μ)/σ", topicId: 3, difficulty: "medium" },
      { question: "In normal distribution, μ±σ contains?", answer: "68% of data", topicId: 3, difficulty: "medium" },
      { question: "In normal distribution, μ±2σ contains?", answer: "95% of data", topicId: 3, difficulty: "medium" },
      { question: "In normal distribution, μ±3σ contains?", answer: "99.7% of data", topicId: 3, difficulty: "medium" },
      { question: "Correlation coefficient range?", answer: "-1 to 1", topicId: 3, difficulty: "medium" },
      { question: "What does p-value < 0.05 typically indicate?", answer: "Statistical significance", topicId: 3, difficulty: "hard" },
      { question: "What is Type I error?", answer: "Rejecting a true null hypothesis", topicId: 3, difficulty: "hard" }
    ];

    statsFlashcards.forEach(flashcard => {
      const id = this.currentFlashcardId++;
      const newFlashcard: Flashcard = { 
        ...flashcard, 
        id,
        createdAt: new Date()
      };
      this.flashcards.set(id, newFlashcard);
    });

    // Create quiz questions
    const quizQuestions: InsertQuizQuestion[] = [
      {
        question: "What is sin(30°)?",
        correctAnswer: "1/2",
        options: [
          { id: "A", text: "1/2", correct: true },
          { id: "B", text: "√2/2", correct: false },
          { id: "C", text: "√3/2", correct: false },
          { id: "D", text: "1", correct: false }
        ],
        topicId: 2,
        difficulty: "easy"
      },
      {
        question: "Solve 2x+3=7. x=?",
        correctAnswer: "2",
        options: [
          { id: "A", text: "1", correct: false },
          { id: "B", text: "2", correct: true },
          { id: "C", text: "3", correct: false },
          { id: "D", text: "4", correct: false }
        ],
        topicId: 1,
        difficulty: "easy"
      },
      {
        question: "Mean of [2,4,6,8] is?",
        correctAnswer: "5",
        options: [
          { id: "A", text: "4", correct: false },
          { id: "B", text: "5", correct: true },
          { id: "C", text: "6", correct: false },
          { id: "D", text: "7", correct: false }
        ],
        topicId: 3,
        difficulty: "easy"
      },
      {
        question: "What is cos(60°)?",
        correctAnswer: "1/2",
        options: [
          { id: "A", text: "1/2", correct: true },
          { id: "B", text: "√3/2", correct: false },
          { id: "C", text: "√2/2", correct: false },
          { id: "D", text: "0", correct: false }
        ],
        topicId: 2,
        difficulty: "medium"
      },
      {
        question: "Solve x²-9=0. x=?",
        correctAnswer: "±3",
        options: [
          { id: "A", text: "±2", correct: false },
          { id: "B", text: "±3", correct: true },
          { id: "C", text: "±6", correct: false },
          { id: "D", text: "±9", correct: false }
        ],
        topicId: 1,
        difficulty: "medium"
      }
    ];

    quizQuestions.forEach(question => {
      const id = this.currentQuizQuestionId++;
      const options = question.options as Option[];
      const newQuestion: QuizQuestionWithOptions = { 
        ...question, 
        id, 
        options,
        difficulty: question.difficulty || 'medium',
        createdAt: new Date()
      };
      this.quizQuestions.set(id, newQuestion);
    });
  }
}