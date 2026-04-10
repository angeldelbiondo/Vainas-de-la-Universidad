import type { PollOption } from '../types'

interface Props {
  options: PollOption[]
  totalVotes: number
  votedIndex?: number
}

const BAR_COLORS = [
  'bg-red-400',
  'bg-yellow-400',
  'bg-green-400',
  'bg-blue-500',
]

const BORDER_COLORS = [
  'border-red-300',
  'border-yellow-300',
  'border-green-300',
  'border-blue-400',
]

const TEXT_COLORS = [
  'text-red-600',
  'text-yellow-600',
  'text-green-600',
  'text-blue-600',
]

export default function ResultsBar({ options, totalVotes, votedIndex }: Props) {
  return (
    <div className="space-y-3 mt-4">
      {options.map((opt, i) => {
        const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
        const isVoted = i === votedIndex
        return (
          <div
            key={i}
            className={`rounded-xl p-1 border-2 transition-all ${
              isVoted ? BORDER_COLORS[i % 4] : 'border-transparent'
            }`}
          >
            <div className="flex justify-between text-sm mb-1 px-1">
              <span className={`font-medium ${isVoted ? TEXT_COLORS[i % 4] + ' font-bold' : 'text-gray-700'}`}>
                {opt.text} {isVoted && '✓'}
              </span>
              <span className="text-gray-500 tabular-nums text-xs font-semibold">
                {pct}% ({opt.votes})
              </span>
            </div>
            <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${BAR_COLORS[i % 4]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-xs text-gray-400 text-right mt-1">
        {totalVotes} voto{totalVotes !== 1 ? 's' : ''} en total
      </p>
    </div>
  )
}
