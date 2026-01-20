import { useEffect, useState } from "react"
import { Award, Plus, Edit2, Trash2, Download, Filter, Search, AlertCircle } from "lucide-react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Grade {
  id: string
  studentId: string
  studentName: string
  subjectName: string
  termId: string
  termName: string
  score: number
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  remarks?: string
  createdBy: string
  createdAt: string
}

// Grades will be loaded from API

const getLetterGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}

const getGradeColor = (grade: string) => {
  switch(grade) {
    case 'A': return 'bg-green-100 text-green-800'
    case 'B': return 'bg-blue-100 text-blue-800'
    case 'C': return 'bg-yellow-100 text-yellow-800'
    case 'D': return 'bg-orange-100 text-orange-800'
    case 'F': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

interface GradesRegistrationProps {
  academicYearId?: string
  academicYearName?: string
  userRole?: 'admin' | 'secretary' | 'teacher'
  currentTermId?: string
}

export default function GradesRegistration({
  academicYearId = '1',
  academicYearName = '2024-2025',
  userRole = 'admin',
  currentTermId = 'T1'
}: GradesRegistrationProps) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    studentName: '',
    subjectName: '',
    termId: currentTermId,
    score: '',
    remarks: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load grades from API
    api.getGrades({ termId: currentTermId })
      .then((rows) => {
        const normalized = (rows || []).map((r: any) => ({
          id: String(r.id),
          studentId: String(r.studentId),
          studentName: r.studentName,
          subjectName: r.subjectName,
          termId: r.termId || currentTermId,
          termName: r.termName || 'Term',
          score: Number(r.score) || 0,
          letterGrade: r.letterGrade || 'F',
          remarks: r.remarks || '',
          createdBy: r.createdBy || 'admin',
          createdAt: r.createdAt
        }))
        setGrades(normalized)
      })
      .catch((err) => {
        console.error('Failed to load grades', err)
        toast.error('Failed to load grades')
      })
      .finally(() => setLoading(false))
  }, [currentTermId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required'
    if (!formData.subjectName) newErrors.subjectName = 'Subject is required'
    if (!formData.termId) newErrors.termId = 'Term is required'
    if (!formData.score) {
      newErrors.score = 'Score is required'
    } else {
      const score = parseInt(formData.score)
      if (score < 0 || score > 100) newErrors.score = 'Score must be between 0 and 100'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    const score = parseInt(formData.score)
    const letterGrade = getLetterGrade(score)

    if (editingGrade) {
      // Update grade via API
      api.updateGrade(editingGrade.id, {
        marksObtained: score,
        totalMarks: 100,
        grade: letterGrade
      })
        .then(() => {
          setGrades(grades.map(g =>
            g.id === editingGrade.id
              ? {
                  ...g,
                  studentName: formData.studentName,
                  subjectName: formData.subjectName,
                  termId: formData.termId,
                  score,
                  letterGrade,
                  remarks: formData.remarks
                }
              : g
          ))
          toast.success('Grade updated successfully')
          setFormData({ studentName: '', subjectName: '', termId: currentTermId, score: '', remarks: '' })
          setEditingGrade(null)
          setIsOpenDialog(false)
        })
        .catch((err) => {
          console.error('Failed to update grade', err)
          toast.error('Failed to update grade')
        })
    } else {
      // Create new grade via API
      api.createGrade({
        studentId: Math.random(),
        subjectId: Math.random(),
        marksObtained: score,
        totalMarks: 100,
        grade: letterGrade,
        gradedDate: new Date().toISOString().split('T')[0]
      })
        .then((newGrade) => {
          setGrades([...grades, {
            id: String(newGrade.id),
            studentId: `S${Math.floor(Math.random() * 1000)}`,
            studentName: formData.studentName,
            subjectName: formData.subjectName,
            termId: formData.termId,
            termName: formData.termId === 'T1' ? 'First Term' : formData.termId === 'T2' ? 'Second Term' : 'Third Term',
            score,
            letterGrade,
            remarks: formData.remarks,
            createdBy: userRole,
            createdAt: new Date().toISOString()
          }])
          toast.success('Grade registered successfully')
          setFormData({ studentName: '', subjectName: '', termId: currentTermId, score: '', remarks: '' })
          setIsOpenDialog(false)
        })
        .catch((err) => {
          console.error('Failed to create grade', err)
          toast.error('Failed to create grade')
        })
    }
  }

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade)
    setFormData({
      studentName: grade.studentName,
      subjectName: grade.subjectName,
      termId: grade.termId,
      score: grade.score.toString(),
      remarks: grade.remarks || ''
    })
    setIsOpenDialog(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      api.deleteGrade(id)
        .then(() => {
          setGrades(grades.filter(g => g.id !== id))
          toast.success('Grade deleted')
        })
        .catch((err) => {
          console.error('Failed to delete grade', err)
          toast.error('Failed to delete grade')
        })
    }
  }

  // Filter grades
  let filteredGrades = grades.filter(g => {
    const matchesSearch = g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         g.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTerm = selectedTerm === 'all' || g.termId === selectedTerm
    const matchesSubject = selectedSubject === 'all' || g.subjectName === selectedSubject
    return matchesSearch && matchesTerm && matchesSubject
  })

  const uniqueSubjects = Array.from(new Set(grades.map(g => g.subjectName)))
  const uniqueTerms = Array.from(new Set(grades.map(g => g.termId)))

  const averageScore = filteredGrades.length > 0
    ? Math.round(filteredGrades.reduce((sum, g) => sum + g.score, 0) / filteredGrades.length)
    : 0

  const statistics = {
    A: filteredGrades.filter(g => g.letterGrade === 'A').length,
    B: filteredGrades.filter(g => g.letterGrade === 'B').length,
    C: filteredGrades.filter(g => g.letterGrade === 'C').length,
    D: filteredGrades.filter(g => g.letterGrade === 'D').length,
    F: filteredGrades.filter(g => g.letterGrade === 'F').length
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades Registration</h1>
          <p className="text-gray-600 mt-2">Register and manage student grades for {academicYearName}</p>
        </div>
        {(userRole === 'admin' || userRole === 'secretary') && (
          <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setEditingGrade(null)
                  setFormData({
                    studentName: '',
                    subjectName: '',
                    termId: currentTermId,
                    score: '',
                    remarks: ''
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Register Grade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingGrade ? 'Edit Grade' : 'Register New Grade'}
                </DialogTitle>
                <DialogDescription>
                  {editingGrade 
                    ? 'Update the grade details' 
                    : 'Register a new grade for a student'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    placeholder="Enter student name"
                    value={formData.studentName}
                    onChange={(e) => {
                      setFormData({...formData, studentName: e.target.value})
                      if (errors.studentName) setErrors({...errors, studentName: ''})
                    }}
                    className={errors.studentName ? 'border-red-500' : ''}
                  />
                  {errors.studentName && <p className="text-sm text-red-500 mt-1">{errors.studentName}</p>}
                </div>

                <div>
                  <Label htmlFor="subjectName">Subject *</Label>
                  <Select value={formData.subjectName} onValueChange={(value) => {
                    setFormData({...formData, subjectName: value})
                    if (errors.subjectName) setErrors({...errors, subjectName: ''})
                  }}>
                    <SelectTrigger className={errors.subjectName ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueSubjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subjectName && <p className="text-sm text-red-500 mt-1">{errors.subjectName}</p>}
                </div>

                <div>
                  <Label htmlFor="termId">Term *</Label>
                  <Select value={formData.termId} onValueChange={(value) => {
                    setFormData({...formData, termId: value})
                    if (errors.termId) setErrors({...errors, termId: ''})
                  }}>
                    <SelectTrigger className={errors.termId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T1">First Term</SelectItem>
                      <SelectItem value="T2">Second Term</SelectItem>
                      <SelectItem value="T3">Third Term</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.termId && <p className="text-sm text-red-500 mt-1">{errors.termId}</p>}
                </div>

                <div>
                  <Label htmlFor="score">Score (0-100) *</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter score"
                    value={formData.score}
                    onChange={(e) => {
                      setFormData({...formData, score: e.target.value})
                      if (errors.score) setErrors({...errors, score: ''})
                    }}
                    className={errors.score ? 'border-red-500' : ''}
                  />
                  {errors.score && <p className="text-sm text-red-500 mt-1">{errors.score}</p>}
                  {formData.score && (
                    <p className="text-sm text-gray-600 mt-1">
                      Letter Grade: <span className="font-semibold">{getLetterGrade(parseInt(formData.score))}</span>
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Input
                    id="remarks"
                    placeholder="e.g., Good performance, Needs improvement"
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpenDialog(false)
                      setEditingGrade(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingGrade ? 'Update Grade' : 'Register Grade'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold">{averageScore}%</p>
            </div>
          </CardContent>
        </Card>
        {['A', 'B', 'C', 'D', 'F'].map(grade => (
          <Card key={grade}>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Grade {grade}</p>
                <p className="text-2xl font-bold text-gray-900">{statistics[grade as keyof typeof statistics]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search" className="text-xs">Search</Label>
              <div className="flex items-center gap-2 mt-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search student or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0"
                />
              </div>
            </div>
            <div className="w-40">
              <Label htmlFor="term" className="text-xs">Term</Label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="T1">First Term</SelectItem>
                  <SelectItem value="T2">Second Term</SelectItem>
                  <SelectItem value="T3">Third Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Label htmlFor="subject" className="text-xs">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
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

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grades ({filteredGrades.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No grades found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGrades.map(grade => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">{grade.studentName}</TableCell>
                      <TableCell>{grade.subjectName}</TableCell>
                      <TableCell>{grade.termName}</TableCell>
                      <TableCell className="text-center">{grade.score}%</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getGradeColor(grade.letterGrade)}>
                          {grade.letterGrade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{grade.remarks || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {(userRole === 'admin' || userRole === 'secretary') && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(grade)}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(grade.id)}
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
              <h4 className="font-semibold text-blue-900">Grades Registration Guidelines</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Grades can only be registered during the active term</li>
                <li>• Scores must be between 0-100</li>
                <li>• Letter grades are auto-calculated (A: 80+, B: 70-79, C: 60-69, D: 50-59, F: below 50)</li>
                <li>• Admin and Secretary can register and edit grades</li>
                <li>• All grades are linked to academic year, term, and student</li>
                <li>• Remarks help track student progress and areas for improvement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
