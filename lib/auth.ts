import type { AuthState } from './types'

const AUTH_KEY = 'gt_coaching_auth'

export const COACH_PASSWORD = 'gt-coach-2026'
export const DIRECTION_PASSWORD = 'gt-boss-2026'

export function getAuth(): AuthState | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = sessionStorage.getItem(AUTH_KEY)
    return stored ? (JSON.parse(stored) as AuthState) : null
  } catch {
    return null
  }
}

export function setAuth(auth: AuthState): void {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth))
}

export function clearAuth(): void {
  sessionStorage.removeItem(AUTH_KEY)
}
