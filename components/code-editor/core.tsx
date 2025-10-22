import { type RefObject, useEffect, useRef } from 'react'
import { shikiToMonaco } from '@shikijs/monaco'
import * as monaco from 'monaco-editor-core'
import { createHighlighter } from 'shiki'
import { cn } from '@/lib/utils'

async function prepare({ themes, languages }: { themes: string[]; languages: string[] }) {
	const highlighter = await createHighlighter({
		themes,
		langs: languages,
	})
	for (const lang of languages) {
		monaco.languages.register({ id: lang })
	}
	shikiToMonaco(highlighter, monaco)
}
await prepare({
	themes: ['github-dark-dimmed', 'github-light'],
	languages: ['wikitext', 'css', 'javascript', 'json', 'regexp'],
})

export type MonacoEditorInstance = monaco.editor.IStandaloneCodeEditor
export type MonacoDiffEditorInstance = monaco.editor.IStandaloneDiffEditor

export interface EditorProps {
	language: string
	defaultValue?: string
	onChange?: (content: string, event: monaco.editor.IModelContentChangedEvent) => unknown
	readOnly?: boolean
	wordWrap?: boolean
	withMinimap?: boolean
	className?: string
	editorRef?: RefObject<MonacoEditorInstance | null>
}

export interface DiffEditorProps {
	language: string
	originalContent: string
	defaultModifiedContent?: string
	onChange?: (content: string, event: monaco.editor.IModelContentChangedEvent) => unknown
	hideUnchangedRegions?: boolean
	wordWrap?: boolean
	withMinimap?: boolean
	className?: string
	editorRef?: RefObject<MonacoDiffEditorInstance | null>
}

export function EditorCore({
	className,
	language,
	defaultValue,
	onChange,
	readOnly,
	wordWrap,
	withMinimap = false,
	editorRef: outerEditorRef,
}: EditorProps) {
	// const theme = resolvedTheme === 'dark' ? DARK_THEME_NAME : LIGHT_THEME_NAME
	const theme = 'github-light'
	const containerRef = useRef<HTMLDivElement>(null)
	const editorRef = useRef<MonacoEditorInstance>(null)

	useEffect(() => {
		if (!containerRef.current) return
		monaco.editor.setTheme(theme)
	}, [theme])

	useEffect(() => {
		if (!editorRef.current) return
		editorRef.current.updateOptions({
			minimap: { enabled: withMinimap },
		})
		console.log('withMinimap: ', withMinimap)
	}, [withMinimap])

	useEffect(() => {
		const container = containerRef.current!

		const editor = monaco.editor.create(container, {
			value: defaultValue,
			theme,
			language,
			readOnly,
			minimap: { enabled: withMinimap },
			automaticLayout: true,
			wordWrap: wordWrap ? 'on' : undefined,
			fontFamily: 'var(--font-mono)',
			unicodeHighlight: {
				allowedLocales: { 'zh-hans': true, ja: true },
				allowedCharacters: { '　': true },
			},
			fontLigatures: true,
		})

		editorRef.current = editor
		if (outerEditorRef) {
			outerEditorRef.current = editor
		}

		// 网络字体可能未完全加载，导致文字尺寸计算错误，重新测量
		// editor.onDidFocusEditorText(debouncedRemeasureFonts)
		// editor.onDidChangeCursorPosition(debouncedRemeasureFonts)

		if (onChange) {
			editor.onDidChangeModelContent((e) => {
				onChange(editor.getValue(), e)
			})
		}

		return () => {
			editorRef.current = null
			if (outerEditorRef) {
				outerEditorRef.current = null
			}
			editor.dispose()
		}
		// theme 没进依赖是有意为之
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [language, onChange])

	return (
		<div
			ref={containerRef}
			className={cn(
				'not-prose absolute inset-0 text-sm [&_.monaco-editor]:rounded-md [&_.overflow-guard]:rounded-md',
				className
			)}
		/>
	)
}

export function DiffEditorCore({
	className,
	language,
	originalContent,
	defaultModifiedContent,
	hideUnchangedRegions,
	onChange,
	wordWrap,
	withMinimap = false,
	editorRef: outerEditorRef,
}: DiffEditorProps) {
	const theme = 'github-light'
	const containerRef = useRef<HTMLDivElement>(null)
	const editorRef = useRef<MonacoDiffEditorInstance>(null)

	useEffect(() => {
		if (!containerRef.current) return
		monaco.editor.setTheme(theme)
	}, [theme])

	useEffect(() => {
		if (!editorRef.current) return
		editorRef.current.updateOptions({
			minimap: { enabled: withMinimap },
		})
		console.log('withMinimap: ', withMinimap)
	}, [withMinimap])

	useEffect(() => {
		const container = containerRef.current!

		const editor = monaco.editor.createDiffEditor(container, {
			originalEditable: false,
			hideUnchangedRegions: { enabled: hideUnchangedRegions },
			theme,
			minimap: { enabled: withMinimap },
			automaticLayout: true,
			wordWrap: wordWrap ? 'on' : undefined,
			fontFamily: 'var(--font-mono)',
			unicodeHighlight: {
				allowedLocales: { 'zh-hans': true, ja: true },
				allowedCharacters: { '　': true },
			},
			fontLigatures: true,
		})

		editorRef.current = editor
		if (outerEditorRef) {
			outerEditorRef.current = editor
		}
		const originalModel = monaco.editor.createModel(originalContent, language)
		const modifiedModel = monaco.editor.createModel(defaultModifiedContent ?? '', language)
		editor.setModel({
			original: originalModel,
			modified: modifiedModel,
		})

		if (onChange) {
			modifiedModel.onDidChangeContent((e) => {
				onChange(modifiedModel.getValue(), e)
			})
		}

		return () => {
			editorRef.current = null
			if (outerEditorRef) {
				outerEditorRef.current = null
			}
			editor.dispose()
		}
		// theme 没进依赖是有意为之
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [originalContent, language, onChange])

	return (
		<div
			ref={containerRef}
			className={cn(
				'not-prose absolute inset-0 text-sm [&_.monaco-diff-editor]:rounded-md-1 [&_.overflow-guard]:rounded-md-1',
				className
			)}
		/>
	)
}
