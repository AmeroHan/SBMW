'use client'
import dynamic from 'next/dynamic'

import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

import { DiffEditorProps, type EditorProps } from './core'

const EditorCore = dynamic(async () => (await import('./core')).EditorCore, { ssr: false })
const DiffEditorCore = dynamic(async () => (await import('./core')).DiffEditorCore, { ssr: false })

export function MonacoEditor({ className, ...props }: EditorProps) {
	return (
		<div
			className={cn(
				'relative flex items-center justify-center rounded-md [&>div:not(:empty)~[aria-label=Loading]]:hidden',
				className
			)}
		>
			<EditorCore {...props} />
			<Spinner />
		</div>
	)
}

export function MonacoDiffEditor({ className, ...props }: DiffEditorProps) {
	return (
		<div
			className={cn(
				'relative flex items-center justify-center rounded-md overflow-hidden [&>div:not(:empty)~[aria-label=Loading]]:hidden',
				className
			)}
		>
			<DiffEditorCore {...props} />
			<Spinner />
		</div>
	)
}
