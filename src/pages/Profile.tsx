
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, UserCircle, Save, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading } = useRequireAuth();
  const { profile, preferences, updateProfile, updatePreferences, signOut } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Preferences states
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      setWorkDuration(preferences.workDuration);
      setBreakDuration(preferences.breakDuration);
      setLongBreakDuration(preferences.longBreakDuration);
      setSessionsBeforeLongBreak(preferences.sessionsBeforeLongBreak);
      setSoundEnabled(preferences.soundEnabled);
      setAutoStartBreaks(preferences.autoStartBreaks);
      setAutoStartPomodoros(preferences.autoStartPomodoros);
      setDarkMode(preferences.darkMode);
    }
  }, [preferences]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Simple validation
      if (!name.trim()) {
        toast.error("Name cannot be empty");
        setIsSaving(false);
        return;
      }
      
      await updateProfile({ name });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate inputs
      if (workDuration < 1 || breakDuration < 1 || longBreakDuration < 1 || sessionsBeforeLongBreak < 1) {
        toast.error("All duration values must be at least 1");
        setIsSaving(false);
        return;
      }
      
      await updatePreferences({
        workDuration,
        breakDuration,
        longBreakDuration,
        sessionsBeforeLongBreak,
        soundEnabled,
        autoStartBreaks,
        autoStartPomodoros,
        darkMode,
      });
    } catch (error) {
      console.error("Error updating preferences", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (authLoading) {
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 mt-10">
        <div className="container max-w-4xl px-4 mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <UserCircle className="mr-2 h-7 w-7" />
            Profile Settings
          </h1>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="profile" className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="shadow-soft animate-fade-in glass-effect">
                <form onSubmit={handleUpdateProfile}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              
              <Card className="mt-6 shadow-soft animate-fade-in glass-effect">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Manage account deletion and other sensitive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Logging out will remove all of your session data from this device.
                  </p>
                  <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout from all devices
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="shadow-soft animate-fade-in glass-effect">
                <form onSubmit={handleUpdatePreferences}>
                  <CardHeader>
                    <CardTitle>Timer Settings</CardTitle>
                    <CardDescription>
                      Customize your pomodoro timer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Timer durations */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="work-duration">Focus Duration (minutes)</Label>
                          <Input
                            id="work-duration"
                            type="number"
                            min="1"
                            max="60"
                            value={workDuration}
                            onChange={(e) => setWorkDuration(parseInt(e.target.value) || 1)}
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="break-duration">Short Break Duration (minutes)</Label>
                          <Input
                            id="break-duration"
                            type="number"
                            min="1"
                            max="30"
                            value={breakDuration}
                            onChange={(e) => setBreakDuration(parseInt(e.target.value) || 1)}
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="long-break-duration">Long Break Duration (minutes)</Label>
                          <Input
                            id="long-break-duration"
                            type="number"
                            min="1"
                            max="60"
                            value={longBreakDuration}
                            onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 1)}
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sessions-before-long-break">Sessions Before Long Break</Label>
                          <Input
                            id="sessions-before-long-break"
                            type="number"
                            min="1"
                            max="10"
                            value={sessionsBeforeLongBreak}
                            onChange={(e) => setSessionsBeforeLongBreak(parseInt(e.target.value) || 1)}
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Toggles */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sound-enabled">Sound Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Play sounds when sessions start and end
                          </p>
                        </div>
                        <Switch
                          id="sound-enabled"
                          checked={soundEnabled}
                          onCheckedChange={setSoundEnabled}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-start-breaks">Auto-start Breaks</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically start breaks when focus sessions end
                          </p>
                        </div>
                        <Switch
                          id="auto-start-breaks"
                          checked={autoStartBreaks}
                          onCheckedChange={setAutoStartBreaks}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-start-pomodoros">Auto-start Pomodoros</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically start focus sessions when breaks end
                          </p>
                        </div>
                        <Switch
                          id="auto-start-pomodoros"
                          checked={autoStartPomodoros}
                          onCheckedChange={setAutoStartPomodoros}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="dark-mode">Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Toggle dark mode for the application
                          </p>
                        </div>
                        <Switch
                          id="dark-mode"
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
