// src/pages/teacher/Assignments.tsx
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  status: 'draft' | 'published' | 'graded';
  submissions: {
    total: number;
    submitted: number;
    graded: number;
  };
  averageScore?: number;
  type: 'homework' | 'quiz' | 'project' | 'test';
}

export default function Assignments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Calculus Chapter 2 Homework',
      subject: 'Mathematics',
      className: 'Grade 10-A',
      dueDate: '2024-01-18',
      status: 'published',
      submissions: { total: 24, submitted: 18, graded: 12 },
      averageScore: 82,
      type: 'homework'
    },
    {
      id: '2',
      title: 'Physics Mid-term Quiz',
      subject: 'Physics',
      className: 'Grade 11-B',
      dueDate: '2024-01-20',
      status: 'published',
      submissions: { total: 22, submitted: 20, graded: 15 },
      averageScore: 75,
      type: 'quiz'
    },
    {
      id: '3',
      title: 'Advanced Mathematics Project',
      subject: 'Mathematics',
      className: 'Grade 12-A',
      dueDate: '2024-01-25',
      status: 'draft',
      submissions: { total: 20, submitted: 0, graded: 0 },
      type: 'project'
    },
    {
      id: '4',
      title: 'Chemistry Chapter Test',
      subject: 'Chemistry',
      className: 'Grade 10-B',
      dueDate: '2024-01-22',
      status: 'graded',
      submissions: { total: 25, submitted: 25, graded: 25 },
      averageScore: 88,
      type: 'test'
    },
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
    const matchesType = selectedType === 'all' || assignment.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Assignment['type']) => {
    switch (type) {
      case 'homework': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <TrendingUp className="h-4 w-4" />;
      case 'project': return <Users className="h-4 w-4" />;
      case 'test': return <AlertCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSubmissionRate = (assignment: Assignment) => {
    return Math.round((assignment.submissions.submitted / assignment.submissions.total) * 100);
  };

  const getGradingRate = (assignment: Assignment) => {
    if (assignment.submissions.submitted === 0) return 0;
    return Math.round((assignment.submissions.graded / assignment.submissions.submitted) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Create, manage, and grade student assignments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <CreateAssignmentDialog onClose={() => setIsCreateDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="homework">Homework</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{assignments.length}</div>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {assignments.filter(a => a.status === 'published').length}
              </div>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {assignments.reduce((acc, a) => acc + a.submissions.submitted, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(assignments.reduce((acc, a) => acc + (a.averageScore || 0), 0) / 
                  assignments.filter(a => a.averageScore).length)}%
              </div>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Assignments ({assignments.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({assignments.filter(a => a.status === 'published').length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Grading ({assignments.filter(a => 
            a.status === 'published' && a.submissions.submitted > a.submissions.graded
          ).length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({assignments.filter(a => a.status === 'graded').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="bg-white/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-indigo-100">
                          {getTypeIcon(assignment.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{assignment.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{assignment.subject}</span>
                            <span>•</span>
                            <span>{assignment.className}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              Due: {assignment.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Submission Rate</span>
                        <span className="font-medium">{getSubmissionRate(assignment)}%</span>
                      </div>
                      <Progress value={getSubmissionRate(assignment)} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {assignment.submissions.submitted} of {assignment.submissions.total} students
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Grading Progress</span>
                        <span className="font-medium">{getGradingRate(assignment)}%</span>
                      </div>
                      <Progress value={getGradingRate(assignment)} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {assignment.submissions.graded} of {assignment.submissions.submitted} graded
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Score</span>
                        <span className="font-medium">
                          {assignment.averageScore ? `${assignment.averageScore}%` : 'N/A'}
                        </span>
                      </div>
                      {assignment.averageScore && (
                        <Progress value={assignment.averageScore} className="h-2" />
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          {assignment.status === 'draft' ? 'Publish' : 'Grade'}
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common assignment management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span>Create Homework</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>Create Quiz</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              <span>Create Test</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Create Project</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateAssignmentDialog({ onClose }: { onClose: () => void }) {
  const [assignmentType, setAssignmentType] = useState('homework');

  return (
    <DialogContent className="sm:max-w-[700px] bg-white/90 backdrop-blur-sm">
      <DialogHeader>
        <DialogTitle>Create New Assignment</DialogTitle>
        <DialogDescription>
          Create a new assignment for your students
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input id="title" placeholder="Enter assignment title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Assignment Type</Label>
            <Select value={assignmentType} onValueChange={setAssignmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homework">Homework</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="test">Test</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grade-10a">Grade 10-A</SelectItem>
                <SelectItem value="grade-11b">Grade 11-B</SelectItem>
                <SelectItem value="grade-12a">Grade 12-A</SelectItem>
                <SelectItem value="grade-10b">Grade 10-B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueTime">Due Time</Label>
            <Input id="dueTime" type="time" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Assignment Description</Label>
          <Textarea 
            id="description" 
            placeholder="Describe the assignment requirements..." 
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Detailed Instructions</Label>
          <Textarea 
            id="instructions" 
            placeholder="Provide detailed instructions for students..." 
            className="min-h-[200px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Attachments</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, images up to 10MB
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalPoints">Total Points</Label>
          <Input id="totalPoints" type="number" placeholder="100" />
        </div>

        {assignmentType === 'quiz' || assignmentType === 'test' ? (
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" type="number" placeholder="60" />
          </div>
        ) : null}
      </div>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose}>
          Save as Draft
        </Button>
        <Button onClick={onClose}>
          Publish Assignment
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}