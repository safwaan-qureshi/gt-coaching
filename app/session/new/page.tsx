'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Header } from '@/components/Header'
import type { EmpAction } from '@/lib/types'

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

const FOLLOWUP_OPTIONS = [
  '1 semaine',
  '2 semaines',
  '1 mois',
  '3 mois',
  'Prochain cycle',
]

const todayStr = new Date().toISOString().split('T')[0]

function newAction(): EmpAction {
  return { id: crypto.randomUUID(), text: '' }
}

interface FormData {
  member_name: string
  session_date: string
  focus: string
  mood: 'Positive' | 'Neutre' | 'À surveiller'
  context: string
  discussed: string
  strengths: string
  private_notes: string
  emp_actions: EmpAction[]
  followup: string
  sig_coach: string
  sig_employee: string
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#AAEE44] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function NewSessionPage() {
  const { auth, loading, logout } = useAuth('coach')
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [form, setForm] = useState<FormData>({
    member_name: '',
    session_date: todayStr,
    focus: FOCUS_OPTIONS[0],
    mood: 'Positive',
    context: '',
    discussed: '',
    strengths: '',
    private_notes: '',
    emp_actions: [newAction()],
    followup: FOLLOWUP_OPTIONS[1],
    sig_coach: '',
    sig_employee: '',
  })

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function addAction() {
    set('emp_actions', [...form.emp_actions, newAction()])
  }

  function removeAction(id: string) {
    set('emp_actions', form.emp_actions.filter(a => a.id !== id))
  }

  function updateAction(id: string, text: string) {
    set('emp_actions', form.emp_actions.map(a => a.id === id ? { ...a, text } : a))
  }

  async function handleSubmit() {
    setSaveError('')
    setSaving(true)
    const filteredActions = form.emp_actions.filter(a => a.text.trim())
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_date: form.session_date,
        member_name: form.member_name.trim(),
        focus: form.focus,
        mood: form.mood,
        context: form.context || null,
        discussed: form.discussed || null,
        strengths: form.strengths || null,
        private_notes: form.private_notes || null,
        emp_actions: filteredActions,
        followup: form.followup || null,
        sig_coach: form.sig_coach || null,
        sig_employee: form.sig_employee || null,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok || data.error) { setSaveError('Erreur lors de la sauvegarde : ' + (data.error ?? res.statusText)); return }
    router.push('/history')
  }

  const step1Valid = !!(form.member_name.trim() && form.session_date && form.focus && form.mood)

  if (loading || !auth) return <Spinner />

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header auth={auth} onLogout={logout} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Nouvelle séance</h1>
          <p className="text-sm text-gray-500">Remplissez les 3 étapes ensemble durant la séance</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {[
            { n: 1, label: 'Informations' },
            { n: 2, label: 'Notes coach' },
            { n: 3, label: 'Employé' },
          ].map(({ n, label }, i) => (
            <div key={n} className={`flex items-center ${i < 2 ? 'flex-1' : ''}`}>
              <button
                type="button"
                onClick={() => n < step && setStep(n)}
                className={`flex items-center gap-2 ${n < step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                    step > n ? 'bg-[#AAEE44] text-gray-900' : step === n ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step > n ? '✓' : n}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${step === n ? 'text-gray-900' : 'text-gray-400'}`}>
                  {label}
                </span>
              </button>
              {i < 2 && (
                <div className={`flex-1 h-0.5 mx-2 sm:mx-3 ${step > n ? 'bg-[#AAEE44]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nom du membre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.member_name}
                onChange={e => set('member_name', e.target.value)}
                placeholder="Prénom et nom"
                autoFocus
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Date de la séance <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.session_date}
                onChange={e => set('session_date', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Axe de développement <span className="text-red-400">*</span>
              </label>
              <select
                value={form.focus}
                onChange={e => set('focus', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm bg-white"
              >
                {FOCUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                État / Humeur <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                {(['Positive', 'Neutre', 'À surveiller'] as const).map(m => (
                  <label
                    key={m}
                    className={`flex-1 text-center py-2.5 rounded-lg border-2 cursor-pointer text-sm font-semibold transition-all ${
                      form.mood === m
                        ? m === 'Positive'
                          ? 'border-green-400 bg-green-50 text-green-800'
                          : m === 'Neutre'
                            ? 'border-gray-400 bg-gray-50 text-gray-700'
                            : 'border-amber-400 bg-amber-50 text-amber-800'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mood"
                      value={m}
                      checked={form.mood === m}
                      onChange={() => set('mood', m)}
                      className="sr-only"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => step1Valid && setStep(2)}
              disabled={!step1Valid}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              Continuer →
            </button>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-[#AAEE44]" />
              <span className="text-sm font-semibold text-gray-500">Rempli par le coach</span>
            </div>

            {[
              { key: 'context' as const, label: 'Contexte et observations', placeholder: 'Décrire le contexte, les observations de performance…', rows: 4 },
              { key: 'discussed' as const, label: 'Points discutés', placeholder: 'Principaux sujets abordés durant la séance…', rows: 4 },
              { key: 'strengths' as const, label: 'Forces identifiées', placeholder: "Points forts observés chez l'employé…", rows: 3 },
            ].map(({ key, label, placeholder, rows }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <textarea
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  rows={rows}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm resize-none"
                />
              </div>
            ))}

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Notes confidentielles</label>
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                  coach &amp; direction seulement
                </span>
              </div>
              <textarea
                value={form.private_notes}
                onChange={e => set('private_notes', e.target.value)}
                placeholder="Observations confidentielles, points à surveiller…"
                rows={3}
                className="w-full px-3 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent text-sm resize-none bg-amber-50/30"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                ← Retour
              </button>
              <button onClick={() => setStep(3)} className="flex-1 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-[#f4fde8] border-2 border-[#AAEE44] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-[#AAEE44]" />
                <span className="text-sm font-bold text-[#4a7c20]">
                  Cette section est remplie par l'employé
                </span>
              </div>

              {/* Actions */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Mes engagements concrets
                </label>
                <div className="space-y-2">
                  {form.emp_actions.map((action, i) => (
                    <div key={action.id} className="flex gap-2 items-center">
                      <span className="text-sm font-bold text-[#AAEE44] w-5 flex-shrink-0 text-right">{i + 1}.</span>
                      <input
                        type="text"
                        value={action.text}
                        onChange={e => updateAction(action.id, e.target.value)}
                        placeholder={`Engagement ${i + 1}…`}
                        className="flex-1 px-3 py-2 border border-[#AAEE44]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm bg-white"
                      />
                      {form.emp_actions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAction(action.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none w-6 flex-shrink-0"
                          aria-label="Supprimer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addAction}
                  className="mt-3 text-sm font-semibold text-[#4a7c20] hover:text-[#AAEE44] transition-colors flex items-center gap-1"
                >
                  + Ajouter un engagement
                </button>
              </div>

              {/* Followup */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Suivi prévu dans</label>
                <select
                  value={form.followup}
                  onChange={e => set('followup', e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#AAEE44]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm bg-white"
                >
                  {FOLLOWUP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            {/* Signatures */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Signatures (noms tapés)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Coach</label>
                  <input
                    type="text"
                    value={form.sig_coach}
                    onChange={e => set('sig_coach', e.target.value)}
                    placeholder="Prénom Nom"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm italic text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Employé</label>
                  <input
                    type="text"
                    value={form.sig_employee}
                    onChange={e => set('sig_employee', e.target.value)}
                    placeholder="Prénom Nom"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AAEE44] focus:border-transparent text-sm italic text-gray-700"
                  />
                </div>
              </div>
            </div>

            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
                {saveError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-3 bg-[#AAEE44] text-gray-900 font-extrabold rounded-xl hover:bg-[#99dd33] active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer la séance ✓'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
