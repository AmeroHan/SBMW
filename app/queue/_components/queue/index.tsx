'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { actionHistoryAtom, queueAtom } from '../../atoms'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { H2 } from '@/app/_components/heading'
import { PlusIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ActionPreview } from '../queue-action/action-preview'

export function Queue() {
	const [queue, setQueue] = useAtom(queueAtom)
	const action = useAtomValue(actionHistoryAtom)
	return (
		<div className="space-y-2">
			<H2>队列</H2>
			<ul className="flex flex-wrap gap-2">
				{queue.map((page, i) => {
					return (
						<QueueItem
							key={page.title}
							title={page.title}
							isCurrent={i === 0}
							onRemoved={() => setQueue(queue.toSpliced(i, 1))}
						/>
					)
				})}
				<li>
					<QueueAdder />
				</li>
			</ul>
			{queue.length > 0 && action.length > 0 && <ActionPreview target={queue[0]} action={action[0]} />}
		</div>
	)
}

function QueueItem({ title, isCurrent, onRemoved }: { title: string; isCurrent: boolean; onRemoved: () => void }) {
	return (
		<li className={cn('border rounded-sm flex items-center pl-2', isCurrent && 'bg-primary text-primary-foreground')}>
			{title}
			<Button size="icon-xs" variant="ghost" onClick={onRemoved}>
				<XIcon />
			</Button>
		</li>
	)
}

function QueueAdder() {
	const setQueue = useSetAtom(queueAtom)
	const inputRef = useRef<HTMLInputElement>(null)
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				setQueue((old) => {
					const title = inputRef.current!.value
					return [...old.filter((x) => x.title !== title), { title }]
				})
			}}
			className="flex gap-2 w-60"
		>
			<Input ref={inputRef} name="title" placeholder="新增页面" />
			<Button type="submit" size="icon-sm">
				<PlusIcon />
			</Button>
		</form>
	)
}
