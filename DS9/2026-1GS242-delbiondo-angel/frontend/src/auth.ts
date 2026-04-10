export interface AuthUser {
  email: string
  role: 'professor' | 'student'
}

const CREDENTIALS: Record<string, { password: string; role: AuthUser['role'] }> = {
  'angeldelbiondo@gmail.com':  { password: '12345', role: 'professor' },
  'angeldelbiondo2@gmail.com': { password: '12345', role: 'student' },
}

const AUTH_KEY = 'pollclass_auth'

export function login(email: string, password: string): AuthUser | null {
  const cred = CREDENTIALS[email.toLowerCase().trim()]
  if (!cred || cred.password !== password) return null
  const user: AuthUser = { email, role: cred.role }
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  return user
}

export function getUser(): AuthUser | null {
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return null
  try { return JSON.parse(stored) } catch { return null }
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}
