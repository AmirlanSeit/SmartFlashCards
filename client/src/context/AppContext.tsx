import { createContext, useState, ReactNode } from "react";

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
}

export const AppContext = createContext<AppContextType>({
  currentMode: "flashcards",
  setCurrentMode: () => {},
  questionType: "multiple",
  setQuestionType: () => {},
  selectedTopic: "all",
  setSelectedTopic: () => {},
  topics: []
});

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [currentMode, setCurrentMode] = useState<Mode>("flashcards");
  const [questionType, setQuestionType] = useState<QuestionType>("multiple");
  const [selectedTopic, setSelectedTopic] = useState<Topic>("all");
  
  // Mock topics data (in a real app, this would come from an API)
  const topics: TopicData[] = [
    { id: 1, name: 'Algebra', slug: 'algebra', difficulty: 'medium' },
    { id: 2, name: 'Trigonometry', slug: 'trigonometry', difficulty: 'medium' },
    { id: 3, name: 'Statistics', slug: 'statistics', difficulty: 'medium' }
  ];

  return (
    <AppContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        questionType,
        setQuestionType,
        selectedTopic,
        setSelectedTopic,
        topics
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
