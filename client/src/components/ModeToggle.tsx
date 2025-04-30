import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { FileText, HelpCircle } from "lucide-react";

export function ModeToggle() {
  const { currentMode, setCurrentMode } = useContext(AppContext);

  return (
    <section className="flex justify-center mb-6">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          className={`mode-btn ${currentMode === "flashcards" ? "mode-btn-active" : ""}`}
          onClick={() => setCurrentMode("flashcards")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Flashcards
        </button>
        <button
          className={`mode-btn ${currentMode === "quiz" ? "mode-btn-active" : ""}`}
          onClick={() => setCurrentMode("quiz")}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Quiz
        </button>
      </div>
    </section>
  );
}
