'use server'

import { wiki } from '../_server-context'

export async function editPage(title: string, content: string, summary: string) {
	await wiki.page({ title }).edit({ content, summary })
}
