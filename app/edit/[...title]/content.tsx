import { wiki } from '@/app/_server-context'
import { PageMissingError } from '@/lib/wiki/page'
import type { ReactNode } from 'react'
import { ContentEditor } from './content-editor'

export async function Content({ title }: { title: string }) {
	let content: ReactNode
	try {
		const revision = await wiki.page({ title }).getLatestRevision()
		const time = new Date(revision.timestamp)
		content = (
			<div>
				<div className="flex justify-between mb-4 text-muted-foreground">
					<div>版本ID：{revision.id}</div>
					<div>{time.toLocaleString()}</div>
				</div>
				<ContentEditor title={title} defaultValue={revision.content + '\n'} />
			</div>
		)
	} catch (e) {
		if (e instanceof PageMissingError) {
			content = (
				<div>
					<p className="text-destructive">页面不存在，将创建页面。</p>
					<ContentEditor title={title} />
				</div>
			)
		} else {
			throw e
		}
	}

	return <div className="">{content}</div>
}
