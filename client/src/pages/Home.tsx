import { Header } from "@/components/Header";
import { TopicSelector } from "@/components/TopicSelector";
import { ModeToggle } from "@/components/ModeToggle";
import { QuestionTypeToggle } from "@/components/QuestionTypeToggle";
import { FlashcardContainer } from "@/components/FlashcardContainer";
import { QuizContainer } from "@/components/QuizContainer";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Math Flashcards" />
      
      <main className="container mx-auto px-4 py-6 max-w-3xl flex-grow">
        <TopicSelector />
        <ModeToggle />
        <QuestionTypeToggle />
        <FlashcardContainer />
        <QuizContainer />
        <Footer />
      </main>
    </div>
  );
}
