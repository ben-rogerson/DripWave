import { useSearch } from 'wouter'
import { PARAM_SEARCH } from '@/constants'

export const useSearchQuery = () => {
  const query = new URLSearchParams(useSearch()).get(PARAM_SEARCH) ?? ''
  return query
}
