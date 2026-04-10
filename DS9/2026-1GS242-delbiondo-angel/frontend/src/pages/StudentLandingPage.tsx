import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../auth'

interface Props {
  onLogout: () => void
}

export default function StudentLandingPage({ onLogout }: Props) {
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  function handleJoin() {
    const trimmed = code.trim()
    if (!trimmed) return
    // Accept full URL or just the poll ID
    const match = trimmed.match(/\/poll\/([a-f0-9]{24})/) ?? trimmed.match(/^([a-f0-9]{24})$/)
    const id = match ? match[1] : trimmed
    navigate(`/poll/${id}`)
  }

  function handleLogout() {
    logout()
    onLogout()
  }

  return (
    <div className="min-h-screen rainbow-bg-soft flex flex-col">
      <header className="rainbow-header px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white drop-shadow">🌈 PollClass</h1>
          <p className="text-white/80 text-xs">Vista del Estudiante</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-white/70 hover:text-white border border-white/30 px-3 py-1.5 rounded-full transition-colors"
        >
          Salir 👋
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 text-center">
            <div className="text-5xl mb-3">🗳️</div>
            <h2 className="text-xl font-black text-gray-800 mb-1">Unirse a una encuesta</h2>
            <p className="text-gray-400 text-sm mb-5">
              Pega el link o el código que te dio tu profe
            </p>

            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="Link o ID de la encuesta..."
              className="w-full border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors mb-3"
            />

            <button
              onClick={handleJoin}
              disabled={!code.trim()}
              className="w-full rainbow-btn text-white font-black py-3 rounded-xl text-base disabled:opacity-40 active:scale-95 transition-all"
            >
              🎉 Entrar a la encuesta
            </button>

            <p className="text-gray-300 text-xs mt-4">
              Si el profe te mandó un link directo, solo ábrelo 😎
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
