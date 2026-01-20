// src/pages/metron/GirlsManage.tsx
import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  Mail,
  Phone,
  Home,
  School,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import apiService from '@/services/api';

interface Girl {
  id: string;
  name: string;
  studentId: string;
  type: 'internal' | 'external';
  grade: string;
  className: string;
  age: number;
  guardianName: string;
  guardianContact: string;
  email: string;
  status: 'active' | 'inactive' | 'graduated';
  admissionDate: string;
  activities: string[];
  dormitory?: string;
  bed?: string;
}

export default function GirlsManage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'internal' | 'external'>('all');
  const [girls, setGirls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch girls data from database
  useEffect(() => {
    const fetchGirls = async () => {
      try {
        setLoading(true);
        const response = await apiService.getGirls();
        setGirls(response.girls || []);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch girls:', err);
        setError('Failed to load girls data');
      } finally {
        setLoading(false);
      }
    };

    fetchGirls();
  }, []);

  const filteredGirls = girls.filter(girl => {
    const matchesSearch = girl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         girl.studentId.includes(searchTerm);
    const matchesType = selectedType === 'all' || girl.type === selectedType;
    return matchesSearch && matchesType;
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive font-medium">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Girls Management</h1>
          <p className="text-muted-foreground">Manage internal and external girls information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Girl
            </Button>
          </DialogTrigger>
          <AddGirlDialog onClose={() => setIsAddDialogOpen(false)} />
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
                  placeholder="Search by name or student ID..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
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

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Girls ({girls.length})</TabsTrigger>
          <TabsTrigger value="internal">Internal Girls ({girls.filter(g => g.type === 'internal').length})</TabsTrigger>
          <TabsTrigger value="external">External Girls ({girls.filter(g => g.type === 'external').length})</TabsTrigger>
          <TabsTrigger value="active">Active ({girls.filter(g => g.status === 'active').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGirls.map((girl) => (
              <GirlCard key={girl.id} girl={girl} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GirlCard({ girl }: { girl: Girl }) {
  return (
    <Card className="bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${girl.name}`} />
              <AvatarFallback>{girl.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{girl.name}</CardTitle>
              <CardDescription>{girl.studentId}</CardDescription>
            </div>
          </div>
          <Badge variant={girl.type === 'internal' ? 'default' : 'secondary'}>
            {girl.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <School className="mr-2 h-3 w-3 text-muted-foreground" />
            <span>Grade {girl.grade} - {girl.className}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
            <span>{girl.age} years</span>
          </div>
          {girl.dormitory && (
            <div className="flex items-center col-span-2">
              <Home className="mr-2 h-3 w-3 text-muted-foreground" />
              <span>{girl.dormitory} - Bed {girl.bed}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
            <span className="truncate">{girl.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
            <span>{girl.guardianContact}</span>
          </div>
        </div>

        {girl.activities.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Activities:</p>
            <div className="flex flex-wrap gap-1">
              {girl.activities.map((activity, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AddGirlDialog({ onClose }: { onClose: () => void }) {
  const [girlType, setGirlType] = useState<'internal' | 'external'>('internal');

  return (
    <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-sm">
      <DialogHeader>
        <DialogTitle>Add New Girl</DialogTitle>
        <DialogDescription>
          Enter the details for the new student. Internal girls will require dormitory assignment.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Tabs value={girlType} onValueChange={(value) => setGirlType(value as 'internal' | 'external')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internal">Internal Girl</TabsTrigger>
            <TabsTrigger value="external">External Girl</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" placeholder="GS2024001" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {['9', '10', '11', '12'].map((grade) => (
                  <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="className">Class</Label>
            <Input id="className" placeholder="e.g., Science A" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" placeholder="16" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admissionDate">Admission Date</Label>
            <Input id="admissionDate" type="date" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="student@school.edu" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardianName">Guardian Name</Label>
          <Input id="guardianName" placeholder="Guardian's full name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardianContact">Guardian Contact</Label>
          <Input id="guardianContact" placeholder="+1234567890" />
        </div>

        {girlType === 'internal' && (
          <div className="space-y-2">
            <Label>Dormitory Assignment</Label>
            <div className="grid grid-cols-2 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select dormitory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rose-hall">Rose Hall</SelectItem>
                  <SelectItem value="lily-wing">Lily Wing</SelectItem>
                  <SelectItem value="jasmine-block">Jasmine Block</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select bed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Bed A</SelectItem>
                  <SelectItem value="b">Bed B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="activities">Activities (comma separated)</Label>
          <Input id="activities" placeholder="Volleyball, Music Club, Debate" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea id="notes" placeholder="Any health conditions or special requirements..." />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Add Girl
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}