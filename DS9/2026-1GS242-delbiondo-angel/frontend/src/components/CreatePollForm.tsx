import { useState, type FormEvent } from 'react'
import { api } from '../api'

interface Props {
  onCreated: () => void
}

const OPTION_PLACEHOLDERS = [
  '🔴 Opción 1 *',
  '🟡 Opción 2 *',
  '🟢 Opción 3 (opcional)',
  '🔵 Opción 4 (opcional)',
]

const OPTION_FOCUS = [
  'focus:ring-red-300 focus:border-red-300',
  'focus:ring-yellow-300 focus:border-yellow-300',
  'focus:ring-green-300 focus:border-green-300',
  'focus:ring-blue-300 focus:border-blue-300',
]

export default function CreatePollForm({ onCreated }: Props) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateOption(i: number, value: string) {
    setOptions(prev => prev.map((o, idx) => (idx === i ? value : o)))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const validOpts = options.map(o => o.trim()).filter(Boolean)
    if (!question.trim()) return setError('La pregunta es requerida 📝')
    if (validOpts.length < 2) return setError('Necesitas al menos 2 opciones 🎯')

    setLoading(true)
    try {
      await api.createPoll({ question: question.trim(), options: validOpts })
      setQuestion('')
      setOptions(['', '', '', ''])
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear encuesta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          ❓ Pregunta
        </label>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="¿Cuál es tu lenguaje favorito?"
          className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">
          🎨 Opciones <span className="text-gray-400 font-normal">(mínimo 2, máximo 4)</span>
        </label>
        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={e => updateOption(i, e.target.value)}
            placeholder={OPTION_PLACEHOLDERS[i]}
            className={`w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${OPTION_FOCUS[i]}`}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rainbow-btn text-white font-black py-3 rounded-xl text-sm disabled:opacity-60 active:scale-95 transition-all"
      >
        {loading ? '⏳ Creando...' : '🚀 Crear encuesta'}
      </button>
    </form>
  )
}
