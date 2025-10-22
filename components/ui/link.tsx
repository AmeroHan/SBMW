import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { LinkProps } from 'next/link'

export function TextLink<RouteType>({ className, ...props }: LinkProps<RouteType>) {
	return <Link className={cn('text-link visited:text-link-visited', className)} {...props} />
}

export function ExternalLink(props: React.ComponentProps<'a'>) {
	return <a target="_blank" rel="noopener noreferrer" {...props} />
}

export function ExternalTextLink({ className, ...props }: React.ComponentProps<'a'>) {
	return <ExternalLink className={cn('text-link visited:text-link-visited', className)} {...props} />
}
