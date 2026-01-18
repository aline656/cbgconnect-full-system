// src/services/api.ts
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('authToken');
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
          localStorage.removeItem('authToken');
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

  async updateUser(userId: string, userData: any) {
    return this.request({
      method: 'PUT',
      url: `/users/${userId}`,
      data: userData,
    });
  }

  async uploadProfileImage(userId: string, file: File) {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    return this.request({
      method: 'POST',
      url: `/users/${userId}/profile-image`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
    return this.request({
      method: 'PUT',
      url: `/metron/dormitory-assignments/${assignmentId}`,
      data,
    });
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
