import { createContext, useState, useEffect, ReactNode } from "react";

type Mode = "flashcards" | "quiz";
type QuestionType = "multiple" | "typed";
type Topic = string;

export interface TopicData {
  id: number;
  name: string;
  slug: string;
  difficulty: string;
}

interface AppContextType {
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
  questionType: QuestionType;
  setQuestionType: (type: QuestionType) => void;
  selectedTopic: Topic;
  setSelectedTopic: (topic: Topic) => void;
  topics: TopicData[];
  isLoading: boolean;
}

export const AppContext = createContext<AppContextType>({
  currentMode: "flashcards",
  setCurrentMode: () => {},
  questionType: "multiple",
  setQuestionType: () => {},
  selectedTopic: "all",
  setSelectedTopic: () => {},
  topics: [],
  isLoading: true
});

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [currentMode, setCurrentMode] = useState<Mode>("flashcards");
  const [questionType, setQuestionType] = useState<QuestionType>("multiple");
  const [selectedTopic, setSelectedTopic] = useState<Topic>("all");
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch topics from the API
    fetch('/api/topics')
      .then(response => response.json())
      .then(data => {
        setTopics(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching topics:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        questionType,
        setQuestionType,
        selectedTopic,
        setSelectedTopic,
        topics,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
