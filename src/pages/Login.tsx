
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/lib/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-radial from-accent/40 to-transparent">
        <div className="w-full max-w-md">
          <AuthForm type="login" />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
