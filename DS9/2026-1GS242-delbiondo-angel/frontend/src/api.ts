import type { Poll, CreatePollPayload, VotePayload } from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
  return body as T
}

export const api = {
  listPolls: () =>
    request<Poll[]>('/polls'),
  getPoll: (id: string) =>
    request<Poll>(`/polls/${id}`),
  createPoll: (p: CreatePollPayload) =>
    request<Poll>('/polls', { method: 'POST', body: JSON.stringify(p) }),
  deletePoll: (id: string) =>
    request<{ ok: true }>(`/polls/${id}`, { method: 'DELETE' }),
  closePoll: (id: string) =>
    request<Poll>(`/polls/${id}/close`, { method: 'PATCH' }),
  vote: (id: string, p: VotePayload) =>
    request<Poll>(`/polls/${id}/vote`, { method: 'POST', body: JSON.stringify(p) }),
}
