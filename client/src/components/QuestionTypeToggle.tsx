import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { ListChecks, Type } from "lucide-react";

export function QuestionTypeToggle() {
  const { questionType, setQuestionType, currentMode } = useContext(AppContext);

  if (currentMode !== "quiz") {
    return null;
  }

  return (
    <section className="flex justify-center mb-6">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <Button
          variant={questionType === "multiple" ? "secondary" : "ghost"}
          className="flex items-center px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => setQuestionType("multiple")}
        >
          <ListChecks className="h-4 w-4 mr-2" />
          Multiple Choice
        </Button>
        <Button
          variant={questionType === "typed" ? "secondary" : "ghost"}
          className="flex items-center px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => setQuestionType("typed")}
        >
          <Type className="h-4 w-4 mr-2" />
          Type Answer
        </Button>
      </div>
    </section>
  );
}
