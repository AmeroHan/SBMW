import { H1 } from '../_components/heading'
import { SearchBox } from './search-box'
import { SearchResultList } from './search-result'

export default function SearchPage() {
	return (
		<div className="space-y-4">
			<H1>搜索</H1>
			<SearchBox />
			<SearchResultList />
		</div>
	)
}
