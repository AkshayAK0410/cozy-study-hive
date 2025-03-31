
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";

type AuthFormProps = {
  type: "login" | "register";
};

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === "register") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        
        await signUp(email, password, name);
        navigate("/dashboard");
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication error", error);
      // Error toasts are handled in the auth provider
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto transition-all duration-500 shadow-soft animate-fade-in glass-effect">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {type === "login" ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription className="text-center">
          {type === "login"
            ? "Enter your credentials to access your account"
            : "Enter your details to create your account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {type === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}
          
          {type === "login" && (
            <div className="flex items-center justify-end">
              <Button
                variant="link"
                className="px-0 font-normal text-xs text-muted-foreground hover:text-primary"
                type="button"
              >
                Forgot password?
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              <>{type === "login" ? "Login" : "Create account"}</>
            )}
          </Button>
          
          <div className="mt-4 text-center text-sm">
            {type === "login" ? (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 font-semibold text-primary hover:text-primary/80"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </Button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 font-semibold text-primary hover:text-primary/80"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
              </p>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
