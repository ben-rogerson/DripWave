import { PARAM_SEARCH } from '@/constants'
import { useLocation, useSearch } from 'wouter'

export const useSetSearchParam = () => {
  const [location, setLocation] = useLocation()
  const params = new URLSearchParams(useSearch())

  return (newSearchParam: string) => {
    if (newSearchParam) {
      params.set(PARAM_SEARCH, newSearchParam)
    } else {
      params.delete(PARAM_SEARCH)
    }

    const newLocation = [location, params.toString()].filter(Boolean).join('?')

    setLocation(newLocation)
  }
}
