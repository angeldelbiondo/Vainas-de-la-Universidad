import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import type { Poll } from '../types'
import { usePolling } from '../hooks/usePolling'
import { useVoterId } from '../hooks/useVoterId'
import ResultsBar from '../components/ResultsBar'

const OPTION_STYLES = [
  'border-red-300 hover:bg-red-50 hover:border-red-400 text-red-700',
  'border-yellow-300 hover:bg-yellow-50 hover:border-yellow-400 text-yellow-700',
  'border-green-300 hover:bg-green-50 hover:border-green-400 text-green-700',
  'border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-blue-700',
]

const OPTION_EMOJIS = ['🔴', '🟡', '🟢', '🔵']

export default function VoterPage() {
  const { id } = useParams<{ id: string }>()
  const voterId = useVoterId()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [error, setError] = useState('')
  const [votedIndex, setVotedIndex] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [voteError, setVoteError] = useState('')

  const localKey = `voted_${id}`

  useEffect(() => {
    const saved = localStorage.getItem(localKey)
    if (saved !== null) setVotedIndex(parseInt(saved, 10))
  }, [localKey])

  async function fetchPoll() {
    if (!id) return
    try {
      const data = await api.getPoll(id)
      setPoll(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encuesta no encontrada')
    }
  }

  usePolling(fetchPoll, 2500, true)

  async function submitVote(optionIndex: number) {
    if (!id || !poll?.isOpen || submitting) return
    setVoteError('')
    setSubmitting(true)
    try {
      const updated = await api.vote(id, { voterId, optionIndex })
      setPoll(updated)
      setVotedIndex(optionIndex)
      localStorage.setItem(localKey, String(optionIndex))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al votar'
      if (msg === 'Already voted') {
        setVotedIndex(-1)
        localStorage.setItem(localKey, '-1')
      } else {
        setVoteError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen rainbow-bg flex items-center justify-center px-4">
        <div className="bg-white/20 backdrop-blur rounded-3xl p-8 text-center">
          <p className="text-5xl mb-3">😕</p>
          <h2 className="text-xl font-black text-white mb-1">Encuesta no encontrada</h2>
          <p className="text-white/70 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="min-h-screen rainbow-bg-soft flex items-center justify-center">
        <div className="animate-spin text-4xl">🌈</div>
      </div>
    )
  }

  const hasVoted = votedIndex !== null

  return (
    <div className="min-h-screen rainbow-bg-soft">
      <header className="rainbow-header px-4 py-4 shadow-lg">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-black text-white drop-shadow">🌈 PollClass</h1>
          <p className="text-white/80 text-xs font-medium">Vista del Estudiante 🎓</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl shadow-xl p-5">
          <div className="flex items-start justify-between gap-2 mb-4 flex-wrap">
            <h2 className="text-lg font-black text-gray-800 flex-1">{poll.question}</h2>
            <span className={`shrink-0 text-xs px-3 py-1 rounded-full font-bold ${
              poll.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {poll.isOpen ? '🟢 Abierta' : '🔒 Cerrada'}
            </span>
          </div>

          {/* Closed, never voted */}
          {!poll.isOpen && !hasVoted && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">🔒</p>
              <p className="text-sm">Esta encuesta está cerrada.</p>
            </div>
          )}

          {/* Already voted — show results */}
          {hasVoted && (
            <div>
              {votedIndex !== null && votedIndex >= 0 && (
                <p className="text-sm font-bold mb-2" style={{ color: ['#ef4444','#eab308','#22c55e','#3b82f6'][votedIndex % 4] }}>
                  {OPTION_EMOJIS[votedIndex % 4]} Votaste por: {poll.options[votedIndex]?.text}
                </p>
              )}
              <ResultsBar
                options={poll.options}
                totalVotes={poll.totalVotes}
                votedIndex={votedIndex ?? undefined}
              />
              <p className="text-xs text-gray-300 mt-3 text-center">
                🔄 Resultados actualizando automáticamente...
              </p>
            </div>
          )}

          {/* Voting form */}
          {poll.isOpen && !hasVoted && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-2">Elige una opción 👇</p>
              {poll.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => submitVote(i)}
                  disabled={submitting}
                  className={`w-full text-left px-4 py-4 rounded-2xl border-2 disabled:opacity-60 transition-all text-sm font-bold active:scale-95 ${OPTION_STYLES[i % 4]}`}
                >
                  {OPTION_EMOJIS[i % 4]} {opt.text}
                </button>
              ))}
              {voteError && <p className="text-red-500 text-sm text-center">{voteError}</p>}
              {submitting && <p className="text-center text-sm text-gray-400 animate-pulse">Enviando voto... 🚀</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
