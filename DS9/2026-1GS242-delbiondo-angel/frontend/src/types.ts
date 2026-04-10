export interface PollOption {
  text: string
  votes: number
}

export interface Poll {
  _id: string
  question: string
  options: PollOption[]
  isOpen: boolean
  createdAt: string
  totalVotes: number
}

export interface CreatePollPayload {
  question: string
  options: string[]
}

export interface VotePayload {
  voterId: string
  optionIndex: number
}
