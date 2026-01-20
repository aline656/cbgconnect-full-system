import { useEffect, useState } from "react"
import { Calendar, Plus, Edit2, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import api from "@/services/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Term {
  id: string
  name: 'First Term' | 'Second Term' | 'Third Term'
  startDate: string
  endDate: string
  status: 'active' | 'inactive' | 'completed'
}

// Terms will be loaded from API

interface TermsManagementProps {
  academicYearId?: string
  academicYearName?: string
}

export default function TermsManagement({ academicYearId = '1', academicYearName = '2024-2025' }: TermsManagementProps) {
  const [terms, setTerms] = useState<Term[]>([])
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '' as 'First Term' | 'Second Term' | 'Third Term' | '',
    startDate: '',
    endDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load terms from API
    api.getTerms(academicYearId)
      .then((rows) => {
        const normalized = (rows || []).map((r: any) => ({
          id: String(r.id),
          name: r.name,
          startDate: r.startDate || r.start_date,
          endDate: r.endDate || r.end_date,
          status: r.status
        }))
        setTerms(normalized)
      })
      .catch((err) => {
        console.error('Failed to load terms', err)
        toast.error('Failed to load terms')
      })
      .finally(() => setLoading(false))
  }, [academicYearId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Term name is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }

    // Check if term already exists (for new terms)
    if (!editingTerm && formData.name && terms.some(t => t.name === formData.name)) {
      newErrors.name = 'This term already exists'
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

    if (editingTerm) {
      // Update term via API
      api.updateTerm(editingTerm.id, {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate
      })
        .then(() => {
          setTerms(terms.map(t => 
            t.id === editingTerm.id
              ? {
                  ...t,
                  name: formData.name as 'First Term' | 'Second Term' | 'Third Term',
                  startDate: formData.startDate,
                  endDate: formData.endDate
                }
              : t
          ))
          toast.success('Term updated successfully')
          setFormData({ name: '', startDate: '', endDate: '' })
          setEditingTerm(null)
          setIsOpenDialog(false)
        })
        .catch((err) => {
          console.error('Failed to update term', err)
          toast.error('Failed to update term')
        })
    } else {
      // Create new term via API
      api.createTerm({
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        academicYearId
      })
        .then((newTerm) => {
          setTerms([...terms, {
            id: String(newTerm.id),
            name: newTerm.name,
            startDate: newTerm.startDate,
            endDate: newTerm.endDate,
            status: 'inactive'
          }])
          toast.success('Term created successfully')
          setFormData({ name: '', startDate: '', endDate: '' })
          setIsOpenDialog(false)
        })
        .catch((err) => {
          console.error('Failed to create term', err)
          toast.error('Failed to create term')
        })
    }
  }

  const handleEdit = (term: Term) => {
    setEditingTerm(term)
    setFormData({
      name: term.name,
      startDate: term.startDate,
      endDate: term.endDate
    })
    setIsOpenDialog(true)
  }

  const handleActivate = (id: string) => {
    api.updateTerm(id, { status: 'active' })
      .then(() => {
        setTerms(terms.map(t => ({
          ...t,
          status: t.id === id ? 'active' : 'inactive'
        })))
        toast.success('Term activated')
      })
      .catch((err) => {
        console.error('Failed to activate term', err)
        toast.error('Failed to activate term')
      })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this term?')) {
      api.deleteTerm(id)
        .then(() => {
          setTerms(terms.filter(t => t.id !== id))
          toast.success('Term deleted')
        })
        .catch((err) => {
          console.error('Failed to delete term', err)
          toast.error('Failed to delete term')
        })
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Terms Management</h1>
          <p className="text-gray-600 mt-2">Manage terms for {academicYearName}</p>
        </div>
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingTerm(null)
                setFormData({ name: '', startDate: '', endDate: '' })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Term
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTerm ? 'Edit Term' : 'Create New Term'}
              </DialogTitle>
              <DialogDescription>
                {editingTerm 
                  ? 'Update the term details' 
                  : 'Create a new term for this academic year'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Term Name *</Label>
                <Select value={formData.name} onValueChange={(value) => {
                  setFormData({...formData, name: value as any})
                  if (errors.name) setErrors({...errors, name: ''})
                }}>
                  <SelectTrigger className={errors.name ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Term">First Term</SelectItem>
                    <SelectItem value="Second Term">Second Term</SelectItem>
                    <SelectItem value="Third Term">Third Term</SelectItem>
                  </SelectContent>
                </Select>
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
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
                />
                {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsOpenDialog(false)
                    setEditingTerm(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingTerm ? 'Update Term' : 'Create Term'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Terms Overview */}
      <div className="grid grid-cols-3 gap-4">
        {terms.map(term => (
          <Card key={term.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{term.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(term.status)}>
                  {term.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-gray-600">Duration</p>
                <p className="font-semibold">
                  {Math.ceil((new Date(term.endDate).getTime() - new Date(term.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                {term.status !== 'active' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleActivate(term.id)}
                    className="flex-1"
                  >
                    Activate
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(term)}
                  className="flex-1"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDelete(term.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Term Management Tips</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Each academic year must have exactly 3 terms (First, Second, Third)</li>
                <li>• Only one term can be active at a time</li>
                <li>• Grades can only be registered during the active term</li>
                <li>• Completed terms cannot be edited</li>
                <li>• Term dates should align with your school calendar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
