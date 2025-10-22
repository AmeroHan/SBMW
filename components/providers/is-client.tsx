'use client'

import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

const isClientAtom = atom(false)

export function IsClientProvider({ children }: { children: React.ReactNode }) {
	const setIsClient = useSetAtom(isClientAtom)
	useEffect(() => {
		setIsClient(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return children
}

export function useIsClient() {
	const isClient = useAtomValue(isClientAtom)
	return isClient
}
