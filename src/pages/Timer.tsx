import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tasks } from "@/components/Tasks";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Volume2, Settings2, Focus } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

const Timer = () => {
  const { user, isLoading } = useRequireAuth();
  const { preferences, updatePreferences } = useAuth();
  const { toast } = useToast();
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        resetTimer();
      } else if (e.code === "KeyF" && e.ctrlKey) {
        e.preventDefault();
        setIsFocusMode(!isFocusMode);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isRunning, isFocusMode]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      
      const audio = new Audio(isBreak ? "/break-end.mp3" : "/focus-end.mp3");
      audio.play().catch(console.error);

      if (!isBreak) {
        setTime(breakDuration * 60);
        setIsBreak(true);
        setStreak(prev => prev + 1);
        toast({
          title: "Focus Session Complete! 🎉",
          description: `Great job! Take a ${breakDuration}-minute break. Current streak: ${streak + 1}`,
        });
      } else {
        setTime(focusDuration * 60);
        setIsBreak(false);
        toast({
          title: "Break Time Over",
          description: "Ready for another focused session?",
        });
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, time, isBreak, streak, focusDuration, breakDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if (!isRunning && time === (isBreak ? breakDuration * 60 : focusDuration * 60)) {
      toast({
        title: isBreak ? "Break Started" : "Focus Time Started",
        description: `Press Space to pause/resume, R to reset`,
      });
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(focusDuration * 60);
    setIsBreak(false);
    toast({
      title: "Timer Reset",
      description: "Ready to start a new session",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95 transition-all duration-300 ${isFocusMode ? 'focus-mode' : ''}`}>
      <style>
        {
          `
          .focus-mode .hide-in-focus {
            opacity: 0;
            pointer-events: none;
          }
          .focus-mode .navbar-minimal {
            transform: translateY(-100%);
          }
          .focus-mode .navbar-minimal:hover {
            transform: translateY(0);
          }
          .focus-mode {
            background: hsl(var(--background));
          }
          `
        }
      </style>
      
      <div className={`transition-transform duration-300 navbar-minimal ${isFocusMode ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
        <Navbar />
      </div>
      
      <main className="flex-1 py-16 mt-10">
        <div className="container px-4 mx-auto">
          <div className={`mb-8 text-center transition-opacity duration-300 ${isFocusMode ? 'hide-in-focus' : ''}`}>
            <h1 className="text-3xl font-bold mb-2">
              Focus Timer
            </h1>
            <p className="text-muted-foreground">
              Stay focused and get more done with the pomodoro technique
            </p>
            {streak > 0 && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                🔥 {streak} Session{streak > 1 ? 's' : ''} Streak
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Tasks */}
            <div className={`lg:col-span-4 order-2 lg:order-1 transition-opacity duration-300 ${isFocusMode ? 'hide-in-focus' : ''}`}>
              <div className="sticky top-24 space-y-6">
                <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Study Tasks</h2>
                    <Tasks />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Middle Column - Timer */}
            <div className="lg:col-span-4 order-1 lg:order-2">
              <div className="sticky top-24">
                <Card className="border-none shadow-lg bg-card/50 backdrop-blur relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 pointer-events-none" />
                  <CardContent className="p-6">
                    <div className="text-center space-y-8">
                      <div className="flex justify-between items-center mb-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Settings2 className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Focus Duration: {focusDuration} minutes</Label>
                                <Slider
                                  value={[focusDuration]}
                                  onValueChange={([value]) => {
                                    setFocusDuration(value);
                                    if (!isRunning && !isBreak) {
                                      setTime(value * 60);
                                    }
                                  }}
                                  min={5}
                                  max={60}
                                  step={5}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Break Duration: {breakDuration} minutes</Label>
                                <Slider
                                  value={[breakDuration]}
                                  onValueChange={([value]) => {
                                    setBreakDuration(value);
                                    if (!isRunning && isBreak) {
                                      setTime(value * 60);
                                    }
                                  }}
                                  min={1}
                                  max={15}
                                  step={1}
                                />
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        <div className="flex items-center gap-2">
                          <Label htmlFor="focus-mode">Focus Mode</Label>
                          <Switch
                            id="focus-mode"
                            checked={isFocusMode}
                            onCheckedChange={setIsFocusMode}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl font-medium">
                          {isBreak ? "Break Time!" : "Focus Time"}
                        </h2>
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />
                          <p className="text-8xl font-bold tracking-tighter relative">
                            {formatTime(time)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center gap-4">
                        <Button
                          size="lg"
                          variant={isRunning ? "destructive" : "default"}
                          onClick={toggleTimer}
                          className="w-32 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          {isRunning ? (
                            <>
                              <Pause className="mr-2 h-5 w-5" /> Pause
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-5 w-5" /> Start
                            </>
                          )}
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={resetTimer}
                          className="w-32 shadow hover:shadow-lg transition-all duration-200"
                        >
                          <RotateCcw className="mr-2 h-5 w-5" /> Reset
                        </Button>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Press <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> to {isRunning ? 'pause' : 'start'},{' '}
                        <kbd className="px-2 py-1 bg-muted rounded">R</kbd> to reset,{' '}
                        <kbd className="px-2 py-1 bg-muted rounded">Ctrl+F</kbd> for focus mode
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Music Player */}
            <div className={`lg:col-span-4 order-3 transition-opacity duration-300 ${isFocusMode ? 'hide-in-focus' : ''}`}>
              <div className="sticky top-24">
                <MusicPlayer />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer className={`transition-opacity duration-300 ${isFocusMode ? 'hide-in-focus' : ''}`} />
    </div>
  );
};

export default Timer;
