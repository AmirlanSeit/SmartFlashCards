import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Flashcard, Topic } from "@shared/schema";
import { formatMath } from "@/lib/math-formatter";

export function FlashcardContainer() {
  const { selectedTopic, currentMode } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);

  const { data: flashcards = [], isLoading: isLoadingFlashcards } = useQuery<Flashcard[]>({
    queryKey: ["/api/flashcards"],
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  useEffect(() => {
    // Filter flashcards based on selected topic
    if (selectedTopic === "all") {
      setAllFlashcards(flashcards);
    } else {
      const selectedTopicId = topics.find(t => t.slug === selectedTopic)?.id;
      if (selectedTopicId) {
        setAllFlashcards(flashcards.filter(f => f.topicId === selectedTopicId));
      } else {
        setAllFlashcards([]);
      }
    }
    // Reset index and flip state when topic changes
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedTopic, flashcards, topics]);

  if (currentMode !== "flashcards") {
    return null;
  }

  if (isLoadingFlashcards) {
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <p className="text-lg mb-4">Loading flashcards...</p>
        <Progress className="w-1/2" value={30} />
      </div>
    );
  }

  if (allFlashcards.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg mb-4">No flashcards available for this topic.</p>
      </Card>
    );
  }

  const currentCard = allFlashcards[currentIndex % allFlashcards.length];
  const progressPercentage = ((currentIndex % allFlashcards.length) + 1) / allFlashcards.length * 100;
  
  const topicName = currentCard?.topicId 
    ? topics.find(t => t.id === currentCard.topicId)?.name || "Unknown"
    : "All Topics";

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => 
      prev > 0 ? prev - 1 : allFlashcards.length - 1
    );
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleFlipCard = () => {
    setIsFlipped(prev => !prev);
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex % allFlashcards.length + 1} of {allFlashcards.length} cards
        </div>
        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-xs font-medium">
          {topicName}
        </div>
      </div>
      
      {/* Flashcard */}
      <div 
        className={`flip-card w-full h-[300px] bg-transparent cursor-pointer mb-4 ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlipCard}
      >
        <div className="flip-card-inner relative w-full h-full">
          {/* Front */}
          <div className="flip-card-front rounded-xl bg-white dark:bg-card shadow-md p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-4">Question</h3>
            <div 
              className="text-2xl font-medium text-center"
              dangerouslySetInnerHTML={{ __html: formatMath(currentCard?.question || "") }}
            />
            <div className="mt-8 text-sm text-gray-400">Click to flip card</div>
          </div>
          
          {/* Back */}
          <div className="flip-card-back rounded-xl bg-white dark:bg-card shadow-md p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-4">Answer</h3>
            <div 
              className="text-2xl font-medium text-center"
              dangerouslySetInnerHTML={{ __html: formatMath(currentCard?.answer || "") }}
            />
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={handlePrevCard}
          className="px-4 py-2"
        >
          Previous Card
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleFlipCard}
          className="px-4 py-2"
        >
          Flip Card
        </Button>
        <Button 
          variant="default" 
          onClick={handleNextCard}
          className="px-4 py-2"
        >
          Next Card
        </Button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-6">
        <Progress value={progressPercentage} className="h-2" />
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
          {Math.round(progressPercentage)}% complete
        </div>
      </div>
    </section>
  );
}
