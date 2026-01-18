// src/pages/patron/Report.tsx
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident' | 'disciplinary';
  date: string;
  author: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'action_required';
  summary: string;
  severity?: 'low' | 'medium' | 'high';
}

export default function PatronReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const reports: Report[] = [
    {
      id: '1',
      title: 'Daily Dormitory Inspection',
      type: 'daily',
      date: '2024-01-15',
      author: 'John Smith',
      status: 'submitted',
      summary: 'All beds in order, minor maintenance needed in Oak Hall'
    },
    {
      id: '2',
      title: 'Weekly Activity Report',
      type: 'weekly',
      date: '2024-01-14',
      author: 'Patron Office',
      status: 'reviewed',
      summary: 'Sports activities completed successfully'
    },
    {
      id: '3',
      title: 'Disciplinary Incident - Fighting',
      type: 'disciplinary',
      date: '2024-01-13',
      author: 'Security',
      status: 'action_required',
      summary: 'Fight between two Grade 11 students',
      severity: 'high'
    },
    {
      id: '4',
      title: 'Late Check-in Report',
      type: 'incident',
      date: '2024-01-12',
      author: 'Night Guard',
      status: 'submitted',
      summary: 'Three boys returned after curfew',
      severity: 'medium'
    },
    {
      id: '5',
      title: 'Monthly Dormitory Analysis',
      type: 'monthly',
      date: '2024-01-10',
      author: 'System',
      status: 'draft',
      summary: 'Occupancy statistics and maintenance schedule'
    },
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      case 'action_required': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'daily': return <Calendar className="h-4 w-4" />;
      case 'weekly': return <FileText className="h-4 w-4" />;
      case 'monthly': return <FileText className="h-4 w-4" />;
      case 'incident': return <AlertCircle className="h-4 w-4" />;
      case 'disciplinary': return <Shield className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={`ml-2 ${colors[severity as keyof typeof colors]}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Incidents</h1>
          <p className="text-muted-foreground">Create and manage dormitory, activity, and disciplinary reports</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Report
            </Button>
          </DialogTrigger>
          <CreateReportDialog onClose={() => setIsCreateDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="disciplinary">Disciplinary</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="action_required">Action Required</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>View and manage all generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    report.type === 'disciplinary' ? 'bg-red-100' : 
                    report.type === 'incident' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{report.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                      {getSeverityBadge(report.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground">{report.summary}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {report.date}
                      </span>
                      <span>By: {report.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.replace('_', ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Quick start with pre-defined templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              <span>Daily Inspection</span>
              <span className="text-xs text-muted-foreground">Routine check</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6" />
              <span>Incident Report</span>
              <span className="text-xs text-muted-foreground">For emergencies</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              <span>Disciplinary Report</span>
              <span className="text-xs text-muted-foreground">Behavior issues</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6" />
              <span>Activity Report</span>
              <span className="text-xs text-muted-foreground">Event summary</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateReportDialog({ onClose }: { onClose: () => void }) {
  const [reportType, setReportType] = useState('daily');

  return (
    <DialogContent className="sm:max-w-[700px] bg-white/90 backdrop-blur-sm">
      <DialogHeader>
        <DialogTitle>Create New Report</DialogTitle>
        <DialogDescription>
          Fill in the details for the new report. Disciplinary reports require immediate attention.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input id="title" placeholder="Enter report title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Report</SelectItem>
                <SelectItem value="weekly">Weekly Report</SelectItem>
                <SelectItem value="monthly">Monthly Report</SelectItem>
                <SelectItem value="incident">Incident Report</SelectItem>
                <SelectItem value="disciplinary">Disciplinary Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Report Date</Label>
          <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Executive Summary</Label>
          <Input id="summary" placeholder="Brief summary of the report" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Detailed Content</Label>
          <Textarea 
            id="content" 
            placeholder="Enter detailed report content here..." 
            className="min-h-[200px]"
          />
        </div>

        {(reportType === 'incident' || reportType === 'disciplinary') && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Incident Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Where did it occur?" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time of Incident</Label>
                <Input id="time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="students-involved">Students Involved</Label>
                <Input id="students-involved" placeholder="Names or student IDs" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="witnesses">Witnesses</Label>
              <Input id="witnesses" placeholder="Names of witnesses" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actions-taken">Immediate Actions Taken</Label>
              <Textarea id="actions-taken" placeholder="Describe immediate response..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea id="recommendations" placeholder="Recommended follow-up actions..." />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Attachments</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, images up to 10MB
            </p>
          </div>
        </div>
      </div>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outline" onClick={onClose}>
          Save as Draft
        </Button>
        <Button onClick={onClose}>
          Submit Report
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}