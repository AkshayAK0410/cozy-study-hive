
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudyBot from "@/components/StudyBot";

const ChatBot = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Study Assistant</h1>
          <p className="text-muted-foreground mb-8 text-center">
            Get help with study techniques, time management, or find motivation
          </p>
          
          <StudyBot />
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h2 className="font-semibold mb-2">Tips:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Ask about study techniques like "How can I remember better?"</li>
              <li>Get help with time management by asking "How to manage study time?"</li>
              <li>Need motivation? Try "How to stay motivated"</li>
              <li>Learn about the Pomodoro Technique by asking "What is pomodoro?"</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatBot;
