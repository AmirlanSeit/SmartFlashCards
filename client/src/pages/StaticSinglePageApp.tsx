import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModeToggle } from '@/components/ModeToggle';
import { FlashcardSection } from '@/components/static/StaticFlashcardSection';
import { QuizSection } from '@/components/static/StaticQuizSection';
import { AppContextProvider } from '@/context/StaticAppContext';
import { Footer } from '@/components/Footer';

export default function StaticSinglePageApp() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <AppContextProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Math Flashcards & Quiz
            </h1>
            <ModeToggle />
          </div>
        </header>

        <main className="flex-1 container mx-auto py-8 px-4">
          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="mb-8 grid w-full grid-cols-3 h-14 shadow-md">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>
            
            <TabsContent value="home" className="animate-fade-in">
              <div className="max-w-3xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                  Welcome to Math Study Assistant
                </h1>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    About this App
                  </h2>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    This interactive learning tool helps you master mathematical concepts through flashcards and quizzes. 
                    Select from various topics including Algebra, Trigonometry, and Statistics.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Made with ♥ for the AI hackathon in Kazakhstan.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div onClick={() => setActiveTab('flashcards')} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      Flashcards
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Review key concepts with interactive flashcards. Flip to see answers and use hints when needed.
                    </p>
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center">
                      Start Learning
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                  
                  <div onClick={() => setActiveTab('quiz')} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                      Quiz Mode
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Test your knowledge with multiple-choice questions or type in answers for more challenge.
                    </p>
                    <button className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium flex items-center">
                      Start Quiz
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="flashcards">
              <FlashcardSection />
            </TabsContent>
            
            <TabsContent value="quiz">
              <QuizSection />
            </TabsContent>
          </Tabs>
        </main>
        
        <Footer />
      </div>
    </AppContextProvider>
  );
}