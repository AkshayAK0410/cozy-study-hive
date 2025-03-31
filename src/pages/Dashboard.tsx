import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FocusSounds from "@/components/FocusSounds";
import SessionHistory from "@/components/SessionHistory";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tasks } from "@/components/Tasks";

const Dashboard = () => {
  const { user, profile, isLoading } = useRequireAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

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

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 mt-10">
        <div className="container px-4 mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.name || 'User'}!</h1>
            <p className="text-muted-foreground">Here's your study dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tasks Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <Tasks />
              </CardContent>
            </Card>

            {/* Focus Sounds Section */}
            <Card>
              <CardHeader>
                <CardTitle>Focus Sounds</CardTitle>
              </CardHeader>
              <CardContent>
                <FocusSounds />
              </CardContent>
            </Card>

            {/* Session History */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Study Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <SessionHistory />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
