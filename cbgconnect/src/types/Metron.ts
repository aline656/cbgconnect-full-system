// src/types/index.ts
export interface Girl {
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
}

export interface Dormitory {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  occupied: number;
  beds: Bed[];
}

export interface Bed {
  id: string;
  number: string;
  dormitoryId: string;
  assignedGirls: string[]; // Array of girl IDs (max 2)
  status: 'vacant' | 'occupied' | 'maintenance';
}

export interface Activity {
  id: string;
  name: string;
  type: 'academic' | 'sports' | 'cultural' | 'other';
  schedule: string;
  participants: string[];
  location: string;
  supervisor: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident';
  date: string;
  author: string;
  content: string;
  status: 'draft' | 'submitted' | 'reviewed';
}

export interface AnalyticsData {
  month: string;
  internal: number;
  external: number;
  occupancy: number;
}