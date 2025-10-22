import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { LinkProps } from 'next/link'

export function TextLink<RouteType>({ className, ...props }: LinkProps<RouteType>) {
	return <Link className={cn('text-link visited:text-link-visited', className)} {...props} />
}
