import { useState } from 'react';
import {
  Plus,
  Users,
  BookOpen,
  Clock,
  MapPin,
  Calendar,
  Trash2,
  Edit2,
  Loader,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Class {
  id: number;
  name: string;
  grade: string;
  section: string;
  total_students: number;
  teacher_name: string;
  room_number: string;
  schedule: string;
  subjects: string[];
}

const mockClasses: Class[] = [
  {
    id: 1,
    name: 'Grade 9-A',
    grade: 'Grade 9',
    section: 'A',
    total_students: 45,
    teacher_name: 'Mr. Ahmed Khan',
    room_number: 'Room 201',
    schedule: 'Monday-Friday, 8:00 AM - 2:30 PM',
    subjects: ['Mathematics', 'English', 'Science', 'History']
  },
  {
    id: 2,
    name: 'Grade 9-B',
    grade: 'Grade 9',
    section: 'B',
    total_students: 42,
    teacher_name: 'Ms. Fatima Ali',
    room_number: 'Room 202',
    schedule: 'Monday-Friday, 8:00 AM - 2:30 PM',
    subjects: ['Mathematics', 'English', 'Science', 'History']
  },
  {
    id: 3,
    name: 'Grade 10-A',
    grade: 'Grade 10',
    section: 'A',
    total_students: 38,
    teacher_name: 'Mr. Hassan Malik',
    room_number: 'Room 301',
    schedule: 'Monday-Friday, 8:00 AM - 2:30 PM',
    subjects: ['Mathematics', 'English', 'Science', 'History']
  },
  {
    id: 4,
    name: 'Grade 10-B',
    grade: 'Grade 10',
    section: 'B',
    total_students: 40,
    teacher_name: 'Dr. Zara Khan',
    room_number: 'Room 302',
    schedule: 'Monday-Friday, 8:00 AM - 2:30 PM',
    subjects: ['Mathematics', 'English', 'Science', 'History']
  }
];

export default function TeacherClasses() {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    section: '',
    room_number: '',
    schedule: '',
    subjects: ''
  });

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || cls.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const handleAddClass = async () => {
    if (!formData.name || !formData.grade || !formData.section) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      const newClass: Class = {
        id: Math.max(...classes.map(c => c.id), 0) + 1,
        name: formData.name,
        grade: formData.grade,
        section: formData.section,
        total_students: 0,
        teacher_name: 'Current Teacher',
        room_number: formData.room_number,
        schedule: formData.schedule,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s)
      };

      setClasses([...classes, newClass]);
      toast.success('Class added successfully');
      setFormData({
        name: '',
        grade: '',
        section: '',
        room_number: '',
        schedule: '',
        subjects: ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add class');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClass = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      setSaving(true);
      setClasses(classes.filter(c => c.id !== id));
      toast.success('Class deleted successfully');
    } catch (error) {
      toast.error('Failed to delete class');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: classes.length,
    totalStudents: classes.reduce((sum, c) => sum + c.total_students, 0),
    avgStudents: classes.length > 0 ? Math.round(classes.reduce((sum, c) => sum + c.total_students, 0) / classes.length) : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">Manage classes and view class details</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Classes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 backdrop-blur-sm border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.avgStudents}</div>
              <p className="text-sm text-muted-foreground">Avg per Class</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="grade">Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="Grade 9">Grade 9</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 11">Grade 11</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search class or room..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Classes</CardTitle>
          <CardDescription>
            {filteredClasses.length} classes found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="border rounded-lg p-4 hover:bg-gray-50/50 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cls.total_students} students • {cls.teacher_name}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingClass(cls)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClass(cls.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{cls.room_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{cls.total_students} Students</span>
                  </div>
                </div>

                {cls.subjects.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cls.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredClasses.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No classes found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Class Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
            <DialogDescription>
              Create a new class for your schedule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Class Name</Label>
              <Input
                id="name"
                placeholder="e.g., Grade 9-A"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select 
                  value={formData.grade}
                  onValueChange={(value) => setFormData({...formData, grade: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  placeholder="e.g., A"
                  value={formData.section}
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="room">Room Number</Label>
              <Input
                id="room"
                placeholder="e.g., Room 201"
                value={formData.room_number}
                onChange={(e) => setFormData({...formData, room_number: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                placeholder="e.g., Monday-Friday, 8:00 AM - 2:30 PM"
                value={formData.schedule}
                onChange={(e) => setFormData({...formData, schedule: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="subjects">Subjects (comma-separated)</Label>
              <Input
                id="subjects"
                placeholder="e.g., Mathematics, English, Science"
                value={formData.subjects}
                onChange={(e) => setFormData({...formData, subjects: e.target.value})}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddClass} disabled={saving}>
                {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {saving ? 'Adding...' : 'Add Class'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      {editingClass && (
        <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Class Name</Label>
                <Input
                  value={editingClass.name}
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Grade</Label>
                  <Input value={editingClass.grade} disabled />
                </div>
                <div>
                  <Label>Section</Label>
                  <Input value={editingClass.section} disabled />
                </div>
              </div>

              <div>
                <Label>Room Number</Label>
                <Input value={editingClass.room_number} disabled />
              </div>

              <div>
                <Label>Schedule</Label>
                <Input value={editingClass.schedule} disabled />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setEditingClass(null)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
