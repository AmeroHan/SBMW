import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function pageUrl(title: string) {
	return `https://voca.wiki/${encodeURI(title)}`
}
