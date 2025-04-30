import { db } from './db';
import { 
  topics, 
  flashcards, 
  quizQuestions, 
  InsertTopic, 
  InsertFlashcard, 
  InsertQuizQuestion,
  Option 
} from '@shared/schema';

// Main function to seed the database
export async function seedDatabase() {
  console.log('Seeding database...');
  
  try {
    // First, check if we already have data
    const existingTopics = await db.select().from(topics);
    
    if (existingTopics.length > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }
    
    // Create topics
    console.log('Creating topics...');
    const createdTopics = await db.insert(topics)
      .values([
        { name: "Algebra", slug: "algebra", difficulty: "medium" },
        { name: "Trigonometry", slug: "trigonometry", difficulty: "medium" },
        { name: "Statistics", slug: "statistics", difficulty: "medium" }
      ])
      .returning();
    
    // Map topic IDs to their names for reference
    const topicMap = new Map<string, number>();
    createdTopics.forEach(topic => {
      topicMap.set(topic.name, topic.id);
    });
    
    // Create algebra flashcards
    console.log('Creating algebra flashcards...');
    const algebraFlashcards: InsertFlashcard[] = [
      { question: "Solve 2x+3=7. x=?", answer: "2", topicId: topicMap.get("Algebra")!, difficulty: "easy" },
      { question: "Solve x²-9=0. x=?", answer: "±3", topicId: topicMap.get("Algebra")!, difficulty: "medium" },
      { question: "Factor x²-4x+4", answer: "(x-2)²", topicId: topicMap.get("Algebra")!, difficulty: "medium" },
      { question: "Solve 2x+3=7. x=?", answer: "2", topicId: topicMap.get("Algebra")!, difficulty: "easy" },
      { question: "Solve 5x-2=13. x=?", answer: "3", topicId: topicMap.get("Algebra")!, difficulty: "easy" },
      { question: "Expand (x+3)(x-2)", answer: "x²+x-6", topicId: topicMap.get("Algebra")!, difficulty: "medium" },
      { question: "Solve x²-4=0. x=?", answer: "±2", topicId: topicMap.get("Algebra")!, difficulty: "medium" },
      { question: "Factor x²-25", answer: "(x+5)(x-5)", topicId: topicMap.get("Algebra")!, difficulty: "medium" }
    ];
    
    await db.insert(flashcards).values(algebraFlashcards);
    
    // Create trigonometry flashcards
    console.log('Creating trigonometry flashcards...');
    const trigFlashcards: InsertFlashcard[] = [
      { question: "What is sin(30°)?", answer: "1/2", topicId: topicMap.get("Trigonometry")!, difficulty: "easy" },
      { question: "What is cos(60°)?", answer: "1/2", topicId: topicMap.get("Trigonometry")!, difficulty: "easy" },
      { question: "What is tan(45°)?", answer: "1", topicId: topicMap.get("Trigonometry")!, difficulty: "easy" },
      { question: "What is sec(0°)?", answer: "1", topicId: topicMap.get("Trigonometry")!, difficulty: "medium" },
      { question: "What is csc(30°)?", answer: "2", topicId: topicMap.get("Trigonometry")!, difficulty: "medium" },
      { question: "What is cot(45°)?", answer: "1", topicId: topicMap.get("Trigonometry")!, difficulty: "medium" },
      { question: "sin²θ + cos²θ = ?", answer: "1", topicId: topicMap.get("Trigonometry")!, difficulty: "easy" }
    ];
    
    await db.insert(flashcards).values(trigFlashcards);
    
    // Create statistics flashcards
    console.log('Creating statistics flashcards...');
    const statsFlashcards: InsertFlashcard[] = [
      { question: "Mean of [2,4,6,8] is?", answer: "5", topicId: topicMap.get("Statistics")!, difficulty: "easy" },
      { question: "Median of [1,3,5,7,9] is?", answer: "5", topicId: topicMap.get("Statistics")!, difficulty: "easy" },
      { question: "Sample variance formula?", answer: "s² = Σ(x-x̄)²/(n-1)", topicId: topicMap.get("Statistics")!, difficulty: "medium" },
      { question: "Population variance formula?", answer: "σ² = Σ(x-μ)²/N", topicId: topicMap.get("Statistics")!, difficulty: "medium" },
      { question: "Standard deviation is?", answer: "Square root of variance", topicId: topicMap.get("Statistics")!, difficulty: "easy" },
      { question: "Range of [3,7,2,9,5] is?", answer: "7", topicId: topicMap.get("Statistics")!, difficulty: "easy" }
    ];
    
    await db.insert(flashcards).values(statsFlashcards);
    
    // Create quiz questions
    console.log('Creating quiz questions...');
    const quizItems: InsertQuizQuestion[] = [
      {
        question: "What is sin(30°)?",
        correctAnswer: "1/2",
        options: [
          { id: "A", text: "1/2", correct: true },
          { id: "B", text: "√2/2", correct: false },
          { id: "C", text: "√3/2", correct: false },
          { id: "D", text: "1", correct: false }
        ] as unknown as Option[],
        topicId: topicMap.get("Trigonometry")!,
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
        ] as unknown as Option[],
        topicId: topicMap.get("Algebra")!,
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
        ] as unknown as Option[],
        topicId: topicMap.get("Statistics")!,
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
        ] as unknown as Option[],
        topicId: topicMap.get("Trigonometry")!,
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
        ] as unknown as Option[],
        topicId: topicMap.get("Algebra")!,
        difficulty: "medium"
      }
    ];
    
    for (const quiz of quizItems) {
      // Using this approach for options handling
      await db.insert(quizQuestions).values(quiz);
    }
    
    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}