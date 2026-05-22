'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, clearAuth } from '@/lib/auth'
import type { AuthState } from '@/lib/types'

export function useAuth(requiredRole?: string) {
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = getAuth()
    if (!stored) {
      router.replace('/')
      return
    }
    if (requiredRole && stored.role !== requiredRole) {
      router.replace('/history')
      return
    }
    setAuth(stored)
    setLoading(false)
  }, [])

  const logout = () => {
    clearAuth()
    router.replace('/')
  }

  return { auth, loading, logout }
}
