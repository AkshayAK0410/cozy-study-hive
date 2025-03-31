import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, mockGetCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Clock, ListTodo, Music, BarChart2 } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await mockGetCurrentUser();
      setUser(currentUser);
      setIsLoaded(true);
    };
    checkUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-blue-50/50 to-transparent dark:from-blue-950/10 dark:to-transparent" />
        </div>
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              Boost your productivity
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Focus better with <span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-600">StudyNook</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              The beautifully designed pomodoro timer app that helps you stay focused, organized, and productive during your study sessions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/timer">
                <Button size="lg" className="rounded-full px-8 font-medium animate-pulse-slow">
                  {user ? "Start Studying" : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/timer">
                <Button variant="outline" size="lg" className="rounded-full px-8 font-medium">
                  Try it out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-accent/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to study effectively</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              StudyNook combines the best features to create your perfect study environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft hover-scale transition-all glass-effect">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-500 mb-5">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pomodoro Timer</h3>
              <p className="text-muted-foreground">
                Stay focused with customizable work sessions and breaks based on the pomodoro technique.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft hover-scale transition-all glass-effect">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-5">
                <ListTodo className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Task Management</h3>
              <p className="text-muted-foreground">
                Organize your study tasks, set pomodoro estimates, and track your progress.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft hover-scale transition-all glass-effect">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 text-purple-500 mb-5">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Focus Sounds</h3>
              <p className="text-muted-foreground">
                Enhance your concentration with ambient noise and focus-boosting sounds.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-soft hover-scale transition-all glass-effect">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500/10 text-orange-500 mb-5">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Visualize your study habits and track your productivity over time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How StudyNook Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, effective, and based on proven productivity techniques.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-5 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Set Your Tasks</h3>
              <p className="text-muted-foreground">
                Create tasks for your study session and estimate how many pomodoros you'll need.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-5 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Focus & Work</h3>
              <p className="text-muted-foreground">
                Work in focused 25-minute sessions, followed by short 5-minute breaks.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-5 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-muted-foreground">
                Review your study habits and productivity stats to keep improving.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-accent/30 to-transparent">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to boost your productivity?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who are using StudyNook to improve their focus and study habits.
            </p>
            
            <Link to="/timer">
              <Button size="lg" className="rounded-full px-8 font-medium animate-pulse-slow">
                {user ? "Start Studying" : "Get Started for Free"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
