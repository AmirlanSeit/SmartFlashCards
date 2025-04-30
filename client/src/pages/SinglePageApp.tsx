import { useState, useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopicSelector } from '@/components/TopicSelector';
import { FlashcardSection } from '@/components/FlashcardSection';
import { QuizSection } from '@/components/QuizSection';

export default function SinglePageApp() {
  const [activeTab, setActiveTab] = useState('home');
  const { topics } = useContext(AppContext);

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Math Flashcards" />
      
      <main className="container mx-auto px-4 py-6 max-w-5xl flex-grow">
        <Tabs 
          defaultValue="home" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6 dark:bg-gray-800">
            <TabsTrigger 
              value="home" 
              className="text-base py-3 dark:data-[state=active]:bg-gray-700 dark:text-gray-200"
            >
              Home
            </TabsTrigger>
            <TabsTrigger 
              value="flashcards" 
              className="text-base py-3 dark:data-[state=active]:bg-gray-700 dark:text-gray-200"
            >
              Flashcards
            </TabsTrigger>
            <TabsTrigger 
              value="quiz" 
              className="text-base py-3 dark:data-[state=active]:bg-gray-700 dark:text-gray-200"
            >
              Quiz
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="animate-fade-in">
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Interactive Math Learning</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Welcome to the interactive math flashcard application created for the AI hackathon in Kazakhstan.
                This application will help you master mathematical concepts through flashcards and quizzes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
                  <CardContent className="pt-6">
                    <CardTitle>Flashcards</CardTitle>
                    <CardDescription className="mt-2">
                      Review mathematical concepts with interactive flashcards. Flip the cards to see the answers and track your progress.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => setActiveTab('flashcards')}
                    >
                      Start Flashcards
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
                  <CardContent className="pt-6">
                    <CardTitle>Quiz</CardTitle>
                    <CardDescription className="mt-2">
                      Test your knowledge with multiple-choice or typed answer quizzes. Get immediate feedback and hints.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => setActiveTab('quiz')}
                    >
                      Start Quiz
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <h3 className="text-xl font-bold mt-10 mb-3 dark:text-gray-100">Available Topics:</h3>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span 
                    key={topic.slug} 
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm dark:bg-blue-900 dark:text-blue-100"
                  >
                    {topic.name}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="flashcards" className="animate-fade-in">
            <FlashcardSection />
          </TabsContent>
          
          <TabsContent value="quiz" className="animate-fade-in">
            <QuizSection />
          </TabsContent>
        </Tabs>
        
        <Footer />
      </main>
    </div>
  );
}