import { H1 } from '../_components/heading'
import { SearchBox } from './search-box'
import { SearchResult } from './search-result'

export default function SearchPage() {
	return (
		<main className="space-y-4">
			<H1>搜索</H1>
			<SearchBox />
			<SearchResult />
		</main>
	)
}
