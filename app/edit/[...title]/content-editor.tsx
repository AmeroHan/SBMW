'use client'
import { MonacoEditor } from '@/components/code-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useId, useState } from 'react'
import { editPage } from './actions'
import { Spinner } from '@/components/ui/spinner'

export function ContentEditor({
	title,
	language,
	defaultValue,
}: {
	title: string
	language?: 'wikitext'
	defaultValue?: string
}) {
	language ??= 'wikitext'

	const [editedContent, setEditedContent] = useState(defaultValue ?? '')
	const [summary, setSummary] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const summaryId = useId()

	return (
		<div className="space-y-4">
			<MonacoEditor
				withMinimap
				defaultValue={defaultValue}
				language={language}
				className="h-[70vh] border rounded-md resize-y min-h-80"
				onChange={setEditedContent}
			/>
			<div className="space-y-4">
				<div className="flex">
					<Label htmlFor={summaryId} className="text-base shrink-0">
						编辑摘要：
					</Label>
					<Input id={summaryId} type="text" className="grow" onChange={(e) => setSummary(e.target.value)} />
				</div>
				<Button
					onClick={async () => {
						setSubmitting(true)
						await editPage({ title, content: editedContent, summary })
						setSubmitting(false)
					}}
				>
					{submitting && <Spinner />}
					提交
				</Button>
			</div>
		</div>
	)
}
