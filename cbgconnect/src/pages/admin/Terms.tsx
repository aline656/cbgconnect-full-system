import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import apiService from "@/services/api"
import { Plus, Trash2, Eye, Edit2, Calendar } from "lucide-react"

const Terms = () => {
  const [terms, setTerms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newTerm, setNewTerm] = useState({ name: "", start_date: "", end_date: "" })

  useEffect(() => {
    fetchTerms()
  }, [])

  const fetchTerms = async () => {
    try {
      setLoading(true)
      const response = await apiService.getTerms()
      setTerms(response)
    } catch (error) {
      console.error("Failed to load terms", error)
      toast.error("Failed to load terms")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTerm = async () => {
    if (!newTerm.name || !newTerm.start_date || !newTerm.end_date) {
      toast.error("Please fill all fields")
      return
    }

    try {
      await apiService.createTerm(newTerm)
      toast.success("Term created successfully")
      setNewTerm({ name: "", start_date: "", end_date: "" })
      setShowForm(false)
      fetchTerms()
    } catch (error) {
      console.error("Failed to create term", error)
      toast.error("Failed to create term")
    }
  }

  const handleDeleteTerm = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this term?")) return

    try {
      await apiService.deleteTerm(id)
      toast.success("Term deleted successfully")
      fetchTerms()
    } catch (error) {
      console.error("Failed to delete term", error)
      toast.error("Failed to delete term")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Terms Management</h2>
          <p className="text-gray-600 mt-1">Create and manage academic terms</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Term
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Term</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Term name (e.g., First Term)"
              value={newTerm.name}
              onChange={(e) => setNewTerm({ ...newTerm, name: e.target.value })}
            />
            <Input
              type="date"
              value={newTerm.start_date}
              onChange={(e) => setNewTerm({ ...newTerm, start_date: e.target.value })}
            />
            <Input
              type="date"
              value={newTerm.end_date}
              onChange={(e) => setNewTerm({ ...newTerm, end_date: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateTerm}>Create</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Academic Terms</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : terms.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No terms found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {terms.map((term) => (
                <div key={term.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{term.name}</p>
                    <p className="text-sm text-gray-600">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(term.start_date).toLocaleDateString()} - {new Date(term.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTerm(term.id)}
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

export default Terms
