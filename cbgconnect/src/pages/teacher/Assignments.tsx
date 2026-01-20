import { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  className: string;
  description: string;
  dueDate: string;
  totalStudents: number;
  submitted: number;
  notSubmitted: number;
  status: 'active' | 'completed' | 'upcoming';
  createdDate: string;
}

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    className: 'Grade 9-A',
    description: 'Solve 20 quadratic equations using different methods',
    dueDate: '2026-01-25',
    totalStudents: 45,
    submitted: 38,
    notSubmitted: 7,
    status: 'active',
    createdDate: '2026-01-15'
  },
  {
    id: 2,
    title: 'Essay on Climate Change',
    subject: 'English',
    className: 'Grade 10-A',
    description: 'Write a 2000-word essay on climate change and its impacts',
    dueDate: '2026-01-28',
    totalStudents: 38,
    submitted: 32,
    notSubmitted: 6,
    status: 'active',
    createdDate: '2026-01-10'
  },
  {
    id: 3,
    title: 'Project: Periodic Table',
    subject: 'Science',
    className: 'Grade 9-B',
    description: 'Create a visual project on the periodic table',
    dueDate: '2026-02-05',
    totalStudents: 42,
    submitted: 5,
    notSubmitted: 37,
    status: 'upcoming',
    createdDate: '2026-01-20'
  },
  {
    id: 4,
    title: 'Historical Events Quiz',
    subject: 'History',
    className: 'Grade 9-A',
    description: 'MCQ-based quiz on historical events',
    dueDate: '2026-01-18',
    totalStudents: 45,
    submitted: 45,
    notSubmitted: 0,
    status: 'completed',
    createdDate: '2026-01-08'
  }
];

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    className: '',
    description: '',
    dueDate: ''
  });

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || assignment.className === selectedClass;
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleAddAssignment = async () => {
    if (!formData.title || !formData.subject || !formData.className || !formData.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      const newAssignment: Assignment = {
        id: Math.max(...assignments.map(a => a.id), 0) + 1,
        title: formData.title,
        subject: formData.subject,
        className: formData.className,
        description: formData.description,
        dueDate: formData.dueDate,
        totalStudents: 40,
        submitted: 0,
        notSubmitted: 40,
        status: new Date(formData.dueDate) > new Date() ? 'upcoming' : 'active',
        createdDate: new Date().toISOString().split('T')[0]
      };

      setAssignments([...assignments, newAssignment]);
      toast.success('Assignment created successfully');
      setFormData({
        title: '',
        subject: '',
        className: '',
        description: '',
        dueDate: ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create assignment');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      setSaving(true);
      setAssignments(assignments.filter(a => a.id !== id));
      toast.success('Assignment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete assignment');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    upcoming: assignments.filter(a => a.status === 'upcoming').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    avgSubmissionRate: assignments.length > 0
      ? Math.round(assignments.reduce((sum, a) => sum + (a.submitted / a.totalStudents), 0) / assignments.length * 100)
      : 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'upcoming': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Create and manage student assignments</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/50 backdrop-blur-sm border-amber-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.upcoming}</div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 backdrop-blur-sm border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50/50 backdrop-blur-sm border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.avgSubmissionRate}%</div>
              <p className="text-sm text-muted-foreground">Avg Submission</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="Grade 9-A">Grade 9-A</SelectItem>
                  <SelectItem value="Grade 9-B">Grade 9-B</SelectItem>
                  <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignment..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>
            {filteredAssignments.length} assignments found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No assignments found</p>
              </div>
            ) : (
              filteredAssignments.map(assignment => {
                const submissionRate = Math.round((assignment.submitted / assignment.totalStudents) * 100);
                return (
                  <div
                    key={assignment.id}
                    className="border rounded-lg p-4 hover:bg-gray-50/50 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.subject} • {assignment.className}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Badge className={getStatusColor(assignment.status)}>
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1">{assignment.status}</span>
                        </Badge>
                        {isOverdue(assignment.dueDate) && (
                          <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                        )}
                      </div>
                    </div>

                    {assignment.description && (
                      <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                    )}

                    <div className="grid gap-3 md:grid-cols-3 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.totalStudents} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{assignment.submitted} submitted</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Submission Progress</p>
                        <span className="text-sm font-semibold">{submissionRate}%</span>
                      </div>
                      <Progress value={submissionRate} className="h-2" />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAssignment(assignment)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Assignment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for your students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                placeholder="e.g., Quadratic Equations"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={formData.subject}
                  onValueChange={(value) => setFormData({...formData, subject: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Urdu">Urdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="class">Class</Label>
                <Select 
                  value={formData.className}
                  onValueChange={(value) => setFormData({...formData, className: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 9-A">Grade 9-A</SelectItem>
                    <SelectItem value="Grade 9-B">Grade 9-B</SelectItem>
                    <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                    <SelectItem value="Grade 10-B">Grade 10-B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Assignment details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAssignment} disabled={saving}>
                {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {saving ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      {editingAssignment && (
        <Dialog open={!!editingAssignment} onOpenChange={() => setEditingAssignment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assignment Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={editingAssignment.title} disabled />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subject</Label>
                  <Input value={editingAssignment.subject} disabled />
                </div>
                <div>
                  <Label>Class</Label>
                  <Input value={editingAssignment.className} disabled />
                </div>
              </div>

              <div>
                <Label>Due Date</Label>
                <Input value={editingAssignment.dueDate} disabled />
              </div>

              <div>
                <Label>Submission Progress</Label>
                <Progress value={(editingAssignment.submitted / editingAssignment.totalStudents) * 100} />
                <p className="text-sm text-muted-foreground mt-2">
                  {editingAssignment.submitted} of {editingAssignment.totalStudents} students submitted
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setEditingAssignment(null)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
