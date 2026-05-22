export type Role = 'coach' | 'direction' | 'employee'

export interface AuthState {
  role: Role
  name: string
}

export interface EmpAction {
  id: string
  text: string
}

export interface CoachingSession {
  id: string
  created_at: string
  session_date: string
  member_name: string
  focus: string
  mood: 'Positive' | 'Neutre' | 'À surveiller'
  context: string | null
  discussed: string | null
  strengths: string | null
  private_notes: string | null
  emp_actions: EmpAction[]
  followup: string | null
  sig_coach: string | null
  sig_employee: string | null
}
