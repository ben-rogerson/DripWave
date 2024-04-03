import { useSearch } from 'wouter'
import { PARAM_TRACK } from '@/constants'

export const useTrackParam = () =>
  new URLSearchParams(useSearch()).get(PARAM_TRACK) ?? ''
