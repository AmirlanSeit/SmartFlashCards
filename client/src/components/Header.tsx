import { useTheme } from "@/hooks/useDarkMode";
import { Moon, Sun, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-card shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary dark:text-primary" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun className="h-[1.5rem] w-[1.5rem]" />
          ) : (
            <Moon className="h-[1.5rem] w-[1.5rem]" />
          )}
        </Button>
      </div>
    </header>
  );
}
