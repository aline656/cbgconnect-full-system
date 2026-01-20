import { useEffect, useState } from "react"
import { BookOpen, Plus, Edit2, Trash2, Users, Calendar, AlertCircle, MoreVertical } from "lucide-react"
import { toast } from "sonner"
import api from "@/services/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Lesson {
  id: string
  academicYearId: string
  teacherId: string
  teacherName: string
  subjectName: string
  grade: string
  className: string
  classId: string
  schedule?: string
  createdAt: string
}

// Lessons will be loaded from API

const subjects = [
  'Mathematics',
  'English',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music'
]

const grades = ['9', '10', '11', '12']
const classes = ['A', 'B', 'C', 'D']

interface TeacherLessonsProps {
  academicYearId?: string
  academicYearName?: string
  userRole?: 'teacher' | 'admin'
  currentTeacherId?: string
}

export default function TeacherLessons({
  academicYearId = '1',
  academicYearName = '2024-2025',
  userRole = 'teacher',
  currentTeacherId = 'T001'
}: TeacherLessonsProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    teacherId: currentTeacherId,
    teacherName: '',
    subjectName: '',
    grade: '',
    className: '',
    schedule: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load lessons from API
    const filters: any = {}
    if (userRole === 'teacher') {
      filters.teacherId = currentTeacherId
    }
    api.getLessons(filters)
      .then((rows) => {
        const normalized = (rows || []).map((r: any) => ({
          id: String(r.id),
          academicYearId,
          teacherId: String(r.teacherId),
          teacherName: r.teacherName,
          subjectName: r.subjectName,
          grade: r.grade,
          className: r.className,
          classId: String(r.classId),
          schedule: r.schedule || '',
          createdAt: r.createdAt
        }))
        setLessons(normalized)
      })
      .catch((err) => {
        console.error('Failed to load lessons', err)
        toast.error('Failed to load lessons')
      })
      .finally(() => setLoading(false))
  }, [academicYearId, userRole, currentTeacherId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.subjectName) newErrors.subjectName = 'Subject is required'
    if (!formData.grade) newErrors.grade = 'Grade is required'
    if (!formData.className) newErrors.className = 'Class is required'
    if (!formData.teacherName && userRole === 'admin') newErrors.teacherName = 'Teacher name is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    if (editingLesson) {
      // Update lesson via API
      api.updateLesson(editingLesson.id, { schedule: formData.schedule })
        .then(() => {
          setLessons(lessons.map(l =>
            l.id === editingLesson.id
              ? {
                  ...l,
                  subjectName: formData.subjectName,
                  grade: formData.grade,
                  className: formData.className,
                  schedule: formData.schedule,
                  teacherName: formData.teacherName || editingLesson.teacherName
                }
              : l
          ))
          toast.success('Lesson updated successfully')
          setFormData({ teacherId: currentTeacherId, teacherName: '', subjectName: '', grade: '', className: '', schedule: '' })
          setEditingLesson(null)
          setIsOpenDialog(false)
        })
        .catch((err) => {
          console.error('Failed to update lesson', err)
          toast.error('Failed to update lesson')
        })
    } else {
      // Create new lesson via API
      api.createLesson({
        teacherId: formData.teacherId,
        subjectId: Math.random(),
        classId: Math.random(),
        schedule: formData.schedule
      })
        .then((newLesson) => {
          setLessons([...lessons, {
            id: String(newLesson.id),
            academicYearId,
            teacherId: formData.teacherId,
            teacherName: formData.teacherName || 'Current Teacher',
            subjectName: formData.subjectName,
            grade: formData.grade,
            className: `${formData.grade}${formData.className}`,
            classId: `C${formData.grade}${formData.className}`,
            schedule: formData.schedule,
            createdAt: new Date().toISOString()
          }])
          toast.success('Lesson registered successfully')
          setFormData({ teacherId: currentTeacherId, teacherName: '', subjectName: '', grade: '', className: '', schedule: '' })
          setIsOpenDialog(false)
        })
        .catch((err) => {
          console.error('Failed to create lesson', err)
          toast.error('Failed to create lesson')
        })
    }
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      teacherId: lesson.teacherId,
      teacherName: lesson.teacherName,
      subjectName: lesson.subjectName,
      grade: lesson.grade,
      className: lesson.className.slice(-1),
      schedule: lesson.schedule || ''
    })
    setIsOpenDialog(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      api.deleteLesson(id)
        .then(() => {
          setLessons(lessons.filter(l => l.id !== id))
          toast.success('Lesson deleted')
        })
        .catch((err) => {
          console.error('Failed to delete lesson', err)
          toast.error('Failed to delete lesson')
        })
    }
  }

  const displayedLessons = userRole === 'teacher' 
    ? lessons.filter(l => l.teacherId === currentTeacherId)
    : lessons

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === 'teacher' ? 'My Lessons' : 'Teacher Lessons'}
          </h1>
          <p className="text-gray-600 mt-2">Register and manage lessons for {academicYearName}</p>
        </div>
        {userRole === 'teacher' || true && (
          <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setEditingLesson(null)
                  setFormData({
                    teacherId: currentTeacherId,
                    teacherName: '',
                    subjectName: '',
                    grade: '',
                    className: '',
                    schedule: ''
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Register Lesson
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLesson ? 'Edit Lesson' : 'Register New Lesson'}
                </DialogTitle>
                <DialogDescription>
                  {editingLesson 
                    ? 'Update the lesson details' 
                    : 'Register a new lesson for this academic year'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {userRole === 'admin' && (
                  <div>
                    <Label htmlFor="teacherName">Teacher Name *</Label>
                    <Input
                      id="teacherName"
                      placeholder="Enter teacher name"
                      value={formData.teacherName}
                      onChange={(e) => {
                        setFormData({...formData, teacherName: e.target.value})
                        if (errors.teacherName) setErrors({...errors, teacherName: ''})
                      }}
                      className={errors.teacherName ? 'border-red-500' : ''}
                    />
                    {errors.teacherName && <p className="text-sm text-red-500 mt-1">{errors.teacherName}</p>}
                  </div>
                )}

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subjectName} onValueChange={(value) => {
                    setFormData({...formData, subjectName: value})
                    if (errors.subjectName) setErrors({...errors, subjectName: ''})
                  }}>
                    <SelectTrigger className={errors.subjectName ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subjectName && <p className="text-sm text-red-500 mt-1">{errors.subjectName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">Grade *</Label>
                    <Select value={formData.grade} onValueChange={(value) => {
                      setFormData({...formData, grade: value})
                      if (errors.grade) setErrors({...errors, grade: ''})
                    }}>
                      <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map(grade => (
                          <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.grade && <p className="text-sm text-red-500 mt-1">{errors.grade}</p>}
                  </div>

                  <div>
                    <Label htmlFor="className">Class *</Label>
                    <Select value={formData.className} onValueChange={(value) => {
                      setFormData({...formData, className: value})
                      if (errors.className) setErrors({...errors, className: ''})
                    }}>
                      <SelectTrigger className={errors.className ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map(cls => (
                          <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.className && <p className="text-sm text-red-500 mt-1">{errors.className}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="schedule">Schedule (Optional)</Label>
                  <Input
                    id="schedule"
                    placeholder="e.g., Monday, Wednesday, Friday - 9:00 AM"
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpenDialog(false)
                      setEditingLesson(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingLesson ? 'Update Lesson' : 'Register Lesson'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Lessons</p>
              <p className="text-2xl font-bold">{displayedLessons.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Unique Subjects</p>
              <p className="text-2xl font-bold">{new Set(displayedLessons.map(l => l.subjectName)).size}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Grades Covered</p>
              <p className="text-2xl font-bold">{new Set(displayedLessons.map(l => l.grade)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Lessons</CardTitle>
          <CardDescription>All lessons registered for this academic year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayedLessons.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No lessons registered yet</p>
            ) : (
              displayedLessons.map(lesson => (
                <div key={lesson.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{lesson.subjectName}</p>
                        <p className="text-sm text-gray-600">
                          Grade {lesson.grade}, Class {lesson.className}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <p className="text-sm text-gray-600">Teacher</p>
                    <p className="font-semibold">{lesson.teacherName}</p>
                  </div>

                  {lesson.schedule && (
                    <div className="flex-1 text-center">
                      <p className="text-sm text-gray-600">Schedule</p>
                      <p className="text-sm font-medium">{lesson.schedule}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(lesson)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(lesson.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Lesson Registration Guidelines</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Each teacher must register all subjects they teach for each academic year</li>
                <li>• Lessons must include the grade and class information</li>
                <li>• Schedule information helps organize the school timetable</li>
                <li>• Only registered lessons can have grades submitted</li>
                <li>• You can edit lesson details until grades are registered</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
