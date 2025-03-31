import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import type { Json } from "../types/supabase";

export interface UserPreferences {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  darkMode: string;
  theme: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  created_at: string;
  preferences: UserPreferences;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  preferences: UserPreferences;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  updateProfile?: (data: Partial<UserProfile>) => Promise<void>;
}

const defaultPrefs: UserPreferences = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  soundEnabled: false,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  darkMode: 'light',
  theme: 'default'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPrefs);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Updated preferences mapping function to match the actual database schema
  const mapPreferences = (data: any) => {
    if (!data) return defaultPrefs;
    
    return {
      workDuration: data.study_duration || 25,
      breakDuration: data.break_duration || 5,
      longBreakDuration: data.long_break_duration || 15,
      sessionsBeforeLongBreak: data.sessions_before_long_break || 4,
      soundEnabled: data.sound_enabled || false,
      autoStartBreaks: data.auto_start_breaks || false,
      autoStartPomodoros: data.auto_start_pomodoros || false,
      darkMode: data.dark_mode || 'light',
      // Use data.theme if exists, otherwise keep the default
      theme: defaultPrefs.theme
    };
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setPreferences(defaultPrefs);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        const userProfile: UserProfile = {
          id: data.id,
          name: data.name ?? '',
          avatar: data.avatar ?? '',
          created_at: data.created_at,
          preferences: mapPreferences(data.preferences),
        };

        setProfile(userProfile);
        setPreferences(userProfile.preferences);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    if (!user) {
      throw new Error('You must be logged in to update preferences');
    }

    try {
      // Convert to database format
      const dbPrefs = {
        study_duration: newPrefs.workDuration,
        break_duration: newPrefs.breakDuration,
        long_break_duration: newPrefs.longBreakDuration,
        sessions_before_long_break: newPrefs.sessionsBeforeLongBreak,
        sound_enabled: newPrefs.soundEnabled,
        auto_start_breaks: newPrefs.autoStartBreaks,
        auto_start_pomodoros: newPrefs.autoStartPomodoros,
        dark_mode: newPrefs.darkMode,
        theme: newPrefs.theme
      };

      // Update the profile with new preferences
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          preferences: dbPrefs,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating preferences:', updateError);
        throw new Error('Failed to update preferences: ' + updateError.message);
      }

      // Update local state
      const updatedPrefs = { ...preferences, ...newPrefs };
      setPreferences(updatedPrefs);
      
      if (profile) {
        setProfile({
          ...profile,
          preferences: updatedPrefs
        });
      }

      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (!data.user) {
        throw new Error('Failed to create user account');

      }

      // Convert preferences to database format and ensure proper initialization
      const dbPrefs = {
        preferences: {
          study_duration: defaultPrefs.workDuration,
          break_duration: defaultPrefs.breakDuration,
          long_break_duration: defaultPrefs.longBreakDuration,
          sessions_before_long_break: defaultPrefs.sessionsBeforeLongBreak,
          sound_enabled: defaultPrefs.soundEnabled,
          auto_start_breaks: defaultPrefs.autoStartBreaks,
          auto_start_pomodoros: defaultPrefs.autoStartPomodoros,
          dark_mode: defaultPrefs.darkMode,
          theme: defaultPrefs.theme
        }
      };

      // Create the user profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        full_name: name,
        preferences: dbPrefs,
        avatar_url: '',
        created_at: new Date().toISOString()
      });

      if (profileError) {
        throw new Error('Failed to create user profile: ' + profileError.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('You must be logged in to update profile');
    }

    try {
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current profile:', fetchError);
        throw new Error('Failed to fetch profile');
      }

      // Only update the fields that are provided and match the database schema
      const updates = {
        ...currentProfile,
      };

      // Map the profile fields to database columns
      if (data.name !== undefined) updates.name = data.name;
      if (data.avatar !== undefined) updates.avatar = data.avatar;
      
      // Handle preferences separately to ensure proper typing
      if (data.preferences) {
        updates.preferences = {
          study_duration: data.preferences.workDuration,
          break_duration: data.preferences.breakDuration,
          long_break_duration: data.preferences.longBreakDuration,
          sessions_before_long_break: data.preferences.sessionsBeforeLongBreak,
          sound_enabled: data.preferences.soundEnabled,
          auto_start_breaks: data.preferences.autoStartBreaks,
          auto_start_pomodoros: data.preferences.autoStartPomodoros,
          dark_mode: data.preferences.darkMode,
          theme: data.preferences.theme
        };
      }

      console.log('Updating profile with:', updates);

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...data
        });
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    profile,
    preferences,
    isLoading,
    signIn,
    signUp,
    signOut,
    updatePreferences,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
