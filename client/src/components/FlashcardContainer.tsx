import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Flashcard, Topic } from "@shared/schema";
import { formatMath } from "@/lib/math-formatter";

export function FlashcardContainer() {
  const { selectedTopic, currentMode } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
  const [showHint, setShowHint] = useState(false);

  // Get the selected topic ID based on the slug
  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });
  
  // Find the topic ID from the selected topic slug
  const selectedTopicId = selectedTopic !== "all" 
    ? topics.find(t => t.slug === selectedTopic)?.id 
    : undefined;

  // Fetch flashcards with dynamic query key based on selected topic
  const { data: flashcards = [], isLoading: isLoadingFlashcards } = useQuery<Flashcard[]>({
    queryKey: selectedTopicId 
      ? ["/api/flashcards", `topicId=${selectedTopicId}`] 
      : ["/api/flashcards"],
  });

  useEffect(() => {
    // Update all flashcards directly from the query
    setAllFlashcards(flashcards);
    
    // Reset index and flip state when topic changes
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [selectedTopic, flashcards]);

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
      <div className="p-6 text-center border rounded-lg shadow-sm">
        <p className="text-lg mb-4">No flashcards available for this topic.</p>
      </div>
    );
  }

  const currentCard = allFlashcards[currentIndex % allFlashcards.length];
  const progressPercentage = ((currentIndex % allFlashcards.length) + 1) / allFlashcards.length * 100;
  
  // Use the selected topic for displaying the topic name
  const topicName = selectedTopic === "all" 
    ? "All Topics" 
    : topics.find(t => t.slug === selectedTopic)?.name || "Unknown";

  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(prev => 
      prev > 0 ? prev - 1 : allFlashcards.length - 1
    );
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleFlipCard = () => {
    setIsFlipped(prev => !prev);
  };

  const toggleHint = () => {
    setShowHint(prev => !prev);
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex % allFlashcards.length + 1} of {allFlashcards.length}
        </div>
        <div className="topic-label">
          {topicName}
        </div>
      </div>
      
      {/* Flashcard with flip animation */}
      <div className={`flip-card mb-4 ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-inner border rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="flip-card-front p-8 flex flex-col items-center min-h-[240px] justify-center">
            <div 
              className="text-2xl font-medium text-center"
              dangerouslySetInnerHTML={{ __html: formatMath(currentCard?.question || "") }}
            />
          </div>
          
          <div className="flip-card-back p-8 flex flex-col items-center min-h-[240px] justify-center">
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-4">Answer</h3>
            <div 
              className="text-2xl font-medium text-center text-green-500"
              dangerouslySetInnerHTML={{ __html: formatMath(currentCard?.answer || "") }}
            />
            
            {showHint && (
              <div className="hint-box mt-4 w-full animate-fade-in">
                <strong>Hint:</strong> {currentCard.hint || "Try breaking down the problem into simpler steps."}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button 
          className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={handlePrevCard}
        >
          Previous Card
        </button>
        
        <button 
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={handleFlipCard}
        >
          Flip Card
        </button>
        
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          onClick={handleNextCard}
        >
          Next Card
        </button>
      </div>
      
      {/* Hint button */}
      <div className="mt-4 flex justify-center">
        <button 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          onClick={toggleHint}
        >
          {showHint ? "Hide Hint" : "Hint"}
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
          {Math.round(progressPercentage)}% complete
        </div>
      </div>
    </section>
  );
}
