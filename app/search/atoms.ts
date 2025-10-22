import { atom } from 'jotai'
import { search, SearchResult } from './actions'

export const submittedSearchValueAtom = atom('')
export const searchResultAtom = atom<SearchResult | null>(null)
