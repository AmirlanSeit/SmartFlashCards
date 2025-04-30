import { 
  Topic, InsertTopic, 
  Flashcard, InsertFlashcard, 
  QuizQuestion, InsertQuizQuestion, 
  QuizQuestionWithOptions, Option
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private topics: Map<number, Topic>;
  private flashcards: Map<number, Flashcard>;
  private quizQuestions: Map<number, QuizQuestionWithOptions>;
  private currentTopicId: number;
  private currentFlashcardId: number;
  private currentQuizQuestionId: number;

  constructor() {
    this.topics = new Map();
    this.flashcards = new Map();
    this.quizQuestions = new Map();
    this.currentTopicId = 1;
    this.currentFlashcardId = 1;
    this.currentQuizQuestionId = 1;

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
    const topic: Topic = { ...insertTopic, id };
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
    const flashcard: Flashcard = { ...insertFlashcard, id };
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
      options 
    };
    this.quizQuestions.set(id, quizQuestion);
    return quizQuestion;
  }

  private initializeData() {
    // Create topics
    const topics: InsertTopic[] = [
      { name: "Algebra", slug: "algebra" },
      { name: "Trigonometry", slug: "trigonometry" },
      { name: "Statistics", slug: "statistics" }
    ];

    const createdTopics: Topic[] = [];
    topics.forEach(topic => {
      const id = this.currentTopicId++;
      const newTopic: Topic = { ...topic, id };
      this.topics.set(id, newTopic);
      createdTopics.push(newTopic);
    });

    // Create algebra flashcards
    const algebraFlashcards: InsertFlashcard[] = [
      { question: "Solve 2x+3=7. x=?", answer: "2", topicId: 1 },
      { question: "Solve x²-9=0. x=?", answer: "±3", topicId: 1 },
      { question: "Factor x²-4x+4", answer: "(x-2)²", topicId: 1 },
      { question: "Solve 2x+3=7. x=?", answer: "2", topicId: 1 },
      { question: "Solve 5x-2=13. x=?", answer: "3", topicId: 1 },
      { question: "Expand (x+3)(x-2)", answer: "x²+x-6", topicId: 1 },
      { question: "Solve x²-4=0. x=?", answer: "±2", topicId: 1 },
      { question: "Find the domain of f(x)=1/(x-3)", answer: "All real numbers except x=3", topicId: 1 },
      { question: "Factor x²-25", answer: "(x+5)(x-5)", topicId: 1 },
      { question: "Solve 3x+7=2x-4. x=?", answer: "-11", topicId: 1 },
      { question: "Simplify (2x³y²)/(4xy)", answer: "x²y/2", topicId: 1 },
      { question: "Find the inverse of f(x)=3x+6", answer: "f⁻¹(x)=(x-6)/3", topicId: 1 },
      { question: "Solve the inequality 2x-5>7. x>?", answer: "6", topicId: 1 },
      { question: "Find the slope of line passing through (2,3) and (5,7)", answer: "4/3", topicId: 1 },
      { question: "Simplify √75", answer: "5√3", topicId: 1 },
      { question: "Solve x²+6x+9=0. x=?", answer: "-3", topicId: 1 },
      { question: "Simplify 3(x-2)-2(x+5)", answer: "x-16", topicId: 1 },
      { question: "Solve 2x+3=7. x=?", answer: "2", topicId: 1 }
    ];

    algebraFlashcards.forEach(flashcard => {
      const id = this.currentFlashcardId++;
      const newFlashcard: Flashcard = { ...flashcard, id };
      this.flashcards.set(id, newFlashcard);
    });

    // Create trigonometry flashcards
    const trigFlashcards: InsertFlashcard[] = [
      { question: "What is sin(30°)?", answer: "1/2", topicId: 2 },
      { question: "What is cos(60°)?", answer: "1/2", topicId: 2 },
      { question: "What is tan(45°)?", answer: "1", topicId: 2 },
      { question: "What is sec(0°)?", answer: "1", topicId: 2 },
      { question: "What is csc(30°)?", answer: "2", topicId: 2 },
      { question: "What is cot(45°)?", answer: "1", topicId: 2 },
      { question: "sin²θ + cos²θ = ?", answer: "1", topicId: 2 },
      { question: "sin(A+B) = ?", answer: "sinA·cosB + cosA·sinB", topicId: 2 },
      { question: "cos(A+B) = ?", answer: "cosA·cosB - sinA·sinB", topicId: 2 },
      { question: "sin(2θ) = ?", answer: "2sinθ·cosθ", topicId: 2 },
      { question: "cos(2θ) = ?", answer: "cos²θ - sin²θ", topicId: 2 },
      { question: "What is sin(90°-θ)?", answer: "cosθ", topicId: 2 },
      { question: "What is cos(90°-θ)?", answer: "sinθ", topicId: 2 },
      { question: "What is sin(-θ)?", answer: "-sinθ", topicId: 2 },
      { question: "What is cos(-θ)?", answer: "cosθ", topicId: 2 }
    ];

    trigFlashcards.forEach(flashcard => {
      const id = this.currentFlashcardId++;
      const newFlashcard: Flashcard = { ...flashcard, id };
      this.flashcards.set(id, newFlashcard);
    });

    // Create statistics flashcards
    const statsFlashcards: InsertFlashcard[] = [
      { question: "Mean of [2,4,6,8] is?", answer: "5", topicId: 3 },
      { question: "Median of [1,3,5,7,9] is?", answer: "5", topicId: 3 },
      { question: "Sample variance formula?", answer: "s² = Σ(x-x̄)²/(n-1)", topicId: 3 },
      { question: "Population variance formula?", answer: "σ² = Σ(x-μ)²/N", topicId: 3 },
      { question: "Standard deviation is?", answer: "Square root of variance", topicId: 3 },
      { question: "Range of [3,7,2,9,5] is?", answer: "7", topicId: 3 },
      { question: "Mode of [2,3,4,2,5,2,6] is?", answer: "2", topicId: 3 },
      { question: "IQR stands for?", answer: "Interquartile Range", topicId: 3 },
      { question: "Formula for z-score?", answer: "z = (x-μ)/σ", topicId: 3 },
      { question: "In normal distribution, μ±σ contains?", answer: "68% of data", topicId: 3 },
      { question: "In normal distribution, μ±2σ contains?", answer: "95% of data", topicId: 3 },
      { question: "In normal distribution, μ±3σ contains?", answer: "99.7% of data", topicId: 3 },
      { question: "Correlation coefficient range?", answer: "-1 to 1", topicId: 3 },
      { question: "What does p-value < 0.05 typically indicate?", answer: "Statistical significance", topicId: 3 },
      { question: "What is Type I error?", answer: "Rejecting a true null hypothesis", topicId: 3 }
    ];

    statsFlashcards.forEach(flashcard => {
      const id = this.currentFlashcardId++;
      const newFlashcard: Flashcard = { ...flashcard, id };
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
        topicId: 2
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
        topicId: 1
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
        topicId: 3
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
        topicId: 2
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
        topicId: 1
      }
    ];

    quizQuestions.forEach(question => {
      const id = this.currentQuizQuestionId++;
      const options = question.options as Option[];
      const newQuestion: QuizQuestionWithOptions = { ...question, id, options };
      this.quizQuestions.set(id, newQuestion);
    });
  }
}

export const storage = new MemStorage();
