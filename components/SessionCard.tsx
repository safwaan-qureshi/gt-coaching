'use client'

import { printSession } from '@/lib/printSession'
import type { CoachingSession, Role } from '@/lib/types'

const MOOD_STYLES: Record<string, string> = {
  Positive: 'bg-green-100 text-green-800',
  Neutre: 'bg-gray-100 text-gray-600',
  'À surveiller': 'bg-amber-100 text-amber-800',
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="mb-3 last:mb-0">
      <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</dt>
      <dd className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{value}</dd>
    </div>
  )
}

export function SessionCard({ session, role }: { session: CoachingSession; role: Role }) {
  const date = new Date(session.session_date + 'T00:00:00').toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const showPrivate = session.private_notes && (role === 'coach' || role === 'direction')
  const hasCoachNotes = session.context || session.discussed || session.strengths
  const hasActions = session.emp_actions && session.emp_actions.length > 0

  return (
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-base">{session.member_name}</span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${MOOD_STYLES[session.mood] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {session.mood}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {date} &bull; <span className="text-gray-600">{session.focus}</span>
          </p>
        </div>
        <button
          onClick={() => printSession(session)}
          className="self-start text-xs font-medium text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-white hover:border-gray-400 hover:text-gray-700 transition-all flex-shrink-0"
        >
          Imprimer PDF
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-5 space-y-4">
        {hasCoachNotes && (
          <dl>
            <Field label="Contexte et observations" value={session.context} />
            <Field label="Points discutés" value={session.discussed} />
            <Field label="Forces identifiées" value={session.strengths} />
          </dl>
        )}

        {showPrivate && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <dt className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1 flex items-center gap-1">
              <span aria-hidden>🔒</span> Notes confidentielles
            </dt>
            <dd className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">
              {session.private_notes}
            </dd>
          </div>
        )}

        {(hasActions || session.followup) && (
          <div className="rounded-xl bg-[#f4fde8] border border-[#AAEE44]/50 p-4">
            <h4 className="text-xs font-bold text-[#4a7c20] uppercase tracking-wide mb-3">
              Engagements de l'employé
            </h4>
            {hasActions && (
              <ul className="space-y-1.5">
                {session.emp_actions.map((action, i) => (
                  <li key={action.id} className="flex gap-2 text-sm text-gray-800">
                    <span className="font-bold text-[#AAEE44] flex-shrink-0">{i + 1}.</span>
                    <span>{action.text}</span>
                  </li>
                ))}
              </ul>
            )}
            {session.followup && (
              <p className="mt-2 text-xs font-bold text-[#4a7c20]">
                Suivi prévu : {session.followup}
              </p>
            )}
          </div>
        )}

        {(session.sig_coach || session.sig_employee) && (
          <div className="flex gap-8 pt-3 border-t border-gray-100">
            {session.sig_coach && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Coach</p>
                <p className="text-sm font-medium text-gray-700 italic">{session.sig_coach}</p>
              </div>
            )}
            {session.sig_employee && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Employé</p>
                <p className="text-sm font-medium text-gray-700 italic">{session.sig_employee}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
