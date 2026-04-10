import { useState } from 'react'
import { api } from '../api'
import type { Poll } from '../types'
import { usePolling } from '../hooks/usePolling'
import CreatePollForm from '../components/CreatePollForm'
import PollCard from '../components/PollCard'

interface Props {
  onLogout: () => void
}

export default function ProfessorPage({ onLogout }: Props) {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loadError, setLoadError] = useState('')

  async function fetchPolls() {
    try {
      const data = await api.listPolls()
      setPolls(data)
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Error al cargar encuestas')
    }
  }

  usePolling(fetchPolls, 3000, true)

  return (
    <div className="min-h-screen rainbow-bg-soft">
      <header className="rainbow-header px-4 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white drop-shadow">🌈 PollClass</h1>
            <p className="text-white/80 text-xs font-medium">Vista del Profesor 👨‍🏫</p>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-white/80 hover:text-white border border-white/30 px-3 py-1.5 rounded-full transition-colors"
          >
            Salir 👋
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white rounded-3xl shadow-xl p-5 border-t-4 border-transparent"
          style={{ borderImage: 'linear-gradient(90deg,#ff0080,#ffcc00,#00cc44,#0099ff) 1' }}>
          <h2 className="text-lg font-black mb-4 rainbow-text">✨ Nueva encuesta</h2>
          <CreatePollForm onCreated={fetchPolls} />
        </section>

        <section>
          <h2 className="text-lg font-black mb-3 rainbow-text">
            📋 Mis encuestas
            <span className="ml-2 text-sm font-normal text-gray-500">
              (se actualiza cada 3s 🔄)
            </span>
          </h2>
          {loadError && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-xl">{loadError}</p>
          )}
          {polls.length === 0 && !loadError && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">🎨</div>
              <p className="text-sm">No hay encuestas aún. ¡Crea una arriba!</p>
            </div>
          )}
          <div className="space-y-4">
            {polls.map(poll => (
              <PollCard
                key={poll._id}
                poll={poll}
                onDeleted={fetchPolls}
                onToggled={fetchPolls}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
