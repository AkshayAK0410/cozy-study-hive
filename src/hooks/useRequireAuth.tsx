
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthProvider";

export function useRequireAuth(redirectUrl = "/login") {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(redirectUrl);
    }
  }, [user, isLoading, navigate, redirectUrl]);

  return { user, profile, isLoading };
}
