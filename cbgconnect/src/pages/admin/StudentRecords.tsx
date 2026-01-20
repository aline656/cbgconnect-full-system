import { useState } from "react"
import { Plus, Edit2, Trash2, Download, Filter, Search, AlertCircle, Users } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StudentRecord {
  id: string
  name: string
  email: string
  phone: string
  class: string
  academicYear: string
  enrollmentDate: string
  status: 'active' | 'inactive' | 'transferred'
  guardianName: string
  guardianPhone: string
  notes?: string
  createdAt: string
}

const mockStudents: StudentRecord[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@school.com',
    phone: '0789123456',
    class: '10A',
    academicYear: '2024-2025',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardianName: 'John Johnson',
    guardianPhone: '0789654321',
    notes: 'Excellent student',
    createdAt: '2024-09-01'
  },
  {
    id: '2',
    name: 'Bob Williams',
    email: 'bob@school.com',
    phone: '0789123457',
    class: '10B',
    academicYear: '2024-2025',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardianName: 'Jane Williams',
    guardianPhone: '0789654322',
    createdAt: '2024-09-01'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@school.com',
    phone: '0789123458',
    class: '11A',
    academicYear: '2024-2025',
    enrollmentDate: '2024-09-01',
    status: 'active',
    guardianName: 'Michael Davis',
    guardianPhone: '0789654323',
    notes: 'Needs support in Math',
    createdAt: '2024-09-01'
  }
]

interface StudentRecordsProps {
  activeAcademicYear?: string
  userRole?: 'admin' | 'secretary'
}

export default function StudentRecords({
  activeAcademicYear = '2024-2025',
  userRole = 'admin'
}: StudentRecordsProps) {
  const [students, setStudents] = useState<StudentRecord[]>(mockStudents)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [selectedYear, setSelectedYear] = useState(activeAcademicYear)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    guardianName: '',
    guardianPhone: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Student name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email is required'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.class) newErrors.class = 'Class is required'
    if (!formData.guardianName.trim()) newErrors.guardianName = 'Guardian name is required'
    if (!formData.guardianPhone.trim()) newErrors.guardianPhone = 'Guardian phone is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    if (editingStudent) {
      // Update student
      setStudents(students.map(s =>
        s.id === editingStudent.id
          ? {
              ...s,
              ...formData,
              academicYear: selectedYear
            }
          : s
      ))
      toast.success('Student record updated successfully')
    } else {
      // Create new student
      const newStudent: StudentRecord = {
        id: Date.now().toString(),
        ...formData,
        academicYear: selectedYear,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setStudents([...students, newStudent])
      toast.success('Student registered successfully for ' + selectedYear)
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      class: '',
      guardianName: '',
      guardianPhone: '',
      notes: ''
    })
    setEditingStudent(null)
    setIsOpenDialog(false)
  }

  const handleEdit = (student: StudentRecord) => {
    setEditingStudent(student)
    setSelectedYear(student.academicYear)
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      class: student.class,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      notes: student.notes || ''
    })
    setIsOpenDialog(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      setStudents(students.filter(s => s.id !== id))
      toast.success('Student record deleted')
    }
  }

  const handleStatusChange = (id: string, newStatus: 'active' | 'inactive' | 'transferred') => {
    setStudents(students.map(s =>
      s.id === id ? { ...s, status: newStatus } : s
    ))
    toast.success('Student status updated')
  }

  // Filter students
  let filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === 'all' || s.class === selectedClass
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus
    const matchesYear = s.academicYear === selectedYear
    return matchesSearch && matchesClass && matchesStatus && matchesYear
  })

  const uniqueClasses = Array.from(new Set(students.map(s => s.class)))
  const academicYears = ['2024-2025', '2023-2024', '2022-2023']

  const statistics = {
    active: filteredStudents.filter(s => s.status === 'active').length,
    inactive: filteredStudents.filter(s => s.status === 'inactive').length,
    transferred: filteredStudents.filter(s => s.status === 'transferred').length
  }

  const statusColor = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'transferred':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Records</h1>
          <p className="text-gray-600 mt-2">Manage student registrations for {selectedYear}</p>
        </div>
        {(userRole === 'admin' || userRole === 'secretary') && (
          <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setEditingStudent(null)
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    class: '',
                    guardianName: '',
                    guardianPhone: '',
                    notes: ''
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Register Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? 'Edit Student Record' : 'Register New Student'}
                </DialogTitle>
                <DialogDescription>
                  {editingStudent 
                    ? `Edit details for ${editingStudent.name}` 
                    : `Register a new student for ${selectedYear}`}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="academicYear">Academic Year *</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Select the academic year for registration</p>
                  </div>
                  <div>
                    <Label htmlFor="class">Class *</Label>
                    <Select value={formData.class} onValueChange={(value) => {
                      setFormData({...formData, class: value})
                      if (errors.class) setErrors({...errors, class: ''})
                    }}>
                      <SelectTrigger className={`mt-1 ${errors.class ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {[9, 10, 11, 12].map(grade => (
                          ['A', 'B', 'C', 'D'].map(suffix => (
                            <SelectItem key={`${grade}${suffix}`} value={`${grade}${suffix}`}>
                              {grade}{suffix}
                            </SelectItem>
                          ))
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.class && <p className="text-sm text-red-500 mt-1">{errors.class}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Student Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter student name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({...formData, name: e.target.value})
                        if (errors.name) setErrors({...errors, name: ''})
                      }}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@school.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({...formData, email: e.target.value})
                        if (errors.email) setErrors({...errors, email: ''})
                      }}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="0789123456"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({...formData, phone: e.target.value})
                        if (errors.phone) setErrors({...errors, phone: ''})
                      }}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      placeholder="Parent/Guardian name"
                      value={formData.guardianName}
                      onChange={(e) => {
                        setFormData({...formData, guardianName: e.target.value})
                        if (errors.guardianName) setErrors({...errors, guardianName: ''})
                      }}
                      className={errors.guardianName ? 'border-red-500' : ''}
                    />
                    {errors.guardianName && <p className="text-sm text-red-500 mt-1">{errors.guardianName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                  <Input
                    id="guardianPhone"
                    placeholder="0789654321"
                    value={formData.guardianPhone}
                    onChange={(e) => {
                      setFormData({...formData, guardianPhone: e.target.value})
                      if (errors.guardianPhone) setErrors({...errors, guardianPhone: ''})
                    }}
                    className={errors.guardianPhone ? 'border-red-500' : ''}
                  />
                  {errors.guardianPhone && <p className="text-sm text-red-500 mt-1">{errors.guardianPhone}</p>}
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes about the student"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpenDialog(false)
                      setEditingStudent(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingStudent ? 'Update Student' : 'Register Student'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{filteredStudents.length}</p>
            </div>
          </CardContent>
        </Card>
        {['active', 'inactive', 'transferred'].map(status => (
          <Card key={status}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 capitalize">{status}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics[status as keyof typeof statistics]}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search" className="text-xs">Search</Label>
              <div className="flex items-center gap-2 mt-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0"
                />
              </div>
            </div>
            <div className="w-40">
              <Label htmlFor="year" className="text-xs">Academic Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Label htmlFor="class" className="text-xs">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Label htmlFor="status" className="text-xs">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No students found for {selectedYear}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-sm">{student.email}</TableCell>
                      <TableCell className="text-sm">{student.phone}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell className="text-sm">{student.guardianName}</TableCell>
                      <TableCell className="text-center">
                        <Select
                          value={student.status}
                          onValueChange={(value) =>
                            handleStatusChange(student.id, value as 'active' | 'inactive' | 'transferred')
                          }
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="transferred">Transferred</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {(userRole === 'admin' || userRole === 'secretary') && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(student)}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(student.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Student Registration Guidelines</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Students are registered per academic year (2024-2025, 2023-2024, etc.)</li>
                <li>• Each student must be assigned to a specific class (9A-12D)</li>
                <li>• Guardian information is required for all students</li>
                <li>• Status can be changed: Active (enrolled), Inactive (not enrolled), or Transferred (moved to another school)</li>
                <li>• When registering in a new academic year, previous year data is archived</li>
                <li>• Archived student records are preserved for historical reference</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
