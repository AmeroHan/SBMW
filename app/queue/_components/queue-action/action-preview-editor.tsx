'use client'

import { MonacoDiffEditor } from '@/components/code-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { queueAtom } from '../../atoms'
import { Caption } from '@/components/ui/caption'
import { toast } from 'sonner'
import { editPage } from '@/app/actions'

export function ActionPreviewEditor({
	title,
	originalContent,
	actionedContent,
	defaultSummary,
}: {
	title: string
	originalContent: string
	actionedContent: string
	defaultSummary: string
}) {
	const [editedContent, setEditedContent] = useState(actionedContent)
	const [editedSummary, setEditedSummary] = useState(defaultSummary)
	const setQueue = useSetAtom(queueAtom)
	const language = 'wikitext'

	return (
		<div className="space-y-2">
			{originalContent === editedContent && <Caption>没有差异。</Caption>}
			<MonacoDiffEditor
				hideUnchangedRegions
				originalContent={originalContent}
				defaultModifiedContent={actionedContent}
				language={language}
				className="h-[70vh] border rounded-md resize-y min-h-80"
				onChange={setEditedContent}
				wordWrap
			/>
			<Label>
				<span className="shrink-0">编辑摘要：</span>
				<Input value={editedSummary} onChange={(e) => setEditedSummary(e.target.value)} />
			</Label>
			<div className="flex gap-2">
				<Button
					variant="secondary"
					onClick={async () => {
						setQueue((old) => old.slice(1))
					}}
				>
					跳过
				</Button>
				<Button
					onClick={async () => {
						toast.info(`提交中……`)
						await editPage({ title, content: editedContent, summary: editedSummary })
						toast.success(`编辑 [[${title}]] 成功`)
						setQueue((old) => old.slice(1))
					}}
				>
					提交
				</Button>
			</div>
		</div>
	)
}
