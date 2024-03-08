import { useLocation, useSearch } from 'wouter'
import { paramsToLocation } from '@/utils/paramsToLocation'
import { PARAM_SEARCH } from '@/constants'

export const useSetFilter = () => {
  const [location, setLocation] = useLocation()
  const params = new URLSearchParams(useSearch())

  return (props: { search?: string }) => {
    if (props.search) {
      params.set(PARAM_SEARCH, props.search)
    }

    setLocation(`${location}${paramsToLocation(params)}`)
  }
}
