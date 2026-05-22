import type { CoachingSession } from './types'

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fmtDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function section(title: string, content: string | null): string {
  if (!content) return ''
  return `<div class="section"><h3>${esc(title)}</h3><p>${esc(content)}</p></div>`
}

export function printSession(session: CoachingSession): void {
  const actionsHtml =
    session.emp_actions.length > 0
      ? session.emp_actions.map((a, i) => `<li>${i + 1}. ${esc(a.text)}</li>`).join('')
      : '<li><em>Aucun engagement enregistré</em></li>'

  const moodClass =
    session.mood === 'Positive'
      ? 'mood-positive'
      : session.mood === 'Neutre'
        ? 'mood-neutre'
        : 'mood-surveiller'

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Séance de coaching — ${esc(session.member_name)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; max-width: 820px; margin: 0 auto; padding: 40px 48px; color: #111; font-size: 14px; line-height: 1.6; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #AAEE44; padding-bottom: 16px; margin-bottom: 24px; }
    .brand-name { font-size: 22px; font-weight: 800; color: #111; }
    .brand-info { font-size: 12px; color: #555; margin-top: 4px; }
    .doc-title { font-size: 16px; font-weight: 700; color: #4a7c20; text-align: right; }
    .doc-sub { font-size: 11px; color: #888; text-align: right; margin-top: 3px; }
    .meta { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; padding: 12px 16px; background: #f9f9f9; border-radius: 8px; }
    .meta-item label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 2px; }
    .meta-item span { font-weight: 600; font-size: 14px; }
    .mood { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .mood-positive { background: #dcfce7; color: #166534; }
    .mood-neutre { background: #e5e7eb; color: #374151; }
    .mood-surveiller { background: #fef3c7; color: #92400e; }
    .section { margin-bottom: 16px; }
    .section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
    .section p { font-size: 14px; white-space: pre-wrap; color: #222; }
    .actions-box { background: #f0fce8; border: 1.5px solid #AAEE44; border-radius: 8px; padding: 14px 16px; margin: 20px 0; }
    .actions-box h3 { font-size: 13px; color: #4a7c20; font-weight: 700; margin-bottom: 8px; }
    .actions-box ul { list-style: none; padding: 0; }
    .actions-box li { padding: 3px 0; font-size: 14px; }
    .followup-line { margin-top: 8px; font-size: 13px; color: #4a7c20; font-weight: 600; }
    .sig-row { display: flex; gap: 48px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
    .sig-item { flex: 1; }
    .sig-line { border-bottom: 1px solid #555; min-height: 30px; padding-bottom: 2px; font-size: 15px; font-weight: 600; color: #111; margin-bottom: 4px; }
    .sig-label { font-size: 11px; color: #999; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #bbb; border-top: 1px solid #eee; padding-top: 12px; }
    @media print { body { padding: 20px 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-name">Gazon Tropical</div>
      <div class="brand-info">1351 rue Newton, Suite 200<br>Boucherville, QC<br>514-996-9966</div>
    </div>
    <div>
      <div class="doc-title">Séance de coaching S.M.A.R.T.</div>
      <div class="doc-sub">Outil de suivi d'équipe</div>
    </div>
  </div>

  <div class="meta">
    <div class="meta-item"><label>Date</label><span>${fmtDate(session.session_date)}</span></div>
    <div class="meta-item"><label>Membre</label><span>${esc(session.member_name)}</span></div>
    <div class="meta-item"><label>Axe de développement</label><span>${esc(session.focus)}</span></div>
    <div class="meta-item"><label>État</label><span class="mood ${moodClass}">${esc(session.mood)}</span></div>
  </div>

  ${section('Contexte et observations', session.context)}
  ${section('Points discutés', session.discussed)}
  ${section('Forces identifiées', session.strengths)}

  <div class="actions-box">
    <h3>Engagements de l'employé</h3>
    <ul>${actionsHtml}</ul>
    ${session.followup ? `<p class="followup-line">Suivi prévu : ${esc(session.followup)}</p>` : ''}
  </div>

  <div class="sig-row">
    <div class="sig-item">
      <div class="sig-line">${esc(session.sig_coach ?? '')}</div>
      <div class="sig-label">Signature du coach</div>
    </div>
    <div class="sig-item">
      <div class="sig-line">${esc(session.sig_employee ?? '')}</div>
      <div class="sig-label">Signature de l'employé</div>
    </div>
  </div>

  <div class="footer">Document confidentiel — Gazon Tropical &copy; ${new Date().getFullYear()}</div>
</body>
</html>`

  const win = window.open('', '_blank', 'width=920,height=720')
  if (win) {
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 400)
  }
}
