import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

export default function Home() {
  const { topics } = useContext(AppContext);

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Math Flashcards" />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl flex-grow">
        <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-2">Interactive Math Learning</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Welcome to the interactive math flashcard application created for the AI hackathon in Kazakhstan.
            This application will help you master mathematical concepts through flashcards and quizzes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6">
                <CardTitle>Flashcards</CardTitle>
                <CardDescription className="mt-2">
                  Review mathematical concepts with interactive flashcards. Flip the cards to see the answers and track your progress.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/flashcards">Start Flashcards</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <CardTitle>Quiz</CardTitle>
                <CardDescription className="mt-2">
                  Test your knowledge with multiple-choice or typed answer quizzes. Get immediate feedback and hints.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/quiz">Start Quiz</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <h3 className="text-xl font-bold mt-10 mb-3">Available Topics:</h3>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic: {slug: string, name: string}) => (
              <span 
                key={topic.slug} 
                className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
              >
                {topic.name}
              </span>
            ))}
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  );
}
