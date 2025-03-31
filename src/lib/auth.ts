
import { toast } from "sonner";

// Interface for user and auth state
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  darkMode: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Default user preferences
export const defaultUserPreferences: UserPreferences = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  soundEnabled: true,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  darkMode: false,
};

// Mock auth functions for initial development
// These will be replaced with Supabase integration
export const mockLogin = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "demo@studynook.com" && password === "password") {
        const user: User = {
          id: "user-1",
          email: "demo@studynook.com",
          name: "Demo User",
          avatar: "https://i.pravatar.cc/150?u=demo@studynook.com",
          createdAt: new Date(),
          preferences: defaultUserPreferences,
        };
        localStorage.setItem("studynook_user", JSON.stringify(user));
        toast.success("Logged in successfully!");
        resolve(user);
      } else {
        toast.error("Invalid email or password");
        reject(new Error("Invalid credentials"));
      }
    }, 800);
  });
};

export const mockRegister = (email: string, name: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real app, we would validate and check if user exists
      const user: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        createdAt: new Date(),
        preferences: defaultUserPreferences,
      };
      localStorage.setItem("studynook_user", JSON.stringify(user));
      toast.success("Account created successfully!");
      resolve(user);
    }, 800);
  });
};

export const mockLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem("studynook_user");
      toast.success("Logged out successfully");
      resolve();
    }, 300);
  });
};

export const mockGetCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userJson = localStorage.getItem("studynook_user");
      if (userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          resolve(user);
        } catch (error) {
          console.error("Error parsing user data", error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, 300);
  });
};

export const mockUpdateUser = (user: Partial<User>): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userJson = localStorage.getItem("studynook_user");
      if (userJson) {
        try {
          const currentUser = JSON.parse(userJson) as User;
          const updatedUser = { ...currentUser, ...user };
          localStorage.setItem("studynook_user", JSON.stringify(updatedUser));
          toast.success("Profile updated successfully");
          resolve(updatedUser);
        } catch (error) {
          console.error("Error updating user data", error);
          resolve({} as User);
        }
      } else {
        resolve({} as User);
      }
    }, 500);
  });
};

export const mockUpdatePreferences = (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userJson = localStorage.getItem("studynook_user");
      if (userJson) {
        try {
          const currentUser = JSON.parse(userJson) as User;
          const updatedPreferences = { ...currentUser.preferences, ...preferences };
          const updatedUser = { ...currentUser, preferences: updatedPreferences };
          localStorage.setItem("studynook_user", JSON.stringify(updatedUser));
          toast.success("Preferences updated");
          resolve(updatedPreferences);
        } catch (error) {
          console.error("Error updating preferences", error);
          resolve(defaultUserPreferences);
        }
      } else {
        resolve(defaultUserPreferences);
      }
    }, 500);
  });
};
