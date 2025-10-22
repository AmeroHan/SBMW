'use server'

import type { Timestamp } from '@/lib/wiki/types'
import { wiki } from '../_server-context'
type HTML = string
export async function search(query: string) {
	const { data } = await wiki.api.query<{
		searchinfo: {
			totalhits: number
		}
		search: {
			ns: number
			title: string
			pageid: number
			size: number
			wordcount: number
			snippet: HTML
			timestamp: Timestamp
		}[]
	}>({
		list: 'search',
		srsearch: query,
		srnamespace: '*',
		srlimit: 500,
	})
	return data.query
}
