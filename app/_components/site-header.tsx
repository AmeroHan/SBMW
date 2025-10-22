import { Route } from 'next'
import Link from 'next/link'

export function SiteHeader() {
	return (
		<header className="h-10 flex items-center bg-muted px-8 sticky top-0">
			<SiteNav />
		</header>
	)
}
function SiteNav() {
	return (
		<nav>
			<ul className="flex items-center gap-8">
				<NavItem href="/search">搜索</NavItem>
				<NavItem href="/queue">队列</NavItem>
			</ul>
		</nav>
	)
}

function NavItem({ href, children }: { href: Route; children: React.ReactNode }) {
	return (
		<li>
			<Link href={href} className="text-lg">
				{children}
			</Link>
		</li>
	)
}
