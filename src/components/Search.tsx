import { PARAM_SEARCH } from '@/constants'
import { useSetFilter } from '@/hooks/useSetFilter'
import { useSearch } from 'wouter'

export const Search = () => {
  const setFilter = useSetFilter()

  const params = new URLSearchParams(useSearch())
  const search = (params.get(PARAM_SEARCH) ?? '').trim()

  return (
    <input
      type="text"
      className="w-full border-b py-1 text-2xl outline-none"
      placeholder="Search"
      defaultValue={search}
      onKeyDown={e => {
        if (e.key !== 'Enter') return
        setFilter({
          search: e.currentTarget.value,
        })
      }}
    />
  )
}
