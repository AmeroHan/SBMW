'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { queueAtom } from '../../atoms'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { H2 } from '@/app/_components/heading'
import { PlusIcon } from 'lucide-react'

export function Queue() {
	const queue = useAtomValue(queueAtom)
	return (
		<div className="space-y-2">
			<H2>队列</H2>
			<ul className="flex flex-wrap gap-2">
				{queue.map((page) => {
					return (
						<li key={page.title} className="border rounded-sm flex items-center px-4">
							{page.title}
						</li>
					)
				})}
				<li>
					<QueueAdder />
				</li>
			</ul>
		</div>
	)
}

function QueueAdder() {
	const setQueue = useSetAtom(queueAtom)
	const inputRef = useRef<HTMLInputElement>(null)
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				setQueue((old) => [...old, { title: inputRef.current!.value }])
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
