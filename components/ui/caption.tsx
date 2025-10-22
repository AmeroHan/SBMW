import { cn } from '@/lib/utils'

export function Caption({ className, ...props }: React.ComponentProps<'p'>) {
	return <p className={cn('text-muted-foreground', className)} {...props} />
}
