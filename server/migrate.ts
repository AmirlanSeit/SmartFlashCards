import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '../shared/schema';
import { db } from './db';

// Check if DB URL is present
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export async function runMigrations() {
  console.log("Running migrations...");
  
  try {
    // Seed achievement data
    await db.insert(schema.achievements).values([
      {
        name: "First Card",
        description: "Review your first flashcard",
        type: "completion",
        requiredValue: 1
      },
      {
        name: "Quiz Master",
        description: "Answer 10 quiz questions correctly",
        type: "mastery",
        requiredValue: 10
      },
      {
        name: "Perfect Score",
        description: "Get 100% on a quiz",
        type: "mastery",
        requiredValue: 100
      },
      {
        name: "Study Streak",
        description: "Study 7 days in a row",
        type: "streak",
        requiredValue: 7
      },
      {
        name: "Topic Explorer",
        description: "Study all available topics",
        type: "exploration",
        requiredValue: 3
      }
    ]).onConflictDoNothing();
    
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migrations if script is called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("All migrations completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}