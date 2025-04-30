import { useContext, useState, useEffect } from 'react';
import { AppContext } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { TopicSelector } from '@/components/TopicSelector';

type Flashcard = {
  id: number;
  question: string;
  answer: string;
  topicId: number;
  difficulty: string;
  hint: string | null;
};

export function FlashcardSection() {
  const { selectedTopic, topics } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Fetch flashcards from the API
  const { data: flashcards = [] } = useQuery<Flashcard[]>({
    queryKey: ['/api/flashcards'],
  });
  
  // Filter flashcards based on selected topic
  const filteredFlashcards = selectedTopic === 'all' 
    ? flashcards 
    : flashcards.filter(card => {
        const topic = topics.find(t => t.slug === selectedTopic);
        return topic ? card.topicId === topic.id : false;
      });
  
  // Reset state when changing topics
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [selectedTopic]);
  
  const currentCard = filteredFlashcards[currentIndex % Math.max(1, filteredFlashcards.length)];
  
  const nextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => prev + 1);
  };
  
  const prevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredFlashcards.length - 1);
    }
  };
  
  const flipCard = () => {
    setIsFlipped((prev) => !prev);
  };
  
  const toggleHint = () => {
    setShowHint((prev) => !prev);
  };
  
  const progressPercentage = 
    filteredFlashcards.length > 0 
      ? ((currentIndex % filteredFlashcards.length) + 1) / filteredFlashcards.length * 100 
      : 0;
  
  // Get current topic name for display
  const currentTopicName = selectedTopic === 'all' 
    ? 'All Topics' 
    : topics.find(t => t.slug === selectedTopic)?.name || 'Unknown';
  
  if (!currentCard) {
    return (
      <div>
        <TopicSelector />
        <Card className="mt-6 p-8 flex justify-center items-center dark:bg-gray-900 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400">No flashcards available for this topic.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 tracking-tight">Math Flashcards</h1>
      
      <TopicSelector />
      
      <div className="my-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            Card {(currentIndex % filteredFlashcards.length) + 1} of {filteredFlashcards.length}
          </div>
          <div className="bg-primary px-4 py-1.5 rounded-full text-sm font-medium text-primary-foreground shadow-sm">
            {currentTopicName}
          </div>
        </div>
        
        <div 
          className={`flip-card mb-4 ${isFlipped ? 'flipped' : ''}`} 
          onClick={flipCard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              flipCard();
            }
          }}
          aria-label="Click to flip the card"
        >
          <div className="flip-card-inner">
            <div className="flip-card-front flex flex-col items-center justify-center p-6 cursor-pointer">
              <div className="text-gray-500 text-sm mb-4 uppercase tracking-wider font-medium">Question</div>
              <div className="text-center text-xl">
                {currentCard.question}
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                {topics.find(t => t.id === currentCard.topicId)?.name || "Math"}
              </div>
              <div className="absolute bottom-2 text-xs text-gray-400 dark:text-gray-500">
                Click to flip
              </div>
            </div>
            
            <div className="flip-card-back flex flex-col items-center justify-center p-6 cursor-pointer">
              <div className="text-gray-500 text-sm mb-4 uppercase tracking-wider">Answer</div>
              <div className="text-xl text-center text-green-600">
                {currentCard.answer}
              </div>
              
              {showHint && currentCard.hint && (
                <div className="hint-box mt-6 w-full">
                  <strong>Hint:</strong> {currentCard.hint}
                </div>
              )}
              <div className="absolute bottom-2 text-xs text-gray-400 dark:text-gray-500">
                Click to flip back
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-8 gap-4">
          <Button 
            variant="outline" 
            onClick={prevCard}
            className="px-5 py-6 text-sm font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 flex-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
            Previous
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={flipCard}
            className="px-5 py-6 text-sm font-medium dark:bg-gray-800 dark:hover:bg-gray-700 flex-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/></svg>
            Flip Card
          </Button>
          
          <Button 
            onClick={nextCard}
            className="px-5 py-6 text-sm font-medium flex-1"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m9 18 6-6-6-6"/></svg>
          </Button>
        </div>
        
        <div className="text-center mt-6">
          <Button 
            variant="link" 
            size="sm" 
            onClick={toggleHint}
            className="text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
            {!showHint && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            )}
          </Button>
        </div>
        
        <Progress value={progressPercentage} className="mt-8 h-2 bg-gray-100 dark:bg-gray-800" />
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 font-medium">
          {Math.round(progressPercentage)}% complete
        </div>
      </div>
    </div>
  );
}