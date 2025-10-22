'use client'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { useAtom, useSetAtom } from 'jotai'
import { searchResultAtom, submittedSearchValueAtom } from './atoms'
import { Button } from '@/components/ui/button'
import { useRef, type FormEventHandler } from 'react'
import { search } from './actions'

export function SearchBox() {
	const [searchValue, setSearchValue] = useAtom(submittedSearchValueAtom)
	const setSearchResult = useSetAtom(searchResultAtom)
	const inputRef = useRef<HTMLInputElement>(null)
	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		const searchValue = inputRef.current!.value
		setSearchValue(searchValue)
		search(searchValue).then(setSearchResult)
	}

	return (
		<form onSubmit={handleSubmit}>
			<ButtonGroup className="w-full">
				<Input ref={inputRef} name="search" type="search" defaultValue={searchValue} />
				<Button type="submit">搜索</Button>
			</ButtonGroup>
		</form>
	)
}
