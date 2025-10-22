import { queueAtom, type QueueAction, type QueueItem, type Replacer, type Searcher } from '../../atoms'
import { H2 } from '@/app/_components/heading'
import { ActionPreviewEditor } from './action-preview-editor'
import { editPage } from '../../actions'
import { useQuery } from '@tanstack/react-query'
import { getPageContent } from '@/app/actions'
import { Spinner } from '@/components/ui/spinner'
import { useSetAtom } from 'jotai'
import { toast } from 'sonner'

export function ActionPreview({ target, action }: { target: QueueItem; action: QueueAction }) {
	const setQueue = useSetAtom(queueAtom)
	const { data, isPending, isError } = useQuery({
		queryKey: ['content', target.title, action],
		queryFn: async () => {
			const originalContent = await getPageContent({ title: target.title })

			const searcher = parseSearcher(action.searcher)
			const replacer = parseReplacer(action.replacer)
			const actionedContent = originalContent.replaceAll(searcher, replacer as any)
			if (action.skipUnchanged && originalContent === actionedContent) {
				toast.info(`跳过无变化的页面 [[${target.title}]]`)
				setQueue((old) => old.slice(1))
			}
			return [originalContent, actionedContent]
		},
	})

	if (isError) return '出错了'
	if (isPending) return <Spinner />

	const [originalContent, actionedContent] = data

	return (
		<div className="space-y-2">
			<H2>预览</H2>
			<ActionPreviewEditor
				title={target.title}
				originalContent={originalContent}
				actionedContent={actionedContent}
				defaultSummary={action.summary}
				editPageAction={editPage}
			/>
		</div>
	)
}

function parseSearcher(searcher: Searcher) {
	if (searcher.type === 'string') return searcher.value

	return new RegExp(searcher.pattern, searcher.flags)
}

function parseReplacer(replacer: Replacer) {
	if (replacer.type === 'string') return replacer.value

	return new Function(...replacer.argNames, ...replacer.body)
}
