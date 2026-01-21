import axios, { AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userRole')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============ Academic Years ============
export const academicYearApi = {
  // Get all academic years
  getAll: async () => {
    const response = await apiClient.get('/admin/academic-years')
    return response.data
  },

  // Get active academic year
  getActive: async () => {
    const response = await apiClient.get('/admin/academic-years/active')
    return response.data
  },

  // Get specific academic year by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/admin/academic-years/${id}`)
    return response.data
  },

  // Create new academic year
  create: async (data: any) => {
    const response = await apiClient.post('/admin/academic-years', data)
    return response.data
  },

  // Update academic year
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/admin/academic-years/${id}`, data)
    return response.data
  },

  // Activate academic year
  activate: async (id: string) => {
    const response = await apiClient.put(`/admin/academic-years/${id}/activate`, {})
    return response.data
  },

  // Archive academic year
  archive: async (id: string) => {
    const response = await apiClient.put(`/admin/academic-years/${id}/archive`, {})
    return response.data
  },

  // Delete academic year
  delete: async (id: string) => {
    const response = await apiClient.delete(`/admin/academic-years/${id}`)
    return response.data
  },
}

// ============ Terms ============
export const termsApi = {
  // Get all terms for an academic year
  getByYear: async (academicYearId: string) => {
    const response = await apiClient.get(`/academic-years/${academicYearId}/terms`)
    return response.data
  },

  // Get active term
  getActive: async (academicYearId: string) => {
    const response = await apiClient.get(`/academic-years/${academicYearId}/terms/active`)
    return response.data
  },

  // Get specific term
  getById: async (termId: string) => {
    const response = await apiClient.get(`/terms/${termId}`)
    return response.data
  },

  // Create term
  create: async (academicYearId: string, data: any) => {
    const response = await apiClient.post(`/academic-years/${academicYearId}/terms`, data)
    return response.data
  },

  // Update term
  update: async (termId: string, data: any) => {
    const response = await apiClient.put(`/terms/${termId}`, data)
    return response.data
  },

  // Activate term
  activate: async (termId: string) => {
    const response = await apiClient.put(`/terms/${termId}/activate`, {})
    return response.data
  },

  // Delete term
  delete: async (termId: string) => {
    const response = await apiClient.delete(`/terms/${termId}`)
    return response.data
  },
}

// ============ Lessons ============
export const lessonsApi = {
  // Get all lessons with optional filters
  getAll: async (filters?: {
    academicYearId?: string
    teacherId?: string
    grade?: number
    className?: string
  }) => {
    const response = await apiClient.get('/lessons', { params: filters })
    return response.data
  },

  // Get lessons for a teacher
  getByTeacher: async (teacherId: string, academicYearId?: string) => {
    const params: any = { teacherId }
    if (academicYearId) params.academicYearId = academicYearId
    const response = await apiClient.get('/lessons', { params })
    return response.data
  },

  // Get lessons for a grade/class
  getByGradeClass: async (grade: number, className: string, academicYearId?: string) => {
    const params: any = { grade, className }
    if (academicYearId) params.academicYearId = academicYearId
    const response = await apiClient.get('/lessons', { params })
    return response.data
  },

  // Get specific lesson
  getById: async (lessonId: string) => {
    const response = await apiClient.get(`/lessons/${lessonId}`)
    return response.data
  },

  // Create lesson
  create: async (data: any) => {
    const response = await apiClient.post('/lessons', data)
    return response.data
  },

  // Update lesson
  update: async (lessonId: string, data: any) => {
    const response = await apiClient.put(`/lessons/${lessonId}`, data)
    return response.data
  },

  // Delete lesson
  delete: async (lessonId: string) => {
    const response = await apiClient.delete(`/lessons/${lessonId}`)
    return response.data
  },
}

// ============ Grades ============
export const gradesApi = {
  // Get all grades with optional filters
  getAll: async (filters?: {
    academicYearId?: string
    termId?: string
    studentId?: string
    lessonId?: string
  }) => {
    const response = await apiClient.get('/grades', { params: filters })
    return response.data
  },

  // Get grades for a student
  getByStudent: async (studentId: string, academicYearId?: string) => {
    const params: any = { studentId }
    if (academicYearId) params.academicYearId = academicYearId
    const response = await apiClient.get('/grades', { params })
    return response.data
  },

  // Get grades for a term
  getByTerm: async (termId: string, academicYearId?: string) => {
    const params: any = { termId }
    if (academicYearId) params.academicYearId = academicYearId
    const response = await apiClient.get('/grades', { params })
    return response.data
  },

  // Get specific grade
  getById: async (gradeId: string) => {
    const response = await apiClient.get(`/grades/${gradeId}`)
    return response.data
  },

  // Create grade
  create: async (data: any) => {
    const response = await apiClient.post('/grades', data)
    return response.data
  },

  // Update grade
  update: async (gradeId: string, data: any) => {
    const response = await apiClient.put(`/grades/${gradeId}`, data)
    return response.data
  },

  // Delete grade
  delete: async (gradeId: string) => {
    const response = await apiClient.delete(`/grades/${gradeId}`)
    return response.data
  },

  // Bulk import grades
  bulkImport: async (academicYearId: string, termId: string, data: any[]) => {
    const response = await apiClient.post('/grades/bulk', {
      academicYearId,
      termId,
      grades: data,
    })
    return response.data
  },
}

// ============ Students ============
export const studentsApi = {
  // Get all students with optional filters
  getAll: async (filters?: {
    academicYearId?: string
    class?: string
    status?: string
  }) => {
    const response = await apiClient.get('/students', { params: filters })
    return response.data
  },

  // Get students for an academic year
  getByYear: async (academicYearId: string) => {
    const response = await apiClient.get('/students', {
      params: { academicYearId },
    })
    return response.data
  },

  // Get students for a class
  getByClass: async (className: string, academicYearId?: string) => {
    const params: any = { class: className }
    if (academicYearId) params.academicYearId = academicYearId
    const response = await apiClient.get('/students', { params })
    return response.data
  },

  // Get specific student
  getById: async (studentId: string) => {
    const response = await apiClient.get(`/students/${studentId}`)
    return response.data
  },

  // Register student
  create: async (data: any) => {
    const response = await apiClient.post('/students', data)
    return response.data
  },

  // Update student
  update: async (studentId: string, data: any) => {
    const response = await apiClient.put(`/students/${studentId}`, data)
    return response.data
  },

  // Change student status
  updateStatus: async (studentId: string, status: 'active' | 'inactive' | 'transferred') => {
    const response = await apiClient.put(`/students/${studentId}/status`, { status })
    return response.data
  },

  // Delete student
  delete: async (studentId: string) => {
    const response = await apiClient.delete(`/students/${studentId}`)
    return response.data
  },

  // Bulk register students
  bulkCreate: async (academicYearId: string, data: any[]) => {
    const response = await apiClient.post('/students/bulk', {
      academicYearId,
      students: data,
    })
    return response.data
  },
}

// ============ Archives ============
export const archivesApi = {
  // Get all archived years
  getAll: async () => {
    const response = await apiClient.get('/admin/academic-years')
    return response.data
  },

  // Get specific archive
  getById: async (archiveId: string) => {
    const response = await apiClient.get(`/admin/academic-years/${archiveId}`)
    return response.data
  },

  // Get archived students for a year
  getStudents: async (archiveId: string, filters?: { status?: string }) => {
    const response = await apiClient.get(`/admin/academic-years/${archiveId}`, {
      params: filters,
    })
    return response.data
  },

  // Export archive as file
  export: async (archiveId: string, format: 'csv' | 'pdf' | 'xlsx' = 'csv') => {
    const response = await apiClient.get(`/admin/academic-years/${archiveId}/export`, {
      params: { format },
      responseType: 'blob',
    })
    return response.data
  },

  // Create archive from academic year
  create: async (academicYearId: string) => {
    const response = await apiClient.post('/admin/academic-years', { academicYearId })
    return response.data
  },
}

export default {
  academicYearApi,
  termsApi,
  lessonsApi,
  gradesApi,
  studentsApi,
  archivesApi,
}
