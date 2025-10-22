'use client'
import { useAtomValue } from 'jotai'
import { searchResultAtom } from './atoms'
import { H2 } from '../_components/heading'
import { TextLink } from '@/components/ui/link'

export function SearchResult() {
	const searchResult = useAtomValue(searchResultAtom)

	if (!searchResult) return null

	const { searchinfo: searchInfo, search: items } = searchResult

	return (
		<>
			<H2>搜索结果</H2>
			<p className="text-muted-foreground">共{searchInfo.totalhits}条结果。</p>
			<ul className="space-y-4">
				{items.map(({ title, pageid, snippet }) => {
					return (
						<li key={pageid} className="space-y-2 border-l-3 pl-4">
							<h3 className="flex items-center gap-4">
								<TextLink href={`/edit/${title}`} className="font-bold text-lg">
									{title}
								</TextLink>
								<code className="border rounded-sm px-2">{pageid}</code>
							</h3>
							<SearchResultContent snippet={snippet} />
						</li>
					)
				})}
			</ul>
		</>
	)
}

function SearchResultContent({ snippet }: { snippet: string }) {
	return <p dangerouslySetInnerHTML={{ __html: snippet }} className="[&_.searchmatch]:font-semibold" />
}
