import type { Track } from '@spotify/web-api-ts-sdk'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { IconAudio, IconPause, IconPlay, IconTop } from '@/components/Icons'
import { TrackImage } from '@/components/TrackImage'

export const TrackItem = (props: {
  onSelect: () => void
  isSelected: boolean
  isPlaying: boolean
  isPaused: boolean
  trackNumber: number
  title: string
  artists: string
  image?: Track['album']['images'][0]
  album?: string
  albumYear?: string
  releaseType?: string
  isTopTrack?: boolean
}) => {
  return (
    <button
      type="button"
      className={cn(
        'group block w-full text-left @container/trackItem',
        props.isSelected ? 'text-primary' : 'text-muted'
      )}
      onClick={props.onSelect}
    >
      <Layout
        className="py-2 pl-1 pr-5 @md/trackItem:py-3"
        indicator={
          <Indicator
            showPlaying={props.isPlaying && props.isSelected}
            isSelected={props.isSelected}
          >
            {props.trackNumber}
          </Indicator>
        }
        image={
          props.image && <TrackImage title={props.title} {...props.image} />
        }
        meta={
          <>
            <div
              className={cn(
                'truncate font-bold @sm/trackItem:text-lg @xl/trackItem:text-xl',
                !props.isSelected && 'text-foreground'
              )}
            >
              {props.title}
            </div>
            <div className="truncate @sm/trackItem:text-lg">
              {props.artists}
            </div>
            {props.album && (
              <div className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-wide @sm/trackItem:text-sm">
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
            {props.isTopTrack && (
              <div className="text-xl text-muted">
                <IconTop />
              </div>
            )}
          </>
        }
      />
      <div className="absolute inset-0 z-behind bg-accent opacity-0 mix-blend-overlay shadow-2xl group-hover:opacity-100 [.container-detail_&]:rounded-lg md:[.container-side_&]:rounded-r-lg" />
    </button>
  )
}

const Indicator = (props: {
  showPlaying: boolean
  isSelected: boolean
  children: ReactNode
}) => {
  return (
    <div className="pointer-events-none relative h-full w-full text-sm @sm/trackItem:text-lg">
      {props.isSelected && (
        <div
          className={cn(
            'absolute z-10 grid h-full w-full place-content-center',
            // 'text-2xl @lg/trackItem:text-3xl',
            'opacity-0 transition-all duration-500 group-hover:opacity-100',
            '-rotate-45 scale-75 ease-out group-hover:rotate-0 group-hover:scale-100'
          )}
        >
          {props.showPlaying ? <IconPause /> : <IconPlay />}
        </div>
      )}
      <div
        className={cn(
          // 'text-sm @md/trackItem:text-lg',
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
            // '@xs/trackItem:text-sm',
            props.showPlaying && 'text-primary opacity-0'
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}

const Layout = (props: {
  selectedTrack?: Track
  indicator: ReactNode
  image: ReactNode
  meta: ReactNode
  className: string
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,40px)_repeat(9,_minmax(0,_1fr))] items-center @sm/trackItem:grid-cols-[minmax(0,60px)_repeat(9,_minmax(0,_1fr))]',
        props.className
      )}
    >
      <div>{props.indicator}</div>
      {props.image && (
        <div className="relative col-span-2 pr-4">{props.image}</div>
      )}
      <div className="col-span-7">{props.meta}</div>
    </div>
  )
}
