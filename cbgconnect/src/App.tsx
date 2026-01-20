import { Routes, Route, Outlet } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import Auth from '@/pages/Auth/Auth'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NotFound from './pages/NotFound'
import Contact from './pages/Contact'
import ProtectedRoute from '@/components/ProtectedRoute'

// Parent pages
import ParentDashboard from './pages/Parents/ParentDashboard'
import ParentProfile from './pages/Parents/Profile'
import ParentReport from './pages/Parents/Report'
import ParentSettings from './pages/Parents/Settings'

import SecretaryLayout from '@/components/layout/SecretaryLayout';
import SecretaryDashboard from './pages/secretary/Dashboard';
import Records from './pages/secretary/Records';
import Finance from './pages/secretary/Finance';
import Attendance from './pages/secretary/Attendance';
import Documents from './pages/secretary/Documents';
import Reports from './pages/secretary/Reports';
import SecretaryProfile from './pages/secretary/Profile';
import SecretarySettings from './pages/secretary/Settings';
// Admin pages
import AdminLayout from '@/components/layout/AdminLayout'
import AdminAuth from './pages/admin/AdminAuth'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProfile from './pages/admin/Profile'
import AdminUsers from './pages/admin/Users'
import AdminStudents from './pages/admin/Students'
import AdminAcademicYears from './pages/admin/AcademicYears'
import AdminTerms from './pages/admin/Terms'
import AdminLessons from './pages/admin/Lessons'
import AdminGrades from './pages/admin/Grades'
import AdminAnalytics from './pages/admin/Analytics'
import AdminSystemSettings from './pages/admin/SystemSettings'

// Metron pages
import MetronLayout from '@/components/layout/MetronLayout'
import MetronDashboard from './pages/metron/Dashboard'
import GirlsManage from './pages/metron/GirlsManage'
import DormitoryAssignment from './pages/metron/DormitoryAssignment'
import Analysis from './pages/metron/Analysis'
import Report from './pages/metron/Report'
import MetronProfile from './pages/metron/Profile'

// Add these imports to your App.tsx
import PatronLayout from '@/components/layout/PatronLayout'
import PatronDashboard from './pages/patron/Dashboard'
import BoysManage from './pages/patron/BoysManage'
import PatronDormitoryAssignment from './pages/patron/DormitoryAssignment'
import PatronAnalysis from './pages/patron/Analysis'
import PatronReport from './pages/patron/Report'
import PatronProfile from './pages/patron/Profile'

// Add these imports to your App.tsx
import TeacherLayout from '@/components/layout/TeacherLayout'
import TeacherDashboard from './pages/teacher/Dashboard'
import Classes from './pages/teacher/Classes'
import Schedule from './pages/teacher/Schedule'
import Assignments from './pages/teacher/Assignments'
import TAttendance from './pages/teacher/Attendance'
import TeacherGrades from './pages/teacher/Grades'
import TeacherProfile from './pages/teacher/Profile'

import Notifications from './pages/Notifications'





// Import NotificationProvider
import { NotificationProvider } from '@/contexts/NotificationContext'

function App() {
  return (
    <>
     <NotificationProvider>
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Auth />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/admin/auth' element={<AdminAuth />} />
          
          {/* Admin Dashboard Routes */}
          <Route path='/admin/auth' element={<AdminAuth />} />
          <Route path='/admin' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='profile' element={<AdminProfile />} />
            <Route path='users' element={<AdminUsers />} />
            <Route path='students' element={<AdminStudents />} />
            <Route path='academic-years' element={<AdminAcademicYears />} />
            <Route path='terms' element={<AdminTerms />} />
            <Route path='lessons' element={<AdminLessons />} />
            <Route path='grades' element={<AdminGrades />} />
            <Route path='analytics' element={<AdminAnalytics />} />
            <Route path='settings' element={<AdminSystemSettings />} />
          </Route>
          
           <Route path='/notifications' element={
              <ProtectedRoute allowedRoles={['teacher', 'metron', 'patron', 'admin']}>
                <Notifications />
              </ProtectedRoute>
            } />

          {/* Teacher Dashboard Routes */}
    <Route path='/teacher' element={
     <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherLayout >
        <Outlet />
      </TeacherLayout>
  </ProtectedRoute>
}>
  <Route index element={<TeacherDashboard />} />
  <Route path='dashboard' element={<TeacherDashboard />} />
  <Route path='classes' element={<Classes />} />
  <Route path='schedule' element={<Schedule />} />
  <Route path='assignments' element={<Assignments />} />
  <Route path='attendance' element={<TAttendance />} />
  <Route path='grades' element={<TeacherGrades />} />
  <Route path='profile' element={<TeacherProfile />} />
</Route>
          
          {/* Parent Dashboard Routes */}
          <Route path='/parent' element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </ProtectedRoute>
          } />
          <Route path='/parent/profile' element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentProfile />
            </ProtectedRoute>
          } />
          <Route path='/parent/report' element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentReport />
            </ProtectedRoute>
          } />
          <Route path='/parent/settings' element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentSettings />
            </ProtectedRoute>
          } />
          
          {/* Secretary Dashboard Routes */}
<Route path='/secretary' element={
  <ProtectedRoute allowedRoles={['secretary']}>
    <SecretaryLayout >
      <Outlet />
    </SecretaryLayout >
  </ProtectedRoute>
}>
  <Route index element={<SecretaryDashboard />} />
  <Route path='dashboard' element={<SecretaryDashboard />} />
  <Route path='records' element={<Records />} />
  <Route path='finance' element={<Finance />} />
  <Route path='attendance' element={<Attendance />} />
  <Route path='documents' element={<Documents />} />
  <Route path='reports' element={<Reports />} />
  <Route path='profile' element={<SecretaryProfile />} />
  <Route path='settings' element={<SecretarySettings />} />
</Route>
          {/* Metron Dashboard Routes */}
          <Route path='/metron' element={
            <ProtectedRoute allowedRoles={['metron']}>
              <MetronLayout>
                <Outlet />
              </MetronLayout>
            </ProtectedRoute>
          }>
            <Route index element={<MetronDashboard />} />
            <Route path='dashboard' element={<MetronDashboard />} />
            <Route path='girls' element={<GirlsManage />} />
            <Route path='dormitory' element={<DormitoryAssignment />} />
            <Route path='analysis' element={<Analysis />} />
            <Route path='reports' element={<Report />} />
            <Route path='profile' element={<MetronProfile />} />
          </Route>
          
          {/* Patron Dashboard Routes */}
          <Route path='/patron' element={
            <ProtectedRoute allowedRoles={['patron']}>
              <PatronLayout>
                <Outlet />
              </PatronLayout>
            </ProtectedRoute>
          }>
            <Route index element={<PatronDashboard />} />
            <Route path='dashboard' element={<PatronDashboard />} />
            <Route path='boys' element={<BoysManage />} />
            <Route path='dormitory' element={<PatronDormitoryAssignment />} />
            <Route path='analysis' element={<PatronAnalysis />} />
            <Route path='reports' element={<PatronReport />} />
            <Route path='profile' element={<PatronProfile />} />
          </Route>
          
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      </NotificationProvider>
    </>
  )
}

export default App