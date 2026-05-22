'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setAuth, getAuth, COACH_PASSWORD, DIRECTION_PASSWORD } from '@/lib/auth'
import type { Role } from '@/lib/types'

type RoleOption = Role | null

const ROLES = [
  { role: 'coach' as const, label: 'Coach', desc: 'Créer et gérer les séances de coaching' },
  { role: 'direction' as const, label: 'Direction', desc: 'Consulter tous les rapports (lecture seule)' },
  { role: 'employee' as const, label: 'Employé', desc: 'Voir mes séances personnelles' },
]

export default function LoginPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<RoleOption>(null)
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (getAuth()) router.replace('/history')
  }, [])

  const back = () => {
    setSelected(null)
    setPassword('')
    setName('')
    setError('')
    setBusy(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)

    if (selected === 'coach') {
      if (password !== COACH_PASSWORD) { setError('Mot de passe incorrect.'); setBusy(false); return }
      setAuth({ role: 'coach', name: 'Coach' })
    } else if (selected === 'direction') {
      if (password !== DIRECTION_PASSWORD) { setError('Mot de passe incorrect.'); setBusy(false); return }
      setAuth({ role: 'direction', name: 'Direction' })
    } else if (selected === 'employee') {
      const trimmed = name.trim()
      if (!trimmed) { setError('Veuillez entrer votre prénom.'); setBusy(false); return }
      setAuth({ role: 'employee', name: trimmed })
    }
    router.push('/history')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Brand header */}
      <div className="mb-10 text-center select-none">
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <div className="flex gap-0.5">
            <div className="w-2 h-9 bg-[#AAEE44] rounded-sm" />
            <div className="w-2 h-9 bg-[#AAEE44]/60 rounded-sm" />
            <div className="w-2 h-9 bg-[#AAEE44]/30 rounded-sm" />
          </div>
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">Gazon Tropical</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="h-px w-10 bg-[#AAEE44]" />
          <span className="text-base font-semibold text-gray-500">GT Coaching</span>
          <div className="h-px w-10 bg-[#AAEE44]" />
        </div>
        <p className="text-sm text-gray-400 mt-1.5">Outil de suivi S.M.A.R.T. de l'équipe</p>
      </div>

      {!selected ? (
        <div className="w-full max-w-xs space-y-3">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Choisissez votre rôle
          </p>
          {ROLES.map(({ role, label, desc }) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className="w-full p-4 border-2 border-gray-100 rounded-xl text-left hover:border-[#AAEE44] hover:bg-[#AAEE44]/5 transition-all duration-150 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </div>
                <div className="text-[#AAEE44] opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={submit} className="w-full max-w-xs">
          <button
            type="button"
            onClick={back}
            className="text-sm text-gray-400 hover:text-gray-600 mb-5 flex items-center gap-1 transition-colors"
          >
            ← Retour
          </button>

          <div className="border-2 border-[#AAEE44] rounded-2xl p-6 shadow-sm">
            <h2 className="font-extrabold text-gray-900 text-xl mb-1">
              {selected === 'coach' ? 'Coach' : selected === 'direction' ? 'Direction' : 'Employé'}
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              {selected === 'employee'
                ? 'Entrez votre prénom pour accéder à vos séances'
                : 'Entrez le mot de passe pour accéder'}
            </p>

            {selected === 'employee' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Votre prénom</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex : Jean"
                  autoFocus
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm"
                />
              </div>
            )}

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full mt-5 py-2.5 bg-[#AAEE44] text-gray-900 font-bold rounded-lg hover:bg-[#99dd33] active:scale-[0.98] transition-all text-sm disabled:opacity-60"
            >
              {busy ? 'Chargement...' : 'Accéder →'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
