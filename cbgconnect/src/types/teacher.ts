// src/types/teacher.ts
export interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  className: string;
  gender: 'male' | 'female';
  attendance: {
    present: number;
    absent: number;
    late: number;
  };
  performance: {
    averageGrade: number;
    lastTestScore: number;
    assignmentsCompleted: number;
    assignmentsPending: number;
  };
  contactInfo: {
    parentName: string;
    parentContact: string;
    email: string;
  };
}

export interface ClassSchedule {
  id: string;
  subject: string;
  className: string;
  day: string;
  time: string;
  duration: number;
  location: string;
  studentsEnrolled: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  status: 'draft' | 'published' | 'graded';
  submissions: {
    total: number;
    submitted: number;
    graded: number;
  };
  averageScore?: number;
}

export interface GradebookEntry {
  studentId: string;
  studentName: string;
  grades: {
    [assignmentId: string]: number;
  };
  average: number;
  attendance: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  className: string;
  subject: string;
  present: string[];
  absent: string[];
  late: string[];
}