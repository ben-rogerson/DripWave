import { PARAM_TRACK } from '@/constants'
import { useLocation, useSearch } from 'wouter'

/**
 * Set the search param in the URL.
 * @returns Function to set the track param.
 */
export const useSetTrackParam = () => {
  const [location, setLocation] = useLocation()
  const params = new URLSearchParams(useSearch())

  return (newTrackParam: string) => {
    if (newTrackParam) {
      params.set(PARAM_TRACK, newTrackParam)
    } else {
      params.delete(PARAM_TRACK)
    }

    const newLocation = [location, params.toString()].filter(Boolean).join('?')

    setLocation(newLocation)
  }
}
