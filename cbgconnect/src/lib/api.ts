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
