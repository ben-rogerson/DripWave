import { Link } from 'wouter'
import { PARAM_SEARCH } from '@/constants'

export const ArtistLink = (props: { children: string }) => {
  return (
    <Link to={`?${PARAM_SEARCH}=${props.children.toLowerCase()}`}>
      {props.children}
    </Link>
  )
}
