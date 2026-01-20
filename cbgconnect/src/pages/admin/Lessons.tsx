import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import apiService from "@/services/api"
import { Plus, Trash2, Eye, Edit2, BookOpen } from "lucide-react"

const Lessons = () => {
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newLesson, setNewLesson] = useState({
    name: "",
    description: "",
    teacher_id: "",
    class_id: ""
  })

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      const response = await apiService.getLessons()
      setLessons(response)
    } catch (error) {
      console.error("Failed to load lessons", error)
      toast.error("Failed to load lessons")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLesson = async () => {
    if (!newLesson.name || !newLesson.teacher_id || !newLesson.class_id) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      await apiService.createLesson(newLesson)
      toast.success("Lesson created successfully")
      setNewLesson({ name: "", description: "", teacher_id: "", class_id: "" })
      setShowForm(false)
      fetchLessons()
    } catch (error) {
      console.error("Failed to create lesson", error)
      toast.error("Failed to create lesson")
    }
  }

  const handleDeleteLesson = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return

    try {
      await apiService.deleteLesson(id)
      toast.success("Lesson deleted successfully")
      fetchLessons()
    } catch (error) {
      console.error("Failed to delete lesson", error)
      toast.error("Failed to delete lesson")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lessons Management</h2>
          <p className="text-gray-600 mt-1">Manage teacher lessons and assignments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Lesson
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Lesson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Lesson name"
              value={newLesson.name}
              onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={newLesson.description}
              onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
            />
            <Input
              placeholder="Teacher ID"
              value={newLesson.teacher_id}
              onChange={(e) => setNewLesson({ ...newLesson, teacher_id: e.target.value })}
            />
            <Input
              placeholder="Class ID"
              value={newLesson.class_id}
              onChange={(e) => setNewLesson({ ...newLesson, class_id: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateLesson}>Create</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Teacher Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No lessons found.
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {lesson.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Lessons
