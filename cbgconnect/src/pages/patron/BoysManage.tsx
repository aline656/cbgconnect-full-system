// src/pages/patron/BoysManage.tsx
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  Mail,
  Phone,
  Home,
  School,
  Calendar,
  Award,
  AlertCircle
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

interface Boy {
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
  disciplinaryPoints?: number;
}

export default function BoysManage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'internal' | 'external'>('all');

  const boys: Boy[] = [
    {
      id: '1',
      name: 'Michael Chen',
      studentId: 'BS2023001',
      type: 'internal',
      grade: '12',
      className: 'Science A',
      age: 17,
      guardianName: 'Robert Chen',
      guardianContact: '+1234567890',
      email: 'michael.c@school.edu',
      status: 'active',
      admissionDate: '2023-09-01',
      activities: ['Basketball', 'Debate Club', 'Robotics'],
      dormitory: 'Oak Hall',
      bed: 'O-301-A',
      disciplinaryPoints: 2
    },
    {
      id: '2',
      name: 'David Rodriguez',
      studentId: 'BS2023002',
      type: 'external',
      grade: '11',
      className: 'Arts B',
      age: 16,
      guardianName: 'Maria Rodriguez',
      guardianContact: '+1234567891',
      email: 'david.r@school.edu',
      status: 'active',
      admissionDate: '2023-09-01',
      activities: ['Soccer', 'Music'],
      dormitory: undefined,
      bed: undefined,
      disciplinaryPoints: 0
    },
    {
      id: '3',
      name: 'Alex Turner',
      studentId: 'BS2023003',
      type: 'internal',
      grade: '10',
      className: 'Science B',
      age: 15,
      guardianName: 'James Turner',
      guardianContact: '+1234567892',
      email: 'alex.t@school.edu',
      status: 'active',
      admissionDate: '2023-09-01',
      activities: ['Swimming', 'Chess'],
      dormitory: 'Oak Hall',
      bed: 'O-302-B',
      disciplinaryPoints: 5
    },
  ];

  const filteredBoys = boys.filter(boy => {
    const matchesSearch = boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boy.studentId.includes(searchTerm);
    const matchesType = selectedType === 'all' || boy.type === selectedType;
    return matchesSearch && matchesType;
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Boys Management</h1>
          <p className="text-muted-foreground">Manage internal and external boys information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Boy
            </Button>
          </DialogTrigger>
          <AddBoyDialog onClose={() => setIsAddDialogOpen(false)} />
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
          <TabsTrigger value="all">All Boys ({boys.length})</TabsTrigger>
          <TabsTrigger value="internal">Internal Boys ({boys.filter(b => b.type === 'internal').length})</TabsTrigger>
          <TabsTrigger value="external">External Boys ({boys.filter(b => b.type === 'external').length})</TabsTrigger>
          <TabsTrigger value="disciplinary">Disciplinary ({boys.filter(b => (b.disciplinaryPoints || 0) > 3).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBoys.map((boy) => (
              <BoyCard key={boy.id} boy={boy} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BoyCard({ boy }: { boy: Boy }) {
  return (
    <Card className="bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${boy.name}`} />
              <AvatarFallback>{boy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{boy.name}</CardTitle>
              <CardDescription>{boy.studentId}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={boy.type === 'internal' ? 'default' : 'secondary'}>
              {boy.type}
            </Badge>
            {boy.disciplinaryPoints && boy.disciplinaryPoints > 0 && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                <AlertCircle className="mr-1 h-3 w-3" />
                {boy.disciplinaryPoints} pts
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <School className="mr-2 h-3 w-3 text-muted-foreground" />
            <span>Grade {boy.grade} - {boy.className}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
            <span>{boy.age} years</span>
          </div>
          {boy.dormitory && (
            <div className="flex items-center col-span-2">
              <Home className="mr-2 h-3 w-3 text-muted-foreground" />
              <span>{boy.dormitory} - Bed {boy.bed}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
            <span className="truncate">{boy.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
            <span>{boy.guardianContact}</span>
          </div>
        </div>

        {boy.activities.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Activities:</p>
            <div className="flex flex-wrap gap-1">
              {boy.activities.map((activity, idx) => (
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

function AddBoyDialog({ onClose }: { onClose: () => void }) {
  const [boyType, setBoyType] = useState<'internal' | 'external'>('internal');

  return (
    <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-sm">
      <DialogHeader>
        <DialogTitle>Add New Boy</DialogTitle>
        <DialogDescription>
          Enter the details for the new student. Internal boys will require dormitory assignment.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Tabs value={boyType} onValueChange={(value) => setBoyType(value as 'internal' | 'external')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internal">Internal Boy</TabsTrigger>
            <TabsTrigger value="external">External Boy</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" placeholder="BS2024001" />
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

        {boyType === 'internal' && (
          <div className="space-y-2">
            <Label>Dormitory Assignment</Label>
            <div className="grid grid-cols-2 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select dormitory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oak-hall">Oak Hall</SelectItem>
                  <SelectItem value="pine-wing">Pine Wing</SelectItem>
                  <SelectItem value="cedar-block">Cedar Block</SelectItem>
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
          <Input id="activities" placeholder="Basketball, Debate, Robotics" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medical">Medical Information</Label>
          <Textarea id="medical" placeholder="Any health conditions or allergies..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea id="notes" placeholder="Behavioral notes or special requirements..." />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Add Boy
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}