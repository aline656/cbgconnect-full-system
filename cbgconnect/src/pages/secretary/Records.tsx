import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  Upload,
  User,
  Mail,
  Phone,
  Calendar,
  School,
  Home,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiCall } from '@/lib/api';
import { studentsApi } from '@/services/academicYearApi';

interface StudentRecord {
  id: number;
  student_id: string;
  name: string;
  grade: string;
  class_name: string;
  gender: 'male' | 'female';
  date_of_birth: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  admission_date: string;
  contact?: {
    parent_name: string;
    parent_phone: string;
    address: string;
  };
  fees?: {
    total_due: number;
    total_paid: number;
    total_pending: number;
  };
}

export default function Records() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [gradesList, setGradesList] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [selectedGrade, selectedStatus]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedGrade !== 'all') filters.grade = selectedGrade;
      if (selectedStatus !== 'all') filters.status = selectedStatus;

      const response = await studentsApi.getAll(filters);
      const normalized = (response || []).map((r: any) => ({
        id: r.id || 0,
        student_id: r.student_id || `S${r.id}`,
        name: r.name || `${r.first_name || ''} ${r.last_name || ''}`.trim(),
        grade: String(r.grade || ''),
        class_name: r.class_name || r.class || '',
        gender: r.gender || 'male',
        date_of_birth: r.date_of_birth || '',
        status: r.status || 'active',
        admission_date: r.admission_date || r.created_at || '',
        contact: {
          parent_name: r.parent_name || '',
          parent_phone: r.parent_phone || '',
          address: r.address || ''
        }
      }));
      setStudents(normalized);

      const grades = Array.from(new Set(normalized.map(s => s.grade).filter(Boolean))).sort() as string[];
      setGradesList(grades);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (formData: any) => {
    try {
      setSubmitting(true);
      const payload: any = {
        student_id: `S${Date.now()}`,
        name: formData.name,
        gender: formData.gender || 'male',
        date_of_birth: formData.date_of_birth || null,
        grade: formData.grade || null,
        class_name: formData.class_name,
        admission_date: formData.admission_date,
        parent_name: formData.parent_name,
        parent_phone: formData.parent_phone,
        address: formData.address || null
      };
      
      const response = await studentsApi.create(payload);
      await fetchStudents();
      setIsAddDialogOpen(false);
      
      toast.success(`Student ${formData.name} added successfully`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add student');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStudent = async (id: number, formData: any) => {
    try {
      setSubmitting(true);
      const payload: any = {
        name: formData.name,
        grade: formData.grade || null,
        class_name: formData.class_name,
        status: formData.status,
      };
      
      await studentsApi.update(String(id), payload);
      await fetchStudents();
      setEditingStudent(null);
      
      toast.success(`Student ${formData.name} updated successfully`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update student');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const studentName = students.find(s => s.id === id)?.name || 'Student';
      await studentsApi.delete(String(id));
      setStudents(students.filter(s => s.id !== id));
      toast.success(`${studentName} has been deleted`);
    } catch (error) {
      toast.error('Failed to delete student');
      console.error(error);
    }
  };

  const handleImportCSV = async (file: File) => {
    try {
      const text = await file.text();
      const response = await apiCall.post('/api/students/import/csv', { csv_data: text });
      
      fetchStudents();
      toast.success(`${response.created} students imported, ${response.failed} failed`);
      if (response.errors.length > 0) {
        toast.error(`Errors: ${response.errors.join(', ')}`);
      }
    } catch (error) {
      toast.error('Failed to import students');
      console.error(error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedGrade !== 'all') params.append('grade', selectedGrade);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const response = await fetch(`http://localhost:4000/api/students/export/csv?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      
      toast.success('Students exported successfully');
    } catch (error) {
      toast.error('Failed to export students');
      console.error(error);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.contact?.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesSearch;
  });

  const getStatusColor = (status: StudentRecord['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'transferred': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Records</h1>
          <p className="text-muted-foreground">Manage all student information and records</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Student
              </Button>
            </DialogTrigger>
            <AddStudentDialog onClose={() => setIsAddDialogOpen(false)} onSubmit={handleAddStudent} />
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, student ID, or parent..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {gradesList.map(grade => (
                    <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files && handleImportCSV(e.target.files[0])}
                  className="hidden"
                />
                <Button variant="outline" asChild className="cursor-pointer">
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {students.filter(s => s.status === 'active').length}
              </div>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {students.filter(s => s.status === 'graduated').length}
              </div>
              <p className="text-sm text-muted-foreground">Graduated</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {students.filter(s => s.status === 'inactive').length}
              </div>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="pt-6">
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
                        <TableHead>ID</TableHead>
                        <TableHead>Grade/Class</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No students found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {student.gender === 'male' ? '♂' : '♀'} • {student.date_of_birth}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{student.student_id}</TableCell>
                            <TableCell>
                              <div>
                                <div>Grade {student.grade}</div>
                                <div className="text-sm text-muted-foreground">{student.class_name}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>{student.contact?.parent_name || 'N/A'}</div>
                                <div className="text-sm text-muted-foreground">{student.contact?.address || 'N/A'}</div>
                              </div>
                            </TableCell>
                            <TableCell>{student.contact?.parent_phone || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(student.status)}>
                                {student.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEditingStudent(student)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteStudent(student.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

        <TabsContent value="cards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription>{student.student_id}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <School className="mr-2 h-3 w-3 text-muted-foreground" />
                      <span>Grade {student.grade}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                      <span>{student.date_of_birth}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <User className="mr-2 h-3 w-3 text-muted-foreground" />
                      <span>{student.contact?.parent_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                      <span>{student.contact?.parent_phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setEditingStudent(student)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Student Dialog */}
      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent className="sm:max-w-[700px] bg-white/90 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Update student information
              </DialogDescription>
            </DialogHeader>
            <EditStudentForm 
              student={editingStudent} 
              onClose={() => setEditingStudent(null)}
              onSubmit={(formData) => {
                handleEditStudent(editingStudent.id, formData);
                setEditingStudent(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AddStudentDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    student_id: '',
    gender: '',
    date_of_birth: '',
    admission_date: '',
    grade: '',
    class_name: '',
    parent_name: '',
    parent_phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.class_name.trim()) newErrors.class_name = 'Class is required';
    if (!formData.admission_date) newErrors.admission_date = 'Admission date is required';
    if (!formData.parent_name.trim()) newErrors.parent_name = 'Parent name is required';
    if (!formData.parent_phone.trim()) newErrors.parent_phone = 'Parent phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit(formData);
    setFormData({
      name: '',
      student_id: '',
      gender: '',
      date_of_birth: '',
      admission_date: '',
      grade: '',
      class_name: '',
      parent_name: '',
      parent_phone: '',
      address: '',
    });
  };

  return (
    <DialogContent className="sm:max-w-[700px] bg-white/90 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogDescription>
          Enter student information for registration. All fields marked with * are required.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              id="name" 
              placeholder="Enter full name" 
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if (errors.name) setErrors({...errors, name: ''});
              }}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => {
                setFormData({...formData, gender: value});
                if (errors.gender) setErrors({...errors, gender: ''});
              }}
            >
              <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input 
              id="date_of_birth" 
              type="date" 
              value={formData.date_of_birth}
              onChange={(e) => {
                setFormData({...formData, date_of_birth: e.target.value});
                if (errors.date_of_birth) setErrors({...errors, date_of_birth: ''});
              }}
              className={errors.date_of_birth ? 'border-red-500' : ''}
            />
            {errors.date_of_birth && <p className="text-sm text-red-500">{errors.date_of_birth}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Grade *</Label>
            <Select 
              value={formData.grade} 
              onValueChange={(value) => {
                setFormData({...formData, grade: value});
                if (errors.grade) setErrors({...errors, grade: ''});
              }}
            >
              <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
                <SelectItem value="11">Grade 11</SelectItem>
                <SelectItem value="12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
            {errors.grade && <p className="text-sm text-red-500">{errors.grade}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="class_name">Class *</Label>
            <Input 
              id="class_name" 
              placeholder="e.g., Science A" 
              value={formData.class_name}
              onChange={(e) => {
                setFormData({...formData, class_name: e.target.value});
                if (errors.class_name) setErrors({...errors, class_name: ''});
              }}
              className={errors.class_name ? 'border-red-500' : ''}
              required
            />
            {errors.class_name && <p className="text-sm text-red-500">{errors.class_name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="admission_date">Admission Date *</Label>
            <Input 
              id="admission_date" 
              type="date" 
              value={formData.admission_date}
              onChange={(e) => {
                setFormData({...formData, admission_date: e.target.value});
                if (errors.admission_date) setErrors({...errors, admission_date: ''});
              }}
              className={errors.admission_date ? 'border-red-500' : ''}
              required
            />
            {errors.admission_date && <p className="text-sm text-red-500">{errors.admission_date}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea 
            id="address" 
            placeholder="Enter full address" 
            value={formData.address}
            onChange={(e) => {
              setFormData({...formData, address: e.target.value});
              if (errors.address) setErrors({...errors, address: ''});
            }}
            className={errors.address ? 'border-red-500' : ''}
            required
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parent_name">Parent/Guardian Name *</Label>
            <Input 
              id="parent_name" 
              placeholder="Enter parent name" 
              value={formData.parent_name}
              onChange={(e) => {
                setFormData({...formData, parent_name: e.target.value});
                if (errors.parent_name) setErrors({...errors, parent_name: ''});
              }}
              className={errors.parent_name ? 'border-red-500' : ''}
              required
            />
            {errors.parent_name && <p className="text-sm text-red-500">{errors.parent_name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent_phone">Parent Contact *</Label>
            <Input 
              id="parent_phone" 
              placeholder="+1234567890" 
              value={formData.parent_phone}
              onChange={(e) => {
                setFormData({...formData, parent_phone: e.target.value});
                if (errors.parent_phone) setErrors({...errors, parent_phone: ''});
              }}
              className={errors.parent_phone ? 'border-red-500' : ''}
              required
            />
            {errors.parent_phone && <p className="text-sm text-red-500">{errors.parent_phone}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Register Student
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function EditStudentForm({ student, onClose, onSubmit }: { student: StudentRecord; onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: student.name,
    grade: student.grade,
    class_name: student.class_name,
    status: student.status,
    parent_name: student.contact?.parent_name || '',
    parent_phone: student.contact?.parent_phone || '',
    address: student.contact?.address || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.class_name.trim()) newErrors.class_name = 'Class is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.parent_name.trim()) newErrors.parent_name = 'Parent name is required';
    if (!formData.parent_phone.trim()) newErrors.parent_phone = 'Parent phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input 
          id="name" 
          value={formData.name}
          onChange={(e) => {
            setFormData({...formData, name: e.target.value});
            if (errors.name) setErrors({...errors, name: ''});
          }}
          className={errors.name ? 'border-red-500' : ''}
          required
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade *</Label>
          <Select 
            value={formData.grade} 
            onValueChange={(value) => {
              setFormData({...formData, grade: value});
              if (errors.grade) setErrors({...errors, grade: ''});
            }}
          >
            <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9">Grade 9</SelectItem>
              <SelectItem value="10">Grade 10</SelectItem>
              <SelectItem value="11">Grade 11</SelectItem>
              <SelectItem value="12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
          {errors.grade && <p className="text-sm text-red-500">{errors.grade}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="class_name">Class *</Label>
          <Input 
            id="class_name" 
            value={formData.class_name}
            onChange={(e) => {
              setFormData({...formData, class_name: e.target.value});
              if (errors.class_name) setErrors({...errors, class_name: ''});
            }}
            className={errors.class_name ? 'border-red-500' : ''}
            required
          />
          {errors.class_name && <p className="text-sm text-red-500">{errors.class_name}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => {
            setFormData({...formData, status: value as any});
            if (errors.status) setErrors({...errors, status: ''});
          }}
        >
          <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="graduated">Graduated</SelectItem>
            <SelectItem value="transferred">Transferred</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_name">Parent/Guardian Name *</Label>
        <Input 
          id="parent_name" 
          value={formData.parent_name}
          onChange={(e) => {
            setFormData({...formData, parent_name: e.target.value});
            if (errors.parent_name) setErrors({...errors, parent_name: ''});
          }}
          className={errors.parent_name ? 'border-red-500' : ''}
          required
        />
        {errors.parent_name && <p className="text-sm text-red-500">{errors.parent_name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_phone">Parent Contact *</Label>
        <Input 
          id="parent_phone" 
          value={formData.parent_phone}
          onChange={(e) => {
            setFormData({...formData, parent_phone: e.target.value});
            if (errors.parent_phone) setErrors({...errors, parent_phone: ''});
          }}
          className={errors.parent_phone ? 'border-red-500' : ''}
          required
        />
        {errors.parent_phone && <p className="text-sm text-red-500">{errors.parent_phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea 
          id="address" 
          value={formData.address}
          onChange={(e) => {
            setFormData({...formData, address: e.target.value});
            if (errors.address) setErrors({...errors, address: ''});
          }}
          className={errors.address ? 'border-red-500' : ''}
          required
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Update Student
        </Button>
      </DialogFooter>
    </form>
  );
}
