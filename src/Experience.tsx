import type { ReactNode } from 'react'
import { TrackDetail } from '@/components/TrackDetail'
import { ArtistSearch } from '@/components/ArtistSearch'
import { cn } from '@/utils/cn'
import { usePlayer } from '@/hooks/usePlayer'
import { TrackImage } from '@/components/TrackImage'

export const Experience = () => (
  <Layout side={<ArtistSearch />} detail={<TrackDetail />} />
)

const Layout = (props: { side: ReactNode; detail: ReactNode }) => (
  <div
    className={cn(
      'sm:grid sm:grid-cols-[minmax(0,40%)_repeat(2,_minmax(0,_1fr))] xl:grid-cols-[minmax(0,425px)_repeat(2,_minmax(0,_1fr))]'
    )}
  >
    <div
      className={cn(
        'container-side grid min-h-[100dvh] grid-rows-[auto_auto_minmax(0,1fr)_auto] bg-background @container/side',
        'md:sticky md:top-0 md:h-[100dvh] md:overflow-y-scroll md:overscroll-contain'
      )}
    >
      {props.side}
    </div>
    <div className="container-detail col-span-2 hidden sm:block">
      {props.detail}
    </div>
    <BackgroundEffect />
  </div>
)

const BackgroundEffect = () => {
  const { selectedTrack } = usePlayer()
  if (!selectedTrack) return

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-50 h-full w-full"
      key={selectedTrack.album.id}
    >
      <TrackImage
        title={selectedTrack.album.name}
        aria-hidden
        className="scale-[200%] rounded-none opacity-15 blur-md md:blur-xl"
        {...selectedTrack.album.images[0]}
      />
    </div>
  )
}
