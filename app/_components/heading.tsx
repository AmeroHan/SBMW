import { cn } from '@/lib/utils'

export function H1({ className, ...props }: React.ComponentProps<'h1'>) {
	return <h1 className={cn('font-bold text-3xl', className)} {...props} />
}

export function H2({ className, ...props }: React.ComponentProps<'h2'>) {
	return <h1 className={cn('font-bold text-xl', className)} {...props} />
}
