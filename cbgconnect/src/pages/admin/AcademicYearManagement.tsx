import { useState, useEffect } from "react"
import { Calendar, Plus, Archive, Edit2, Trash2, CheckCircle, AlertCircle, MoreVertical, Loader } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { academicYearApi } from "@/services/academicYearApi"

interface AcademicYear {
  id: string
  year: string
  startDate: string
  endDate: string
  status: 'active' | 'inactive' | 'completed' | 'archived'
  createdAt: string
  totalStudents: number
}

export default function AcademicYearManagement() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)
  const [formData, setFormData] = useState({
    year: '',
    startDate: '',
    endDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch academic years on component mount
  useEffect(() => {
    fetchAcademicYears()
  }, [])

  const fetchAcademicYears = async () => {
    try {
      setLoading(true)
      const data = await academicYearApi.getAll()
      setAcademicYears(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error('Failed to fetch academic years:', error)
      toast.error('Failed to load academic years')
      setAcademicYears([])
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.year.trim()) newErrors.year = 'Academic year is required (e.g., 2024-2025)'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      setSubmitting(true)
      if (editingYear) {
        // Update existing year
        await academicYearApi.update(editingYear.id, {
          year: formData.year,
          startDate: formData.startDate,
          endDate: formData.endDate
        })
        toast.success('Academic year updated successfully')
      } else {
        // Create new year
        await academicYearApi.create({
          year: formData.year,
          startDate: formData.startDate,
          endDate: formData.endDate
        })
        toast.success(`Academic year ${formData.year} created successfully`)
      }
      
      await fetchAcademicYears()
      setFormData({ year: '', startDate: '', endDate: '' })
      setEditingYear(null)
      setIsOpenDialog(false)
    } catch (error) {
      console.error('Failed to save academic year:', error)
      toast.error('Failed to save academic year')
    } finally {
      setSubmitting(false)
    }
  }

  const handleActivate = async (id: string) => {
    try {
      await academicYearApi.activate(id)
      await fetchAcademicYears()
      toast.success('Academic year activated')
    } catch (error) {
      console.error('Failed to activate academic year:', error)
      toast.error('Failed to activate academic year')
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await academicYearApi.archive(id)
      await fetchAcademicYears()
      toast.success('Academic year archived')
    } catch (error) {
      console.error('Failed to archive academic year:', error)
      toast.error('Failed to archive academic year')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this academic year?')) {
      try {
        await academicYearApi.delete(id)
        await fetchAcademicYears()
        toast.success('Academic year deleted')
      } catch (error) {
        console.error('Failed to delete academic year:', error)
        toast.error('Failed to delete academic year')
      }
    }
  }

  const handleEdit = (year: AcademicYear) => {
    setEditingYear(year)
    setFormData({
      year: year.year,
      startDate: year.startDate,
      endDate: year.endDate
    })
    setIsOpenDialog(true)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const activeYear = academicYears.find(ay => ay.status === 'active')
  const allYears = academicYears
  const archivedYears = academicYears.filter(ay => ay.status === 'archived')

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Year Management</h1>
          <p className="text-gray-600 mt-2">Create and manage academic years with terms and student data</p>
        </div>
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingYear(null)
                setFormData({ year: '', startDate: '', endDate: '' })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Academic Year
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingYear ? 'Edit Academic Year' : 'Create New Academic Year'}
              </DialogTitle>
              <DialogDescription>
                {editingYear 
                  ? 'Update the academic year details'
                  : 'Create a new academic year that will contain all student and grade data for that period'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="year">Academic Year *</Label>
                <Input
                  id="year"
                  placeholder="e.g., 2024-2025"
                  value={formData.year}
                  onChange={(e) => {
                    setFormData({...formData, year: e.target.value})
                    if (errors.year) setErrors({...errors, year: ''})
                  }}
                  className={errors.year ? 'border-red-500' : ''}
                  disabled={submitting}
                />
                {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year}</p>}
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData({...formData, startDate: e.target.value})
                    if (errors.startDate) setErrors({...errors, startDate: ''})
                  }}
                  className={errors.startDate ? 'border-red-500' : ''}
                  disabled={submitting}
                />
                {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData({...formData, endDate: e.target.value})
                    if (errors.endDate) setErrors({...errors, endDate: ''})
                  }}
                  className={errors.endDate ? 'border-red-500' : ''}
                  disabled={submitting}
                />
                {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpenDialog(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingYear ? 'Update Academic Year' : 'Create Academic Year'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Year Overview */}
      {activeYear && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle>Active Academic Year: {activeYear.year}</CardTitle>
                  <CardDescription>
                    All new registrations will be added to this academic year
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-green-600">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="text-lg font-semibold">{new Date(activeYear.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="text-lg font-semibold">{new Date(activeYear.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-lg font-semibold">{activeYear.totalStudents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold">Running</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Academic Years List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Years ({academicYears.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({academicYears.filter(ay => ay.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({academicYears.filter(ay => ay.status === 'archived').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {academicYears.map(year => (
            <Card key={year.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{year.year}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-1 justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Students</p>
                      <p className="text-lg font-semibold">{year.totalStudents}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(year.status)}>
                        {year.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {year.status !== 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleActivate(year.id)}
                      >
                        Activate
                      </Button>
                    )}
                    {year.status !== 'archived' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchive(year.id)}
                      >
                        <Archive className="mr-1 h-4 w-4" />
                        Archive
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit2 className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          View Terms
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          View Students
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(year.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-4">
          {academicYears.filter(ay => ay.status === 'active').map(year => (
            <Card key={year.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{year.year}</h3>
                    <p className="text-sm text-gray-600">Active since {new Date(year.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4 mt-4">
          {academicYears.filter(ay => ay.status === 'archived').map(year => (
            <Card key={year.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{year.year}</h3>
                    <p className="text-sm text-gray-600">Archived - Contains {year.totalStudents} student records</p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">How Academic Years Work</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Each academic year contains 3 terms: First, Second, and Third</li>
                <li>• All student registrations are linked to the active academic year</li>
                <li>• Teachers register lessons (subjects) for each academic year and class</li>
                <li>• Grades are registered by secretary/admin for each term</li>
                <li>• When an academic year ends, it's archived with all data saved for records</li>
                <li>• New students can be registered in the new academic year while old records remain</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
