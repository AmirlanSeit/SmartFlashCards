import { useContext, useState, useEffect, FormEvent } from "react";
import { AppContext } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Topic, QuizQuestionWithOptions } from "@shared/schema";
import { formatMath } from "@/lib/math-formatter";

export function QuizContainer() {
  const { selectedTopic, currentMode, questionType } = useContext(AppContext);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [allQuestions, setAllQuestions] = useState<QuizQuestionWithOptions[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Get the selected topic ID based on the slug
  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });
  
  // Find the topic ID from the selected topic slug
  const selectedTopicId = selectedTopic !== "all" 
    ? topics.find(t => t.slug === selectedTopic)?.id 
    : undefined;
  
  // Fetch quiz questions with dynamic query key based on selected topic
  const { data: quizQuestions = [], isLoading: isLoadingQuestions } = useQuery<QuizQuestionWithOptions[]>({
    queryKey: selectedTopicId 
      ? ["/api/quiz", `topicId=${selectedTopicId}`] 
      : ["/api/quiz"],
  });

  useEffect(() => {
    // Update all questions directly from the query
    setAllQuestions(quizQuestions);
    
    // Reset index and states when topic changes
    setCurrentIndex(0);
    setUserAnswer("");
    setShowAnswer(false);
    setSelectedOption(null);
    setShowHint(false);
  }, [selectedTopic, quizQuestions]);

  if (currentMode !== "quiz") {
    return null;
  }

  if (isLoadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <p className="text-lg mb-4">Loading quiz questions...</p>
        <Progress className="w-1/2" value={30} />
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div className="p-6 text-center border rounded-lg shadow-sm">
        <p className="text-lg mb-4">No quiz questions available for this topic.</p>
      </div>
    );
  }

  const currentQuestion = allQuestions[currentIndex % allQuestions.length];
  const progressPercentage = ((currentIndex % allQuestions.length) + 1) / allQuestions.length * 100;
  
  const topicName = currentQuestion?.topicId 
    ? topics.find(t => t.id === currentQuestion.topicId)?.name || "Unknown"
    : "All Topics";

  const handleNextQuestion = () => {
    setCurrentIndex(prev => prev + 1);
    setUserAnswer("");
    setShowAnswer(false);
    setSelectedOption(null);
    setShowHint(false);
  };

  const toggleHint = () => {
    setShowHint(prev => !prev);
  };

  const handleAnswerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      return;
    }
    
    // Check if answer is correct (case insensitive)
    setShowAnswer(true);
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionId);
  };

  // Find if the selected option is correct
  const isOptionCorrect = (optionId: string) => {
    return currentQuestion.options.find(opt => opt.id === optionId)?.correct;
  };
  
  // Get the correct option
  const getCorrectOption = () => {
    return currentQuestion.options.find(opt => opt.correct);
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex % allQuestions.length + 1} of {allQuestions.length} cards
        </div>
        <div className="topic-label">
          {topicName}
        </div>
      </div>
      
      {/* Question Card with slide-in animation */}
      <div className="mb-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden p-6 animate-slide-in">
        <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-4">Question:</h3>
        <div 
          className="text-xl font-medium text-center mb-8"
          dangerouslySetInnerHTML={{ __html: formatMath(currentQuestion?.question || "") }}
        />
        
        {/* Multiple Choice Options */}
        {questionType === "multiple" && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                className={`quiz-option ${
                  selectedOption === option.id
                    ? option.correct
                      ? "option-correct"
                      : "option-incorrect"
                    : ""
                } ${
                  selectedOption !== null && option.correct && selectedOption !== option.id
                    ? "option-correct"
                    : ""
                }`}
                onClick={() => handleOptionSelect(option.id)}
                disabled={selectedOption !== null}
              >
                <span className="font-medium mr-3">{option.id}</span>
                <span dangerouslySetInnerHTML={{ __html: formatMath(option.text) }} />
              </button>
            ))}
          </div>
        )}
        
        {/* Type Answer Input */}
        {questionType === "typed" && (
          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className={`w-full px-4 py-3 ${
                showAnswer
                  ? userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                    ? "border-green-500 bg-green-50 dark:bg-green-900"
                    : "border-red-500 bg-red-50 dark:bg-red-900"
                  : ""
              }`}
              disabled={showAnswer}
            />
            
            {showAnswer && userAnswer.toLowerCase() !== currentQuestion.correctAnswer.toLowerCase() && (
              <div className="text-center text-sm mt-2 mb-4">
                Correct answer: <span className="font-bold">{currentQuestion.correctAnswer}</span>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={showAnswer || !userAnswer.trim()}
            >
              Submit Answer
            </button>
          </form>
        )}

        {/* Hint box */}
        {showHint && (
          <div className="hint-box mt-4 animate-fade-in">
            <strong>Hint:</strong> {currentQuestion.hint || "Try breaking down the problem into simpler steps."}
          </div>
        )}
      </div>
      
      {/* Hint and Navigation */}
      <div className="flex justify-between items-center">
        <button 
          className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={toggleHint}
        >
          {showHint ? "Hide Hint" : "Hint"}
        </button>
        
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          onClick={handleNextQuestion}
        >
          Next Question
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
