import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle } from "lucide-react";

export function ModeToggle() {
  const { currentMode, setCurrentMode } = useContext(AppContext);

  return (
    <section className="flex justify-center mb-6">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <Button
          variant={currentMode === "flashcards" ? "secondary" : "ghost"}
          className="flex items-center px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => setCurrentMode("flashcards")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Flashcards
        </Button>
        <Button
          variant={currentMode === "quiz" ? "secondary" : "ghost"}
          className="flex items-center px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => setCurrentMode("quiz")}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Quiz
        </Button>
      </div>
    </section>
  );
}
