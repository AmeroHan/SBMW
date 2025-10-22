'use client'

import { Button } from '@/components/ui/button'
import { useSetAtom } from 'jotai'
import {
	actionHistoryAtom,
	FunctionReplacer,
	RegExpSearcher,
	Replacer,
	Searcher,
	SearchReplaceAction,
	StringReplacer,
	StringSearcher,
} from '../../atoms'
import { Fragment, useState } from 'react'
import { omit } from 'radashi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ButtonGroup } from '@/components/ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { NonEmptyTuple } from 'type-fest'
import { H2 } from '@/app/_components/heading'
import isDeepEqual from 'react-fast-compare'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const defaultStringSearcher: StringSearcher = { type: 'string', value: '' }
const defaultRegexpSearcher: RegExpSearcher = { type: 'regexp', pattern: '', flags: 'g' }
const defaultStringReplacer: StringReplacer = { type: 'string', value: '' }
const defaultFunctionReplacer: FunctionReplacer = { type: 'function', argNames: ['str'], body: 'return str' }

export function AddQueueAction() {
	const setHistory = useSetAtom(actionHistoryAtom)
	const [searcher, setSearcher] = useState<Searcher>(defaultStringSearcher)
	const [replacer, setReplacer] = useState<Replacer>(defaultStringReplacer)
	const [summary, setSummary] = useState('')
	const [skipUnchanged, setSkipUnchanged] = useState(true)

	return (
		<div className="space-y-2 border bg-muted rounded-md p-4">
			<H2>添加操作</H2>
			<SearcherSetter value={searcher} onChange={setSearcher} />
			<ReplacerSetter value={replacer} onChange={setReplacer} />
			<div className="space-y-2">
				<h3 className="font-bold">编辑摘要</h3>
				<Input className="block" value={summary} onChange={(e) => setSummary(e.target.value)} />
			</div>
			<div className="flex gap-4 items-center">
				<Label>
					<Checkbox checked={skipUnchanged} onCheckedChange={(checked) => setSkipUnchanged(checked !== false)} />
					跳过无更改的页面
				</Label>
				<Button
					onClick={() =>
						setHistory((history) => {
							const newAction: SearchReplaceAction = {
								type: 'search-replace',
								skipUnchanged,
								searcher,
								replacer,
								summary,
							}
							return [newAction, ...history.filter((x) => !isDeepEqual(x, newAction))]
						})
					}
				>
					确定
				</Button>
			</div>
		</div>
	)
}

function SearcherSetter({ value, onChange }: { value: Searcher; onChange: (searcher: Searcher) => void }) {
	return (
		<Tabs
			value={value.type}
			onValueChange={(type) =>
				onChange((type as Searcher['type']) === 'string' ? defaultStringSearcher : defaultRegexpSearcher)
			}
		>
			<div className="flex gap-4 items-center">
				<h3 className="font-bold">搜索</h3>
				<TabsList>
					<TabsTrigger value="string">字符串</TabsTrigger>
					<TabsTrigger value="regexp">正则</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="string">
				{value.type === 'string' && (
					<Input
						value={value.value}
						onChange={(e) => onChange({ type: 'string', value: e.target.value })}
						className="block"
					/>
				)}
			</TabsContent>
			<TabsContent value="regexp">
				{value.type === 'regexp' && (
					<RegexpInput value={omit(value, ['type'])} onChange={(regexp) => onChange({ type: 'regexp', ...regexp })} />
				)}
			</TabsContent>
		</Tabs>
	)
}

function RegexpInput({
	value,
	onChange,
}: {
	value: Omit<RegExpSearcher, 'type'>
	onChange: (value: Omit<RegExpSearcher, 'type'>) => void
}) {
	return (
		<ButtonGroup className="font-mono w-full">
			<InputGroup className="basis-[max-content] grow w-auto">
				<InputGroupAddon>
					<InputGroupText>/</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput value={value.pattern} onChange={(e) => onChange({ ...value, pattern: e.target.value })} />
				<InputGroupAddon align="inline-end">
					<InputGroupText>/</InputGroupText>
				</InputGroupAddon>
			</InputGroup>
			<Input
				className="basis-[calc(1.5rem+8ch)]! grow-0! shrink-0!"
				value={value.flags}
				onChange={(e) => onChange({ ...value, flags: e.target.value })}
			/>
		</ButtonGroup>
	)
}

function ReplacerSetter({ value, onChange }: { value: Replacer; onChange: (searcher: Replacer) => void }) {
	return (
		<Tabs
			value={value.type}
			onValueChange={(type) =>
				onChange((type as Replacer['type']) === 'string' ? defaultStringReplacer : defaultFunctionReplacer)
			}
		>
			<div className="flex gap-4 items-center">
				<h3 className="font-bold">替换为</h3>
				<TabsList>
					<TabsTrigger value="string">字符串</TabsTrigger>
					<TabsTrigger value="function">函数</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="string">
				{value.type === 'string' && (
					<Input
						value={value.value}
						onChange={(e) => onChange({ type: 'string', value: e.target.value })}
						className="block"
					/>
				)}
			</TabsContent>
			<TabsContent value="function">
				{value.type === 'function' && (
					<FunctionInput value={omit(value, ['type'])} onChange={(func) => onChange({ type: 'function', ...func })} />
				)}
			</TabsContent>
		</Tabs>
	)
}

function FunctionInput({
	value,
	onChange,
}: {
	value: Omit<FunctionReplacer, 'type'>
	onChange: (value: Omit<FunctionReplacer, 'type'>) => void
}) {
	const { argNames, body } = value

	return (
		<div className="font-mono space-y-2">
			<div className="flex items-center gap-1">
				<span>{'function ('}</span>
				<ul className="flex items-center gap-1">
					{argNames.map((name, i) => {
						return (
							<Fragment key={i}>
								{i !== 0 && <li className="whitespace-pre">, </li>}
								<li>
									<Input
										className="w-20 block"
										value={name}
										onChange={(e) =>
											onChange({
												...value,
												argNames: argNames.with(i, e.target.value) as unknown as NonEmptyTuple<string>,
											})
										}
									/>
								</li>
							</Fragment>
						)
					})}
					{argNames.length !== 1 && (
						<li>
							<Button
								size="icon-xs"
								onClick={() =>
									onChange({ ...value, argNames: argNames.slice(0, -1) as unknown as NonEmptyTuple<string> })
								}
							>
								<MinusIcon />
							</Button>
						</li>
					)}
					<li>
						<Button
							size="icon-xs"
							onClick={() => onChange({ ...value, argNames: [...argNames, `p${argNames.length}`] })}
						>
							<PlusIcon />
						</Button>
					</li>
				</ul>
				<span>{') {'}</span>
			</div>
			<Textarea value={body} onChange={(e) => onChange({ ...value, body: e.target.value })} />
			<div>{'}'}</div>
		</div>
	)
}
