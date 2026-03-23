import { createContext, createElement, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { verifyAdminToken } from '@/api/admin'

interface AdminUser {
  name: string
  email: string
}

interface AdminAuthContextValue {
  token: string | null
  user: AdminUser | null
  isAuthenticated: boolean
  isVerifying: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AdminAuthCtx = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('kc_session'))
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isVerifying, setIsVerifying] = useState(!!sessionStorage.getItem('kc_session'))

  useEffect(() => {
    const stored = sessionStorage.getItem('kc_session')
    if (!stored) return
    verifyAdminToken(stored)
      .then((res) => setUser(res.data))
      .catch(() => {
        sessionStorage.removeItem('kc_session')
        setToken(null)
      })
      .finally(() => setIsVerifying(false))
  }, [])

  const login = async (rawToken: string) => {
    const res = await verifyAdminToken(rawToken)
    sessionStorage.setItem('kc_session', rawToken)
    setToken(rawToken)
    setUser(res.data)
  }

  const logout = () => {
    sessionStorage.removeItem('kc_session')
    setToken(null)
    setUser(null)
  }

  return createElement(
    AdminAuthCtx.Provider,
    { value: { token, user, isAuthenticated: !!token && !!user, isVerifying, login, logout } },
    children,
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthCtx)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
