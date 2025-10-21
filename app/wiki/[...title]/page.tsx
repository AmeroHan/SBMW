import { Content } from './content'

export default async function Page({ params }: PageProps<'/wiki/[...title]'>) {
	const title = (await params).title.map((segment) => decodeURIComponent(segment)).join('/')

	return (
		<main className="py-8 px-8 space-y-8">
			<h1 className="font-bold text-3xl">{title}</h1>
			<Content title={title} />
		</main>
	)
}
