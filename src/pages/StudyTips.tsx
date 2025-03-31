
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  BrainCircuit, 
  Coffee, 
  ListTodo, 
  Clock, 
  Lightbulb, 
  Music, 
  Smartphone, 
  LayoutDashboard, 
  Salad, 
  Activity, 
  Sparkles 
} from "lucide-react";

const StudyTips = () => {
  const [activeTab, setActiveTab] = useState("techniques");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 mt-10">
        <div className="container px-4 mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Study Tips & Techniques</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover effective study methods and strategies to improve your focus, 
              retention, and overall productivity.
            </p>
          </div>
          
          <Tabs defaultValue="techniques" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 w-full mb-8">
              <TabsTrigger value="techniques">Study Techniques</TabsTrigger>
              <TabsTrigger value="environment">Study Environment</TabsTrigger>
              <TabsTrigger value="health">Health & Wellbeing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="techniques" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle>Pomodoro Technique</CardTitle>
                    </div>
                    <CardDescription>
                      Break work into intervals for better focus
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Work for 25 minutes, then take a 5-minute break. After four work periods, 
                      take a longer 15-30 minute break. This method helps maintain focus and prevent burnout.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Improves focus and concentration</li>
                      <li>Reduces mental fatigue</li>
                      <li>Creates a sense of urgency</li>
                      <li>Helps track your productivity</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle>Active Recall</CardTitle>
                    </div>
                    <CardDescription>
                      Test yourself instead of passive re-reading
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Instead of re-reading material, try to recall information from memory. 
                      This strengthens neural pathways and makes it easier to remember information later.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Enhances long-term retention</li>
                      <li>Identifies knowledge gaps</li>
                      <li>Simulates test conditions</li>
                      <li>More effective than re-reading</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <ListTodo className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <CardTitle>Spaced Repetition</CardTitle>
                    </div>
                    <CardDescription>
                      Review material at increasing intervals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Space out your review sessions over time, with increasing intervals between reviews. 
                      This method leverages how memory works to maximize retention.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Optimizes memory consolidation</li>
                      <li>Reduces forgetting curve</li>
                      <li>More efficient than cramming</li>
                      <li>Can be easily implemented with flashcards</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <CardTitle>Feynman Technique</CardTitle>
                    </div>
                    <CardDescription>
                      Explain concepts in simple terms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Try to explain a concept in simple language as if teaching someone else. 
                      This helps identify gaps in your understanding and reinforces learning.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Deepens understanding</li>
                      <li>Reveals knowledge gaps</li>
                      <li>Simplifies complex concepts</li>
                      <li>Improves communication skills</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="environment" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle>Lighting Matters</CardTitle>
                    </div>
                    <CardDescription>
                      Optimize your study space lighting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Natural light is ideal for studying. Position your desk near a window, but avoid glare on your screen. 
                      In the evening, use warm lighting that doesn't strain your eyes or disrupt your sleep cycle.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <Music className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle>Sound Environment</CardTitle>
                    </div>
                    <CardDescription>
                      Create the right audio atmosphere
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Some people focus better with background noise, while others need silence. 
                      Experiment with ambient sounds, white noise, or instrumental music without lyrics to find what works for you.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <CardTitle>Digital Distractions</CardTitle>
                    </div>
                    <CardDescription>
                      Manage technology interruptions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Put your phone on "Do Not Disturb" mode or use apps that block distracting websites during study sessions. 
                      Consider using dedicated study devices that don't have social media or games installed.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                        <LayoutDashboard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <CardTitle>Ergonomic Setup</CardTitle>
                    </div>
                    <CardDescription>
                      Create a comfortable workspace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Invest in a comfortable chair that supports good posture. Position your screen at eye level and keep your 
                      wrists straight when typing. Take regular breaks to stand up and stretch to prevent physical discomfort.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="health" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        <Coffee className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle>Sleep Quality</CardTitle>
                    </div>
                    <CardDescription>
                      Prioritize rest for better learning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Aim for 7-9 hours of quality sleep. Memory consolidation happens during sleep, making it crucial for 
                      effective learning. Avoid screens before bedtime and maintain a consistent sleep schedule.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <Salad className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <CardTitle>Nutrition</CardTitle>
                    </div>
                    <CardDescription>
                      Fuel your brain properly
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Eat balanced meals with plenty of fruits, vegetables, and proteins. Stay hydrated and avoid heavy meals 
                      before studying. Consider brain-boosting foods like nuts, blueberries, and fatty fish.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                        <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle>Exercise</CardTitle>
                    </div>
                    <CardDescription>
                      Move your body for a sharper mind
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Regular physical activity improves cognitive function and reduces stress. Even short walks or stretching 
                      sessions between study blocks can boost focus and creativity.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-soft glass-effect hover-scale">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="mr-3 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                        <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <CardTitle>Mindfulness</CardTitle>
                    </div>
                    <CardDescription>
                      Practice being present
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Take a few minutes each day for meditation or mindfulness exercises. These practices can improve focus, 
                      reduce anxiety, and help you stay present during study sessions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudyTips;
