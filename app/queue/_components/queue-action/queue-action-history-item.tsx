import { Button } from '@/components/ui/button'
import { QueueAction, Replacer, Searcher } from '../../atoms'
import { Caption } from '@/components/ui/caption'

export function HistoryItem({
	value,
	isCurrent,
	onUse,
}: {
	value: QueueAction
	isCurrent: boolean
	onUse: () => void
}) {
	return (
		<li className="border rounded-sm p-2 space-y-2 [text-box-trim:none] flex flex-col">
			<div className="grow">
				<span className="text-muted-foreground">将</span>
				<SearcherDisplay value={value.searcher} />
				<span className="text-muted-foreground">替换为</span>
				<ReplacerDisplay value={value.replacer} />
				{value.summary && (
					<>
						<span className="text-muted-foreground">摘要：</span>
						<span>“{value.summary}”</span>
					</>
				)}
			</div>
			{isCurrent ? (
				<Button size="sm" disabled>
					正在使用
				</Button>
			) : (
				<Button size="sm" onClick={onUse}>
					使用
				</Button>
			)}
		</li>
	)
}

function SearcherDisplay({ value }: { value: Searcher }) {
	if (value.type === 'string') {
		return <span>“{value.value}”</span>
	}
	return (
		<code>
			<bdi>/</bdi>
			{value.pattern}
			<bdi>/</bdi>
			{value.flags}
		</code>
	)
}

function ReplacerDisplay({ value }: { value: Replacer }) {
	if (value.type === 'string') {
		return <span>“{value.value}”</span>
	}
	const { argNames, body } = value
	const code = [
		`function (${argNames[0]}${argNames.slice(1).map((name) => `, ${name}`)}) {`,
		body.replaceAll(/^/gm, '  '),
		'}',
	].join('\n')

	return (
		<pre>
			<code>{code}</code>
		</pre>
	)
}
