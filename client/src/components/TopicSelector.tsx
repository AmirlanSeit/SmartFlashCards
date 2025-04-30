import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

export function TopicSelector() {
  const { selectedTopic, setSelectedTopic, topics, isLoading } = useContext(AppContext);

  // Show skeleton loading state
  if (isLoading) {
    return (
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Select Math Topic</h2>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-[100px] rounded-full" />
          <Skeleton className="h-9 w-[120px] rounded-full" />
          <Skeleton className="h-9 w-[140px] rounded-full" />
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
