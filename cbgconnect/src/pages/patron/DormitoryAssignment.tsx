// src/pages/patron/DormitoryAssignment.tsx
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Home, 
  Bed,
  Plus,
  X,
  User,
  UserPlus,
  Check,
  AlertCircle,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Dormitory {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  occupied: number;
  beds: Bed[];
}

interface Bed {
  id: string;
  number: string;
  dormitoryId: string;
  assignedBoys: AssignedBoy[];
  status: 'vacant' | 'occupied' | 'maintenance';
}

interface AssignedBoy {
  id: string;
  name: string;
  studentId: string;
  disciplinaryPoints?: number;
}

interface UnassignedBoy {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  requestedDormitory?: string;
  disciplinaryPoints?: number;
}

export default function PatronDormitoryAssignment() {
  const [dormitories, setDormitories] = useState<Dormitory[]>([
    {
      id: '1',
      name: 'Oak Hall',
      building: 'Building C',
      floor: 3,
      capacity: 30,
      occupied: 24,
      beds: [
        { id: '1-1', number: 'C-301-A', dormitoryId: '1', assignedBoys: [{ id: '101', name: 'Michael Chen', studentId: 'BS2023001', disciplinaryPoints: 2 }], status: 'occupied' },
        { id: '1-2', number: 'C-301-B', dormitoryId: '1', assignedBoys: [], status: 'vacant' },
        { id: '1-3', number: 'C-302-A', dormitoryId: '1', assignedBoys: [{ id: '102', name: 'James Wilson', studentId: 'BS2023002' }], status: 'occupied' },
        { id: '1-4', number: 'C-302-B', dormitoryId: '1', assignedBoys: [{ id: '103', name: 'Alex Turner', studentId: 'BS2023003', disciplinaryPoints: 5 }], status: 'occupied' },
      ]
    },
    {
      id: '2',
      name: 'Pine Wing',
      building: 'Building D',
      floor: 2,
      capacity: 20,
      occupied: 16,
      beds: [
        { id: '2-1', number: 'D-201-A', dormitoryId: '2', assignedBoys: [{ id: '104', name: 'David Brown', studentId: 'BS2023004' }], status: 'occupied' },
        { id: '2-2', number: 'D-201-B', dormitoryId: '2', assignedBoys: [], status: 'vacant' },
        { id: '2-3', number: 'D-202-A', dormitoryId: '2', assignedBoys: [], status: 'maintenance' },
      ]
    }
  ]);

  const [unassignedBoys, setUnassignedBoys] = useState<UnassignedBoy[]>([
    { id: '201', name: 'Robert Kim', studentId: 'BS2024001', grade: '10', requestedDormitory: 'Oak Hall', disciplinaryPoints: 1 },
    { id: '202', name: 'Thomas Lee', studentId: 'BS2024002', grade: '11', requestedDormitory: 'Pine Wing' },
    { id: '203', name: 'Samuel Park', studentId: 'BS2024003', grade: '12', disciplinaryPoints: 3 },
  ]);

  const [selectedDormitory, setSelectedDormitory] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedBedForAssignment, setSelectedBedForAssignment] = useState<string | null>(null);

  const selectedDorm = dormitories.find(d => d.id === selectedDormitory);

  const handleAssignBoy = (bedId: string, boyId: string) => {
    const boy = unassignedBoys.find(b => b.id === boyId);
    if (!boy) return;

    setDormitories(prev => prev.map(dorm => ({
      ...dorm,
      beds: dorm.beds.map(bed => 
        bed.id === bedId 
          ? { 
              ...bed, 
              assignedBoys: [...bed.assignedBoys, { 
                id: boy.id, 
                name: boy.name, 
                studentId: boy.studentId,
                disciplinaryPoints: boy.disciplinaryPoints
              }], 
              status: 'occupied' 
            }
          : bed
      )
    })));

    setUnassignedBoys(prev => prev.filter(b => b.id !== boyId));
    setIsAssignDialogOpen(false);
    setSelectedBedForAssignment(null);
  };

  const handleRemoveBoy = (bedId: string, boyId: string) => {
    const bed = dormitories.flatMap(d => d.beds).find(b => b.id === bedId);
    if (!bed) return;

    const boy = bed.assignedBoys.find(b => b.id === boyId);
    if (!boy) return;

    setDormitories(prev => prev.map(dorm => ({
      ...dorm,
      beds: dorm.beds.map(b => 
        b.id === bedId 
          ? { 
              ...b, 
              assignedBoys: b.assignedBoys.filter(b => b.id !== boyId),
              status: b.assignedBoys.length === 1 ? 'vacant' : 'occupied'
            }
          : b
      )
    })));

    setUnassignedBoys(prev => [...prev, {
      id: boy.id,
      name: boy.name,
      studentId: boy.studentId,
      grade: '11',
      disciplinaryPoints: boy.disciplinaryPoints
    }]);
  };

  const handleAutoAssign = () => {
    const vacantBeds = selectedDorm?.beds.filter(bed => 
      bed.status === 'vacant' && bed.assignedBoys.length < 2
    ) || [];

    const boysToAssign = [...unassignedBoys]
      .sort((a, b) => (a.disciplinaryPoints || 0) - (b.disciplinaryPoints || 0)) // Assign better behaved first
      .slice(0, vacantBeds.length);
    
    let updatedDormitories = [...dormitories];
    let updatedUnassigned = [...unassignedBoys];

    boysToAssign.forEach((boy, index) => {
      if (index < vacantBeds.length) {
        const bed = vacantBeds[index];
        updatedDormitories = updatedDormitories.map(dorm => ({
          ...dorm,
          beds: dorm.beds.map(b => 
            b.id === bed.id 
              ? { 
                  ...b, 
                  assignedBoys: [...b.assignedBoys, { 
                    id: boy.id, 
                    name: boy.name, 
                    studentId: boy.studentId,
                    disciplinaryPoints: boy.disciplinaryPoints
                  }], 
                  status: 'occupied' 
                }
              : b
          )
        }));
        updatedUnassigned = updatedUnassigned.filter(b => b.id !== boy.id);
      }
    });

    setDormitories(updatedDormitories);
    setUnassignedBoys(updatedUnassigned);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dormitory Assignment</h1>
          <p className="text-muted-foreground">Manage bed assignments for internal boys (Max 2 boys per bed)</p>
        </div>
        <Button onClick={handleAutoAssign}>
          Auto-assign
        </Button>
      </div>

      {/* Filters and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1 bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Select Dormitory</Label>
                <Select value={selectedDormitory} onValueChange={setSelectedDormitory}>
                  <SelectTrigger>
                    <Home className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select dormitory" />
                  </SelectTrigger>
                  <SelectContent>
                    {dormitories.map((dorm) => (
                      <SelectItem key={dorm.id} value={dorm.id}>
                        {dorm.name} - {dorm.building}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium mb-2 block">Statistics</Label>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Capacity:</span>
                    <span className="font-medium">{selectedDorm?.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Occupied:</span>
                    <span className="font-medium">{selectedDorm?.occupied}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vacant Beds:</span>
                    <span className="font-medium">
                      {selectedDorm ? selectedDorm.capacity - selectedDorm.occupied : 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unassigned Boys:</span>
                    <span className="font-medium">{unassignedBoys.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search beds or boys..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Beds</SelectItem>
                      <SelectItem value="vacant">Vacant Only</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Unassigned Boys */}
            <Card className="lg:col-span-1 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Unassigned Boys
                  <Badge variant="outline" className="ml-2">{unassignedBoys.length}</Badge>
                </CardTitle>
                <CardDescription>Click + to assign to beds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 min-h-[200px]">
                  {unassignedBoys.map((boy) => (
                    <div key={boy.id} className="p-3 border rounded-lg bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{boy.name}</p>
                            <p className="text-xs text-muted-foreground">{boy.studentId} - Grade {boy.grade}</p>
                            {boy.requestedDormitory && (
                              <p className="text-xs text-blue-600">Prefers: {boy.requestedDormitory}</p>
                            )}
                            {boy.disciplinaryPoints && boy.disciplinaryPoints > 0 && (
                              <div className="flex items-center gap-1 text-xs text-amber-600">
                                <AlertCircle className="h-3 w-3" />
                                <span>{boy.disciplinaryPoints} disciplinary points</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedBedForAssignment(null);
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {unassignedBoys.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p>All boys are assigned!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dormitory Beds */}
            <Card className="lg:col-span-2 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  {selectedDorm?.name} - Beds
                </CardTitle>
                <CardDescription>Click on beds to manage assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedDorm?.beds.map((bed) => (
                    <div key={bed.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Bed className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{bed.number}</span>
                        </div>
                        <Badge variant={
                          bed.status === 'vacant' ? 'outline' :
                          bed.status === 'maintenance' ? 'destructive' : 'default'
                        }>
                          {bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 min-h-[100px] border-2 border-dashed rounded p-3">
                        {bed.assignedBoys.map((boy) => (
                          <div key={boy.id} className="p-2 bg-white border rounded shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="h-3 w-3 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{boy.name}</p>
                                  <p className="text-xs text-muted-foreground">{boy.studentId}</p>
                                  {boy.disciplinaryPoints && boy.disciplinaryPoints > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-amber-600">
                                      <Shield className="h-2 w-2" />
                                      <span>{boy.disciplinaryPoints} pts</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleRemoveBoy(bed.id, boy.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {bed.assignedBoys.length < 2 && bed.status !== 'maintenance' && (
                          <div className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setSelectedBedForAssignment(bed.id);
                                setIsAssignDialogOpen(true);
                              }}
                            >
                              <Plus className="mr-2 h-3 w-3" />
                              Assign Boy
                              <div className="text-xs mt-1 text-muted-foreground">
                                {2 - bed.assignedBoys.length} spot(s) available
                              </div>
                            </Button>
                          </div>
                        )}
                        
                        {bed.assignedBoys.length === 2 && (
                          <div className="flex items-center justify-center text-xs text-green-600">
                            <Check className="mr-1 h-3 w-3" />
                            Bed at full capacity (2/2)
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Assignment</CardTitle>
          <CardDescription>Automated assignment options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleAutoAssign}>
              Auto-assign by Behavior
            </Button>
            <Button variant="outline">
              Balance Dormitory Occupancy
            </Button>
            <Button variant="outline">
              Separate by Grade Level
            </Button>
            <Button variant="outline">
              Assign Roommates by Activity
            </Button>
            <Button variant="outline" className="text-destructive">
              Clear All Assignments
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assign Boy Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>
              {selectedBedForAssignment ? 'Assign Boy to Specific Bed' : 'Select Bed for Assignment'}
            </DialogTitle>
            <DialogDescription>
              {selectedBedForAssignment ? 
                `Assign a boy to bed ${selectedDorm?.beds.find(b => b.id === selectedBedForAssignment)?.number}` :
                'First select a bed, then assign a boy to it'
              }
            </DialogDescription>
          </DialogHeader>
          
          {!selectedBedForAssignment ? (
            <div className="space-y-4 py-4">
              <Label>Select a bed to assign to:</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                {selectedDorm?.beds
                  .filter(bed => bed.status !== 'maintenance' && bed.assignedBoys.length < 2)
                  .map((bed) => (
                    <Button
                      key={bed.id}
                      variant="outline"
                      className="flex flex-col h-auto py-4"
                      onClick={() => setSelectedBedForAssignment(bed.id)}
                    >
                      <Bed className="h-5 w-5 mb-2" />
                      <span className="font-medium">{bed.number}</span>
                      <span className="text-xs text-muted-foreground">
                        {2 - bed.assignedBoys.length} spot(s) available
                      </span>
                    </Button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {unassignedBoys.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No unassigned boys available</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {unassignedBoys.map((boy) => (
                    <div key={boy.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{boy.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {boy.studentId} - Grade {boy.grade}
                        </p>
                        {boy.disciplinaryPoints && boy.disciplinaryPoints > 0 && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <Shield className="h-3 w-3" />
                            <span>{boy.disciplinaryPoints} disciplinary points</span>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => selectedBedForAssignment && handleAssignBoy(selectedBedForAssignment, boy.id)}
                      >
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAssignDialogOpen(false);
              setSelectedBedForAssignment(null);
            }}>
              Cancel
            </Button>
            {selectedBedForAssignment && (
              <Button onClick={() => setSelectedBedForAssignment(null)}>
                Back to Bed Selection
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}