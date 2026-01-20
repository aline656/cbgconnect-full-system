import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import apiService from "@/services/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Archive, Plus, Trash2, Eye, Edit2, X } from "lucide-react"

const AcademicYears = () => {
  const [years, setYears] = useState<any[]>([])
  const [archived, setArchived] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("current")
  const [showForm, setShowForm] = useState(false)
  const [newYear, setNewYear] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: "active"
  })

  useEffect(() => {
    fetchAcademicYears()
  }, [])

  const fetchAcademicYears = async () => {
    try {
      setLoading(true)
      const response = await apiService.getArchivedAcademicYears()
      setArchived(response)
      // Separate current from archived
      const currentYears = response.filter((y: any) => y.status === 'active' || !y.archived_at)
      setYears(currentYears)
    } catch (error) {
      console.error("Failed to load academic years", error)
      toast.error("Failed to load academic years")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateYear = async () => {
    if (!newYear.name || !newYear.startDate || !newYear.endDate) {
      toast.error("Please fill all fields")
      return
    }

    try {
      await apiService.createAcademicYear({
        name: newYear.name,
        start_date: newYear.startDate,
        end_date: newYear.endDate,
        status: newYear.status
      })
      toast.success("Academic year created successfully")
      setNewYear({ name: "", startDate: "", endDate: "", status: "active" })
      setShowForm(false)
      fetchAcademicYears()
    } catch (error) {
      console.error("Failed to create academic year", error)
      toast.error("Failed to create academic year")
    }
  }

  const handleArchiveYear = async (id: string) => {
    if (!window.confirm("Are you sure you want to archive this academic year?")) return

    try {
      await apiService.updateAcademicYear(id, { status: 'archived' })
      toast.success("Academic year archived successfully")
      fetchAcademicYears()
    } catch (error) {
      console.error("Failed to archive academic year", error)
      toast.error("Failed to archive academic year")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Academic Years</h2>
          <p className="text-gray-600 mt-1">Manage academic years and student archives</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Academic Year
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create New Academic Year</CardTitle>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Academic Year Name (e.g., 2025/2026)"
              value={newYear.name}
              onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Start Date"
                value={newYear.startDate}
                onChange={(e) => setNewYear({ ...newYear, startDate: e.target.value })}
              />
              <Input
                type="date"
                placeholder="End Date"
                value={newYear.endDate}
                onChange={(e) => setNewYear({ ...newYear, endDate: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateYear} className="bg-green-600 hover:bg-green-700">
                Create Academic Year
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="current">Current Years</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Active Academic Years</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : years.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No active academic years. Create one to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {years.map((year) => (
                    <div key={year.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="font-medium text-lg">{year.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {year.start_date ? new Date(year.start_date).toLocaleDateString() : 'N/A'} - {year.end_date ? new Date(year.end_date).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Status: {year.status || 'active'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleArchiveYear(year.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived">
          <Card>
            <CardHeader>
              <CardTitle>Archived Academic Years</CardTitle>
              <CardDescription>Previously completed academic years</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : archived.filter(y => y.status === 'archived' || y.archived_at).length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No archived academic years yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {archived.filter(y => y.status === 'archived' || y.archived_at).map((year) => (
                    <div key={year.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <p className="font-medium text-lg">{year.name || year.year}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {year.start_date ? new Date(year.start_date).toLocaleDateString() : 'N/A'} - {year.end_date ? new Date(year.end_date).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {year.total_students || 0} students archived
                          {year.archived_at && ` • Archived on ${new Date(year.archived_at).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AcademicYears
