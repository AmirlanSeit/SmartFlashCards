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
  const { selectedTopic, questionType, setQuestionType, topics } = useContext(AppContext);
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
  
  // Get current topic name for display
  const currentTopicName = selectedTopic === 'all' 
    ? 'All Topics' 
    : topics.find(t => t.slug === selectedTopic)?.name || 'Unknown';
  
  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Math Quiz</h1>
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
      
      <TopicSelector />
      
      <div className="mt-6 mb-6">
        <Tabs defaultValue={questionType} className="w-full" onValueChange={(val) => setQuestionType(val as 'multiple' | 'typed')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="multiple">Multiple Choice</TabsTrigger>
            <TabsTrigger value="typed">Typed Answer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="multiple" className="animate-slide-in">
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    {(currentIndex % filteredQuestions.length) + 1} of {filteredQuestions.length}
                  </div>
                  <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                    {currentTopicName}
                  </div>
                </div>
                
                <div className="question mb-6">
                  <h2 className="text-xl font-medium mb-4">{currentQuestion.question}</h2>
                  
                  {showHint && currentQuestion.hint && (
                    <div className="hint-box mb-4">
                      <strong>Hint:</strong> {currentQuestion.hint}
                    </div>
                  )}
                  
                  <div className="options">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.id}
                        className={`quiz-option mb-2 ${selectedOption === option.id ? 'option-selected' : ''} ${getOptionColor(option)}`}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={selectedOption !== null}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                  
                  {selectedOption !== null && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="font-medium mb-2">
                        {currentQuestion.options.find(opt => opt.id === selectedOption)?.correct 
                          ? '✓ Correct!' 
                          : '✗ Incorrect!'}
                      </p>
                      
                      <p className="correct-answer">
                        Correct answer: {currentQuestion.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <Button variant="link" size="sm" onClick={toggleHint}>
                    {showHint ? "Hide Hint" : "Hint"}
                  </Button>
                  
                  <Button onClick={nextQuestion} disabled={selectedOption === null}>
                    Next Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="typed" className="animate-slide-in">
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    {(currentIndex % filteredQuestions.length) + 1} of {filteredQuestions.length}
                  </div>
                  <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                    {currentTopicName}
                  </div>
                </div>
                
                <div className="question mb-6">
                  <h2 className="text-xl font-medium mb-4">{currentQuestion.question}</h2>
                  
                  {showHint && currentQuestion.hint && (
                    <div className="hint-box mb-4">
                      <strong>Hint:</strong> {currentQuestion.hint}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmitTypedAnswer}>
                    <div className="mb-4">
                      <Input
                        type="text"
                        placeholder="Type your answer..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className={getAnswerColor()}
                        readOnly={showAnswer}
                      />
                    </div>
                    
                    {!showAnswer && (
                      <Button type="submit" className="w-full">Check Answer</Button>
                    )}
                  </form>
                  
                  {showAnswer && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="font-medium mb-2">
                        {userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() 
                          ? '✓ Correct!' 
                          : '✗ Incorrect!'}
                      </p>
                      
                      <p className="correct-answer">
                        Correct answer: {currentQuestion.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <Button variant="link" size="sm" onClick={toggleHint}>
                    {showHint ? "Hide Hint" : "Hint"}
                  </Button>
                  
                  <Button onClick={nextQuestion} disabled={!showAnswer}>
                    Next Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Progress value={progressPercentage} className="mt-6" />
      <div className="text-xs text-gray-500 text-center mt-1">
        {Math.round(progressPercentage)}% complete
      </div>
      
      <div className="mt-6">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}