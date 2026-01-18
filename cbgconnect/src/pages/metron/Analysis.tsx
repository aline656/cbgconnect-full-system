// src/pages/metron/Analysis.tsx
import { 
  TrendingUp, 
  Users, 
  Home, 
  Activity,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analysis() {
  const occupancyData = [
    { month: 'Jan', Rose: 85, Lily: 78, Jasmine: 92, Average: 85 },
    { month: 'Feb', Rose: 88, Lily: 82, Jasmine: 90, Average: 87 },
    { month: 'Mar', Rose: 90, Lily: 85, Jasmine: 88, Average: 88 },
    { month: 'Apr', Rose: 92, Lily: 88, Jasmine: 85, Average: 88 },
    { month: 'May', Rose: 89, Lily: 90, Jasmine: 87, Average: 89 },
    { month: 'Jun', Rose: 85, Lily: 92, Jasmine: 90, Average: 89 },
  ];

  const studentTypeData = [
    { name: 'Internal', value: 89, color: '#3b82f6' },
    { name: 'External', value: 67, color: '#10b981' },
  ];

  const activityParticipation = [
    { name: 'Sports', participants: 45, capacity: 60 },
    { name: 'Cultural', participants: 38, capacity: 50 },
    { name: 'Academic', participants: 52, capacity: 70 },
    { name: 'Others', participants: 28, capacity: 40 },
  ];

  const dormitoryStats = [
    { name: 'Rose Hall', capacity: 24, occupied: 18, available: 6 },
    { name: 'Lily Wing', capacity: 16, occupied: 12, available: 4 },
    { name: 'Jasmine Block', capacity: 20, occupied: 15, available: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground">Comprehensive analysis of dormitory and student data</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Occupancy Rate</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Participation</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Average participation rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Distribution</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">89 internal, 67 external</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incident Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="occupancy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="occupancy">Dormitory Occupancy</TabsTrigger>
          <TabsTrigger value="students">Student Analysis</TabsTrigger>
          <TabsTrigger value="activities">Activity Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="occupancy" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Occupancy Trends</CardTitle>
                <CardDescription>Monthly occupancy rate by dormitory</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Rose" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Lily" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Jasmine" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Average" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Dormitory Capacity</CardTitle>
                <CardDescription>Current bed utilization</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dormitoryStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="occupied" fill="#3b82f6" name="Occupied Beds" />
                    <Bar dataKey="available" fill="#10b981" name="Available Beds" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Student Type Distribution</CardTitle>
                <CardDescription>Internal vs External students</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {studentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Students by grade level</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { grade: 'Grade 9', internal: 20, external: 15 },
                    { grade: 'Grade 10', internal: 22, external: 18 },
                    { grade: 'Grade 11', internal: 24, external: 20 },
                    { grade: 'Grade 12', internal: 23, external: 14 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="internal" fill="#3b82f6" name="Internal" />
                    <Bar dataKey="external" fill="#10b981" name="External" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Activity Participation</CardTitle>
              <CardDescription>Participation rates across different activity types</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityParticipation}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} participants`, 'Count']} />
                  <Legend />
                  <Bar dataKey="participants" fill="#3b82f6" name="Current Participants" />
                  <Bar dataKey="capacity" fill="#10b981" name="Total Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
          <CardDescription>Automated insights based on current data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">High Occupancy Alert</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Rose Hall is at 92% occupancy. Consider redistributing new internal students to other dormitories.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Activity Engagement</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Academic activities have the highest participation rate (74%). Consider expanding capacity or adding more sessions.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Student Distribution</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Grade 11 has the highest number of internal students. Ensure adequate supervision and resources for this group.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}