import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import apiService from "@/services/api"
import { Plus, Trash2, Edit2, BarChart3 } from "lucide-react"

const Grades = () => {
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newGrade, setNewGrade] = useState({
    student_id: "",
    subject: "",
    score: "",
    term: ""
  })

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    try {
      setLoading(true)
      const response = await apiService.getGrades()
      setGrades(response)
    } catch (error) {
      console.error("Failed to load grades", error)
      toast.error("Failed to load grades")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGrade = async () => {
    if (!newGrade.student_id || !newGrade.subject || !newGrade.score || !newGrade.term) {
      toast.error("Please fill all fields")
      return
    }

    try {
      await apiService.createGrade({
        ...newGrade,
        score: parseFloat(newGrade.score)
      })
      toast.success("Grade recorded successfully")
      setNewGrade({ student_id: "", subject: "", score: "", term: "" })
      setShowForm(false)
      fetchGrades()
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
      fetchGrades()
    } catch (error) {
      console.error("Failed to delete grade", error)
      toast.error("Failed to delete grade")
    }
  }

  const getGradeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 80) return "bg-blue-100 text-blue-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getGradeLabel = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    return "F"
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
            <Input
              placeholder="Student ID"
              value={newGrade.student_id}
              onChange={(e) => setNewGrade({ ...newGrade, student_id: e.target.value })}
            />
            <Input
              placeholder="Subject"
              value={newGrade.subject}
              onChange={(e) => setNewGrade({ ...newGrade, subject: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Score (0-100)"
              value={newGrade.score}
              onChange={(e) => setNewGrade({ ...newGrade, score: e.target.value })}
              min="0"
              max="100"
            />
            <Input
              placeholder="Term (e.g., First Term)"
              value={newGrade.term}
              onChange={(e) => setNewGrade({ ...newGrade, term: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateGrade}>Record</Button>
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
              No grades recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Student ID</th>
                    <th className="text-left py-2 px-4">Subject</th>
                    <th className="text-left py-2 px-4">Score</th>
                    <th className="text-left py-2 px-4">Grade</th>
                    <th className="text-left py-2 px-4">Term</th>
                    <th className="text-right py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{grade.student_id}</td>
                      <td className="py-3 px-4">{grade.subject}</td>
                      <td className="py-3 px-4 font-medium">{grade.score}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.score)}`}>
                          {getGradeLabel(grade.score)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{grade.term}</td>
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
