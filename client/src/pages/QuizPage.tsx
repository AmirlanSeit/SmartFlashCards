import { useContext, useState, useEffect, FormEvent } from 'react';
import { AppContext } from '@/context/AppContext';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { TopicSelector } from '@/components/TopicSelector';
import { Header } from '@/components/Header';
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
        // Add debugging
        console.log('Quiz - Selected topic:', selectedTopic, 'Topic found:', topic, 'Question topicId:', question.topicId);
        return topic ? question.topicId === topic.id : false;
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
      return option.correct ? 'option-correct' : 'option-incorrect';
    }
    
    if (option.correct && selectedOption !== null) {
      return 'option-correct';
    }
    
    return '';
  };
  
  // Get text input color based on answer correctness
  const getAnswerColor = () => {
    if (!showAnswer) return '';
    
    return userAnswer.toLowerCase() === currentQuestion?.correctAnswer.toLowerCase()
      ? 'option-correct'
      : 'option-incorrect';
  };
  
  // Get current topic name for display
  const currentTopicName = selectedTopic === 'all' 
    ? 'All Topics' 
    : topics.find(t => t.slug === selectedTopic)?.name || 'Unknown';
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Math Quiz" />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <TopicSelector />
          <Card className="mt-6 p-8 flex justify-center items-center dark:bg-gray-900 dark:border-gray-800">
            <p className="text-center text-gray-500 dark:text-gray-400">No quiz questions available for this topic.</p>
          </Card>
          <div className="mt-10 flex justify-center">
            <Button 
              asChild
              variant="outline"
              className="px-5 py-6 text-sm font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
            >
              <Link href="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Math Quiz" />
      <div className="container mx-auto px-4 py-8 flex-grow">
      
      <TopicSelector />
      
      <div className="mt-8 mb-6">
        <Tabs defaultValue={questionType} className="w-full" onValueChange={(val) => setQuestionType(val as 'multiple' | 'typed')}>
          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
            <TabsTrigger value="multiple" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-200">Multiple Choice</TabsTrigger>
            <TabsTrigger value="typed" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-200">Typed Answer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="multiple" className="animate-slide-in">
            <Card className="mt-4 dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    Question {(currentIndex % filteredQuestions.length) + 1} of {filteredQuestions.length}
                  </div>
                  <div className="bg-primary px-4 py-1.5 rounded-full text-sm font-medium text-primary-foreground shadow-sm">
                    {currentTopicName}
                  </div>
                </div>
                
                <div className="question mb-6">
                  <div className="relative">
                    <h2 className="text-xl font-medium mb-6 dark:text-gray-100">{currentQuestion.question}</h2>
                    <div className="absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {topics.find(t => t.id === currentQuestion.topicId)?.name || "Math"}
                    </div>
                  </div>
                  
                  {showHint && currentQuestion.hint && (
                    <div className="hint-box mb-6 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-md text-amber-800 dark:text-amber-200">
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
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                      <p className="font-medium mb-2 dark:text-gray-200">
                        {currentQuestion.options.find(opt => opt.id === selectedOption)?.correct 
                          ? '✓ Correct!' 
                          : '✗ Incorrect!'}
                      </p>
                      
                      <p className="correct-answer dark:text-gray-300">
                        Correct answer: <span className="text-blue-600 dark:text-blue-400 font-medium">{currentQuestion.correctAnswer}</span>
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
            <Card className="mt-4 dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    Question {(currentIndex % filteredQuestions.length) + 1} of {filteredQuestions.length}
                  </div>
                  <div className="bg-primary px-4 py-1.5 rounded-full text-sm font-medium text-primary-foreground shadow-sm">
                    {currentTopicName}
                  </div>
                </div>
                
                <div className="question mb-6">
                  <div className="relative">
                    <h2 className="text-xl font-medium mb-6 dark:text-gray-100">{currentQuestion.question}</h2>
                    <div className="absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {topics.find(t => t.id === currentQuestion.topicId)?.name || "Math"}
                    </div>
                  </div>
                  
                  {showHint && currentQuestion.hint && (
                    <div className="hint-box mb-6 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-md text-amber-800 dark:text-amber-200">
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
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                      <p className="font-medium mb-2 dark:text-gray-200">
                        {userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() 
                          ? '✓ Correct!' 
                          : '✗ Incorrect!'}
                      </p>
                      
                      <p className="correct-answer dark:text-gray-300">
                        Correct answer: <span className="text-blue-600 dark:text-blue-400 font-medium">{currentQuestion.correctAnswer}</span>
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
      
      <div className="mt-10 flex justify-center">
        <Button 
          asChild
          variant="outline"
          className="px-5 py-6 text-sm font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
        >
          <Link href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </Link>
        </Button>
      </div>
      </div>
    </div>
  );
}