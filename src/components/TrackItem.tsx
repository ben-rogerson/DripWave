import { cn } from '@/utils/cn'
import { IconAudio, IconPause, IconPlay, IconTop } from '@/components/Icons'
import { TrackImage } from '@/components/TrackImage'
import type { ReactNode } from 'react'
import type { Track } from '@spotify/web-api-ts-sdk'

/**
 * A single track for display in a track list.
 */
export const TrackItem = (props: {
  id?: string
  image?: Track['album']['images'][0]
  album?: string
  title: string
  artists: string
  trackNumber: number
  albumYear?: string
  releaseType?: string
  isTopTrack?: boolean
  isSelected: boolean
  isPlaying: boolean
  isPaused: boolean
  canPlay: boolean
  hasEnterSlide?: boolean
  style?: React.CSSProperties
  onSelect: () => void
}) => (
  <button
    type="button"
    className={cn(
      'group block w-full text-left @container/trackItem',
      props.isSelected ? 'text-primary' : 'text-muted',
      'duration-1000 ease-out animate-in fade-in-0 fill-mode-backwards',
      props.hasEnterSlide && 'slide-in-from-top-2'
    )}
    style={props.style}
    onClick={props.onSelect}
    id={`track-${props.id}`}
  >
    <Layout
      className="py-2 pl-1 pr-5 @md/trackItem:py-3"
      indicator={
        <Indicator
          showPlaying={props.isPlaying && props.isSelected}
          isSelected={props.canPlay && props.isSelected}
        >
          {props.trackNumber}
        </Indicator>
      }
      image={props.image && <TrackImage title={props.title} {...props.image} />}
      meta={
        <div className="flex items-center justify-between gap-2">
          <div className="w-full overflow-hidden">
            <div
              className={cn(
                'truncate font-bold !leading-snug @sm/trackItem:text-lg @xl/trackItem:text-xl',
                !props.isSelected && 'text-foreground'
              )}
            >
              {props.title}
            </div>
            <div className="truncate  @sm/trackItem:text-lg">
              {props.artists}
            </div>
            {props.album && (
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted/50 @sm/trackItem:text-sm @md/trackItem:mt-1">
                {props.releaseType === 'single' &&
                props.album === props.title ? (
                  <span className="italic">Single</span>
                ) : (
                  <span className="max-w-[calc(100%-6ch)] truncate">
                    {props.album}
                  </span>
                )}
                <span className="text-muted/50">&middot;</span>
                <span>{props.albumYear}</span>
              </div>
            )}
          </div>
          {props.isTopTrack && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation() // Avoid triggering onSelect
              }}
              className="group/top relative cursor-help px-3 text-xl"
            >
              <div className="pointer-events-none absolute right-full -mr-1 -mt-0.5 whitespace-nowrap rounded bg-background/80 px-2 py-1 text-sm text-foreground opacity-0 transition-opacity group-hover/top:opacity-100 group-focus/top:opacity-100">
                Top track
              </div>
              <IconTop className="group-hover/top:text-foreground" />
            </button>
          )}
        </div>
      }
    />
    <BackgroundSelector />
  </button>
)

const BackgroundSelector = () => (
  <div className="absolute inset-0 z-behind bg-border opacity-0 mix-blend-overlay shadow-2xl group-hover:opacity-25 group-focus:opacity-75 [.container-detail_&]:mx-2 [.container-detail_&]:rounded-lg md:[.container-side_&]:rounded-r-lg" />
)

const Indicator = (props: {
  showPlaying: boolean
  isSelected: boolean
  children: ReactNode
}) => (
  <div className="pointer-events-none relative h-full w-full text-sm @sm/trackItem:text-lg">
    {props.isSelected && (
      <div
        className={cn(
          'absolute z-10 grid h-full w-full place-content-center',
          'opacity-0 transition-all duration-500 group-hover:opacity-100',
          '-rotate-45 scale-75 ease-out group-hover:rotate-0 group-hover:scale-100'
        )}
      >
        {props.showPlaying ? <IconPause /> : <IconPlay />}
      </div>
    )}
    <div
      className={cn(
        'grid h-inherit w-inherit place-content-center',
        props.isSelected && 'group-hover:opacity-0'
      )}
    >
      <div
        className={cn(
          'absolute left-0 grid h-inherit w-inherit place-content-center',
          'transition-opacity duration-500',
          !props.showPlaying && 'opacity-0'
        )}
      >
        <IconAudio />
      </div>
      <div
        className={cn(
          'transition-opacity duration-500',
          props.showPlaying && 'text-primary opacity-0'
        )}
      >
        {props.children}
      </div>
    </div>
  </div>
)

const Layout = (props: {
  selectedTrack?: Track
  indicator: ReactNode
  image: ReactNode
  meta: ReactNode
  className: string
}) => (
  <div
    className={cn(
      'grid grid-cols-[minmax(0,40px)_repeat(9,_minmax(0,_1fr))] items-center @sm/trackItem:grid-cols-[minmax(0,50px)_repeat(9,_minmax(0,_1fr))] @lg/trackItem:grid-cols-[minmax(0,80px)_repeat(9,_minmax(0,_1fr))]',
      props.className
    )}
  >
    <div>{props.indicator}</div>
    {props.image && (
      <div className="relative col-span-2 pr-4">{props.image}</div>
    )}
    <div className={props.image ? 'col-span-7' : 'col-span-9'}>
      {props.meta}
    </div>
  </div>
)
