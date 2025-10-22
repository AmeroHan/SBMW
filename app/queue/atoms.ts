import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { NonEmptyTuple } from 'type-fest'
export interface ActionBase {
	summary: string
}

export interface SearchReplaceAction extends ActionBase {
	type: 'search-replace'
	searcher: Searcher
	replacer: Replacer
}

export interface StringSearcher {
	type: 'string'
	value: string
}

export interface RegExpSearcher {
	type: 'regexp'
	pattern: string
	flags: string
}

export type Searcher = StringSearcher | RegExpSearcher

export interface StringReplacer {
	type: 'string'
	value: string
}

export interface FunctionReplacer {
	type: 'function'
	argNames: NonEmptyTuple<string>
	body: string
}
export type Replacer = StringReplacer | FunctionReplacer

export type QueueAction = SearchReplaceAction

export interface QueueItem {
	title: string
}

export const queueAtom = atom<QueueItem[]>([])
export const usingActionAtom = atom<QueueAction | null>(null)

export const actionHistoryAtom = atomWithStorage<QueueAction[]>('historicalActions', [])
