import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe } from '../api/authAPI'

const AuthContext = createContext(null)

const normalizeTokens = (tokens) => {
  if (!tokens || typeof tokens !== 'object') return { access: '', refresh: '' }

  return {
    access: tokens.access ?? tokens.accessToken ?? tokens.access_token ?? tokens.token ?? '',
    refresh: tokens.refresh ?? tokens.refreshToken ?? tokens.refresh_token ?? '',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('access_token')
    if (!token) { setLoading(false); return }
    try {
      const { data } = await getMe()
      setUser(data)
    } catch {
      localStorage.clear()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  const login = (tokens, userData) => {
    const normalizedTokens = normalizeTokens(tokens)

    if (normalizedTokens.access) {
      localStorage.setItem('access_token', normalizedTokens.access)
    }
    if (normalizedTokens.refresh) {
      localStorage.setItem('refresh_token', normalizedTokens.refresh)
    }

    setUser(userData ?? null)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
