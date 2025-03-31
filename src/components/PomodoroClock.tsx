import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipForward, 
  Timer, 
  Settings, 
  RefreshCw, 
  Coffee, 
  CheckCircle 
} from "lucide-react";
import { UserPreferences, defaultUserPreferences } from "@/lib/auth";
import { TimerMode, formatTime, playSound, saveSession } from "@/lib/timer";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface PomodoroClockProps {
  preferences?: UserPreferences;
  onUpdatePreferences?: (prefs: Partial<UserPreferences>) => void;
  currentTask?: { id: string; title: string } | null;
  onCompleteSession?: (session: { duration: number; mode: TimerMode }) => void;
}

const PomodoroClock = ({ 
  preferences = defaultUserPreferences,
  onUpdatePreferences,
  currentTask,
  onCompleteSession
}: PomodoroClockProps) => {
  // Ensure valid values from preferences to prevent NaN
  const workDuration = preferences?.workDuration && !isNaN(preferences.workDuration) 
    ? preferences.workDuration : defaultUserPreferences.workDuration;
  const breakDuration = preferences?.breakDuration && !isNaN(preferences.breakDuration) 
    ? preferences.breakDuration : defaultUserPreferences.breakDuration;
  const longBreakDuration = preferences?.longBreakDuration && !isNaN(preferences.longBreakDuration)
    ? preferences.longBreakDuration : defaultUserPreferences.longBreakDuration;
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(workDuration * 60);
  const [initialTime, setInitialTime] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Update timer when preferences change
  useEffect(() => {
    const duration = mode === "work" 
      ? workDuration 
      : mode === "break" 
        ? breakDuration 
        : longBreakDuration;
    
    // Make sure we have a valid duration
    const validDuration = (!isNaN(duration) && duration > 0) ? duration : 
      (mode === "work" ? 25 : mode === "break" ? 5 : 15);
    
    setInitialTime(validDuration * 60);
    
    // Only reset the current time if the timer isn't running
    if (!isRunning) {
      setTimeRemaining(validDuration * 60);
    }
  }, [preferences, workDuration, breakDuration, longBreakDuration, mode]);
  
  // Settings form state
  const [workMinutes, setWorkMinutes] = useState(workDuration);
  const [breakMinutes, setBreakMinutes] = useState(breakDuration);
  const [longBreakMinutes, setLongBreakMinutes] = useState(longBreakDuration);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(
    preferences.sessionsBeforeLongBreak || 4
  );
  const [soundEnabled, setSoundEnabled] = useState(preferences.soundEnabled);
  const [autoStartBreaks, setAutoStartBreaks] = useState(preferences.autoStartBreaks);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(preferences.autoStartPomodoros);
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Progress calculation
  const progress = (initialTime - timeRemaining) / initialTime;
  const progressPercent = progress * 100;

  // Initialize audio (would be properly implemented in a real app)
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle timer ticking
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Handle timer completion
  const handleTimerComplete = () => {
    if (preferences.soundEnabled) {
      playSound("finish");
    }

    // Save completed session
    const session = {
      id: `session-${Date.now()}`,
      date: new Date(),
      duration: initialTime,
      mode: mode,
      taskId: currentTask?.id,
    };
    
    saveSession(session);
    
    if (onCompleteSession) {
      onCompleteSession({
        duration: initialTime,
        mode: mode
      });
    }

    // Determine next session type
    if (mode === "work") {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      // Check if it's time for a long break
      if (newCompletedSessions % preferences.sessionsBeforeLongBreak === 0) {
        switchMode("longBreak");
        toast.success("Long break time! Take a good rest.", {
          duration: 5000,
        });
      } else {
        switchMode("break");
        toast.success("Break time! Take a short rest.", {
          duration: 5000,
        });
      }
      
      // Auto-start breaks if enabled
      if (preferences.autoStartBreaks) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    } else {
      // After a break, switch back to work mode
      switchMode("work");
      toast.success("Break complete! Ready to focus again?", {
        duration: 5000,
      });
      
      // Auto-start pomodoros if enabled
      if (preferences.autoStartPomodoros) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    }
  };

  // Switch between pomodoro, short break, and long break
  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    let newTime;
    
    switch (newMode) {
      case "work":
        newTime = workDuration * 60;
        break;
      case "break":
        newTime = breakDuration * 60;
        break;
      case "longBreak":
        newTime = longBreakDuration * 60;
        break;
      default:
        newTime = workDuration * 60;
    }
    
    setTimeRemaining(newTime);
    setInitialTime(newTime);
    if (preferences.soundEnabled) {
      playSound("start");
    }
  };

  // Start/pause the timer
  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
      if (preferences.soundEnabled) {
        playSound("start");
      }
    }
  };

  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(initialTime);
  };

  // Skip to the next mode
  const skipToNextMode = () => {
    setIsRunning(false);
    if (mode === "work") {
      if ((completedSessions + 1) % preferences.sessionsBeforeLongBreak === 0) {
        switchMode("longBreak");
      } else {
        switchMode("break");
      }
    } else {
      switchMode("work");
    }
  };

  // Handle settings submission
  const saveSettings = () => {
    const newPreferences = {
      workDuration: workMinutes,
      breakDuration: breakMinutes,
      longBreakDuration: longBreakMinutes,
      sessionsBeforeLongBreak: sessionsBeforeLongBreak,
      soundEnabled: soundEnabled,
      autoStartBreaks: autoStartBreaks,
      autoStartPomodoros: autoStartPomodoros,
    };
    
    if (onUpdatePreferences) {
      onUpdatePreferences(newPreferences);
    }
    
    // Update current timer if needed
    if (mode === "work") {
      setInitialTime(workMinutes * 60);
      setTimeRemaining(workMinutes * 60);
    } else if (mode === "break") {
      setInitialTime(breakMinutes * 60);
      setTimeRemaining(breakMinutes * 60);
    } else if (mode === "longBreak") {
      setInitialTime(longBreakMinutes * 60);
      setTimeRemaining(longBreakMinutes * 60);
    }
    
    setShowSettings(false);
    toast.success("Settings updated successfully");
  };

  // Get the current theme for the timer UI
  const getTimerTheme = () => {
    switch (mode) {
      case "work":
        return {
          bg: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
          border: "border-blue-400/30",
          text: "text-blue-700 dark:text-blue-300",
          progress: "stroke-blue-500",
          trail: "stroke-blue-100 dark:stroke-blue-900",
          icon: <Timer className="h-6 w-6" />,
          label: "Focus Time"
        };
      case "break":
        return {
          bg: "bg-gradient-to-br from-green-500/10 to-teal-500/10",
          border: "border-green-400/30",
          text: "text-green-700 dark:text-green-300",
          progress: "stroke-green-500",
          trail: "stroke-green-100 dark:stroke-green-900",
          icon: <Coffee className="h-6 w-6" />,
          label: "Short Break"
        };
      case "longBreak":
        return {
          bg: "bg-gradient-to-br from-purple-500/10 to-indigo-500/10",
          border: "border-purple-400/30",
          text: "text-purple-700 dark:text-purple-300",
          progress: "stroke-purple-500",
          trail: "stroke-purple-100 dark:stroke-purple-900",
          icon: <Coffee className="h-6 w-6" />,
          label: "Long Break"
        };
      default:
        return {
          bg: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
          border: "border-blue-400/30",
          text: "text-blue-700 dark:text-blue-300",
          progress: "stroke-blue-500",
          trail: "stroke-blue-100 dark:stroke-blue-900",
          icon: <Timer className="h-6 w-6" />,
          label: "Focus Time"
        };
    }
  };

  const theme = getTimerTheme();
  
  return (
    <div className="flex flex-col items-center">
      {/* Timer Card */}
      <div className={`relative rounded-2xl ${theme.bg} border ${theme.border} shadow-soft p-8 w-full max-w-md mx-auto mb-8 transition-all duration-500 glass-effect`}>
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="hover:bg-white/10"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          {theme.icon}
          <h2 className="text-lg font-medium">{theme.label}</h2>
        </div>
        
        {currentTask && (
          <div className="mb-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">Current Task</div>
            <div className="font-medium truncate">{currentTask.title}</div>
          </div>
        )}
        
        <div className="timer-container">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
              className={theme.trail}
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${
                2 * Math.PI * 45 * (1 - progress)
              }`}
              className={`timer-progress ${theme.progress}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="timer-text">
            <div className={`text-4xl font-medium ${theme.text}`}>
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {completedSessions} sessions completed
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center space-x-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="rounded-full h-10 w-10 transition-transform hover:scale-105"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            size="lg"
            onClick={toggleTimer}
            className={`rounded-full transition-transform hover:scale-105 ${
              isRunning 
                ? "bg-muted hover:bg-muted/80" 
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isRunning ? (
              <Pause className="h-5 w-5 mr-1" />
            ) : (
              <Play className="h-5 w-5 mr-1" />
            )}
            {isRunning ? "Pause" : "Start"}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={skipToNextMode}
            className="rounded-full h-10 w-10 transition-transform hover:scale-105"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-center mt-4">
          <div className="flex space-x-3">
            <Button
              variant={mode === "work" ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode("work")}
              className="rounded-full text-xs px-3"
            >
              Focus
            </Button>
            <Button
              variant={mode === "break" ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode("break")}
              className="rounded-full text-xs px-3"
            >
              Break
            </Button>
            <Button
              variant={mode === "longBreak" ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode("longBreak")}
              className="rounded-full text-xs px-3"
            >
              Long Break
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-6">
        <div className="bg-background border border-border rounded-lg p-4 text-center shadow-soft">
          <div className="text-muted-foreground text-xs mb-1">Focus</div>
          <div className="text-lg font-medium">{preferences.workDuration}:00</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 text-center shadow-soft">
          <div className="text-muted-foreground text-xs mb-1">Sessions</div>
          <div className="text-lg font-medium">{completedSessions}</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 text-center shadow-soft">
          <div className="text-muted-foreground text-xs mb-1">Goal</div>
          <div className="text-lg font-medium">{preferences.sessionsBeforeLongBreak}</div>
        </div>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Timer Settings</DialogTitle>
            <DialogDescription>
              Customize your Pomodoro timer to match your work style.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workMinutes">Focus Duration (minutes)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="workMinutes"
                    min={1}
                    max={60}
                    step={1}
                    value={[workMinutes]}
                    onValueChange={(value) => setWorkMinutes(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={workMinutes}
                    onChange={(e) => setWorkMinutes(parseInt(e.target.value) || 1)}
                    min={1}
                    max={60}
                    className="w-16"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="breakMinutes">Short Break Duration (minutes)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="breakMinutes"
                    min={1}
                    max={30}
                    step={1}
                    value={[breakMinutes]}
                    onValueChange={(value) => setBreakMinutes(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(parseInt(e.target.value) || 1)}
                    min={1}
                    max={30}
                    className="w-16"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longBreakMinutes">Long Break Duration (minutes)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="longBreakMinutes"
                    min={1}
                    max={60}
                    step={1}
                    value={[longBreakMinutes]}
                    onValueChange={(value) => setLongBreakMinutes(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={longBreakMinutes}
                    onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 1)}
                    min={1}
                    max={60}
                    className="w-16"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionsBeforeLongBreak">Sessions Before Long Break</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="sessionsBeforeLongBreak"
                    min={1}
                    max={10}
                    step={1}
                    value={[sessionsBeforeLongBreak]}
                    onValueChange={(value) => setSessionsBeforeLongBreak(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={sessionsBeforeLongBreak}
                    onChange={(e) => setSessionsBeforeLongBreak(parseInt(e.target.value) || 1)}
                    min={1}
                    max={10}
                    className="w-16"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="soundEnabled" className="cursor-pointer">
                  Sound Notifications
                </Label>
                <Switch
                  id="soundEnabled"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoStartBreaks" className="cursor-pointer">
                  Auto-start Breaks
                </Label>
                <Switch
                  id="autoStartBreaks"
                  checked={autoStartBreaks}
                  onCheckedChange={setAutoStartBreaks}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoStartPomodoros" className="cursor-pointer">
                  Auto-start Pomodoros
                </Label>
                <Switch
                  id="autoStartPomodoros"
                  checked={autoStartPomodoros}
                  onCheckedChange={setAutoStartPomodoros}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={saveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PomodoroClock;
