import { createContext, ReactNode, useState, useEffect } from 'react';
import { topics, flashcards, quizQuestions } from '../staticData';

type Topic = {
  id: number;
  name: string;
  slug: string;
  difficulty: string;
};

type AppContextType = {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  topics: Topic[];
};

export const AppContext = createContext<AppContextType>({
  selectedTopic: 'all',
  setSelectedTopic: () => {},
  topics: [],
});

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [loadedTopics, setLoadedTopics] = useState<Topic[]>([]);
  
  // Use static data instead of API fetch
  useEffect(() => {
    setLoadedTopics(topics);
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedTopic,
        setSelectedTopic,
        topics: loadedTopics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}