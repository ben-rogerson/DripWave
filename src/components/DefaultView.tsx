import { TrackDetail } from '@/components/TrackDetail'
import { ArtistSearch } from '@/components/ArtistSearch'
import { Introduction } from '@/components/Introduction'
import { BackgroundCover } from '@/components/BackgroundCover'
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

/**
 * Starting view for the app.
 */
export const DefaultView = () => (
  <Layout side={<ArtistSearch />} detail={<TrackDetail />} />
)

const Layout = (props: { side: ReactNode; detail: ReactNode }) => (
  <>
    <Introduction />
    <div className="sm:grid sm:grid-cols-[minmax(0,40%)_repeat(2,_minmax(0,_1fr))] xl:grid-cols-[minmax(0,425px)_repeat(2,_minmax(0,_1fr))]">
      <section
        className={cn(
          'container-side grid min-h-[100dvh] grid-rows-[auto_minmax(0,1fr)_auto]',
          'sm:sticky sm:top-0 sm:h-[100dvh] sm:overflow-y-scroll sm:overscroll-contain'
        )}
      >
        {props.side}
      </section>
      <section
        className={cn(
          'container-detail col-span-2 hidden sm:block',
          'duration-1000 ease-out animate-in fade-in-0 slide-in-from-left-4'
        )}
      >
        {props.detail}
      </section>
      <BackgroundCover />
    </div>
  </>
)
