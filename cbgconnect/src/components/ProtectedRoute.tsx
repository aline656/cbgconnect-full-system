import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const getDashboardPathForRole = (role: unknown) => {
    const r = typeof role === 'string' ? role : ''
    const mapping: Record<string, string> = {
      parent: '/parent',
      secretary: '/secretary',
      teacher: '/teacher',
      metron: '/metron',
      patron: '/patron',
      admin: '/admin',
    }
    return mapping[r] ?? '/'
  }

  const parseToken = (token: string | null) => {
    if (!token) return null
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const json = JSON.parse(atob(base64))
      return json
    } catch {
      return null
    }
  }

  const token = localStorage.getItem('token')
  const payload = parseToken(token)
  const exp = payload?.exp
  const now = Math.floor(Date.now() / 1000)
  const isAuthenticated = Boolean(payload) && (typeof exp !== 'number' || exp >= now)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const role = payload?.role
    if (typeof role !== 'string' || !allowedRoles.includes(role)) {
      return <Navigate to={getDashboardPathForRole(role)} replace />
    }
  }
  
  return <>{children}</>
}

export default ProtectedRoute
