import { useContext, useState, useEffect, FormEvent } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Topic, QuizQuestionWithOptions } from "@shared/schema";
import { formatMath } from "@/lib/math-formatter";

export function QuizContainer() {
  const { selectedTopic, currentMode, questionType } = useContext(AppContext);
  const { toast } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [allQuestions, setAllQuestions] = useState<QuizQuestionWithOptions[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { data: quizQuestions = [], isLoading: isLoadingQuestions } = useQuery<QuizQuestionWithOptions[]>({
    queryKey: ["/api/quiz"],
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  useEffect(() => {
    // Filter questions based on selected topic
    if (selectedTopic === "all") {
      setAllQuestions(quizQuestions);
    } else {
      const selectedTopicId = topics.find(t => t.slug === selectedTopic)?.id;
      if (selectedTopicId) {
        setAllQuestions(quizQuestions.filter(q => q.topicId === selectedTopicId));
      } else {
        setAllQuestions([]);
      }
    }
    // Reset index and states when topic changes
    setCurrentIndex(0);
    setUserAnswer("");
    setShowAnswer(false);
    setSelectedOption(null);
  }, [selectedTopic, quizQuestions, topics]);

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
      <Card className="p-6 text-center">
        <p className="text-lg mb-4">No quiz questions available for this topic.</p>
      </Card>
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
  };

  const handleShowHint = () => {
    toast({
      title: "Hint",
      description: "Think about the topic principles and formulas you've learned.",
      duration: 5000,
    });
  };

  const handleAnswerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please type your answer before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if answer is correct (case insensitive)
    const isCorrect = userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Your answer is correct.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${currentQuestion.correctAnswer}`,
        variant: "destructive",
      });
    }
    
    setShowAnswer(true);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Find if the selected option is correct
    const selectedOptionObj = currentQuestion.options.find(opt => opt.id === optionId);
    
    if (selectedOptionObj?.correct) {
      toast({
        title: "Correct!",
        description: "You selected the right answer.",
        variant: "default",
      });
    } else {
      // Find the correct option
      const correctOption = currentQuestion.options.find(opt => opt.correct);
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${correctOption?.text}`,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex % allQuestions.length + 1} of {allQuestions.length} cards
        </div>
        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-xs font-medium">
          {topicName}
        </div>
      </div>
      
      {/* Question Card */}
      <Card className="p-6 mb-4 animate-fade-in">
        <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-4">Question:</h3>
        <div 
          className="text-xl font-medium text-center mb-8"
          dangerouslySetInnerHTML={{ __html: formatMath(currentQuestion?.question || "") }}
        />
        
        {/* Multiple Choice Options */}
        {questionType === "multiple" && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className={`w-full text-left justify-start px-4 py-3 h-auto ${
                  selectedOption === option.id
                    ? option.correct
                      ? "bg-green-100 dark:bg-green-900 border-green-500"
                      : "bg-red-100 dark:bg-red-900 border-red-500"
                    : ""
                } ${
                  selectedOption !== null && option.correct
                    ? "bg-green-100 dark:bg-green-900 border-green-500"
                    : ""
                }`}
                onClick={() => {
                  if (selectedOption === null) {
                    handleOptionSelect(option.id);
                  }
                }}
                disabled={selectedOption !== null}
              >
                <span className="font-medium mr-3">{option.id}</span>
                <span dangerouslySetInnerHTML={{ __html: formatMath(option.text) }} />
              </Button>
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
            
            <Button
              type="submit"
              className="w-full py-3"
              disabled={showAnswer || !userAnswer.trim()}
            >
              Submit Answer
            </Button>
          </form>
        )}
      </Card>
      
      {/* Hint and Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={handleShowHint}>
          Hint
        </Button>
        <Button 
          variant="default" 
          onClick={handleNextQuestion}
          className="bg-primary hover:bg-primary/90"
        >
          Next Question
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
