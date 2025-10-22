'use client'
import { useAtomValue } from 'jotai'
import { searchResultAtom } from './atoms'
import { H2 } from '../_components/heading'
import { ExternalTextLink } from '@/components/ui/link'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit3Icon } from 'lucide-react'
import { Caption } from '@/components/ui/caption'

export function SearchResult() {
	const searchResult = useAtomValue(searchResultAtom)

	if (!searchResult) return null

	const { searchinfo: searchInfo, search: items } = searchResult

	return (
		<div className="space-y-6">
			<header className="space-y-2">
				<H2>搜索结果</H2>
				<Caption>共{searchInfo.totalhits}条结果。</Caption>
			</header>
			<main>
				<ul className="space-y-6">
					{items.map(({ title, pageid, snippet }) => {
						return (
							<li key={pageid} className="space-y-2 border-l-3 pl-4">
								<h3 className="flex items-center gap-4">
									<div>
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
					})}
				</ul>
			</main>
		</div>
	)
}

function SearchResultContent({ snippet }: { snippet: string }) {
	return <p dangerouslySetInnerHTML={{ __html: snippet }} className="[&_.searchmatch]:font-semibold" />
}
