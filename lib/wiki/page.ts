import { MaybeArray } from '@/lib/typing'
import type { PageInit, Wiki } from '.'
import { NotImplementedError } from '../errors'
import { Timestamp } from './types'
import { MissingPage } from './api'

export interface PageEditOptions {
	content: string
	summary?: string
	tags?: MaybeArray<string>
	isBot?: boolean
	isMinor?: boolean
}

export class PageMissingError extends Error {
	constructor(title: string) {
		super(`页面不存在：${title}`)
	}
}

export class Page {
	wiki: Wiki
	id: number | undefined = undefined
	title: string | undefined = undefined

	private existing: boolean | null = null

	constructor(options: { wiki: Wiki } & PageInit) {
		this.wiki = options.wiki
		if ('id' in options) {
			this.id = options.id
		}
		if ('title' in options) {
			this.title = options.title
		}
	}

	async getLatestRevision(): Promise<{ id: number; content: string; timestamp: Timestamp }> {
		const title = this.title
		if (title === undefined) {
			throw new NotImplementedError('只支持title，不支持id')
		}
		const api = this.wiki.api
		const result = await api.query<{
			pages: [
				| {
						pageid: number
						ns: number
						title: string
						missing?: undefined
						revisions: [
							{
								revid: number
								parentid: number
								timestamp: Timestamp
								slots: {
									main: {
										contentmodel: string
										contentformat: string
										content: string
									}
								}
							}
						]
				  }
				| MissingPage
			]
		}>({
			titles: title,
			prop: 'revisions',
			rvprop: ['ids', 'timestamp', 'content'],
			rvslots: 'main',
			rvlimit: 1,
		})
		const page = result.data.query.pages[0]
		if (page.missing) {
			throw new PageMissingError(title)
		}
		const rev = page.revisions[0]
		return { id: rev.revid, content: rev.slots.main.content, timestamp: rev.timestamp }
	}

	async edit({ content, summary, tags, isMinor, isBot }: PageEditOptions) {
		const api = this.wiki.api

		const title = this.title
		if (title === undefined) {
			throw new NotImplementedError('只支持title，不支持id')
		}

		await api.edit({
			title: title,
			text: content,
			summary,
			tags,
			minor: isMinor,
			notminor: isMinor === false ? true : undefined,
			bot: isBot,
		})
	}
}
