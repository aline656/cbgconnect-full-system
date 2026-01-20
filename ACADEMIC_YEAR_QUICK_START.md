# Academic Year System - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### 1. Import a Component

```typescript
import AcademicYearManagement from '@/pages/admin/AcademicYearManagement'

export default function AdminPage() {
  return <AcademicYearManagement />
}
```

### 2. Component Works Immediately
- Mock data loads automatically
- All features functional
- Can perform CRUD operations
- No API calls needed yet

### 3. See All Components

```typescript
// Academic Year Management
import AcademicYearManagement from '@/pages/admin/AcademicYearManagement'

// Terms Management
import TermsManagement from '@/pages/admin/TermsManagement'

// Teacher Lessons
import TeacherLessons from '@/pages/admin/TeacherLessons'

// Grades Registration
import GradesRegistration from '@/pages/admin/GradesRegistration'

// Student Records
import StudentRecords from '@/pages/admin/StudentRecords'

// Academic Year Archive
import AcademicYearArchive from '@/pages/admin/AcademicYearArchive'
```

## 📂 File Structure

```
cbgconnect/src/
├── pages/admin/
│   ├── AcademicYearManagement.tsx   (450 lines)
│   ├── TermsManagement.tsx          (350 lines)
│   ├── TeacherLessons.tsx           (450 lines)
│   ├── GradesRegistration.tsx       (500 lines)
│   ├── StudentRecords.tsx           (500 lines)
│   └── AcademicYearArchive.tsx      (450 lines)
├── lib/
│   └── academicYearTypes.ts         (80 lines)
└── components/layout/
    └── AdminLayout.tsx              (Updated)
```

## 🔧 Configuration

### Environment Variables (if needed)
```bash
VITE_API_URL=http://localhost:5000/api
```

### Mock Data
- Already included in each component
- No configuration needed
- Automatically loaded on component mount

## 📋 Component Props Reference

### AcademicYearManagement
```typescript
// No props required
<AcademicYearManagement />
```

### TermsManagement
```typescript
<TermsManagement 
  academicYearId="1"                    // ID of academic year
  academicYearName="2024-2025"         // Display name
/>
```

### TeacherLessons
```typescript
<TeacherLessons 
  academicYearId="1"                   // ID of academic year
  academicYearName="2024-2025"         // Display name
  userRole="admin"                     // 'admin' | 'teacher'
  currentTeacherId="teacher1"          // Current user's teacher ID
/>
```

### GradesRegistration
```typescript
<GradesRegistration 
  academicYearId="1"                   // ID of academic year
  academicYearName="2024-2025"         // Display name
  userRole="admin"                     // 'admin' | 'secretary'
  currentTermId="T1"                   // Current term ID
/>
```

### StudentRecords
```typescript
<StudentRecords 
  activeAcademicYear="2024-2025"      // Active year
  userRole="admin"                     // 'admin' | 'secretary'
/>
```

### AcademicYearArchive
```typescript
// No props required
<AcademicYearArchive />
```

## 🧪 Testing

### Test Academic Year Creation
1. Go to AcademicYearManagement page
2. Click "Create Academic Year"
3. Fill form (e.g., "2024-2025")
4. Click "Create"
5. ✅ Should see success notification

### Test Student Registration
1. Go to StudentRecords page
2. Click "Register Student"
3. Fill all required fields
4. Click "Register Student"
5. ✅ Should see student in list

### Test Grade Entry
1. Go to GradesRegistration page
2. Click "Register Grade"
3. Enter student name, subject, score
4. Click "Register Grade"
5. ✅ Letter grade auto-calculated

### Test Archival
1. Go to AcademicYearArchive page
2. See archived years listed
3. Click "View Students" on a year
4. See archived student records
5. ✅ Can filter and search

## 🔌 Adding Routes

### In your router configuration (e.g., `main.tsx`):

```typescript
import AcademicYearManagement from '@/pages/admin/AcademicYearManagement'
import TermsManagement from '@/pages/admin/TermsManagement'
import TeacherLessons from '@/pages/admin/TeacherLessons'
import GradesRegistration from '@/pages/admin/GradesRegistration'
import StudentRecords from '@/pages/admin/StudentRecords'
import AcademicYearArchive from '@/pages/admin/AcademicYearArchive'

const routes = [
  {
    path: '/admin/academic-years',
    element: <AcademicYearManagement />,
    requiresAuth: true,
    role: 'admin'
  },
  {
    path: '/admin/terms/:academicYearId',
    element: <TermsManagement />,
    requiresAuth: true,
    role: 'admin'
  },
  {
    path: '/admin/lessons',
    element: <TeacherLessons />,
    requiresAuth: true,
    role: ['teacher', 'admin']
  },
  {
    path: '/admin/grades',
    element: <GradesRegistration />,
    requiresAuth: true,
    role: ['admin', 'secretary']
  },
  {
    path: '/admin/students',
    element: <StudentRecords />,
    requiresAuth: true,
    role: ['admin', 'secretary']
  },
  {
    path: '/admin/archives',
    element: <AcademicYearArchive />,
    requiresAuth: true,
    role: 'admin'
  }
]
```

## 🔄 Switching to Real API

### Step 1: Create API Service

Create `cbgconnect/src/services/academicYearApi.ts`:

```typescript
import { api } from './api'

export const academicYearAPI = {
  // Academic Years
  getAll: () => api.get('/academic-years'),
  getById: (id: string) => api.get(`/academic-years/${id}`),
  create: (data) => api.post('/academic-years', data),
  update: (id: string, data) => api.put(`/academic-years/${id}`, data),
  delete: (id: string) => api.delete(`/academic-years/${id}`),
  activate: (id: string) => api.put(`/academic-years/${id}/activate`, {}),
  
  // Terms
  getTerms: (yearId: string) => api.get(`/academic-years/${yearId}/terms`),
  createTerm: (data) => api.post('/terms', data),
  updateTerm: (id: string, data) => api.put(`/terms/${id}`, data),
  deleteTerm: (id: string) => api.delete(`/terms/${id}`),
  
  // Lessons
  getLessons: (filters?) => api.get('/lessons', { params: filters }),
  createLesson: (data) => api.post('/lessons', data),
  updateLesson: (id: string, data) => api.put(`/lessons/${id}`, data),
  deleteLesson: (id: string) => api.delete(`/lessons/${id}`),
  
  // Grades
  getGrades: (filters?) => api.get('/grades', { params: filters }),
  createGrade: (data) => api.post('/grades', data),
  updateGrade: (id: string, data) => api.put(`/grades/${id}`, data),
  deleteGrade: (id: string) => api.delete(`/grades/${id}`),
  
  // Students
  getStudents: (filters?) => api.get('/students', { params: filters }),
  createStudent: (data) => api.post('/students', data),
  updateStudent: (id: string, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id: string) => api.delete(`/students/${id}`),
  
  // Archives
  getArchives: () => api.get('/archives'),
  getArchiveById: (id: string) => api.get(`/archives/${id}`),
  getArchivedStudents: (id: string) => api.get(`/archives/${id}/students`)
}
```

### Step 2: Update Component

Replace mock data in `AcademicYearManagement.tsx`:

```typescript
// Before (mock data)
const [academicYears, setAcademicYears] = useState<AcademicYear[]>(mockAcademicYears)

// After (API data)
useEffect(() => {
  const fetchYears = async () => {
    try {
      const response = await academicYearAPI.getAll()
      setAcademicYears(response.data)
    } catch (error) {
      toast.error('Failed to load academic years')
    }
  }
  fetchYears()
}, [])
```

## 📊 Mock Data Structure

### AcademicYear
```typescript
{
  id: '1',
  year: '2024-2025',
  startDate: '2024-09-01',
  endDate: '2025-06-30',
  status: 'active',
  terms: [],
  createdAt: '2024-01-01'
}
```

### Term
```typescript
{
  id: '1',
  academicYearId: '1',
  name: 'First Term',
  startDate: '2024-09-01',
  endDate: '2024-11-30',
  status: 'active'
}
```

### Lesson
```typescript
{
  id: '1',
  academicYearId: '1',
  teacherId: 'teacher1',
  subjectName: 'Mathematics',
  grade: 10,
  className: 'A',
  schedule: 'Monday, Wednesday, Friday'
}
```

### Grade
```typescript
{
  id: '1',
  academicYearId: '1',
  termId: '1',
  studentId: '1',
  lessonId: '1',
  score: 85,
  letterGrade: 'A',
  remarks: 'Excellent',
  createdBy: 'admin'
}
```

### StudentRecord
```typescript
{
  id: '1',
  name: 'Alice Johnson',
  email: 'alice@school.com',
  phone: '0789123456',
  class: '10A',
  academicYear: '2024-2025',
  enrollmentDate: '2024-09-01',
  status: 'active',
  guardianName: 'John Johnson',
  guardianPhone: '0789654321',
  notes: 'Excellent student'
}
```

## 🎯 Common Tasks

### Task: Add a new subject to lessons
1. Open `TeacherLessons.tsx`
2. Find the subjects array
3. Add new subject to the list
4. Subjects appear in dropdown

### Task: Change grade scale
1. Open `GradesRegistration.tsx`
2. Find `getLetterGrade()` function
3. Modify thresholds
4. Letter grades update accordingly

### Task: Add new term name
1. **Cannot** - Terms are fixed (First, Second, Third)
2. Edit existing terms instead
3. Cannot exceed 3 terms per year

### Task: Modify validation rules
1. Find `validateForm()` function in component
2. Update validation logic
3. Modify error messages as needed
4. Validation applies immediately

## 🚨 Troubleshooting

### Components not rendering
- Check imports are correct
- Ensure component path matches file location
- Verify TypeScript compilation

### Mock data not showing
- Clear browser cache
- Check browser console for errors
- Verify mock data structure matches types

### Validation not working
- Check `validateForm()` function
- Verify form field bindings
- Check error state update

### API integration issues
- Verify API endpoint URLs
- Check request/response format matches mock data
- Add console logs to debug

## 📚 Documentation

For detailed information, see:
- `ACADEMIC_YEAR_SYSTEM.md` - Complete system documentation
- `SESSION_5_ACADEMIC_YEAR_CHECKLIST.md` - Implementation checklist
- `SESSION_5_COMPLETE_SUMMARY.md` - Session summary
- Component files have inline comments

## ✨ Tips & Tricks

### Tip 1: Use DevTools
```typescript
// In browser console
// To see current state
JSON.stringify(academicYears, null, 2)
```

### Tip 2: Test Form Validation
1. Try submitting empty form
2. Check error messages display
3. Fill required fields one by one

### Tip 3: Check Role-Based Filtering
In `TeacherLessons.tsx`:
- Change `userRole="teacher"` to see limited lessons
- Change to `userRole="admin"` to see all lessons

### Tip 4: Mock Different Scenarios
Each component has mock data you can modify to test different cases:
- Empty states
- Full lists
- Error conditions

## 🔐 Security Notes

Components include:
- ✅ Required field validation
- ✅ Email format validation
- ✅ Role-based access control (props-based)
- ✅ Confirmation dialogs for destructive operations
- ⚠️ Backend validation still needed
- ⚠️ Authentication still needed
- ⚠️ Authorization checks needed

## 🎓 Learning Path

1. **Start**: Review `ACADEMIC_YEAR_SYSTEM.md`
2. **Then**: Import one component and test
3. **Next**: Review component source code
4. **Then**: Add routes to application
5. **Next**: Connect to mock API service
6. **Then**: Implement real API
7. **Finally**: Add tests and optimize

## 💬 Need Help?

1. Check documentation files
2. Review component inline comments
3. Check mock data structure
4. Review component props interface
5. Check type definitions

## 🎉 You're Ready!

All components are ready to use. Start by:
1. ✅ Importing a component
2. ✅ Running the application
3. ✅ Testing with mock data
4. ✅ Connecting to API when ready

Enjoy building! 🚀
