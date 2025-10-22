'use server'

import { wiki } from '@/app/_server-context'

export async function editPage({ title, content, summary }: { title: string; content: string; summary?: string }) {
	wiki.page({ title }).edit({
		content,
		summary,
	})
}
