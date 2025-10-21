'use client'
import dynamic from 'next/dynamic'

import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

import type { CodeEditorProps } from './core'

const CodeEditorCore = dynamic(() => import('./core').then((m) => m.CodeEditorCore), { ssr: false })

export function MonacoEditor({ className, ...props }: CodeEditorProps) {
	return (
		<div
			className={cn(
				'relative flex items-center justify-center rounded-md overflow-hidden [&>div:not(:empty)~[aria-label=Loading]]:hidden',
				className
			)}
		>
			<CodeEditorCore {...props} />
			<Spinner />
		</div>
	)
}
