import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Download, 
  Search,
  Edit2,
  TrendingUp,
  BarChart3,
  Loader,
  FileUp,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';

interface Grade {
  id: number;
  student_id: number;
  subject_id: number;
  student_name: string;
  subject_name: string;
  assignment_name: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade: string;
}

interface GradeDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
}

interface Student {
  id: number;
  name: string;
  student_id: string;
  class_name: string;
}

export default function TeacherGrades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution>({A: 0, B: 0, C: 0, D: 0, F: 0});
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    assignment_name: '',
    marks_obtained: '',
    total_marks: '100'
  });

  useEffect(() => {
    fetchGrades();
    fetchStudents();
  }, [selectedSubject, selectedGrade]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedSubject !== 'all') params.append('subject_id', selectedSubject);
      
      const data = await apiCall.get(`/api/grades?${params}`);
      setGrades(data);

      // Fetch grade distribution
      if (selectedSubject !== 'all') {
        const dist = await apiCall.get(`/api/grades/distribution/${selectedSubject}`);
        setGradeDistribution(dist);
      }
    } catch (error) {
      toast.error('Failed to fetch grades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await apiCall.get('/api/students');
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleAddGrade = async () => {
    if (!formData.student_id || !formData.subject_id || !formData.assignment_name || !formData.marks_obtained) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      await apiCall.post('/api/grades', {
        student_id: parseInt(formData.student_id),
        subject_id: parseInt(formData.subject_id),
        assignment_name: formData.assignment_name,
        marks_obtained: parseFloat(formData.marks_obtained),
        total_marks: parseFloat(formData.total_marks)
      });

      toast.success('Grade added successfully');
      setFormData({
        student_id: '',
        subject_id: '',
        assignment_name: '',
        marks_obtained: '',
        total_marks: '100'
      });
      setIsAddDialogOpen(false);
      fetchGrades();
    } catch (error) {
      toast.error('Failed to add grade');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditGrade = async () => {
    if (!editingGrade) return;

    try {
      setSaving(true);
      await apiCall.put(`/api/grades/${editingGrade.id}`, {
        marks_obtained: editingGrade.marks_obtained,
        assignment_name: editingGrade.assignment_name
      });

      toast.success('Grade updated successfully');
      setEditingGrade(null);
      fetchGrades();
    } catch (error) {
      toast.error('Failed to update grade');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGrade = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return;

    try {
      setSaving(true);
      await apiCall.delete(`/api/grades/${id}`);
      toast.success('Grade deleted successfully');
      setGrades(grades.filter(g => g.id !== id));
    } catch (error) {
      toast.error('Failed to delete grade');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const formDataObj = new FormData();
      formDataObj.append('file', file);

      const response = await fetch('http://localhost:4000/api/grades/import/csv', {
        method: 'POST',
        body: formDataObj,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`${data.imported} grades imported successfully`);
        setIsImportDialogOpen(false);
        fetchGrades();
      } else {
        toast.error(data.errors?.join('; ') || 'Import failed');
      }
    } catch (error) {
      toast.error('Failed to import grades');
      console.error(error);
    } finally {
      setSaving(false);
      event.target.value = '';
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/grades/export/csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `grades-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Grades exported successfully');
    } catch (error) {
      toast.error('Failed to export grades');
      console.error(error);
    }
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: grades.length,
    average: grades.length > 0 ? (grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length).toFixed(1) : '0',
    highest: grades.length > 0 ? Math.max(...grades.map(g => g.percentage)) : 0,
    lowest: grades.length > 0 ? Math.min(...grades.map(g => g.percentage)) : 0
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-amber-100 text-amber-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-amber-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const totalDistribution = Object.values(gradeDistribution).reduce((a, b) => a + b, 0);
  const distributionPercentages = {
    A: totalDistribution > 0 ? ((gradeDistribution.A / totalDistribution) * 100).toFixed(1) : 0,
    B: totalDistribution > 0 ? ((gradeDistribution.B / totalDistribution) * 100).toFixed(1) : 0,
    C: totalDistribution > 0 ? ((gradeDistribution.C / totalDistribution) * 100).toFixed(1) : 0,
    D: totalDistribution > 0 ? ((gradeDistribution.D / totalDistribution) * 100).toFixed(1) : 0,
    F: totalDistribution > 0 ? ((gradeDistribution.F / totalDistribution) * 100).toFixed(1) : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Grades</h1>
          <p className="text-muted-foreground">Manage student academic performance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsImportDialogOpen(true)}
            variant="outline"
          >
            <FileUp className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button 
            onClick={handleExportCSV}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Grade
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Grades</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50/50 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.average}%</div>
              <p className="text-sm text-muted-foreground">Average</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 backdrop-blur-sm border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.highest}%</div>
              <p className="text-sm text-muted-foreground">Highest</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 backdrop-blur-sm border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.lowest}%</div>
              <p className="text-sm text-muted-foreground">Lowest</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="subject">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="1">Mathematics</SelectItem>
                  <SelectItem value="2">English</SelectItem>
                  <SelectItem value="3">Science</SelectItem>
                  <SelectItem value="4">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="grades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          {selectedSubject !== 'all' && <TabsTrigger value="distribution">Distribution</TabsTrigger>}
        </TabsList>

        <TabsContent value="grades" className="space-y-4">
          {/* Grades Table */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Student Grades</CardTitle>
              <CardDescription>
                {filteredGrades.length} grades found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGrades.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No grades found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredGrades.map((grade) => (
                          <TableRow key={grade.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">{grade.student_name}</TableCell>
                            <TableCell>{grade.subject_name}</TableCell>
                            <TableCell>{grade.assignment_name}</TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {grade.marks_obtained}/{grade.total_marks}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`font-semibold ${getPercentageColor(grade.percentage)}`}>
                                {grade.percentage.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getGradeColor(grade.grade)}>
                                {grade.grade}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingGrade(grade)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteGrade(grade.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          {/* Grade Distribution */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>
                Distribution of grades for the selected subject
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {['A', 'B', 'C', 'D', 'F'].map((gradeLabel) => (
                <div key={gradeLabel}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${gradeLabel === 'A' ? 'bg-green-100 text-green-800' : gradeLabel === 'B' ? 'bg-blue-100 text-blue-800' : gradeLabel === 'C' ? 'bg-amber-100 text-amber-800' : gradeLabel === 'D' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                      Grade {gradeLabel}
                    </Badge>
                    <span className="text-sm font-medium">
                      {gradeDistribution[gradeLabel as keyof GradeDistribution]} students ({distributionPercentages[gradeLabel as keyof typeof distributionPercentages]}%)
                    </span>
                  </div>
                  <Progress 
                    value={parseFloat(distributionPercentages[gradeLabel as keyof typeof distributionPercentages] as string)} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Grade Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Grade</DialogTitle>
            <DialogDescription>
              Enter grade information for a student
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="student">Student</Label>
              <Select 
                value={formData.student_id} 
                onValueChange={(value) => setFormData({...formData, student_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name} ({student.student_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={formData.subject_id} 
                onValueChange={(value) => setFormData({...formData, subject_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Mathematics</SelectItem>
                  <SelectItem value="2">English</SelectItem>
                  <SelectItem value="3">Science</SelectItem>
                  <SelectItem value="4">History</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assignment">Assignment Name</Label>
              <Input
                id="assignment"
                placeholder="e.g., Midterm Exam, Quiz 1"
                value={formData.assignment_name}
                onChange={(e) => setFormData({...formData, assignment_name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="obtained">Marks Obtained</Label>
                <Input
                  id="obtained"
                  type="number"
                  placeholder="0"
                  value={formData.marks_obtained}
                  onChange={(e) => setFormData({...formData, marks_obtained: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="total">Total Marks</Label>
                <Input
                  id="total"
                  type="number"
                  placeholder="100"
                  value={formData.total_marks}
                  onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddGrade} disabled={saving}>
                {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? 'Saving...' : 'Add Grade'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Grade Dialog */}
      {editingGrade && (
        <Dialog open={!!editingGrade} onOpenChange={() => setEditingGrade(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Grade</DialogTitle>
              <DialogDescription>
                Update grade for {editingGrade.student_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Assignment Name</Label>
                <Input
                  placeholder="Assignment name"
                  value={editingGrade.assignment_name}
                  onChange={(e) => setEditingGrade({...editingGrade, assignment_name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Marks Obtained</Label>
                  <Input
                    type="number"
                    value={editingGrade.marks_obtained}
                    onChange={(e) => setEditingGrade({...editingGrade, marks_obtained: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Total Marks</Label>
                  <Input
                    type="number"
                    value={editingGrade.total_marks}
                    disabled
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-muted-foreground">Calculated Percentage</p>
                <p className="text-2xl font-bold">
                  {((editingGrade.marks_obtained / editingGrade.total_marks) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setEditingGrade(null)}>Cancel</Button>
                <Button onClick={handleEditGrade} disabled={saving}>
                  {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {saving ? 'Saving...' : 'Update Grade'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Import CSV Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Grades from CSV</DialogTitle>
            <DialogDescription>
              Select a CSV file to import grades in bulk. Format: student_id, subject_id, assignment_name, marks_obtained, total_marks
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                disabled={saving}
                className="hidden"
                id="csv-input"
              />
              <label htmlFor="csv-input" className="cursor-pointer">
                <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload CSV file</p>
                <p className="text-xs text-muted-foreground">or drag and drop</p>
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
