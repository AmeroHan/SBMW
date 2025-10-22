'use server'

import type { Timestamp } from '@/lib/wiki/types'
import { wiki } from '../_server-context'

export interface SearchResult {
	searchinfo: {
		totalhits: number
	}
	search: {
		ns: number
		title: string
		pageid: number
		size: number
		wordcount: number
		snippet: string
		timestamp: Timestamp
	}[]
}

export async function search(query: string) {
	const { data } = await wiki.api.query<SearchResult>({
		list: 'search',
		srsearch: query,
		srnamespace: '*',
		srlimit: 500,
	})
	return data.query
}
