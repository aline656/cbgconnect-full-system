// src/types/patron.ts
export interface Boy {
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
  healthNotes?: string;
  dormitory?: string;
  bed?: string;
}

export interface BoysDormitory {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  occupied: number;
  beds: BoysBed[];
}

export interface BoysBed {
  id: string;
  number: string;
  dormitoryId: string;
  assignedBoys: AssignedBoy[];
  status: 'vacant' | 'occupied' | 'maintenance';
}

export interface AssignedBoy {
  id: string;
  name: string;
  studentId: string;
}

export interface BoysActivity {
  id: string;
  name: string;
  type: 'academic' | 'sports' | 'cultural' | 'other';
  schedule: string;
  participants: string[];
  location: string;
  supervisor: string;
}