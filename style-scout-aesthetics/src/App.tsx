import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StyleQuiz from "./pages/StyleQuiz";
import QuizResultBoardPage from "./pages/QuizResultBoardPage";
import Discover from "./pages/Discover";
import BoardPage from "./pages/BoardPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Pinterest from "./pages/Pinterest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz" element={<StyleQuiz />} />
          <Route path="/quiz/results" element={<QuizResultBoardPage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/board/:id" element={<BoardPage />} />
          <Route path="/pinterest" element={<Pinterest />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
