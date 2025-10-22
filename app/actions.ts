'use server'

import { wiki } from '@/app/_server-context'

export async function editPage({ title, content, summary }: { title: string; content: string; summary?: string }) {
	await wiki.page({ title }).edit({
		content,
		summary,
	})
}

export async function getPageContent({ title }: { title: string }) {
	return (await wiki.page({ title }).getLatestRevision()).content
}
