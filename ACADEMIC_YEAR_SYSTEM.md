# Academic Year Management System - Implementation Guide

## Overview

The Academic Year Management System is a comprehensive feature that organizes all school data around academic years. It enables:

- **Admins** to create and manage academic years (e.g., 2024-2025)
- **Three fixed terms** within each academic year (First, Second, Third)
- **Student registration** linked to specific academic years
- **Teacher lesson registration** for each academic year
- **Grade registration** by secretaries and admins for each term
- **Data archival** when academic years end, preserving complete records
- **Historical tracking** for reporting and analysis

## System Architecture

```
Academic Year (e.g., 2024-2025)
├── Status: Active/Archived
├── Dates: Start Date - End Date
├── Students (Multiple)
│   ├── Linked to specific academic year
│   ├── Status: Active/Inactive/Transferred
│   ├── Class Assignment: 9A-12D
│   └── Final GPA (calculated at year end)
├── Terms (3 Fixed)
│   ├── First Term (Sept-Nov)
│   ├── Second Term (Dec-Feb)
│   └── Third Term (Mar-Jun)
├── Lessons (Teacher-Subject-Class combinations)
│   ├── Teacher assigned
│   ├── Subject selection
│   ├── Grade level (9-12)
│   ├── Class (A-D)
│   └── Optional schedule
└── Grades (Score entries)
    ├── Linked to Term
    ├── Linked to Student
    ├── Linked to Lesson
    ├── Score (0-100)
    ├── Auto-calculated Letter Grade (A-F)
    └── Optional remarks
```

## Components

### 1. AcademicYearManagement.tsx
**Location**: `cbgconnect/src/pages/admin/AcademicYearManagement.tsx`

**Purpose**: Admin dashboard for creating and managing academic years

**Features**:
- Create new academic years with validation
- Set start and end dates
- Activate/Archive/Delete years
- View active year overview with student count
- Tabbed interface (All, Active, Archived)
- Status indicators and date display

**Key Functions**:
```typescript
- validateForm(): Validates year format (YYYY-YYYY) and date range
- handleSubmit(): Creates new academic year
- handleActivate(): Sets year as active (only one active at a time)
- handleArchive(): Archives completed years
- handleDelete(): Removes academic year with confirmation
```

**Form Validation**:
- Year format: Must be in format like "2024-2025"
- Start date: Required, must be valid date
- End date: Required, must be after start date

### 2. TermsManagement.tsx
**Location**: `cbgconnect/src/pages/admin/TermsManagement.tsx`

**Purpose**: Manage the 3 fixed terms within an academic year

**Features**:
- Create/Edit/Delete terms
- Enforce exactly 3 terms: First Term, Second Term, Third Term
- Only one term can be active at a time
- Set term dates and calculate duration
- Visual status indicators

**Key Functions**:
```typescript
- validateForm(): Checks no duplicate terms exist
- handleSubmit(): Creates or updates term
- handleEdit(): Pre-populates form with term data
- handleActivate(): Sets term as active
- handleDelete(): Removes term with confirmation
```

**Term Rules**:
- Cannot have more than 3 terms per year
- Term names are fixed (First, Second, Third)
- Each term must have start and end dates
- Only one term can be active during school operations

### 3. TeacherLessons.tsx
**Location**: `cbgconnect/src/pages/admin/TeacherLessons.tsx`

**Purpose**: Teachers register lessons they teach; admins manage all lessons

**Features**:
- Teachers register subjects for specific grades and classes
- 12 subjects available (Math, English, Science, Physics, Chemistry, Biology, History, Geography, CS, PE, Art, Music)
- Grades 9-12 selection
- Classes A-D selection
- Optional schedule information
- Role-based filtering (teachers see only their lessons, admins see all)
- Statistics dashboard

**Key Functions**:
```typescript
- validateForm(): Validates subject, grade, className
- handleSubmit(): Creates lesson with proper naming (e.g., 10A Math)
- handleEdit(): Pre-populates form with lesson data
- handleDelete(): Removes lesson with confirmation
```

**Subject List**:
1. Mathematics
2. English
3. Science
4. Physics
5. Chemistry
6. Biology
7. History
8. Geography
9. Computer Science
10. Physical Education
11. Art
12. Music

### 4. GradesRegistration.tsx
**Location**: `cbgconnect/src/pages/admin/GradesRegistration.tsx`

**Purpose**: Register and manage student grades for each term

**Features**:
- Register grades for students by subject and term
- Scores from 0-100
- Auto-calculate letter grades (A: 80+, B: 70-79, C: 60-69, D: 50-59, F: <50)
- Add optional remarks
- Filter by term, subject, and student
- Statistics on grade distribution
- Export functionality

**Grade Scale**:
| Score Range | Letter Grade |
|------------|-------------|
| 80-100     | A           |
| 70-79      | B           |
| 60-69      | C           |
| 50-59      | D           |
| 0-49       | F           |

**Key Functions**:
```typescript
- getLetterGrade(): Calculates letter grade from score
- validateForm(): Validates student name, subject, score range
- handleSubmit(): Creates or updates grade
- handleEdit(): Pre-populates form with grade data
- handleDelete(): Removes grade with confirmation
```

### 5. StudentRecords.tsx
**Location**: `cbgconnect/src/pages/admin/StudentRecords.tsx`

**Purpose**: Register and manage student records linked to academic years

**Features**:
- Register students for specific academic year
- Assign class (9A-12D)
- Capture guardian information
- Change student status (Active/Inactive/Transferred)
- Search and filter students
- Link students to academic year

**Required Fields**:
- Academic Year (dropdown select)
- Student Name
- Email Address
- Phone Number
- Class (9A-12D)
- Guardian Name
- Guardian Phone Number
- Notes (optional)

**Key Functions**:
```typescript
- validateForm(): Validates all required fields and email format
- handleSubmit(): Creates or updates student record
- handleEdit(): Pre-populates form with student data
- handleDelete(): Removes student record
- handleStatusChange(): Updates student status
```

### 6. AcademicYearArchive.tsx
**Location**: `cbgconnect/src/pages/admin/AcademicYearArchive.tsx`

**Purpose**: View and manage archived academic year data

**Features**:
- Display all archived academic years
- View complete list of archived students per year
- Statistics on archived data
- Filter students by status (Promoted, Repeat, Transferred)
- Search within archived records
- Export archive reports
- Read-only for data integrity

**Archive Information Stored**:
- Complete student list
- Final GPA per student
- Student status (Promoted, Repeat, Transferred)
- All grades from that year
- All lesson information
- Complete term data

## Data Flow

### Registration Flow
1. Admin creates Academic Year (e.g., 2024-2025)
2. Admin creates/activates Terms for that year
3. Secretary/Admin registers students for the year
4. Teachers register lessons for their subjects
5. Secretary/Admin enters grades for each term
6. At year end: All data archived, new year started

### Data Relationships
```
StudentRecord
├── academicYearId → AcademicYear
├── class → Lesson
└── id → Grade

Lesson
├── academicYearId → AcademicYear
├── teacherId → Teacher
└── id → Grade

Term
├── academicYearId → AcademicYear
└── id → Grade

Grade
├── studentId → StudentRecord
├── lessonId → Lesson
├── termId → Term
└── academicYearId → AcademicYear
```

## Role-Based Access

### Admin
- Can access all components
- Can create/edit/delete academic years, terms, lessons, grades
- Can view all student records
- Can manage archives
- Can change student status

### Secretary
- Can register students
- Can enter grades
- Can view student records
- Can view grades
- Cannot create academic years or terms

### Teacher
- Can register their own lessons
- Can view only their lessons
- Can view their assigned classes and grades
- Cannot modify student records or academic year settings

## Type Definitions

All types are defined in `cbgconnect/src/lib/academicYearTypes.ts`:

```typescript
interface AcademicYear {
  id: string
  year: string              // "2024-2025"
  startDate: string         // "2024-09-01"
  endDate: string          // "2025-06-30"
  status: 'active' | 'archived'
  terms: Term[]
  createdAt: string
  updatedAt: string
}

interface Term {
  id: string
  academicYearId: string
  name: 'First Term' | 'Second Term' | 'Third Term'
  startDate: string
  endDate: string
  status: 'active' | 'inactive'
}

interface Lesson {
  id: string
  academicYearId: string
  teacherId: string
  subjectName: string
  grade: number            // 9, 10, 11, 12
  className: string        // "A", "B", "C", "D"
  schedule?: string
}

interface Grade {
  id: string
  academicYearId: string
  termId: string
  studentId: string
  lessonId: string
  score: number            // 0-100
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  remarks?: string
  createdBy: 'admin' | 'secretary'
}

interface StudentRecord {
  id: string
  name: string
  email: string
  phone: string
  class: string            // "9A", "10B", etc.
  academicYear: string     // "2024-2025"
  enrollmentDate: string
  status: 'active' | 'inactive' | 'transferred'
  guardianName: string
  guardianPhone: string
  notes?: string
}

interface AcademicYearArchive {
  id: string
  year: string
  startDate: string
  endDate: string
  totalStudents: number
  averageGPA: number
  archivedDate: string
  students: ArchivedStudent[]
}
```

## Database Schema (Required)

The following tables need to be created in PostgreSQL:

```sql
-- Academic Years
CREATE TABLE academic_years (
  id SERIAL PRIMARY KEY,
  year VARCHAR(10) UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Terms
CREATE TABLE terms (
  id SERIAL PRIMARY KEY,
  academic_year_id INTEGER REFERENCES academic_years(id),
  name VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update Students table to include academic year
ALTER TABLE students ADD COLUMN academic_year_id INTEGER REFERENCES academic_years(id);
ALTER TABLE students ADD COLUMN student_class VARCHAR(5);

-- Lessons
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  academic_year_id INTEGER REFERENCES academic_years(id),
  teacher_id INTEGER REFERENCES users(id),
  subject_name VARCHAR(50) NOT NULL,
  grade INTEGER NOT NULL,
  class_name VARCHAR(2) NOT NULL,
  schedule TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grades
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  academic_year_id INTEGER REFERENCES academic_years(id),
  term_id INTEGER REFERENCES terms(id),
  student_id INTEGER REFERENCES students(id),
  lesson_id INTEGER REFERENCES lessons(id),
  score DECIMAL(5,2) NOT NULL,
  letter_grade VARCHAR(1),
  remarks TEXT,
  created_by VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Archives
CREATE TABLE academic_year_archives (
  id SERIAL PRIMARY KEY,
  academic_year_id INTEGER REFERENCES academic_years(id),
  year VARCHAR(10),
  total_students INTEGER,
  average_gpa DECIMAL(3,2),
  archived_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data JSONB
);
```

## Backend API Endpoints (Required)

The following endpoints need to be implemented:

```
Academic Years:
POST   /api/academic-years              - Create new academic year
GET    /api/academic-years              - List all academic years
GET    /api/academic-years/:id          - Get specific academic year
PUT    /api/academic-years/:id          - Update academic year
DELETE /api/academic-years/:id          - Delete academic year
PUT    /api/academic-years/:id/activate - Activate academic year

Terms:
POST   /api/academic-years/:id/terms             - Create term
GET    /api/academic-years/:id/terms             - List terms for year
PUT    /api/terms/:id                            - Update term
DELETE /api/terms/:id                            - Delete term
PUT    /api/terms/:id/activate                   - Activate term

Students:
POST   /api/students                    - Register student
GET    /api/students                    - List students (filter by year)
PUT    /api/students/:id                - Update student
DELETE /api/students/:id                - Delete student
PUT    /api/students/:id/status         - Change student status

Lessons:
POST   /api/lessons                     - Create lesson
GET    /api/lessons                     - List lessons (filter by year)
PUT    /api/lessons/:id                 - Update lesson
DELETE /api/lessons/:id                 - Delete lesson
GET    /api/lessons/teacher/:id         - Get lessons for teacher

Grades:
POST   /api/grades                      - Register grade
GET    /api/grades                      - List grades (filter by term/year)
PUT    /api/grades/:id                  - Update grade
DELETE /api/grades/:id                  - Delete grade
GET    /api/grades/student/:id          - Get student grades
GET    /api/grades/term/:id             - Get grades for term

Archives:
GET    /api/archives                    - List archived years
GET    /api/archives/:id                - Get archived year details
GET    /api/archives/:id/students       - Get archived students
POST   /api/archives/:id/export         - Export archive as file
```

## Usage Examples

### Creating an Academic Year
1. Go to Admin Dashboard → Academic Year Management
2. Click "Create Academic Year"
3. Fill in year format (e.g., "2024-2025")
4. Set start and end dates
5. Click "Create Academic Year"
6. Activate the year by clicking the "Activate" button

### Setting Up Terms
1. Go to Admin Dashboard → Terms Management
2. For each term (First, Second, Third):
   - Click "Create Term"
   - Set start and end dates
   - Click "Create"
3. Only one term should be "Active" at a time

### Registering Students
1. Go to Admin Dashboard → Student Records
2. Click "Register Student"
3. Select the academic year (should default to current active year)
4. Fill in all required information
5. Click "Register Student"

### Teachers Registering Lessons
1. Teacher logs in and goes to Teacher Dashboard
2. Click "Register Lessons"
3. Select subject, grade, class
4. Optionally add schedule
5. Click "Register Lesson"

### Entering Grades
1. Go to Admin Dashboard → Grades Registration
2. Click "Register Grade"
3. Select student, subject, term
4. Enter score (0-100)
5. Remarks auto-calculated
6. Optional: Add remarks
7. Click "Register Grade"

### Viewing Archives
1. Go to Admin Dashboard → Academic Year Archive
2. View list of archived years
3. Click "View Students" to see archived student data
4. Use filters to search specific students or status
5. Export if needed

## Validation Rules

### Academic Year
- Year format must be "YYYY-YYYY" (e.g., "2024-2025")
- Start date must be valid date
- End date must be after start date
- Only one academic year can be active at a time

### Terms
- Must have exactly 3 terms: First, Second, Third
- Term names are fixed and cannot be changed
- Start date must be valid
- End date must be after start date
- Only one term can be active at a time
- Cannot create duplicate terms

### Students
- Name, email, phone, class, guardian name, and guardian phone are required
- Email must be valid format (contain @)
- Class must be valid (9A-12D)
- Student must be assigned to an academic year
- When changing years, student records are archived, not deleted

### Lessons
- Subject must be selected from the 12 predefined subjects
- Grade must be 9, 10, 11, or 12
- Class must be A, B, C, or D
- Teacher must be assigned
- Lesson is tied to academic year

### Grades
- Score must be between 0 and 100
- Student must exist
- Must be assigned to an active term
- Letter grade is auto-calculated based on score
- Only admin and secretary can enter grades

## Mocking Strategy

All components include mock data for immediate testing:

**AcademicYearManagement**: 2 academic years (2024-2025 active, 2023-2024 archived)
**TermsManagement**: 3 terms (First active, Second and Third inactive)
**StudentRecords**: 3 students enrolled in 2024-2025
**TeacherLessons**: 3 lessons from 2 teachers
**GradesRegistration**: 3 grades across students and subjects
**AcademicYearArchive**: 2 archived years with student records

To test:
1. Navigate to each page
2. Mock data automatically loads
3. Can create, edit, delete mock items
4. All operations update in-memory state
5. When ready, replace mock calls with API calls

## Next Steps

1. **Create Backend API**: Implement all required endpoints
2. **Create Database Tables**: Run SQL migrations
3. **Connect Components**: Replace mock data with API calls
4. **Add Tests**: Create unit and integration tests
5. **Performance Optimization**: Add pagination and caching
6. **Reporting**: Create academic year summary reports
7. **Notifications**: Add SMS/email notifications for grade entry
8. **Bulk Operations**: Add bulk student import/export functionality

## Testing Checklist

- [ ] Create academic year successfully
- [ ] Activate/archive academic year
- [ ] Cannot activate two years simultaneously
- [ ] Create exactly 3 terms
- [ ] Cannot create more than 3 terms
- [ ] Register student with academic year
- [ ] Filter students by academic year
- [ ] Teacher can only see their lessons
- [ ] Admin can see all lessons
- [ ] Register grade with score 0-100
- [ ] Letter grade auto-calculates correctly
- [ ] Archive contains all historical data
- [ ] Can export archive data
- [ ] Form validation prevents invalid data
- [ ] All required fields are validated
- [ ] Date ranges validate correctly

## Support

For issues or questions about the Academic Year Management System, refer to:
- Component files in `cbgconnect/src/pages/admin/`
- Type definitions in `cbgconnect/src/lib/academicYearTypes.ts`
- Backend documentation (when created)
