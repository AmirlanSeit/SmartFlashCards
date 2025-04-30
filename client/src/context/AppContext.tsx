import { createContext, useState, ReactNode } from "react";

type Mode = "flashcards" | "quiz";
type QuestionType = "multiple" | "typed";
type Topic = string;

interface AppContextType {
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
  questionType: QuestionType;
  setQuestionType: (type: QuestionType) => void;
  selectedTopic: Topic;
  setSelectedTopic: (topic: Topic) => void;
}

export const AppContext = createContext<AppContextType>({
  currentMode: "flashcards",
  setCurrentMode: () => {},
  questionType: "multiple",
  setQuestionType: () => {},
  selectedTopic: "all",
  setSelectedTopic: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [currentMode, setCurrentMode] = useState<Mode>("flashcards");
  const [questionType, setQuestionType] = useState<QuestionType>("multiple");
  const [selectedTopic, setSelectedTopic] = useState<Topic>("all");

  return (
    <AppContext.Provider
      value={{
        currentMode,
        setCurrentMode,
        questionType,
        setQuestionType,
        selectedTopic,
        setSelectedTopic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
