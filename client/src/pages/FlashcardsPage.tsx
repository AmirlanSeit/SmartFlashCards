import { useContext, useState, useEffect } from 'react';
import { AppContext } from '@/context/AppContext';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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

export default function FlashcardsPage() {
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
        return card.topicId === topic?.id;
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Math Flashcards</h1>
        <TopicSelector />
        <Card className="mt-6 p-8 flex justify-center items-center">
          <p className="text-center text-gray-500">No flashcards available for this topic.</p>
        </Card>
        <div className="mt-6">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Math Flashcards</h1>
      
      <TopicSelector />
      
      <div className="my-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {(currentIndex % filteredFlashcards.length) + 1} of {filteredFlashcards.length}
          </div>
          <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
            {currentTopicName}
          </div>
        </div>
        
        <div className={`flip-card mb-4 ${isFlipped ? 'flipped' : ''}`}>
          <div className="flip-card-inner">
            <Card className="flip-card-front flex items-center justify-center min-h-[240px]">
              <CardContent className="text-center text-xl p-6">
                {currentCard.question}
              </CardContent>
            </Card>
            
            <Card className="flip-card-back flex flex-col items-center justify-center min-h-[240px]">
              <div className="text-gray-500 text-sm mb-4">Answer</div>
              <div className="text-xl text-center text-green-600">
                {currentCard.answer}
              </div>
              
              {showHint && currentCard.hint && (
                <div className="hint-box mt-4 w-full">
                  <strong>Hint:</strong> {currentCard.hint}
                </div>
              )}
            </Card>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={prevCard}>
            Previous Card
          </Button>
          
          <Button variant="secondary" onClick={flipCard}>
            Flip Card
          </Button>
          
          <Button onClick={nextCard}>
            Next Card
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <Button variant="link" size="sm" onClick={toggleHint}>
            {showHint ? "Hide Hint" : "Hint"}
          </Button>
        </div>
        
        <Progress value={progressPercentage} className="mt-6" />
        <div className="text-xs text-gray-500 text-center mt-1">
          {Math.round(progressPercentage)}% complete
        </div>
      </div>
      
      <div className="mt-6">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}