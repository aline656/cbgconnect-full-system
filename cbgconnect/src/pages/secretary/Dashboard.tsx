// src/pages/secretary/Dashboard.tsx
import { 
  Users, 
  CreditCard, 
  Calendar, 
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export default function SecretaryDashboard() {
  const stats = {
    totalStudents: 324,
    activeStudents: 298,
    feeCollection: 85,
    pendingFees: 26,
    attendanceRate: 92,
    pendingDocuments: 8
  };

  const recentTransactions = [
    { id: 1, student: 'Sarah Johnson', amount: 500, type: 'Tuition', date: 'Today', status: 'completed' },
    { id: 2, student: 'Michael Chen', amount: 300, type: 'Hostel', date: 'Today', status: 'pending' },
    { id: 3, student: 'Emma Wilson', amount: 200, type: 'Uniform', date: 'Yesterday', status: 'completed' },
    { id: 4, student: 'David Rodriguez', amount: 150, type: 'Exam', date: '2 days ago', status: 'failed' },
  ];

  const pendingTasks = [
    { id: 1, task: 'Process 15 admission forms', priority: 'high', deadline: 'Tomorrow' },
    { id: 2, task: 'Generate monthly fee report', priority: 'medium', deadline: 'This week' },
    { id: 3, task: 'Update student records', priority: 'low', deadline: 'Next week' },
    { id: 4, task: 'Schedule parent meetings', priority: 'medium', deadline: 'Friday' },
  ];

  const upcomingEvents = [
    { id: 1, event: 'Fee Payment Deadline', date: 'Jan 25, 2024', type: 'financial' },
    { id: 2, event: 'Parent-Teacher Meeting', date: 'Jan 28, 2024', type: 'academic' },
    { id: 3, event: 'Mid-term Exams', date: 'Feb 5, 2024', type: 'academic' },
    { id: 4, event: 'School Annual Day', date: 'Feb 15, 2024', type: 'cultural' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Secretary Dashboard</h1>
          <p className="text-muted-foreground">School administration and management overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Admission
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
              {stats.activeStudents} active • {stats.totalStudents - stats.activeStudents} inactive
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.feeCollection}%</div>
            <Progress value={stats.feeCollection} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingFees} pending payments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <Progress value={stats.attendanceRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              School-wide average
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDocuments}</div>
            <p className="text-xs text-muted-foreground">
              5 admissions • 2 transfers • 1 certificate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Transactions */}
        <Card className="lg:col-span-4 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.status === 'completed' ? 'bg-green-100' :
                      transaction.status === 'pending' ? 'bg-amber-100' : 'bg-red-100'
                    }`}>
                      <CreditCard className={`h-5 w-5 ${
                        transaction.status === 'completed' ? 'text-green-600' :
                        transaction.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{transaction.student}</h3>
                      <p className="text-sm text-muted-foreground">{transaction.type} • {transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold">${transaction.amount}</span>
                      <Badge variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'outline' : 'destructive'
                      }>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Register New Student
              </Button>
              <Button className="justify-start" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
              <Button className="justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Certificate
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Event
              </Button>
              <Button className="justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
              <Button className="justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Tasks */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Urgent actions required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className={`h-4 w-4 ${
                        task.priority === 'high' ? 'text-red-500' :
                        task.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                      }`} />
                      <span className="font-medium text-sm">{task.task}</span>
                    </div>
                    <Badge variant={
                      task.priority === 'high' ? 'destructive' :
                      task.priority === 'medium' ? 'outline' : 'secondary'
                    }>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Due: {task.deadline}
                    </span>
                    <Button size="sm">Mark Complete</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>School calendar events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}