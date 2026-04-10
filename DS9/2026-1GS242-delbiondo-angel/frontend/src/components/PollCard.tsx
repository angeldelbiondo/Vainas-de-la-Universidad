import { useState } from 'react'
import { api } from '../api'
import type { Poll } from '../types'
import ResultsBar from './ResultsBar'
import ShareLink from './ShareLink'

interface Props {
  poll: Poll
  onDeleted: () => void
  onToggled: () => void
}

const CARD_ACCENTS = [
  'border-l-red-400',
  'border-l-yellow-400',
  'border-l-green-400',
  'border-l-blue-400',
  'border-l-purple-400',
  'border-l-pink-400',
]

export default function PollCard({ poll, onDeleted, onToggled }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState(false)

  // Use a stable color based on poll ID
  const accentIdx = parseInt(poll._id.slice(-1), 16) % CARD_ACCENTS.length

  async function handleDelete() {
    if (!window.confirm('¿Eliminar esta encuesta? 🗑️')) return
    setDeleting(true)
    try {
      await api.deletePoll(poll._id)
      onDeleted()
    } finally {
      setDeleting(false)
    }
  }

  async function handleToggle() {
    setToggling(true)
    try {
      await api.closePoll(poll._id)
      onToggled()
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-md border-l-4 ${CARD_ACCENTS[accentIdx]} p-5`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <h3 className="font-black text-gray-800 text-base flex-1">{poll.question}</h3>
        <span className={`shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
          poll.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {poll.isOpen ? '🟢 Abierta' : '🔒 Cerrada'}
        </span>
      </div>

      <ShareLink pollId={poll._id} />
      <ResultsBar options={poll.options} totalVotes={poll.totalVotes} />

      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="flex-1 text-sm py-2 px-4 rounded-xl border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-60 transition-colors font-bold text-gray-600"
        >
          {toggling ? '⏳' : poll.isOpen ? '🔒 Cerrar' : '🔓 Reabrir'}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 text-sm py-2 px-4 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors font-bold"
        >
          {deleting ? '⏳ Eliminando...' : '🗑️ Eliminar'}
        </button>
      </div>
    </div>
  )
}
