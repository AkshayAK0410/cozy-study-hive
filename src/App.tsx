import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Timer from "./pages/Timer";
import Profile from "./pages/Profile";
import StudyTips from "./pages/StudyTips";
import ProductivityGuides from "./pages/ProductivityGuides";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import StudyStats from "./pages/StudyStats";
import { AuthProvider } from "./lib/AuthProvider";
import StudyBot from "./components/StudyBot";
import { TaskProvider } from "./lib/TaskProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TaskProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/study-tips" element={<StudyTips />} />
              <Route path="/productivity-guides" element={<ProductivityGuides />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/stats" element={<StudyStats />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <StudyBot />
          </BrowserRouter>
        </TooltipProvider>
      </TaskProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
