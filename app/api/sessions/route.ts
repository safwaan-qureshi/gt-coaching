import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { error } = await supabase.from('coaching_sessions').insert({
      session_date: body.session_date,
      member_name: body.member_name,
      focus: body.focus,
      mood: body.mood,
      context: body.context ?? null,
      discussed: body.discussed ?? null,
      strengths: body.strengths ?? null,
      private_notes: body.private_notes ?? null,
      emp_actions: body.emp_actions ?? [],
      followup: body.followup ?? null,
      sig_coach: body.sig_coach ?? null,
      sig_employee: body.sig_employee ?? null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
}
