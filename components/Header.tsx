'use client'

import { useRouter } from 'next/navigation'
import type { AuthState } from '@/lib/types'

const ROLE_LABELS: Record<string, string> = {
  coach: 'Coach',
  direction: 'Direction',
  employee: 'Employé',
}

interface HeaderProps {
  auth: AuthState
  onLogout: () => void
}

export function Header({ auth, onLogout }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={() => router.push('/history')}
          className="flex items-center gap-2 flex-shrink-0"
          aria-label="Accueil GT Coaching"
        >
          <div className="flex gap-0.5 flex-shrink-0">
            <div className="w-1.5 h-6 bg-[#AAEE44] rounded-sm" />
            <div className="w-1.5 h-6 bg-[#AAEE44]/60 rounded-sm" />
            <div className="w-1.5 h-6 bg-[#AAEE44]/30 rounded-sm" />
          </div>
          <span className="font-extrabold text-gray-900 tracking-tight text-base">GT Coaching</span>
        </button>

        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
              auth.role === 'coach'
                ? 'bg-[#AAEE44] text-gray-900'
                : auth.role === 'direction'
                  ? 'bg-gray-900 text-white'
                  : 'bg-blue-100 text-blue-800'
            }`}
          >
            {ROLE_LABELS[auth.role]}
          </span>
          {auth.role === 'employee' && (
            <span className="text-sm text-gray-600 truncate font-medium">{auth.name}</span>
          )}
        </div>

        <nav className="flex items-center gap-1 flex-shrink-0">
          {auth.role === 'coach' && (
            <button
              onClick={() => router.push('/session/new')}
              className="text-sm font-bold px-3 py-1.5 rounded-lg bg-[#AAEE44] text-gray-900 hover:bg-[#99dd33] transition-colors"
            >
              + Séance
            </button>
          )}
          <button
            onClick={() => router.push('/history')}
            className="text-sm px-3 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Historique
          </button>
          <button
            onClick={onLogout}
            className="text-sm text-gray-400 hover:text-gray-700 px-2 py-1.5 transition-colors"
            title="Déconnexion"
          >
            ↩
          </button>
        </nav>
      </div>
    </header>
  )
}
