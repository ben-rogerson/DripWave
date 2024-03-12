import type { ReactNode } from 'react'
import { TrackDetail } from '@/components/TrackDetail'
import { ArtistSearch } from '@/components/ArtistSearch'
import { TrackImage } from '@/components/TrackImage'
import { IconDrip } from '@/components/Icons'
import { usePlayer } from '@/hooks/usePlayer'
import { cn } from '@/utils/cn'

export const Experience = () => (
  <Layout side={<ArtistSearch />} detail={<TrackDetail />} />
)

const Introduction = () => {
  return (
    <div className="pointer-events-none fixed z-40 h-[100dvh] w-[100dvw] overflow-hidden">
      <div className="delay-2000 absolute grid h-full w-full place-content-center bg-background duration-1000 animate-out fade-out fill-mode-forwards">
        <div className="-ml-4 -mt-6 flex items-center text-2xl delay-0 duration-1000 ease-out animate-in zoom-in-110 fill-mode-backwards sm:text-4xl">
          <IconDrip className="-mr-1 -mt-2 text-[175%]" />
          <div>DripWave</div>
        </div>
      </div>
    </div>
  )
}

const Layout = (props: { side: ReactNode; detail: ReactNode }) => (
  <>
    <Introduction />
    <div className="sm:grid sm:grid-cols-[minmax(0,40%)_repeat(2,_minmax(0,_1fr))] xl:grid-cols-[minmax(0,425px)_repeat(2,_minmax(0,_1fr))]">
      <div
        className={cn(
          'container-side grid min-h-[100dvh] grid-rows-[auto_minmax(0,1fr)_auto]',
          'sm:sticky sm:top-0 sm:h-[100dvh] sm:overflow-y-scroll sm:overscroll-contain'
        )}
      >
        {props.side}
      </div>
      <div
        className={cn(
          'container-detail col-span-2 hidden sm:block',
          'duration-1000 ease-out animate-in fade-in-0 slide-in-from-left-4'
        )}
      >
        {props.detail}
      </div>
      <BackgroundEffect />
    </div>
  </>
)

const BackgroundEffect = () => {
  const { selectedTrack } = usePlayer()
  if (!selectedTrack) return

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-50 grid h-full w-full place-content-center opacity-15 mix-blend-screen"
      key={selectedTrack.album.id}
    >
      <TrackImage
        title={selectedTrack.album.name}
        aria-hidden
        className="min-h-[100dvh] scale-[110%] rounded-none blur-md sm:scale-[140%] sm:blur-xl"
        {...selectedTrack.album.images[0]}
      />
    </div>
  )
}
