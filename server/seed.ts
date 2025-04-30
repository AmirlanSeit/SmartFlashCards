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
      // Trigonometry questions
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
        difficulty: "easy",
        hint: "In a 30-60-90 triangle, the side opposite to the 30° angle is half the hypotenuse."
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
        difficulty: "medium",
        hint: "In a 30-60-90 triangle, the adjacent side to the 60° angle is half the hypotenuse."
      },
      {
        question: "What is tan(45°)?",
        correctAnswer: "1",
        options: [
          { id: "A", text: "0", correct: false },
          { id: "B", text: "1", correct: true },
          { id: "C", text: "√2", correct: false },
          { id: "D", text: "√3", correct: false }
        ] as unknown as Option[],
        topicId: topicMap.get("Trigonometry")!,
        difficulty: "easy",
        hint: "In a 45-45-90 triangle, the opposite and adjacent sides are equal."
      },
      {
        question: "sin²θ + cos²θ = ?",
        correctAnswer: "1",
        options: [
          { id: "A", text: "0", correct: false },
          { id: "B", text: "1", correct: true },
          { id: "C", text: "2", correct: false },
          { id: "D", text: "θ", correct: false }
        ] as unknown as Option[],
        topicId: topicMap.get("Trigonometry")!,
        difficulty: "medium",
        hint: "This is the Pythagorean identity in trigonometry."
      },
      
      // Algebra questions
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
        difficulty: "easy",
        hint: "Subtract 3 from both sides, then divide by 2."
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
        difficulty: "medium",
        hint: "Factor the equation as (x+3)(x-3)=0."
      },
      {
        question: "Factor x²-4x+4",
        correctAnswer: "(x-2)²",
        options: [
          { id: "A", text: "(x-2)²", correct: true },
          { id: "B", text: "(x+2)²", correct: false },
          { id: "C", text: "(x-2)(x-2)", correct: true },
          { id: "D", text: "(x+2)(x-2)", correct: false }
        ] as unknown as Option[],
        topicId: topicMap.get("Algebra")!,
        difficulty: "medium",
        hint: "This is a perfect square trinomial."
      },
      {
        question: "Solve 5x-2=13. x=?",
        correctAnswer: "3",
        options: [
          { id: "A", text: "2", correct: false },
          { id: "B", text: "3", correct: true },
          { id: "C", text: "4", correct: false },
          { id: "D", text: "5", correct: false }
        ] as unknown as Option[],
        topicId: topicMap.get("Algebra")!,
        difficulty: "easy",
        hint: "Add 2 to both sides, then divide by 5."
      },
      
      // Statistics questions
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
        difficulty: "easy",
        hint: "Add all numbers and divide by the count of numbers."
      },
      {
        question: "Median of [1,3,5,7,9] is?",
        correctAnswer: "5",
        options: [
          { id: "A", text: "3", correct: false },
          { id: "B", text: "5", correct: true },
          { id: "C", text: "6", correct: false },
          { id: "D", text: "7", correct: false }
        ] as unknown as Option[],
        topicId: topicMap.get("Statistics")!,
        difficulty: "easy",
        hint: "The median is the middle value in an ordered list of numbers."
      },
      {
        question: "Standard deviation is?",
        correctAnswer: "Square root of variance",
        options: [
          { id: "A", text: "Mean of deviations", correct: false },
          { id: "B", text: "Square root of variance", correct: true },
          { id: "C", text: "Square of variance", correct: false },
          { id: "D", text: "Difference between max and min", correct: false }
        ] as unknown as Option[],
        topicId: topicMap.get("Statistics")!,
        difficulty: "medium",
        hint: "Variance measures squared deviations from the mean."
      },
      {
        question: "Range of [3,7,2,9,5] is?",
        correctAnswer: "7",
        options: [
          { id: "A", text: "5", correct: false },
          { id: "B", text: "6", correct: false },
          { id: "C", text: "7", correct: true },
          { id: "D", text: "9", correct: false }
        ] as unknown as Option[],
        topicId: topicMap.get("Statistics")!,
        difficulty: "easy",
        hint: "Range is the difference between the largest and smallest values."
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