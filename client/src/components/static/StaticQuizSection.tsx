import { useContext, useState, useEffect, FormEvent } from 'react';
import { AppContext } from '@/context/StaticAppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { quizQuestions } from '@/staticData';
import { TopicSelector } from '@/components/TopicSelector';

type QuizOption = {
  id: string;
  text: string;
  correct: boolean;
};

type QuizQuestion = {
  id: number;
  question: string;
  correctAnswer: string;
  options: QuizOption[];
  topicId: number;
  difficulty: string;
  hint: string | null;
};

export function QuizSection() {
  const { selectedTopic, topics } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [quizMode, setQuizMode] = useState<'multiple-choice' | 'typed'>('multiple-choice');
  
  // Use static data instead of API
  const allQuestions = quizQuestions;
  
  // Filter questions based on selected topic
  const filteredQuestions = selectedTopic === 'all' 
    ? allQuestions 
    : allQuestions.filter(q => {
        const topic = topics.find(t => t.slug === selectedTopic);
        return topic ? q.topicId === topic.id : false;
      });
      
  // Reset state when changing topics or quiz mode
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTypedAnswer('');
    setShowHint(false);
  }, [selectedTopic, quizMode]);
  
  const currentQuestion = filteredQuestions[currentIndex % Math.max(1, filteredQuestions.length)];
  
  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    
    setSelectedOption(optionId);
    const selectedQuizOption = currentQuestion.options.find(opt => opt.id === optionId);
    const correct = selectedQuizOption?.correct || false;
    
    setIsAnswered(true);
    setIsCorrect(correct);
  };
  
  const handleSubmitTypedAnswer = (e: FormEvent) => {
    e.preventDefault();
    if (isAnswered) return;
    
    // Simple case-insensitive comparison
    const isCorrectAnswer = typedAnswer.trim().toLowerCase() === currentQuestion?.correctAnswer.toLowerCase();
    
    setIsAnswered(true);
    setIsCorrect(isCorrectAnswer);
  };
  
  const nextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTypedAnswer('');
    setShowHint(false);
    setCurrentIndex((prev) => prev + 1);
  };
  
  const prevQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTypedAnswer('');
    setShowHint(false);
    
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredQuestions.length - 1);
    }
  };
  
  const toggleHint = () => {
    setShowHint((prev) => !prev);
  };
  
  const progressPercentage = 
    filteredQuestions.length > 0 
      ? ((currentIndex % filteredQuestions.length) + 1) / filteredQuestions.length * 100 
      : 0;
  
  // Get current topic name for display
  const currentTopicName = selectedTopic === 'all' 
    ? 'All Topics' 
    : topics.find(t => t.slug === selectedTopic)?.name || 'Unknown';
    
  const getOptionColor = (option: QuizOption) => {
    if (!isAnswered) return '';
    if (option.correct) return 'option-correct';
    if (option.id === selectedOption && !option.correct) return 'option-incorrect';
    return '';
  };
  
  if (!currentQuestion) {
    return (
      <div>
        <TopicSelector />
        <Card className="mt-6 p-8 flex justify-center items-center dark:bg-gray-900 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400">No quiz questions available for this topic.</p>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 tracking-tight">Math Quiz</h1>
      
      <div className="flex flex-wrap justify-between items-center gap-4">
        <TopicSelector />
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setQuizMode('multiple-choice')}
            className={`mode-btn ${quizMode === 'multiple-choice' ? 'mode-btn-active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 12h6"/><path d="M9 16h6"/><path d="M9 8h6"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
            Multiple Choice
          </Button>
          
          <Button 
            onClick={() => setQuizMode('typed')}
            className={`mode-btn ${quizMode === 'typed' ? 'mode-btn-active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1"/><path d="M7 22h1a4 4 0 0 0 4-4v-1"/><path d="M7 2h1a4 4 0 0 1 4 4v1"/></svg>
            Typed Answer
          </Button>
        </div>
      </div>
      
      <div className="my-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            Question {(currentIndex % filteredQuestions.length) + 1} of {filteredQuestions.length}
          </div>
          <div className="bg-primary px-4 py-1.5 rounded-full text-sm font-medium text-primary-foreground shadow-sm">
            {currentTopicName}
          </div>
        </div>
        
        <Card className="p-6 shadow-lg dark:bg-gray-900 dark:border-gray-800 mb-4 relative animate-slide-in">
          <div className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {topics.find(t => t.id === currentQuestion.topicId)?.name || "Math"}
          </div>
          
          <h3 className="text-xl font-medium mb-6 text-center">{currentQuestion.question}</h3>
          
          {quizMode === 'multiple-choice' ? (
            <div className="space-y-3 mt-6">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={isAnswered}
                  className={`quiz-option ${selectedOption === option.id ? 'ring-2 ring-primary' : ''} ${getOptionColor(option)}`}
                >
                  <span className="flex-1">{option.text}</span>
                  {isAnswered && option.correct && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400 ml-2"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmitTypedAnswer} className="mt-6">
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Type your answer here..." 
                  value={typedAnswer} 
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  disabled={isAnswered}
                  className={`flex-1 text-lg p-4 h-12 ${isAnswered ? (isCorrect ? 'border-green-500 dark:border-green-500' : 'border-red-500 dark:border-red-500') : ''}`}
                />
                <Button type="submit" disabled={isAnswered || !typedAnswer.trim()}>
                  Submit
                </Button>
              </div>
              
              {isAnswered && (
                <div className="mt-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {isCorrect ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Correct!</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center text-red-600 dark:text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>Incorrect</span>
                      </div>
                      <div className="mt-2">
                        Correct answer: <span className="correct-answer">{currentQuestion.correctAnswer}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
          
          {isAnswered && showHint && currentQuestion.hint && (
            <div className="hint-box mt-6">
              <strong>Hint:</strong> {currentQuestion.hint}
            </div>
          )}
        </Card>
        
        <div className="flex justify-between items-center mt-8 gap-4">
          <Button 
            variant="outline" 
            onClick={prevQuestion}
            className="px-5 py-6 text-sm font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 flex-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
            Previous
          </Button>
          
          {isAnswered && (
            <Button 
              onClick={nextQuestion}
              className="px-5 py-6 text-sm font-medium flex-1"
            >
              Next Question
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          )}
        </div>
        
        <div className="text-center mt-6">
          {isAnswered && !isCorrect && (
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
          )}
        </div>
        
        <Progress value={progressPercentage} className="mt-8 h-2 bg-gray-100 dark:bg-gray-800" />
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 font-medium">
          {Math.round(progressPercentage)}% complete
        </div>
      </div>
    </div>
  );
}