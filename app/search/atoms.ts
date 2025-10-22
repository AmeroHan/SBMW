import { atom } from 'jotai'
import { search } from './actions'

export const submittedSearchValueAtom = atom('')
export const searchResultAtom = atom<Awaited<ReturnType<typeof search>> | null>(null)
