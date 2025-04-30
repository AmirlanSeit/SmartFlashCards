import { useContext } from 'react';
import { AppContext } from '@/context/StaticAppContext';
import { Button } from '@/components/ui/button';

export function TopicSelector() {
  const { selectedTopic, setSelectedTopic, topics } = useContext(AppContext);
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Select Math Topic</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedTopic('all')}
          className={`topic-btn ${selectedTopic === 'all' ? 'topic-btn-active' : ''}`}
        >
          All Topics
        </Button>
        
        {topics.map((topic) => (
          <Button
            key={topic.id}
            onClick={() => setSelectedTopic(topic.slug)}
            className={`topic-btn ${selectedTopic === topic.slug ? 'topic-btn-active' : ''}`}
          >
            {topic.name}
          </Button>
        ))}
      </div>
    </div>
  );
}