import { Link } from 'wouter'
import { PARAM_SEARCH } from '@/constants'

/**
 * Link to search for an artist
 */
export const ArtistLink = (props: { children: string }) => (
  <Link to={`?${PARAM_SEARCH}=${props.children}`}>{props.children}</Link>
)
