'use client'
import { useAtomValue, useSetAtom } from 'jotai'
import { searchResultAtom } from './atoms'
import { H2 } from '../_components/heading'
import { ExternalTextLink } from '@/components/ui/link'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit3Icon } from 'lucide-react'
import { Caption } from '@/components/ui/caption'
import { SearchResult } from './actions'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { queueAtom } from '../queue/atoms'
import { toast } from 'sonner'

export function SearchResultList() {
	const searchResult = useAtomValue(searchResultAtom)
	const [selectedTitles, setSelectedTitles] = useState<Set<string>>(new Set())
	const setQueue = useSetAtom(queueAtom)

	if (!searchResult) return null

	const { searchinfo: searchInfo, search: items } = searchResult

	return (
		<div className="space-y-6">
			<header className="space-y-2">
				<H2>搜索结果</H2>
				<Caption>共{searchInfo.totalhits}条结果。</Caption>
				<div className="flex gap-2">
					<Button onClick={() => setSelectedTitles(new Set(searchResult.search.map((x) => x.title)))}>全选</Button>
					<Button onClick={() => setSelectedTitles(new Set())}>全不选</Button>
					<Button
						onClick={() => {
							setQueue((old) => [...old, ...[...selectedTitles.difference(new Set(old))].map((title) => ({ title }))])
							toast.success('添加成功')
						}}
					>
						将所选加入队列
					</Button>
				</div>
			</header>
			<main>
				<ul className="space-y-6">
					{items.map((item) => {
						return (
							<SearchResultItem
								key={item.pageid}
								value={item}
								selected={selectedTitles.has(item.title)}
								onSelectedChange={(selected) => {
									const newSet = new Set(selectedTitles)
									if (selected) {
										newSet.add(item.title)
									} else {
										newSet.delete(item.title)
									}
									setSelectedTitles(newSet)
								}}
							/>
						)
					})}
				</ul>
			</main>
		</div>
	)
}

function SearchResultItem({
	value: { pageid, title, snippet },
	selected,
	onSelectedChange,
}: {
	value: SearchResult['search'][number]
	selected: boolean
	onSelectedChange: (selected: boolean) => void
}) {
	return (
		<li className="space-y-2 border-l-3 pl-4">
			<h3 className="flex items-center gap-4">
				<div>
					<Checkbox checked={selected} onCheckedChange={onSelectedChange} className="mr-2" />
					<ExternalTextLink href={`https://voca.wiki/${encodeURI(title)}`} className="font-bold text-lg">
						{title}
					</ExternalTextLink>
				</div>
				<Button asChild size="icon-xs">
					<Link href={`/edit/${title}`}>
						<Edit3Icon />
					</Link>
				</Button>
				<code className="border rounded-sm px-2">{pageid}</code>
			</h3>
			<SearchResultContent snippet={snippet} />
		</li>
	)
}

function SearchResultContent({ snippet }: { snippet: string }) {
	return <p dangerouslySetInnerHTML={{ __html: snippet }} className="[&_.searchmatch]:font-semibold" />
}
