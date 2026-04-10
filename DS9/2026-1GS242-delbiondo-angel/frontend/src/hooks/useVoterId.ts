import { useState } from 'react'

const VOTER_KEY = 'pollclass_voter_id'

export function useVoterId(): string {
  const [id] = useState<string>(() => {
    const stored = localStorage.getItem(VOTER_KEY)
    if (stored) return stored
    const fresh = crypto.randomUUID()
    localStorage.setItem(VOTER_KEY, fresh)
    return fresh
  })
  return id
}
