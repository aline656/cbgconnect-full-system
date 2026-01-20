import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
})

export function getAuthToken() {
  return localStorage.getItem("token")
}

export function setAuthToken(token: string) {
  localStorage.setItem("token", token)
}

export function clearAuthToken() {
  localStorage.removeItem("token")
}

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const apiCall = {
  async get(url: string) {
    const response = await api.get(url)
    return response.data
  },
  async post(url: string, data: any) {
    const response = await api.post(url, data)
    return response.data
  },
  async put(url: string, data: any) {
    const response = await api.put(url, data)
    return response.data
  },
  async delete(url: string) {
    const response = await api.delete(url)
    return response.data
  }
}
