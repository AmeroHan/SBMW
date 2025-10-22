'use client'

import { useAtom } from 'jotai'
import { actionHistoryAtom } from '../../atoms'
import { HistoryItem } from './queue-action-history-item'
import { H2 } from '@/app/_components/heading'
import { Button } from '@/components/ui/button'

export function QueueActionHistory() {
	const [history, setHistory] = useAtom(actionHistoryAtom)
	const len = history.length
	return (
		<div className="p-4 rounded-lg border bg-muted space-y-2">
			<div className="flex gap-4 items-center">
				<H2>操作</H2>
				<Button size="sm" onClick={() => setHistory([])}>
					清空
				</Button>
			</div>
			<ul className="flex flex-wrap gap-4">
				{history.map((item, i) => (
					<HistoryItem
						key={len - i}
						value={item}
						isCurrent={i === 0}
						onUse={() => setHistory([item, ...history.filter((x) => x !== item)])}
					/>
				))}
			</ul>
		</div>
	)
}
