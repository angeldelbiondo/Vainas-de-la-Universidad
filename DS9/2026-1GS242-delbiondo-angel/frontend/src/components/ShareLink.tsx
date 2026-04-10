import { useState } from 'react'

interface Props {
  pollId: string
}

export default function ShareLink({ pollId }: Props) {
  const url = `${window.location.origin}/poll/${pollId}`
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        readOnly
        value={url}
        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 min-w-0"
      />
      <button
        onClick={copy}
        className="shrink-0 text-sm px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand-dark transition-colors font-medium"
      >
        {copied ? '¡Copiado!' : 'Copiar'}
      </button>
    </div>
  )
}
