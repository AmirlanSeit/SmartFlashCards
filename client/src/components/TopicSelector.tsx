import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
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
        <h2 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Select Topic</h2>
        <div className="flex flex-wrap gap-2">
          <Button className="px-4 py-2 rounded-full text-sm font-medium" disabled>
            Loading topics...
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <h2 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Select Topic</h2>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedTopic === "all" ? "default" : "outline"}
          className="px-4 py-2 rounded-full text-sm font-medium"
          onClick={() => setSelectedTopic("all")}
        >
          All Topics
        </Button>

        {topics.map((topic) => (
          <Button
            key={topic.id}
            variant={selectedTopic === topic.slug ? "default" : "outline"}
            className="px-4 py-2 rounded-full text-sm font-medium"
            onClick={() => setSelectedTopic(topic.slug)}
          >
            {topic.name}
          </Button>
        ))}
      </div>
    </section>
  );
}
