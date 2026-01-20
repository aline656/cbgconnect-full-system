import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Search,
  FileText,
  Upload,
  Eye,
  Loader,
  Filter,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import api from '@/services/api';

interface Document {
  id: number;
  student_id: number;
  student_name: string;
  document_type: 'birth_certificate' | 'transfer_certificate' | 'medical_report' | 'id_proof' | 'other';
  file_name: string;
  file_path: string;
  uploaded_date: string;
  expiry_date: string | null;
  status: 'verified' | 'pending' | 'rejected';
  notes: string;
}

interface Student {
  id: number;
  name: string;
  student_id: string;
  class_name: string;
}

const documentTypes = [
  { value: 'birth_certificate', label: 'Birth Certificate' },
  { value: 'transfer_certificate', label: 'Transfer Certificate' },
  { value: 'medical_report', label: 'Medical Report' },
  { value: 'id_proof', label: 'ID Proof' },
  { value: 'other', label: 'Other' }
];

export default function SecretaryDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  const [formData, setFormData] = useState({
    student_id: '',
    document_type: '',
    file_name: '',
    expiry_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchDocuments();
    fetchStudents();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Fetch documents from API
      const docs = await api.getDocuments();
      const normalized = (docs || []).map((d: any) => ({
        id: d.id,
        student_id: d.student_id,
        student_name: d.student_name || 'Unknown',
        document_type: d.document_type,
        file_name: d.file_path?.split('/').pop() || d.file_name,
        file_path: d.file_path,
        uploaded_date: d.created_at,
        expiry_date: d.expiry_date,
        status: d.status,
        notes: d.notes || ''
      }))
      setDocuments(normalized);
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      // Fetch students from API 
      const students = await api.getUsers('student');
      const normalized = (students || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        student_id: s.student_id,
        class_name: s.class_name || 'N/A'
      }))
      setStudents(normalized);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleAddDocument = async () => {
    if (!formData.student_id || !formData.document_type || !formData.file_name) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      const newDocument: Document = {
        id: documents.length + 1,
        student_id: parseInt(formData.student_id),
        student_name: students.find(s => s.id === parseInt(formData.student_id))?.name || '',
        document_type: formData.document_type as any,
        file_name: formData.file_name,
        file_path: `/uploads/${formData.file_name}`,
        uploaded_date: new Date().toISOString().split('T')[0],
        expiry_date: formData.expiry_date || null,
        status: 'pending',
        notes: formData.notes
      };

      setDocuments([...documents, newDocument]);
      toast.success('Document added successfully');
      setFormData({
        student_id: '',
        document_type: '',
        file_name: '',
        expiry_date: '',
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add document');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      setSaving(true);
      setDocuments(documents.filter(d => d.id !== id));
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDocument = (id: number) => {
    setDocuments(documents.map(d => 
      d.id === id ? {...d, status: 'verified' as const} : d
    ));
    toast.success('Document verified');
  };

  const handleRejectDocument = (id: number) => {
    setDocuments(documents.map(d => 
      d.id === id ? {...d, status: 'rejected' as const} : d
    ));
    toast.success('Document rejected');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.document_type === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: documents.length,
    verified: documents.filter(d => d.status === 'verified').length,
    pending: documents.filter(d => d.status === 'pending').length,
    rejected: documents.filter(d => d.status === 'rejected').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    return documentTypes.find(dt => dt.value === type)?.label || type;
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const days = Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days <= 30 && days >= 0;
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Documents</h1>
          <p className="text-muted-foreground">Manage and verify student documents</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50/50 backdrop-blur-sm border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/50 backdrop-blur-sm border-amber-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 backdrop-blur-sm border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="type">Document Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map(dt => (
                    <SelectItem key={dt.value} value={dt.value}>{dt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            {filteredDocuments.length} documents found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No documents found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium">{doc.student_name}</TableCell>
                        <TableCell>{getTypeLabel(doc.document_type)}</TableCell>
                        <TableCell className="text-blue-600 underline cursor-pointer">{doc.file_name}</TableCell>
                        <TableCell>{new Date(doc.uploaded_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {doc.expiry_date ? (
                            <div>
                              <p>{new Date(doc.expiry_date).toLocaleDateString()}</p>
                              {isExpired(doc.expiry_date) && (
                                <Badge className="bg-red-100 text-red-800 text-xs">Expired</Badge>
                              )}
                              {isExpiringSoon(doc.expiry_date) && !isExpired(doc.expiry_date) && (
                                <Badge className="bg-amber-100 text-amber-800 text-xs">Expiring Soon</Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setIsViewDialogOpen(true);
                              }}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {doc.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVerifyDocument(doc.id)}
                                  className="text-green-600"
                                  title="Verify"
                                >
                                  ✓
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRejectDocument(doc.id)}
                                  className="text-red-600"
                                  title="Reject"
                                >
                                  ✕
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>
              Upload a new student document
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="student">Student</Label>
              <Select 
                value={formData.student_id} 
                onValueChange={(value) => setFormData({...formData, student_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name} ({student.student_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Document Type</Label>
              <Select 
                value={formData.document_type} 
                onValueChange={(value) => setFormData({...formData, document_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(dt => (
                    <SelectItem key={dt.value} value={dt.value}>{dt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filename">File Name</Label>
              <Input
                id="filename"
                placeholder="e.g., birth_certificate.pdf"
                value={formData.file_name}
                onChange={(e) => setFormData({...formData, file_name: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="expiry">Expiry Date (Optional)</Label>
              <Input
                id="expiry"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddDocument} disabled={saving}>
                {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {saving ? 'Adding...' : 'Add Document'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      {selectedDocument && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Student</p>
                <p className="font-semibold">{selectedDocument.student_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Document Type</p>
                <p className="font-semibold">{getTypeLabel(selectedDocument.document_type)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">File Name</p>
                <p className="font-semibold">{selectedDocument.file_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Uploaded Date</p>
                <p className="font-semibold">{new Date(selectedDocument.uploaded_date).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(selectedDocument.status)}>
                  {selectedDocument.status}
                </Badge>
              </div>

              {selectedDocument.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-semibold">{selectedDocument.notes}</p>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
