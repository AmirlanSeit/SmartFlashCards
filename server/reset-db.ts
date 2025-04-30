import { db } from './db';
import { seedDatabase } from './seed';
import { 
  topics, 
  flashcards, 
  quizQuestions, 
  users,
  userProgress,
  userAchievements,
  userSettings,
  studySessions
} from '@shared/schema';

async function resetDatabase() {
  console.log('Resetting database...');
  
  try {
    // Drop tables in reverse order to avoid foreign key constraints
    console.log('Dropping existing tables...');
    await db.delete(studySessions);
    await db.delete(userSettings);
    await db.delete(userAchievements);
    await db.delete(userProgress);
    await db.delete(users);
    await db.delete(quizQuestions);
    await db.delete(flashcards);
    await db.delete(topics);
    
    console.log('Database tables cleared.');
    
    // Seed the database
    await seedDatabase();
    
    console.log('Database reset and seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();