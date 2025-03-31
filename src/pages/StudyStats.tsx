
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Clock, Calendar, BarChart2, Target, TrendingUp, Award } from "lucide-react";
import { StudySession, Task, getTasks, getSessions, calculateStats } from "@/lib/timer";

const todayDate = new Date();
const startDate = new Date(todayDate.getFullYear(), todayDate.getMonth() - 3, 1);

const StudyStats = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    totalTime: 0,
    totalSessions: 0,
    streakDays: 0,
    averageSessionTime: 0
  });

  useEffect(() => {
    // Load sessions and tasks
    const loadedSessions = getSessions();
    const loadedTasks = getTasks();
    
    setSessions(loadedSessions);
    setTasks(loadedTasks);
    
    // Calculate stats
    setStats(calculateStats(loadedSessions));
  }, []);

  // Prepare data for charts
  const prepareWeeklyData = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const data = days.map(day => ({ name: day, sessions: 0, minutes: 0 }));
    
    sessions.forEach(session => {
      const date = new Date(session.date);
      const dayOfWeek = date.getDay();
      data[dayOfWeek].sessions += 1;
      data[dayOfWeek].minutes += Math.round(session.duration / 60);
    });
    
    return data;
  };
  
  const prepareCategoryData = () => {
    // Create a map of task categories
    const categoryMap = new Map();
    
    // Go through all sessions with taskIds
    sessions.forEach(session => {
      if (session.taskId) {
        const task = tasks.find(t => t.id === session.taskId);
        if (task && task.tags && task.tags.length > 0) {
          // Use the first tag as category
          const category = task.tags[0];
          const currentMinutes = categoryMap.get(category) || 0;
          categoryMap.set(category, currentMinutes + Math.round(session.duration / 60));
        }
      }
    });
    
    // Convert map to array for chart
    return Array.from(categoryMap, ([name, minutes]) => ({ name, minutes }));
  };
  
  const prepareHeatmapData = () => {
    const heatmapData = [];
    const dateMap = new Map();
    
    // Group session minutes by date
    sessions.forEach(session => {
      const date = new Date(session.date).toISOString().split('T')[0];
      const currentMinutes = dateMap.get(date) || 0;
      dateMap.set(date, currentMinutes + Math.round(session.duration / 60));
    });
    
    // Create continuous date range for heatmap
    let currentDate = new Date(startDate);
    while (currentDate <= todayDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      heatmapData.push({
        date: dateStr,
        count: dateMap.get(dateStr) || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return heatmapData;
  };

  const weeklyData = prepareWeeklyData();
  const categoryData = prepareCategoryData();
  const heatmapData = prepareHeatmapData();

  // Color scales for charts
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-16 mt-10">
        <div className="container px-4 mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Study Statistics</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your progress and analyze your study patterns to optimize your productivity.
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-soft glass-effect hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  Total Study Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(stats.totalTime / 3600)} hrs {Math.floor((stats.totalTime % 3600) / 60)} mins
                </div>
                <p className="text-xs text-muted-foreground">Across all your sessions</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft glass-effect hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Target className="mr-2 h-4 w-4 text-green-500" />
                  Total Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <p className="text-xs text-muted-foreground">Pomodoro sessions completed</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft glass-effect hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-purple-500" />
                  Avg. Session Length
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(stats.averageSessionTime / 60)} mins
                </div>
                <p className="text-xs text-muted-foreground">Average focus time per session</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft glass-effect hover-scale">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Award className="mr-2 h-4 w-4 text-amber-500" />
                  Day Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.streakDays}</div>
                <p className="text-xs text-muted-foreground">Days with study activity</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="weekly">Weekly Activity</TabsTrigger>
              <TabsTrigger value="heatmap">Activity Heatmap</TabsTrigger>
              <TabsTrigger value="categories">By Category</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="animate-fade-in">
              <Card className="shadow-soft glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5" />
                    Weekly Study Distribution
                  </CardTitle>
                  <CardDescription>
                    See which days of the week you're most productive
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Sessions', angle: 90, position: 'insideRight' }} />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="minutes" fill="#8884d8" name="Minutes" />
                        <Bar yAxisId="right" dataKey="sessions" fill="#82ca9d" name="Sessions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="heatmap" className="animate-fade-in">
              <Card className="shadow-soft glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Activity Heatmap
                  </CardTitle>
                  <CardDescription>
                    Your study intensity over the past months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="px-4 py-10 rounded-lg">
                    <style>
                      {`.react-calendar-heatmap text {
                        font-size: 8px;
                        fill: #aaa;
                      }
                      .react-calendar-heatmap .color-scale-1 { fill: #d6e9ff; }
                      .react-calendar-heatmap .color-scale-2 { fill: #b3d4ff; }
                      .react-calendar-heatmap .color-scale-3 { fill: #80b7ff; }
                      .react-calendar-heatmap .color-scale-4 { fill: #4d9aff; }
                      .react-calendar-heatmap .color-scale-5 { fill: #1a7dff; }
                      .react-calendar-heatmap .color-scale-6 { fill: #0066e5; }
                      .react-calendar-heatmap .color-scale-7 { fill: #0055cc; }
                      .react-calendar-heatmap .color-scale-8 { fill: #0044a3; }`}
                    </style>
                    <CalendarHeatmap
                      startDate={startDate}
                      endDate={todayDate}
                      values={heatmapData}
                      classForValue={(value) => {
                        if (!value || value.count === 0) {
                          return 'color-empty';
                        }
                        let scale = Math.min(Math.floor(value.count / 15) + 1, 8);
                        return `color-scale-${scale}`;
                      }}
                      tooltipDataAttrs={(value) => {
                        if (!value || !value.date) return { 'data-tip': 'No study activity' };
                        return {
                          'data-tip': `${value.date}: ${value.count} minutes of study`,
                        };
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories" className="animate-fade-in">
              <Card className="shadow-soft glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Study by Category
                  </CardTitle>
                  <CardDescription>
                    How you distribute your focus across different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="minutes"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} minutes`, 'Study Time']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-muted-foreground">
                      No category data available. Try assigning categories to your tasks.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudyStats;
