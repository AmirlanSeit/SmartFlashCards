import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { ThemeProvider } from "./hooks/useDarkMode";
import { AppProvider } from "./context/AppContext";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizPage from "./pages/QuizPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/flashcards" component={FlashcardsPage} />
      <Route path="/quiz" component={QuizPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
