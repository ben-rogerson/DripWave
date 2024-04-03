import { useSearch } from 'wouter'
import { PARAM_SEARCH } from '@/constants'

export const useSearchParam = () =>
  new URLSearchParams(useSearch()).get(PARAM_SEARCH) ?? ''
