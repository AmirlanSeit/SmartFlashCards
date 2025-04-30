import { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import session from "express-session";
import { db } from "./db";
import { users, insertUserSchema } from "../shared/schema";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";
import connectPgSimple from "connect-pg-simple";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      displayName?: string | null;
      avatarUrl?: string | null;
    }
  }
}

export function setupAuth(app: Express) {
  // Create PostgreSQL session store
  const PgStore = connectPgSimple(session);
  
  // Configure session middleware
  app.use(
    session({
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "math-flashcards-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure local strategy for username/password authentication
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username));
        
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // Return the user without the password
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    })
  );
  
  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        })
        .from(users)
        .where(eq(users.id, id));
      
      if (!user) {
        return done(null, false);
      }
      
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Auth routes
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const [existingUserByUsername] = await db
        .select()
        .from(users)
        .where(eq(users.username, userData.username));
      
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Check if email already exists
      const [existingUserByEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email));
      
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          ...userData,
          password: hashedPassword,
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        });
      
      // Log in the new user
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login error after registration" });
        }
        
        return res.status(201).json(newUser);
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Server error during registration" });
    }
  });
  
  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: Express.User, info: { message: string }) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        
        return res.json(user);
      });
    })(req, res, next);
  });
  
  app.post("/api/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout error" });
      }
      
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Session destruction error" });
        }
        
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
      });
    });
  });
  
  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    return res.json(req.user);
  });
  
  // Middleware to check if user is authenticated
  app.use("/api/protected", (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    next();
  });
}