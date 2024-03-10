import { AsyncImage } from 'loadable-image'
import { cn } from '@/utils/cn'

export const TrackImage = (props: {
  url: string
  width: number
  height: number
  title: string
  className?: string
}) => {
  return (
    <AsyncImage
      src={props.url}
      alt={`${props.title} cover`}
      loader={<div className="bg-accent" />}
      className={cn('overflow-hidden rounded-md', props.className)}
      style={{ width: '100%', height: 'auto', aspectRatio: 1 / 1 }}
    />
  )
}
