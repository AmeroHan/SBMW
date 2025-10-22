import { wiki } from '@/app/_server-context'
import { MonacoEditor } from '@/components/code-editor'
import { PageMissingError } from '@/lib/wiki/page'
import type { ReactNode } from 'react'

export async function Content({ title }: { title: string }) {
	let content: ReactNode
	try {
		const revision = await wiki.page({ title }).getLatestRevision()
		const time = new Date(revision.timestamp)
		content = (
			<>
				<div className="flex justify-between mb-4 text-muted-foreground">
					<div>版本ID：{revision.id}</div>
					<div>{time.toLocaleString()}</div>
				</div>
				<MonacoEditor
					withMinimap
					defaultValue={revision.content}
					language="wikitext"
					className="h-[80vh] border rounded-md"
				/>
			</>
		)
	} catch (e) {
		if (e instanceof PageMissingError) {
			content = <div>页面不存在</div>
		} else {
			throw e
		}
	}

	return <div className="">{content}</div>
}
