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
await prepare({ themes: ['github-dark-dimmed', 'github-light'], languages: ['wikitext', 'css', 'javascript', 'json'] })

export type MonacoEditorInstance = monaco.editor.IStandaloneCodeEditor

export type CodeEditorProps = {
	language: string
	defaultValue?: string
	onChange?: (value: string, e: monaco.editor.IModelContentChangedEvent) => unknown
	readOnly?: boolean
	wordWrap?: boolean
	withMinimap?: boolean
	className?: string
	editorRef?: RefObject<MonacoEditorInstance | null>
}

export function CodeEditorCore({
	className,
	language,
	defaultValue,
	onChange,
	readOnly,
	wordWrap,
	withMinimap = false,
	editorRef,
}: CodeEditorProps) {
	// const theme = resolvedTheme === 'dark' ? DARK_THEME_NAME : LIGHT_THEME_NAME
	const containerRef = useRef<HTMLDivElement>(null)

	// useEffect(() => {
	//   if (!containerRef.current) return
	//   monaco.editor.setTheme(theme)
	// }, [theme])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const editor = monaco.editor.create(container, {
			value: defaultValue,
			theme: 'github-light',
			language,
			readOnly,
			minimap: { enabled: withMinimap },
			lineNumbersMinChars: 3,
			showFoldingControls: 'never',
			scrollbar: {
				verticalScrollbarSize: 6,
				horizontalSliderSize: 6,
			},
			automaticLayout: true,
			wordWrap: wordWrap ? 'on' : undefined,
			fontFamily: 'var(--font-mono)',
			unicodeHighlight: {
				allowedLocales: { 'zh-hans': true },
			},
		})

		if (editorRef) {
			editorRef.current = editor
		}

		// 网络字体可能未完全加载，导致文字尺寸计算错误，重新测量
		// editor.onDidFocusEditorText(debouncedRemeasureFonts)
		// editor.onDidChangeCursorPosition(debouncedRemeasureFonts)

		if (onChange) {
			editor.onDidChangeModelContent((e) => {
				onChange?.(editor.getValue(), e)
			})
		}

		return () => {
			editor.dispose()
		}
		// theme 没进依赖是有意为之
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultValue, language, onChange])

	return (
		<div
			ref={containerRef}
			className={cn(
				'not-prose absolute inset-0 text-sm [&_.monaco-editor]:rounded-md-1 [&_.overflow-guard]:rounded-md-1',
				className
			)}
		/>
	)
}
