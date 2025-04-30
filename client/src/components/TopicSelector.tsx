import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Topic } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export function TopicSelector() {
  const { selectedTopic, setSelectedTopic } = useContext(AppContext);

  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  if (isLoading) {
    return (
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Select Math Topic</h2>
        <div className="flex flex-wrap gap-2">
          <button className="topic-btn px-5 py-2 text-sm" disabled>
            Loading topics...
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Select Math Topic</h2>
      <div className="flex flex-wrap gap-2">
        <button 
          className={`topic-btn px-5 py-2 text-sm ${selectedTopic === "all" ? "topic-btn-active" : ""}`}
          onClick={() => setSelectedTopic("all")}
        >
          All Topics
        </button>

        {topics.map((topic) => (
          <button
            key={topic.id}
            className={`topic-btn px-5 py-2 text-sm ${selectedTopic === topic.slug ? "topic-btn-active" : ""}`}
            onClick={() => setSelectedTopic(topic.slug)}
          >
            {topic.name}
          </button>
        ))}
      </div>
    </section>
  );
}
