'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import { SessionCard } from '@/components/SessionCard'
import { supabase } from '@/lib/supabase'
import type { CoachingSession } from '@/lib/types'

const FOCUS_OPTIONS = [
  'Vitesse de réponse aux leads',
  'Suivi des dossiers ouverts',
  'Qualité des estimations',
  'Mise à jour Pipedrive',
  'Mise à jour USOFT/Sunrise',
  'Technique de vente',
  'Communication client',
  'Gestion du temps',
  'Attitude et engagement',
  'Autre',
]

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-[#AAEE44] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function HistoryPage() {
  const { auth, loading, logout } = useAuth()
  const [sessions, setSessions] = useState<CoachingSession[]>([])
  const [fetching, setFetching] = useState(true)
  const [filterMember, setFilterMember] = useState('')
  const [filterFocus, setFilterFocus] = useState('')

  const loadSessions = useCallback(async () => {
    setFetching(true)
    const { data } = await supabase
      .from('coaching_sessions')
      .select('*')
      .order('session_date', { ascending: false })
    setSessions((data as CoachingSession[]) ?? [])
    setFetching(false)
  }, [])

  useEffect(() => {
    if (auth) loadSessions()
  }, [auth, loadSessions])

  if (loading || !auth) return <Spinner />

  // Base set: employees only see their own sessions
  const baseSet =
    auth.role === 'employee'
      ? sessions.filter(s => s.member_name.toLowerCase().includes(auth.name.toLowerCase()))
      : sessions

  // Apply manual filters
  let displayed = baseSet
  if (filterMember) displayed = displayed.filter(s => s.member_name === filterMember)
  if (filterFocus)  displayed = displayed.filter(s => s.focus === filterFocus)

  // Stats
  const uniqueMembers = new Set(baseSet.map(s => s.member_name)).size
  const totalCommitments = baseSet.reduce((acc, s) => acc + (s.emp_actions?.length ?? 0), 0)

  // Member options for filter
  const memberOptions = [...new Set(baseSet.map(s => s.member_name))].sort()

  const hasFilters = filterMember || filterFocus

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header auth={auth} onLogout={logout} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {auth.role === 'employee' ? 'Mes séances de coaching' : 'Historique des séances'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {auth.role === 'employee'
              ? `Séances enregistrées pour ${auth.name}`
              : "Toutes les séances de coaching de l'équipe"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Séances', value: baseSet.length },
            { label: auth.role === 'employee' ? 'Axes couverts' : 'Membres', value: auth.role === 'employee' ? new Set(baseSet.map(s => s.focus)).size : uniqueMembers },
            { label: 'Engagements', value: totalCommitments },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters (coach + direction only) */}
        {auth.role !== 'employee' && (
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <select
              value={filterMember}
              onChange={e => setFilterMember(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] text-sm bg-white"
            >
              <option value="">Tous les membres</option>
              {memberOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={filterFocus}
              onChange={e => setFilterFocus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] text-sm bg-white"
            >
              <option value="">Tous les axes</option>
              {FOCUS_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {hasFilters && (
              <button
                onClick={() => { setFilterMember(''); setFilterFocus('') }}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                Réinitialiser
              </button>
            )}
          </div>
        )}

        {/* Session list */}
        {fetching ? (
          <Spinner />
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-semibold text-gray-400 text-lg">
              {auth.role === 'employee'
                ? 'Aucune séance trouvée pour votre nom.'
                : hasFilters
                  ? 'Aucune séance pour ces filtres.'
                  : 'Aucune séance enregistrée.'}
            </p>
            {auth.role === 'coach' && !hasFilters && (
              <p className="text-sm text-gray-400 mt-2">
                <a href="/session/new" className="text-[#4a7c20] hover:underline font-semibold">
                  Créer la première séance →
                </a>
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(session => (
              <SessionCard key={session.id} session={session} role={auth.role} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
