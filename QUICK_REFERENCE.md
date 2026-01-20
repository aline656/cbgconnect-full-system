# CBG Connect - Quick Reference Guide

## 🚀 Quick Start

### Running the Application

**Backend:**
```bash
cd backend
npm install  # If first time
npm start    # Or: npm run dev (with nodemon)
```
Server runs on `http://localhost:3000`

**Frontend:**
```bash
cd cbgconnect
npm install  # If first time
npm run dev  # Vite development server
```
App runs on `http://localhost:5173`

## 📚 Module Overview

### Secretary Module (✅ Complete)
Access via: `/secretary/*`

**Pages:**
- **Records** - Student CRUD, CSV import/export, view all students
- **Finance** - Fee tracking, payment recording, status filtering
- **Attendance** - School-wide attendance dashboard, statistics, reports
- **Documents** - Student document management, expiry tracking, verification
- **Reports** - 4-type reporting (Student, Attendance, Finance, Grades), CSV export

**Key Features:**
- Search and filter on all pages
- CSV import/export capabilities
- Status workflows (Pending → Verified/Rejected, etc.)
- Statistics dashboard on each page
- Bulk operations support

### Teacher Module (✅ Complete)
Access via: `/teacher/*`

**Pages:**
- **Attendance** - Daily attendance marking, date navigation, bulk operations
- **Grades** - Grade management, auto-calculation, distribution visualization
- **Classes** - Class management, subject tracking, room assignments
- **Schedule** - Weekly schedule view, time slot management
- **Assignments** - Assignment creation, submission tracking, overdue indicators

**Key Features:**
- Real-time statistics and calculations
- Class-wise filtering
- Bulk operations (Mark all present/absent)
- Progress tracking and visualization
- Status workflows

### Admin Module (🔄 In Progress)
Access via: `/admin/*`

**Pages:**
- **UserManagement** ✅ - User CRUD, role filtering, bulk actions, CSV export
- **SystemSettings** 🟡 - Configuration, email/SMS settings, backups (needs enhancement)
- **Analytics** 🟡 - Dashboard, charts, statistics (needs data integration)
- **Dashboard** 🟡 - Overview page with key metrics (needs enhancement)

**Key Features:**
- Tab-based user role filtering
- Status management (Active/Inactive/Pending/Blocked)
- Bulk selection and actions
- CSV export
- Settings configuration

## 🔐 User Roles & Access

| Role | Modules | Permissions |
|------|---------|-------------|
| **Student** | Parent portal | View own grades, attendance, fees |
| **Teacher** | Teacher | Manage attendance, grades, assignments |
| **Parent** | Parent portal | View children's progress, fees, communications |
| **Secretary** | Secretary, Admin (limited) | Manage records, finance, reports |
| **Admin** | All | Full system control, user management, settings |

## 🎨 UI/UX Patterns

### Color Scheme
- **Green**: Success, Active, Present, Verified (badges: `bg-green-50`, `text-green-700`)
- **Red**: Error, Danger, Absent, Rejected (badges: `bg-red-50`, `text-red-700`)
- **Amber**: Warning, Pending, Late, Expiring (badges: `bg-amber-50`, `text-amber-700`)
- **Blue**: Info, Active, Default (badges: `bg-blue-50`, `text-blue-700`)

### Common Components
- **Stats Cards**: Summary metrics with icons
- **Data Tables**: Sortable, searchable, filterable
- **Dialogs**: Add/Edit forms with validation
- **Badges**: Status indicators with colors
- **Progress Bars**: Visual representation of percentages
- **Dropdowns**: Action menus, sorting options

### Form Patterns
```tsx
<Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Item</DialogTitle>
    </DialogHeader>
    {/* Form fields */}
    <div className="flex gap-3 justify-end">
      <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </div>
  </DialogContent>
</Dialog>
```

### Search & Filter Pattern
```tsx
const filtered = data.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
  return matchesSearch && matchesFilter;
});
```

## 🔗 API Integration Points

### Available Endpoints

**Students:**
- `GET /api/students` - Fetch all students
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

**Attendance:**
- `GET /api/attendance` - Fetch attendance records
- `POST /api/attendance/bulk` - Mark attendance for class
- `GET /api/attendance/:student_id` - Student attendance history

**Grades:**
- `GET /api/grades` - Fetch all grades
- `POST /api/grades` - Create grade
- `PUT /api/grades/:id` - Update grade
- `GET /api/grades/distribution/:subject_id` - Grade distribution

**Finance:**
- `GET /api/fees` - Fetch all fees
- `POST /api/fees/payment` - Record payment
- `GET /api/fees/summary` - Fee summary stats

## 📊 Mock Data Examples

### Student Object
```json
{
  "id": 1,
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "grade": "10-A",
  "status": "active",
  "lastActive": "10 mins ago",
  "joinDate": "2023-01-15"
}
```

### Attendance Record
```json
{
  "id": 1,
  "student_id": 1,
  "date": "2024-01-19",
  "status": "present",
  "marked_time": "08:30",
  "marked_by": "Teacher Name"
}
```

### Grade Object
```json
{
  "id": 1,
  "student_id": 1,
  "subject": "Mathematics",
  "marks": 85,
  "total": 100,
  "percentage": 85,
  "grade": "B"
}
```

## 🧪 Testing Checklist

### Before Deployment
- [ ] Search functionality works on all pages
- [ ] Filters apply correctly
- [ ] Add/Edit/Delete operations work
- [ ] CSV export downloads correctly
- [ ] Toast notifications appear
- [ ] Loading states show
- [ ] Confirmation dialogs appear on delete
- [ ] Mobile responsive (test on md: breakpoint)
- [ ] Form validation prevents empty submissions
- [ ] Status badges show correct colors

### Database Integration
- [ ] Replace mock data with API calls
- [ ] Update apiCall service for new endpoints
- [ ] Add error handling for API failures
- [ ] Implement loading states
- [ ] Add pagination for large datasets
- [ ] Cache frequently accessed data

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module" Error
**Solution**: Install missing package or check import path
```bash
npm install missing-package
```

### Issue: Toast notifications not showing
**Solution**: Ensure `<Toaster />` is in App.tsx
```tsx
import { Toaster } from 'sonner'
<Toaster position="top-right" />
```

### Issue: Form not updating state
**Solution**: Check that state update function is called correctly
```tsx
onChange={(e) => setFormData({ ...formData, name: e.target.value })}
```

### Issue: CSV export fails
**Solution**: Ensure data has consistent keys and structure
```tsx
const csv = currentReport.data.map(row => 
  Object.values(row).join(',')
).join('\n')
```

## 📈 Performance Optimization

### Current Performance
- Mock data loads: < 1 second
- CSV generation: < 2 seconds
- Page transitions: Smooth (< 300ms)
- Search/Filter: Instant (< 100ms)

### Optimization Strategies
1. **Lazy Loading**: Import pages with React.lazy()
2. **Memoization**: Use React.memo() for expensive components
3. **Pagination**: Limit table rows to 20-50 per page
4. **Virtual Scrolling**: For large lists use react-window
5. **Debouncing**: Debounce search input (300-500ms)

## 🔄 Workflow Examples

### Adding a New Record
1. Click "Add" button
2. Dialog opens with form
3. Fill in required fields (marked with *)
4. Click "Save"
5. Success toast appears
6. Table updates with new record
7. Form resets and dialog closes

### Exporting Data
1. Apply filters (optional)
2. Click "Export" button
3. Browser downloads CSV file
4. File named with timestamp (e.g., `export-2024-01-19.csv`)
5. Open in Excel or Google Sheets

### Bulk Operations
1. Select multiple records using checkboxes
2. Click bulk action button
3. Confirmation dialog appears
4. Confirm action
5. Success message shows
6. Results updated in table

## 📞 Getting Help

### For Issues
1. Check IMPLEMENTATION_PROGRESS.md for status
2. Review code in corresponding page file
3. Check mock data structure in component
4. Test with browser DevTools
5. Check console for error messages

### For New Features
1. Follow established UI patterns
2. Use existing color scheme
3. Implement search/filter if applicable
4. Add mock data
5. Create corresponding API endpoint
6. Update this guide

---

**Last Updated**: January 19, 2026
**Version**: 1.0
**Status**: Active Development
