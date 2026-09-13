import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, setToken } from '../lib/api'

type Admin = { id: number; username: string }
type LoginResponse = Admin & { token: string }

type AuthContextValue = {
  admin: Admin | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Admin>('/api/admin/me')
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(username: string, password: string) {
    const result = await api.post<LoginResponse>('/api/admin/login', { username, password })
    setToken(result.token)
    setAdmin({ id: result.id, username: result.username })
  }

  async function logout() {
    await api.post('/api/admin/logout', {}).catch(() => {})
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
