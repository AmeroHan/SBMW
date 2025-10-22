import { Suspense } from 'react'
import { Content } from './content'
import { Spinner } from '@/components/ui/spinner'

export default async function Page({ params }: PageProps<'/edit/[...title]'>) {
	const title = (await params).title.map((segment) => decodeURIComponent(segment)).join('/')

	return (
		<main className="space-y-8">
			<h1 className="font-bold text-3xl">{title}</h1>
			<Suspense fallback={<Spinner />}>
				<Content title={title} />
			</Suspense>
		</main>
	)
}
