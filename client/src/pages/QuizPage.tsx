import { useContext, useState, useEffect, FormEvent } from 'react';
import { AppContext } from '@/context/AppContext';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { TopicSelector } from '@/components/TopicSelector';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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

export default function QuizPage() {
  const { selectedTopic, questionType, setQuestionType } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Fetch quiz questions from the API
  const { data: quizQuestions = [] } = useQuery<QuizQuestion[]>({
    queryKey: ['/api/quiz'],
  });
  
  // Filter questions based on selected topic
  const filteredQuestions = selectedTopic === 'all' 
    ? quizQuestions 
    : quizQuestions.filter(question => {
        const topic = topics.find(t => t.slug === selectedTopic);
        return question.topicId === topic?.id;
      });
  
  // Reset state when changing topics or question type
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setUserAnswer('');
    setShowAnswer(false);
    setShowHint(false);
  }, [selectedTopic, questionType]);
  
  const currentQuestion = filteredQuestions[currentIndex % Math.max(1, filteredQuestions.length)];
  
  const nextQuestion = () => {
    setSelectedOption(null);
    setUserAnswer('');
    setShowAnswer(false);
    setShowHint(false);
    setCurrentIndex((prev) => prev + 1);
  };
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  const handleSubmitTypedAnswer = (e: FormEvent) => {
    e.preventDefault();
    setShowAnswer(true);
  };
  
  const toggleHint = () => {
    setShowHint((prev) => !prev);
  };
  
  const progressPercentage = 
    filteredQuestions.length > 0 
      ? ((currentIndex % filteredQuestions.length) + 1) / filteredQuestions.length * 100 
      : 0;
  
  // Get option color based on selection state
  const getOptionColor = (option: QuizOption) => {
    if (selectedOption === null) return '';
    
    if (option.id === selectedOption) {
      return option.correct ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
    }
    
    if (option.correct && selectedOption !== null) {
      return 'bg-green-100 border-green-500';
    }
    
    return '';
  };
  
  // Get text input color based on answer correctness
  const getAnswerColor = () => {
    if (!showAnswer) return '';
    
    return userAnswer.toLowerCase() === currentQuestion?.correctAnswer.toLowerCase()
      ? 'border-green-500 text-green-600'
      : 'border-red-500 text-red-600';
  };
  
  // Mock topics data (should be fetched from API in production)
  const topics = [
    { id: 1, name: 'Algebra', slug: 'algebra', difficulty: 'medium' },
    { id: 2, name: 'Trigonometry', slug: 'trigonometry', difficulty: 'medium' },
    { id: 3, name: 'Statistics', slug: 'statistics', difficulty: 'medium' }
  ];
  
  // Get current topic name for display
  const currentTopicName = selectedTopic === 'all' 
    ? 'All Topics' 
    : topics.find(t => t.slug === selectedTopic)?.name || 'Unknown';
  
  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Math Quiz</h1>
        
        <Tabs defaultValue={questionType} onValueChange={(value) => setQuestionType(value as 'multiple' | 'typed')}>
          <TabsList className="mb-4">
            <TabsTrigger value="multiple">Multiple Choice</TabsTrigger>
            <TabsTrigger value="typed">Type Answer</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <TopicSelector />
        
        <Card className="mt-6 p-8 flex justify-center items-center">
          <p className="text-center text-gray-500">No quiz questions available for this topic.</p>
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
      <h1 className="text-3xl font-bold mb-4">Math Quiz</h1>
      
      <Tabs defaultValue={questionType} onValueChange={(value) => setQuestionType(value as 'multiple' | 'typed')}>
        <TabsList className="mb-4">
          <TabsTrigger value="multiple">Multiple Choice</TabsTrigger>
          <TabsTrigger value="typed">Type Answer</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <TopicSelector />
      
      <div className="my-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {(currentIndex % filteredQuestions.length) + 1} of {filteredQuestions.length}
          </div>
          <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
            {currentTopicName}
          </div>
        </div>
        
        <Card className="mb-4 animate-slide-in">
          <CardContent className="p-6">
            <div className="text-gray-500 text-sm mb-4">Question:</div>
            <div className="text-xl text-center mb-8">
              {currentQuestion.question}
            </div>
            
            {/* Multiple Choice Options */}
            {questionType === 'multiple' && (
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className={`justify-start px-4 py-3 text-left ${getOptionColor(option)}`}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={selectedOption !== null}
                  >
                    <span className="font-medium mr-3">{option.id}</span>
                    <span>{option.text}</span>
                  </Button>
                ))}
              </div>
            )}
            
            {/* Type Answer Input */}
            {questionType === 'typed' && (
              <form onSubmit={handleSubmitTypedAnswer}>
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className={getAnswerColor()}
                  disabled={showAnswer}
                />
                
                {showAnswer && userAnswer.toLowerCase() !== currentQuestion.correctAnswer.toLowerCase() && (
                  <div className="text-center text-sm my-2">
                    Correct answer: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full mt-3"
                  disabled={showAnswer || !userAnswer.trim()}
                >
                  Submit Answer
                </Button>
              </form>
            )}
            
            {/* Hint box */}
            {showHint && currentQuestion.hint && (
              <div className="hint-box mt-4">
                <strong>Hint:</strong> {currentQuestion.hint}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={toggleHint}>
            {showHint ? "Hide Hint" : "Hint"}
          </Button>
          
          <Button onClick={nextQuestion}>
            Next Question
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