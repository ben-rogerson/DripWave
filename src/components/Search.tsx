import { memo, useEffect, useState } from 'react'
import { useSearch } from 'wouter'
import { useSetSearchParam } from '@/hooks/useSetSearchParam'
import { cn } from '@/utils/cn'
import { titleCase } from '@/utils/titleCase'
import { IconDisc, IconSearch } from '@/components/Icons'
import { PARAM_SEARCH } from '@/constants'
import { useArtistTracks } from '@/hooks/useArtistTracks'

export const SearchView = () => {
  const { isFetching } = useArtistTracks()
  const defaultValue = new URLSearchParams(useSearch()).get(PARAM_SEARCH) ?? ''
  const [value, setValue] = useState(defaultValue)
  const setSearchParam = useSetSearchParam()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value
    setSearchParam(currentValue.trim().toLowerCase())
    setValue(currentValue)
  }

  // Update the input value if the search param changes
  useEffect(() => {
    if (value === defaultValue) return
    if (defaultValue === '') return
    if (value !== '') return
    // TODO: Fix this
    setValue(titleCase(defaultValue))
  }, [value, defaultValue])

  return (
    <div className="relative @container/search">
      <Indicator inProgress={isFetching} />
      <input
        type="text"
        className="h-full w-full bg-transparent py-4 pl-8 text-lg caret-primary outline-none @xs/search:pl-[2.15rem] @xs/search:text-xl @sm/search:text-2xl"
        placeholder="Search Artists&hellip;"
        // Controlled input so we can update it when the search param changes.
        // This allows links that trigger a search to work.
        value={value}
        onChange={handleChange}
        spellCheck="false"
      />
    </div>
  )
}

export const Search = memo(SearchView)

const Indicator = (props: { inProgress: boolean }) => {
  return (
    <div className="pointer-events-none absolute h-full text-2xl text-muted">
      <IconSearch
        className={cn(
          'absolute h-full text-2xl transition-all delay-75 duration-700 ease-out',
          { 'scale-50 opacity-0': props.inProgress }
        )}
      />
      <div
        className={cn(
          'ease absolute inline-block h-full scale-100 text-primary transition-all delay-75 duration-700',
          { 'scale-150 opacity-0': !props.inProgress }
        )}
      >
        <IconDisc className="h-full animate-spin" />
      </div>
    </div>
  )
}
