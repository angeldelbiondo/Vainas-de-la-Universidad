import { useState, type FormEvent } from 'react'
import { login, type AuthUser } from '../auth'

interface Props {
  onLogin: (user: AuthUser) => void
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // dramatic effect 🎭
    const user = login(email, password)
    if (!user) {
      setError('❌ Credenciales incorrectas, tío')
      setLoading(false)
      return
    }
    onLogin(user)
  }

  return (
    <div className="min-h-screen rainbow-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Funny header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 animate-bounce">🌈</div>
          <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tight">
            PollClass
          </h1>
          <p className="text-white/80 text-sm mt-1 font-medium">
            el sistema de encuestas más colorido del universo ✨
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-semibold text-sm mb-1">
                📧 Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                className="w-full rounded-xl px-4 py-3 text-sm bg-white/90 border-0 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-white font-semibold text-sm mb-1">
                🔑 Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full rounded-xl px-4 py-3 text-sm bg-white/90 border-0 focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400 text-gray-800"
              />
            </div>

            {error && (
              <p className="text-white bg-red-500/40 rounded-xl px-4 py-2 text-sm font-medium text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rainbow-btn text-white font-black py-3 rounded-xl text-base transition-all active:scale-95 disabled:opacity-70 shadow-lg"
            >
              {loading ? '🌀 Entrando...' : '🚀 Entrar'}
            </button>
          </form>

          <p className="text-white/60 text-xs text-center mt-4">
            hint: la contraseña es <span className="font-bold text-white/80">12345</span> 🤫
          </p>
        </div>
      </div>
    </div>
  )
}
