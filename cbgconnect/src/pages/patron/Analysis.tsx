// src/pages/patron/Analysis.tsx
import { 
  TrendingUp, 
  Users, 
  Home, 
  Activity,
  Calendar,
  Download,
  Filter,
  Shield,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PatronAnalysis() {
  const occupancyData = [
    { month: 'Jan', Oak: 78, Pine: 72, Cedar: 85, Average: 78 },
    { month: 'Feb', Oak: 80, Pine: 75, Cedar: 83, Average: 79 },
    { month: 'Mar', Oak: 82, Pine: 78, Cedar: 80, Average: 80 },
    { month: 'Apr', Oak: 85, Pine: 80, Cedar: 78, Average: 81 },
    { month: 'May', Oak: 83, Pine: 82, Cedar: 76, Average: 80 },
    { month: 'Jun', Oak: 80, Pine: 85, Cedar: 75, Average: 80 },
  ];

  const studentTypeData = [
    { name: 'Internal', value: 78, color: '#3b82f6' },
    { name: 'External', value: 64, color: '#10b981' },
  ];

  const activityParticipation = [
    { name: 'Sports', participants: 38, capacity: 50 },
    { name: 'Cultural', participants: 25, capacity: 40 },
    { name: 'Academic', participants: 45, capacity: 60 },
    { name: 'Others', participants: 20, capacity: 30 },
  ];

  const disciplinaryData = [
    { month: 'Jan', incidents: 3, warnings: 5 },
    { month: 'Feb', incidents: 2, warnings: 4 },
    { month: 'Mar', incidents: 4, warnings: 6 },
    { month: 'Apr', incidents: 1, warnings: 3 },
    { month: 'May', incidents: 2, warnings: 4 },
    { month: 'Jun', incidents: 0, warnings: 2 },
  ];

  const dormitoryStats = [
    { name: 'Oak Hall', capacity: 30, occupied: 24, available: 6 },
    { name: 'Pine Wing', capacity: 20, occupied: 16, available: 4 },
    { name: 'Cedar Block', capacity: 25, occupied: 20, available: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground">Comprehensive analysis of boys dormitory and disciplinary data</p>
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
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +1.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disciplinary Incidents</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">This month (down 25%)</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Participation</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">71%</div>
            <p className="text-xs text-muted-foreground">Average participation rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Distribution</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">78 internal, 64 external</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="occupancy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="occupancy">Dormitory Occupancy</TabsTrigger>
          <TabsTrigger value="disciplinary">Disciplinary Trends</TabsTrigger>
          <TabsTrigger value="students">Student Analysis</TabsTrigger>
          <TabsTrigger value="activities">Activity Analysis</TabsTrigger>
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
                    <Line type="monotone" dataKey="Oak" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Pine" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Cedar" stroke="#8b5cf6" strokeWidth={2} />
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

        <TabsContent value="disciplinary" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Disciplinary Trends</CardTitle>
                <CardDescription>Monthly incidents and warnings</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={disciplinaryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incidents" fill="#ef4444" name="Major Incidents" />
                    <Bar dataKey="warnings" fill="#f59e0b" name="Warnings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Disciplinary by Grade</CardTitle>
                <CardDescription>Incidents distributed by grade level</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Grade 9', value: 12, color: '#3b82f6' },
                        { name: 'Grade 10', value: 18, color: '#10b981' },
                        { name: 'Grade 11', value: 15, color: '#8b5cf6' },
                        { name: 'Grade 12', value: 8, color: '#f59e0b' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Grade 9', value: 12, color: '#3b82f6' },
                        { name: 'Grade 10', value: 18, color: '#10b981' },
                        { name: 'Grade 11', value: 15, color: '#8b5cf6' },
                        { name: 'Grade 12', value: 8, color: '#f59e0b' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
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
                    { grade: 'Grade 9', internal: 18, external: 12 },
                    { grade: 'Grade 10', internal: 20, external: 16 },
                    { grade: 'Grade 11', internal: 22, external: 20 },
                    { grade: 'Grade 12', internal: 18, external: 16 },
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
                <Shield className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Disciplinary Improvement</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Disciplinary incidents decreased by 25% this month. Continue current supervision strategies.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Occupancy Management</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Cedar Block has lower occupancy. Consider moving some boys from Oak Hall for better distribution.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Activity Engagement</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Grade 10 has lowest activity participation. Consider targeted engagement programs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}