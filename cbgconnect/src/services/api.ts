// src/services/api.ts
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

class ApiService {
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // Increased from 10000 to 30000ms for file uploads
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        // Only logout on 401 Unauthorized, not on network errors
        if (error.response?.status === 401) {
          localStorage.removeItem('token'); // Changed from 'authToken' to 'token'
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          window.location.href = '/login';
        }
        // Don't logout on network errors (ERR_NETWORK, etc.)
        return Promise.reject(error);
      }
    );
  }

  // Generic API methods
  async request<T>(config: any): Promise<T> {
    try {
      const response = await this.api(config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });
  }

  async register(userData: any) {
    return this.request({
      method: 'POST',
      url: '/auth/register',
      data: userData,
    });
  }

  async getCurrentUser() {
    return this.request({
      method: 'GET',
      url: '/auth/me',
    });
  }

  async getProfileByRole(role: string) {
    return this.request({
      method: 'GET',
      url: `/profile/${role}`,
    });
  }

  async updateProfileByRole(role: string, profileData: any) {
    return this.request({
      method: 'PUT',
      url: `/profile/${role}`,
      data: profileData,
    });
  }

  async uploadProfileImage(role: string, file: File) {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    return this.api.post(`/profile/${role}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for file uploads
    });
  }

  async getGirls() {
    return this.request({
      method: 'GET',
      url: '/girls',
    });
  }

  async getBoys() {
    return this.request({
      method: 'GET',
      url: '/boys',
    });
  }

  async updateUserProfile(userId: string, userData: any) {
    return this.request({
      method: 'PUT',
      url: `/users/${userId}`,
      data: userData,
    });
  }

  // User management
  async getUsers(role?: string) {
    return this.request({
      method: 'GET',
      url: role ? `/users?role=${role}` : '/users',
    });
  }

  // Dashboard data
  async getDashboardData(role: string) {
    return this.request({
      method: 'GET',
      url: `/dashboard/${role}`,
    });
  }

  // Teacher specific endpoints
  async getTeacherClasses() {
    return this.request({
      method: 'GET',
      url: '/teacher/classes',
    });
  }

  async getTeacherAssignments() {
    return this.request({
      method: 'GET',
      url: '/teacher/assignments',
    });
  }

  async getTeacherAttendance() {
    return this.request({
      method: 'GET',
      url: '/teacher/attendance',
    });
  }

  async getTeacherGrades() {
    return this.request({
      method: 'GET',
      url: '/teacher/grades',
    });
  }

  async createAssignment(assignmentData: any) {
    return this.request({
      method: 'POST',
      url: '/teacher/assignments',
      data: assignmentData,
    });
  }

  async updateAssignment(assignmentId: string, assignmentData: any) {
    return this.request({
      method: 'PUT',
      url: `/teacher/assignments/${assignmentId}`,
      data: assignmentData,
    });
  }

  async submitGrade(gradeData: any) {
    return this.request({
      method: 'POST',
      url: '/teacher/grades',
      data: gradeData,
    });
  }

  async updateAttendance(attendanceData: any) {
    return this.request({
      method: 'POST',
      url: '/teacher/attendance',
      data: attendanceData,
    });
  }

  // Metron specific endpoints
  async getMetronDormitories() {
    return this.request({
      method: 'GET',
      url: '/metron/dormitories',
    });
  }

  async getMetronGirls() {
    return this.request({
      method: 'GET',
      url: '/metron/girls',
    });
  }

  async assignDormitory(assignmentData: any) {
    return this.request({
      method: 'POST',
      url: '/metron/dormitory-assignments',
      data: assignmentData,
    });
  }

  async updateDormitoryAssignment(assignmentId: string, data: any) {
    return this.api.put(`/metron/dormitory-assignments/${assignmentId}`, data);
  }

  async getMetronAnalytics() {
    return this.request({
      method: 'GET',
      url: '/metron/analytics',
    });
  }

  // Patron specific endpoints
  async getPatronDormitories() {
    return this.request({
      method: 'GET',
      url: '/patron/dormitories',
    });
  }

  async getPatronBoys() {
    return this.request({
      method: 'GET',
      url: '/patron/boys',
    });
  }

  async assignPatronDormitory(assignmentData: any) {
    return this.request({
      method: 'POST',
      url: '/patron/dormitory-assignments',
      data: assignmentData,
    });
  }

  async getPatronAnalytics() {
    return this.request({
      method: 'GET',
      url: '/patron/analytics',
    });
  }

  async getPatronReports() {
    return this.request({
      method: 'GET',
      url: '/patron/reports',
    });
  }

  async createPatronReport(reportData: any) {
    return this.request({
      method: 'POST',
      url: '/patron/reports',
      data: reportData,
    });
  }

  // Notifications
  async getNotifications(userRole: string) {
    return this.request({
      method: 'GET',
      url: `/notifications?role=${userRole}`,
    });
  }

  // Academic years / archive
  async getArchivedAcademicYears() {
    return this.request({
      method: 'GET',
      url: '/admin/academic-years',
    });
  }

  async getAcademicYearDetails(yearId: string) {
    return this.request({
      method: 'GET',
      url: `/admin/academic-years/${yearId}`,
    });
  }

  async createAcademicYear(yearData: any) {
    return this.request({
      method: 'POST',
      url: '/admin/academic-years',
      data: yearData,
    });
  }

  async updateAcademicYear(yearId: string, yearData: any) {
    return this.request({
      method: 'PUT',
      url: `/admin/academic-years/${yearId}`,
      data: yearData,
    });
  }

  async deleteAcademicYear(yearId: string) {
    return this.request({
      method: 'DELETE',
      url: `/admin/academic-years/${yearId}`,
    });
  }

  // Terms management
  async getTerms(academicYearId?: string) {
    const url = academicYearId 
      ? `/admin/terms?academicYearId=${academicYearId}`
      : '/admin/terms';
    return this.request({
      method: 'GET',
      url,
    });
  }

  async createTerm(termData: any) {
    return this.request({
      method: 'POST',
      url: '/admin/terms',
      data: termData,
    });
  }

  async updateTerm(termId: string, termData: any) {
    return this.request({
      method: 'PUT',
      url: `/admin/terms/${termId}`,
      data: termData,
    });
  }

  async deleteTerm(termId: string) {
    return this.request({
      method: 'DELETE',
      url: `/admin/terms/${termId}`,
    });
  }

  // Lessons management
  async getLessons(filters?: any) {
    let url = '/admin/lessons';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.academicYearId) params.append('academicYearId', filters.academicYearId);
      if (filters.teacherId) params.append('teacherId', filters.teacherId);
      if (filters.classId) params.append('classId', filters.classId);
      if (params.toString()) url += '?' + params.toString();
    }
    return this.request({
      method: 'GET',
      url,
    });
  }

  async createLesson(lessonData: any) {
    return this.request({
      method: 'POST',
      url: '/admin/lessons',
      data: lessonData,
    });
  }

  async updateLesson(lessonId: string, lessonData: any) {
    return this.request({
      method: 'PUT',
      url: `/admin/lessons/${lessonId}`,
      data: lessonData,
    });
  }

  async deleteLesson(lessonId: string) {
    return this.request({
      method: 'DELETE',
      url: `/admin/lessons/${lessonId}`,
    });
  }

  // Grades management
  async getGrades(filters?: any) {
    let url = '/admin/grades-register';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.termId) params.append('termId', filters.termId);
      if (filters.subjectId) params.append('subjectId', filters.subjectId);
      if (params.toString()) url += '?' + params.toString();
    }
    return this.request({
      method: 'GET',
      url,
    });
  }

  async createGrade(gradeData: any) {
    return this.request({
      method: 'POST',
      url: '/admin/grades-register',
      data: gradeData,
    });
  }

  async updateGrade(gradeId: string, gradeData: any) {
    return this.request({
      method: 'PUT',
      url: `/admin/grades-register/${gradeId}`,
      data: gradeData,
    });
  }

  async deleteGrade(gradeId: string) {
    return this.request({
      method: 'DELETE',
      url: `/admin/grades-register/${gradeId}`,
    });
  }

  // Documents
  async getDocuments(filters?: any) {
    let url = '/documents';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.status) params.append('status', filters.status);
      if (params.toString()) url += '?' + params.toString();
    }
    return this.request({
      method: 'GET',
      url,
    });
  }

  async uploadDocument(studentId: string, documentType: string, file: File, expiryDate?: string) {
    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('documentType', documentType);
    formData.append('document', file);
    if (expiryDate) formData.append('expiryDate', expiryDate);

    return this.api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteDocument(documentId: string) {
    return this.request({
      method: 'DELETE',
      url: `/documents/${documentId}`,
    });
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request({
      method: 'PUT',
      url: `/notifications/${notificationId}/read`,
    });
  }

  async markAllNotificationsAsRead() {
    return this.request({
      method: 'PUT',
      url: '/notifications/read-all',
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request({
      method: 'DELETE',
      url: `/notifications/${notificationId}`,
    });
  }

  // Real-time events (WebSocket integration)
  setupWebSocket(userId: string, userRole: string) {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:4000';
    const ws = new WebSocket(`${wsUrl}?userId=${userId}&role=${userRole}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleRealTimeUpdate(data);
    };
    
    return ws;
  }

  private handleRealTimeUpdate(data: any) {
    // Dispatch custom events for real-time updates
    window.dispatchEvent(new CustomEvent('realTimeUpdate', { detail: data }));
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;
