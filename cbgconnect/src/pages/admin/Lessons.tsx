import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import apiService from "@/services/api"
import { Plus, Trash2, Edit2, BookOpen } from "lucide-react"

const Lessons = () => {
  const [lessons, setLessons] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    teacherId: "",
    subjectId: "",
    classId: "",
    dueDate: ""
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [lessonsRes, refDataRes] = await Promise.all([
        apiService.getLessons(),
        apiService.getLessonsRefData()
      ])
      setLessons(lessonsRes as any[])
      setTeachers((refDataRes as any)?.teachers || [])
      setSubjects((refDataRes as any)?.subjects || [])
      setClasses((refDataRes as any)?.classes || [])
    } catch (error) {
      console.error("Failed to load data", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLesson = async () => {
    if (!newLesson.title || !newLesson.teacherId || !newLesson.subjectId || !newLesson.classId) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      await apiService.createLesson({
        title: newLesson.title,
        description: newLesson.description,
        teacherId: parseInt(newLesson.teacherId),
        subjectId: parseInt(newLesson.subjectId),
        classId: parseInt(newLesson.classId),
        dueDate: newLesson.dueDate || null
      })
      toast.success("Lesson created successfully")
      setNewLesson({ title: "", description: "", teacherId: "", subjectId: "", classId: "", dueDate: "" })
      setShowForm(false)
      fetchAllData()
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
      fetchAllData()
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
            <div>
              <label className="text-sm font-medium">Lesson Title</label>
              <Input
                placeholder="e.g., Introduction to Algebra"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Lesson description"
                value={newLesson.description}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Teacher</label>
              <Select value={newLesson.teacherId} onValueChange={(value) => setNewLesson({ ...newLesson, teacherId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      Teacher {teacher.id} ({teacher.subject || 'General'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Subject</label>
              <Select value={newLesson.subjectId} onValueChange={(value) => setNewLesson({ ...newLesson, subjectId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Class</label>
              <Select value={newLesson.classId} onValueChange={(value) => setNewLesson({ ...newLesson, classId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name} (Grade {cls.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Due Date (Optional)</label>
              <Input
                type="date"
                value={newLesson.dueDate}
                onChange={(e) => setNewLesson({ ...newLesson, dueDate: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateLesson}>Create Lesson</Button>
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
              No lessons found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {lesson.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                    {lesson.dueDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(lesson.dueDate).toLocaleDateString()}
                      </p>
                    )}
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
