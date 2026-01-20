// Types for Academic Year System

export interface Term {
  id: string;
  academicYearId: string;
  name: 'First Term' | 'Second Term' | 'Third Term';
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'completed';
}

export interface AcademicYear {
  id: string;
  year: string; // e.g., "2024-2025"
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  terms: Term[];
}

export interface Lesson {
  id: string;
  academicYearId: string;
  teacherId: string;
  teacherName: string;
  subjectName: string;
  grade: string;
  className: string;
  classId: string;
  schedule?: string; // Day and time info
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  academicYearId: string;
  termId: string;
  studentId: string;
  studentName: string;
  lessonId: string;
  subjectName: string;
  teacherId: string;
  score: number; // 0-100
  percentage: number;
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // admin_id or secretary_id
}

export interface StudentRecord {
  id: number;
  student_id: string;
  academicYearId: string;
  name: string;
  grade: string;
  class_name: string;
  gender: 'male' | 'female';
  date_of_birth: string;
  admission_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  contact?: {
    parent_name?: string;
    parent_phone?: string;
    address?: string;
  };
  fees?: {
    total_due: number;
    total_paid: number;
    total_pending: number;
  };
}

export interface AcademicYearArchive {
  id: string;
  academicYearId: string;
  year: string;
  totalStudents: number;
  totalGrades: number;
  totalLessons: number;
  archivedDate: string;
  archivedBy: string;
  data: {
    students: StudentRecord[];
    grades: Grade[];
    lessons: Lesson[];
  };
}
