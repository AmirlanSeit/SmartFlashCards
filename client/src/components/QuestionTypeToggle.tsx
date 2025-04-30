import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { ListChecks, Type } from "lucide-react";

export function QuestionTypeToggle() {
  const { questionType, setQuestionType, currentMode } = useContext(AppContext);

  if (currentMode !== "quiz") {
    return null;
  }

  return (
    <section className="flex justify-center mb-6">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          className={`mode-btn ${questionType === "multiple" ? "mode-btn-active" : ""}`}
          onClick={() => setQuestionType("multiple")}
        >
          <ListChecks className="h-4 w-4 mr-2" />
          Multiple Choice
        </button>
        <button
          className={`mode-btn ${questionType === "typed" ? "mode-btn-active" : ""}`}
          onClick={() => setQuestionType("typed")}
        >
          <Type className="h-4 w-4 mr-2" />
          Type Answer
        </button>
      </div>
    </section>
  );
}
