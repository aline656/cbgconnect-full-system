// src/pages/metron/DormitoryAssignment.tsx
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Home, 
  Bed,
  MoveRight,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
  assignedGirls: AssignedGirl[];
  status: 'vacant' | 'occupied' | 'maintenance';
}

interface AssignedGirl {
  id: string;
  name: string;
  studentId: string;
}

interface UnassignedGirl {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  requestedDormitory?: string;
}

export default function DormitoryAssignment() {
  const [dormitories, setDormitories] = useState<Dormitory[]>([
    {
      id: '1',
      name: 'Rose Hall',
      building: 'Building A',
      floor: 2,
      capacity: 24,
      occupied: 18,
      beds: [
        { id: '1-1', number: 'B-201-A', dormitoryId: '1', assignedGirls: [{ id: '101', name: 'Alice Johnson', studentId: 'GS2023001' }], status: 'occupied' },
        { id: '1-2', number: 'B-201-B', dormitoryId: '1', assignedGirls: [], status: 'vacant' },
        { id: '1-3', number: 'B-202-A', dormitoryId: '1', assignedGirls: [{ id: '102', name: 'Bella Smith', studentId: 'GS2023002' }], status: 'occupied' },
        { id: '1-4', number: 'B-202-B', dormitoryId: '1', assignedGirls: [{ id: '103', name: 'Carol Davis', studentId: 'GS2023003' }], status: 'occupied' },
      ]
    },
    {
      id: '2',
      name: 'Lily Wing',
      building: 'Building B',
      floor: 1,
      capacity: 16,
      occupied: 12,
      beds: [
        { id: '2-1', number: 'L-101-A', dormitoryId: '2', assignedGirls: [{ id: '104', name: 'Diana Wilson', studentId: 'GS2023004' }], status: 'occupied' },
        { id: '2-2', number: 'L-101-B', dormitoryId: '2', assignedGirls: [], status: 'vacant' },
        { id: '2-3', number: 'L-102-A', dormitoryId: '2', assignedGirls: [], status: 'maintenance' },
      ]
    }
  ]);

  const [unassignedGirls, setUnassignedGirls] = useState<UnassignedGirl[]>([
    { id: '201', name: 'Eva Brown', studentId: 'GS2024001', grade: '10', requestedDormitory: 'Rose Hall' },
    { id: '202', name: 'Fiona Green', studentId: 'GS2024002', grade: '11', requestedDormitory: 'Lily Wing' },
    { id: '203', name: 'Grace White', studentId: 'GS2024003', grade: '12' },
  ]);

  const [selectedDormitory, setSelectedDormitory] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;
    const itemId = result.draggableId;

    if (sourceId === 'unassigned' && destId.startsWith('bed-')) {
      // Assign unassigned girl to bed
      const bedId = destId.replace('bed-', '');
      const girl = unassignedGirls.find(g => g.id === itemId);
      if (!girl) return;

      setDormitories(prev => prev.map(dorm => ({
        ...dorm,
        beds: dorm.beds.map(bed => 
          bed.id === bedId 
            ? { ...bed, assignedGirls: [...bed.assignedGirls, { id: girl.id, name: girl.name, studentId: girl.studentId }], status: 'occupied' }
            : bed
        )
      })));

      setUnassignedGirls(prev => prev.filter(g => g.id !== itemId));
    } else if (sourceId.startsWith('bed-') && destId === 'unassigned') {
      // Remove girl from bed
      const bedId = sourceId.replace('bed-', '');
      const dormitory = dormitories.find(d => d.beds.some(b => b.id === bedId));
      if (!dormitory) return;

      const bed = dormitory.beds.find(b => b.id === bedId);
      if (!bed) return;

      const girl = bed.assignedGirls.find(g => g.id === itemId);
      if (!girl) return;

      setDormitories(prev => prev.map(dorm => ({
        ...dorm,
        beds: dorm.beds.map(b => 
          b.id === bedId 
            ? { 
                ...b, 
                assignedGirls: b.assignedGirls.filter(g => g.id !== itemId),
                status: b.assignedGirls.length === 1 ? 'vacant' : 'occupied'
              }
            : b
        )
      })));

      setUnassignedGirls(prev => [...prev, {
        id: girl.id,
        name: girl.name,
        studentId: girl.studentId,
        grade: '11' // You would get this from actual data
      }]);
    }
  };

  const selectedDorm = dormitories.find(d => d.id === selectedDormitory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dormitory Assignment</h1>
          <p className="text-muted-foreground">Manage bed assignments for internal girls (Max 2 girls per bed)</p>
        </div>
        <Button>
          Save Assignments
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
                    <span className="font-medium">{selectedDorm ? selectedDorm.capacity - selectedDorm.occupied : 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unassigned Girls:</span>
                    <span className="font-medium">{unassignedGirls.length}</span>
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
                      placeholder="Search beds or girls..."
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

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Unassigned Girls */}
              <Card className="lg:col-span-1 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Unassigned Girls
                  </CardTitle>
                  <CardDescription>Drag to assign to beds</CardDescription>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId="unassigned">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-2 min-h-[200px]"
                      >
                        {unassignedGirls.map((girl, index) => (
                          <Draggable key={girl.id} draggableId={girl.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-move"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{girl.name}</p>
                                    <p className="text-sm text-muted-foreground">{girl.studentId} - Grade {girl.grade}</p>
                                  </div>
                                  <MoveRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>

              {/* Dormitory Beds */}
              <Card className="lg:col-span-2 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    {selectedDorm?.name} - Beds
                  </CardTitle>
                  <CardDescription>Drag girls onto beds or drag out to unassign</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDorm?.beds.map((bed) => (
                      <div key={bed.id} className="border rounded-lg p-4">
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
                        
                        <Droppable droppableId={`bed-${bed.id}`}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="min-h-[100px] border-2 border-dashed rounded p-2"
                            >
                              {bed.assignedGirls.map((girl, index) => (
                                <Draggable key={girl.id} draggableId={girl.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="p-2 mb-2 bg-white border rounded shadow-sm cursor-move"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-medium text-sm">{girl.name}</p>
                                          <p className="text-xs text-muted-foreground">{girl.studentId}</p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle remove girl from bed
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {bed.assignedGirls.length < 2 && bed.status !== 'maintenance' && (
                                <div className="text-center text-sm text-muted-foreground py-4">
                                  Drag girl here to assign
                                  <div className="text-xs mt-1">
                                    {2 - bed.assignedGirls.length} spot(s) available
                                  </div>
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        
                        {bed.assignedGirls.length === 2 && (
                          <div className="flex items-center justify-center mt-2 text-xs text-green-600">
                            <Check className="mr-1 h-3 w-3" />
                            Bed at full capacity (2/2)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DragDropContext>
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
            <Button variant="outline">
              Auto-assign by Grade
            </Button>
            <Button variant="outline">
              Auto-assign by Request
            </Button>
            <Button variant="outline">
              Balance Dormitory Occupancy
            </Button>
            <Button variant="outline" className="text-destructive">
              Clear All Assignments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>
      {children}
    </label>
  );
}