
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { StudySession, calculateStats, formatTime, getSessions } from "@/lib/timer";
import { 
  Calendar,
  Clock,
  TrendingUp,
  Award,
  BarChart2,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const SessionHistory = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [stats, setStats] = useState({
    totalTime: 0,
    totalSessions: 0,
    streakDays: 0,
    averageSessionTime: 0,
  });
  const [tab, setTab] = useState<"chart" | "pie">("chart");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);
    
    // Calculate statistics
    const calculatedStats = calculateStats(loadedSessions);
    setStats(calculatedStats);
  };

  // Format minutes for display
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Prepare data for the bar chart
  const prepareBarChartData = () => {
    // Get last 7 days
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push(date);
    }
    
    // Create data structure for chart
    return last7Days.map(day => {
      const dayStr = day.toLocaleDateString('en-US', { weekday: 'short' });
      const dayMinutes = sessions
        .filter(s => {
          const sessionDate = new Date(s.date);
          return sessionDate.toDateString() === day.toDateString() && s.mode === 'work';
        })
        .reduce((sum, session) => sum + (session.duration / 60), 0);
      
      return {
        day: dayStr,
        minutes: Math.round(dayMinutes),
        date: day.toISOString(),
      };
    });
  };

  // Prepare data for pie chart (study session types)
  const preparePieChartData = () => {
    const workSessions = sessions.filter(s => s.mode === 'work').length;
    const breakSessions = sessions.filter(s => s.mode === 'break').length;
    const longBreakSessions = sessions.filter(s => s.mode === 'longBreak').length;
    
    return [
      { name: 'Focus', value: workSessions, color: '#3B82F6' },
      { name: 'Break', value: breakSessions, color: '#10B981' },
      { name: 'Long Break', value: longBreakSessions, color: '#8B5CF6' },
    ].filter(item => item.value > 0);
  };

  const barChartData = prepareBarChartData();
  const pieChartData = preparePieChartData();

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{`Study time: ${formatMinutes(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-xs text-muted-foreground">{`${Math.round(payload[0].percent * 100)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full shadow-soft glass-effect">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Study Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>No study sessions recorded yet.</p>
            <p className="text-sm mt-2">
              Complete your first pomodoro session to see statistics.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-accent/30 rounded-lg p-3 flex flex-col items-center justify-center text-center">
                <Clock className="h-5 w-5 mb-1 text-primary" />
                <div className="text-xs text-muted-foreground">Total Focus Time</div>
                <div className="font-medium">{formatMinutes(Math.round(stats.totalTime / 60))}</div>
              </div>
              
              <div className="bg-accent/30 rounded-lg p-3 flex flex-col items-center justify-center text-center">
                <TrendingUp className="h-5 w-5 mb-1 text-primary" />
                <div className="text-xs text-muted-foreground">Completed Sessions</div>
                <div className="font-medium">{stats.totalSessions}</div>
              </div>
              
              <div className="bg-accent/30 rounded-lg p-3 flex flex-col items-center justify-center text-center">
                <Award className="h-5 w-5 mb-1 text-primary" />
                <div className="text-xs text-muted-foreground">Day Streak</div>
                <div className="font-medium">{stats.streakDays} days</div>
              </div>
              
              <div className="bg-accent/30 rounded-lg p-3 flex flex-col items-center justify-center text-center">
                <Clock className="h-5 w-5 mb-1 text-primary" />
                <div className="text-xs text-muted-foreground">Avg. Session</div>
                <div className="font-medium">{formatMinutes(Math.round(stats.averageSessionTime / 60))}</div>
              </div>
            </div>
            
            {/* Charts */}
            <Tabs value={tab} onValueChange={(value) => setTab(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="chart" className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Weekly Activity
                </TabsTrigger>
                <TabsTrigger value="pie" className="flex items-center">
                  <PieChartIcon className="h-4 w-4 mr-2" />
                  Session Types
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => value === 0 ? '0' : `${value}m`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar 
                      dataKey="minutes" 
                      radius={[4, 4, 0, 0]}
                    >
                      {barChartData.map((entry, index) => {
                        const isToday = new Date(entry.date).toDateString() === new Date().toDateString();
                        return (
                          <Cell 
                            key={`cell-${index}`}
                            fill={isToday ? 'hsl(var(--focus-blue))' : 'hsl(var(--primary))'}
                            opacity={isToday ? 1 : 0.7}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="pie" className="h-64">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p>Not enough data for visualization</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
