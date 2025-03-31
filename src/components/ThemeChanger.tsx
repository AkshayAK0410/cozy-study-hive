
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Palette, Check, Moon, Sun, Monitor } from "lucide-react";

interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  primaryColorHSL: string;
  secondaryColor: string;
  secondaryColorHSL: string;
}

const themes: Theme[] = [
  { 
    id: "default", 
    name: "Default Blue", 
    primaryColor: "hsl(222.2 47.4% 11.2%)", 
    primaryColorHSL: "222.2 47.4% 11.2%",
    secondaryColor: "hsl(210 40% 96.1%)",
    secondaryColorHSL: "210 40% 96.1%" 
  },
  { 
    id: "purple", 
    name: "Purple Dream", 
    primaryColor: "hsl(262 83% 58%)", 
    primaryColorHSL: "262 83% 58%",
    secondaryColor: "hsl(263 85% 95%)",
    secondaryColorHSL: "263 85% 95%" 
  },
  { 
    id: "green", 
    name: "Green Focus", 
    primaryColor: "hsl(142 76% 36%)", 
    primaryColorHSL: "142 76% 36%",
    secondaryColor: "hsl(142 72% 95%)",
    secondaryColorHSL: "142 72% 95%" 
  },
  { 
    id: "amber", 
    name: "Amber Warmth", 
    primaryColor: "hsl(25 95% 53%)", 
    primaryColorHSL: "25 95% 53%",
    secondaryColor: "hsl(25 100% 97%)",
    secondaryColorHSL: "25 100% 97%" 
  },
  { 
    id: "sky", 
    name: "Sky Blue", 
    primaryColor: "hsl(198 93% 60%)", 
    primaryColorHSL: "198 93% 60%",
    secondaryColor: "hsl(199 89% 97%)",
    secondaryColorHSL: "199 89% 97%" 
  },
  { 
    id: "rose", 
    name: "Rose Garden", 
    primaryColor: "hsl(346 77% 49%)", 
    primaryColorHSL: "346 77% 49%",
    secondaryColor: "hsl(346 100% 97%)",
    secondaryColorHSL: "346 100% 97%" 
  }
];

const ThemeChanger = () => {
  const [theme, setTheme] = useState<string>("default");
  const [mode, setMode] = useState<"light" | "dark" | "system">("light");
  const [isOpen, setIsOpen] = useState(false);
  
  // Function to update CSS variables for theme colors
  const applyTheme = (themeId: string) => {
    const selectedTheme = themes.find(t => t.id === themeId);
    if (!selectedTheme) return;
    
    document.documentElement.style.setProperty("--primary", selectedTheme.primaryColorHSL);
    document.documentElement.style.setProperty("--secondary", selectedTheme.secondaryColorHSL);
    
    localStorage.setItem("user-theme", themeId);
  };
  
  // Function to apply dark/light mode
  const applyMode = (newMode: "light" | "dark" | "system") => {
    const root = document.documentElement;
    
    if (newMode === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.toggle("dark", systemPreference === "dark");
    } else {
      root.classList.toggle("dark", newMode === "dark");
    }
    
    localStorage.setItem("user-mode", newMode);
  };
  
  // Initialize theme and mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("user-theme") || "default";
    const savedMode = localStorage.getItem("user-mode") as "light" | "dark" | "system" || "light";
    
    setTheme(savedTheme);
    setMode(savedMode);
    
    applyTheme(savedTheme);
    applyMode(savedMode);
    
    // Listen for system preference changes if in system mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (savedMode === "system") {
        applyMode("system");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  
  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    applyTheme(themeId);
  };
  
  const handleModeChange = (newMode: "light" | "dark" | "system") => {
    setMode(newMode);
    applyMode(newMode);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Change theme">
          <Palette className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Appearance</h4>
            <Tabs defaultValue={mode} value={mode} onValueChange={(value) => handleModeChange(value as "light" | "dark" | "system")}>
              <TabsList className="grid grid-cols-3 h-8">
                <TabsTrigger value="light" className="h-7 text-xs">
                  <Sun className="h-3.5 w-3.5 mr-1" />
                  Light
                </TabsTrigger>
                <TabsTrigger value="dark" className="h-7 text-xs">
                  <Moon className="h-3.5 w-3.5 mr-1" />
                  Dark
                </TabsTrigger>
                <TabsTrigger value="system" className="h-7 text-xs">
                  <Monitor className="h-3.5 w-3.5 mr-1" />
                  System
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Color Theme</h4>
            <RadioGroup value={theme} onValueChange={handleThemeChange} className="grid grid-cols-3 gap-2">
              {themes.map((themeOption) => (
                <div key={themeOption.id}>
                  <RadioGroupItem
                    value={themeOption.id}
                    id={`theme-${themeOption.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`theme-${themeOption.id}`}
                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
                  >
                    <div 
                      className="w-full h-10 rounded-md mb-2"
                      style={{ 
                        background: `linear-gradient(to right, ${themeOption.primaryColor}, ${themeOption.secondaryColor})` 
                      }}
                    />
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs">{themeOption.name}</span>
                      {theme === themeOption.id && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeChanger;
