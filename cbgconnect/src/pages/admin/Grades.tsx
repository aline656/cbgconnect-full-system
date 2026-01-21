import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import apiService from "@/services/api"
import { Plus, Trash2, Edit2 } from "lucide-react"

const Grades = () => {
  const [grades, setGrades] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newGrade, setNewGrade] = useState({
    studentId: "",
    subjectId: "",
    marksObtained: "",
    totalMarks: "100",
    gradedDate: ""
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [gradesRes, refDataRes] = await Promise.all([
        apiService.getGrades(),
        apiService.getGradeRefData()
      ])
      setGrades(gradesRes as any[])
      setStudents((refDataRes as any)?.students || [])
      setSubjects((refDataRes as any)?.subjects || [])
      // terms data available but not used yet
    } catch (error) {
      console.error("Failed to load data", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGrade = async () => {
    if (!newGrade.studentId || !newGrade.subjectId || !newGrade.marksObtained || !newGrade.totalMarks) {
      toast.error("Please fill all fields")
      return
    }

    try {
      const gradeValue = calculateGrade(parseFloat(newGrade.marksObtained), parseFloat(newGrade.totalMarks))
      
      await apiService.createGrade({
        studentId: parseInt(newGrade.studentId),
        subjectId: parseInt(newGrade.subjectId),
        marksObtained: parseFloat(newGrade.marksObtained),
        totalMarks: parseFloat(newGrade.totalMarks),
        grade: gradeValue,
        gradedDate: newGrade.gradedDate || new Date().toISOString().split('T')[0]
      })
      toast.success("Grade recorded successfully")
      setNewGrade({ studentId: "", subjectId: "", marksObtained: "", totalMarks: "100", gradedDate: "" })
      setShowForm(false)
      fetchAllData()
    } catch (error) {
      console.error("Failed to create grade", error)
      toast.error("Failed to create grade")
    }
  }

  const handleDeleteGrade = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return

    try {
      await apiService.deleteGrade(id)
      toast.success("Grade deleted successfully")
      fetchAllData()
    } catch (error) {
      console.error("Failed to delete grade", error)
      toast.error("Failed to delete grade")
    }
  }

  const calculateGrade = (marks: number, total: number): string => {
    const percentage = (marks / total) * 100
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-800"
      case "B": return "bg-blue-100 text-blue-800"
      case "C": return "bg-yellow-100 text-yellow-800"
      case "D": return "bg-orange-100 text-orange-800"
      default: return "bg-red-100 text-red-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grades Management</h2>
          <p className="text-gray-600 mt-1">Register and manage student grades</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Record Grade
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record New Grade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Student</label>
              <Select value={newGrade.studentId} onValueChange={(value) => setNewGrade({ ...newGrade, studentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Subject</label>
              <Select value={newGrade.subjectId} onValueChange={(value) => setNewGrade({ ...newGrade, subjectId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Marks Obtained</label>
              <Input
                type="number"
                placeholder="0"
                value={newGrade.marksObtained}
                onChange={(e) => setNewGrade({ ...newGrade, marksObtained: e.target.value })}
                min="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Total Marks</label>
              <Input
                type="number"
                placeholder="100"
                value={newGrade.totalMarks}
                onChange={(e) => setNewGrade({ ...newGrade, totalMarks: e.target.value })}
                min="1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Graded Date</label>
              <Input
                type="date"
                value={newGrade.gradedDate}
                onChange={(e) => setNewGrade({ ...newGrade, gradedDate: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateGrade}>Record Grade</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Grade Registry</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : grades.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No grades recorded yet. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium">Student</th>
                    <th className="text-left py-3 px-4 font-medium">Subject</th>
                    <th className="text-right py-3 px-4 font-medium">Marks</th>
                    <th className="text-center py-3 px-4 font-medium">Grade</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{grade.studentName || grade.studentId}</td>
                      <td className="py-3 px-4">{grade.subjectName || grade.subject}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {grade.score}/{grade.letterGrade === 'A' ? '100' : '100'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(grade.letterGrade)}`}>
                          {grade.letterGrade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(grade.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGrade(grade.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Grades
