import { memo, useEffect, useRef, useState } from 'react'
import { useSearch } from 'wouter'
import { PARAM_SEARCH } from '@/constants'
import { useSetSearchParam } from '@/hooks/useSetSearchParam'
import { IconCross, IconDisc, IconSearch } from '@/components/Icons'
import { useArtistTracks } from '@/hooks/useArtistTracks'
import { cn } from '@/utils/cn'

/**
 * Search input box for artists.
 */
export const SearchBox = () => {
  const { isFetching } = useArtistTracks()
  const defaultValue = new URLSearchParams(useSearch()).get(PARAM_SEARCH) ?? ''
  const [value, setValue] = useState(defaultValue)
  const setSearchParam = useSetSearchParam()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (newValue: string) => {
    setSearchParam(newValue)
    setValue(newValue)
  }

  // Update the input value if the search param changes
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className="relative @container/search">
      <ResultBounceHider />
      <div className="flex">
        <Indicator inProgress={isFetching} />
        <input
          ref={inputRef}
          type="search"
          className="peer h-full w-full bg-transparent py-4 pl-8 text-lg text-foreground caret-primary outline-none focus-within:outline-none @xs/search:pl-[2.15rem] @xs/search:text-xl @sm/search:text-2xl"
          placeholder="Search Artists&hellip;"
          // Controlled input so we can update it when the search param changes.
          // This allows links that trigger a search to work.
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e.currentTarget.value)
          }}
          spellCheck="false"
        />
        <button
          aria-label="Clear search"
          type="button"
          onClick={() => {
            handleChange('')
            inputRef.current?.focus()
          }}
          className="group/clear block p-2"
        >
          <IconCross
            className={cn(
              'text-muted duration-500 animate-in fade-in-0 group-hover/clear:text-primary peer-focus:opacity-100',
              value
                ? 'opacity-100'
                : 'animate-out fade-out-0 fill-mode-forwards'
            )}
          />
        </button>
      </div>
    </div>
  )
}

export const Search = memo(SearchBox)

const Indicator = (props: { inProgress: boolean }) => (
  <div className="pointer-events-none absolute h-full text-2xl text-muted">
    <IconSearch
      className={cn(
        'absolute h-full text-2xl transition-all delay-75 duration-700 ease-out',
        props.inProgress && 'scale-50 opacity-0'
      )}
    />
    <div
      className={cn(
        'ease absolute inline-block h-full scale-100 text-primary transition-all delay-75 duration-700',
        !props.inProgress && 'scale-150 opacity-0'
      )}
    >
      <IconDisc className="h-full animate-spin" />
    </div>
  </div>
)

/**
 * When results are scrolled on mobile, the menu bar (while resizing) shows
 * the results in the background at the top. This panel prevents them from
 * being shown.
 */
const ResultBounceHider = () => (
  <div className="pointer-events-none absolute inset-0 -top-full h-full bg-background" />
)
