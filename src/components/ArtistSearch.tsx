import type { Artist } from '@spotify/web-api-ts-sdk'
import { Search } from '@/components/Search'
import { IconDisc } from '@/components/Icons'
import { ArtistLink } from '@/components/ArtistLink'
import { TrackItem } from '@/components/TrackItem'
import { Player } from '@/components/Player'
import { Header } from '@/components/Header'
import { cn } from '@/utils/cn'
import { formatArtists } from '@/utils/formatArtists'
import { type Track } from '@spotify/web-api-ts-sdk'
import type AudioPlayer from 'react-h5-audio-player'
import type { ReactNode } from 'react'

export const ArtistSearch = (props: {
  isFetching: boolean
  query: string
  trackMeta: {
    artist?: Artist
    tracks: Track[]
    selectedTrack?: Track
    playingTrackId?: string
    setSelectedTrack: (track: Track) => void
    setPlayingTrackId: (trackId: string) => void
  }
  handleTogglePlayback: (trackId: string) => void
  smallPlayerRef: React.RefObject<AudioPlayer>
  isPlaceholderData: boolean
}) => (
  <>
    <div className="items-center justify-between px-5 pt-6 @xs/side:px-6 xs:flex md:pt-8">
      <Header />
    </div>
    <div className="sticky top-0 z-10 bg-background px-5 shadow-md shadow-background @xs/side:px-6">
      <Search inProgress={props.isFetching} />
    </div>
    {Boolean(
      props.trackMeta.tracks.length === 0 && props.query && !props.isFetching
    ) && <Message>No artists found</Message>}
    {!props.query && (
      <Message>
        Enter an artist, eg: <ArtistLink>TesseracT</ArtistLink>,{' '}
        <ArtistLink>Aether</ArtistLink>, <ArtistLink>Sticky Fingers</ArtistLink>
      </Message>
    )}
    <div>
      {props.trackMeta.artist && (
        <div className="px-6 pb-1 text-sm text-muted @sm/side:pb-2 @sm/side:text-lg">
          Artist “{props.trackMeta.artist.name}”
        </div>
      )}
      {props.trackMeta.tracks.length > 0 && (
        <div className={cn('pb-6', props.isPlaceholderData && 'opacity-50')}>
          {props.trackMeta.tracks.map((track, index) => (
            <TrackItem
              key={track.id}
              trackNumber={index + 1}
              image={track.album.images[0]}
              title={track.name}
              artists={formatArtists(track.artists)}
              album={track.album.name}
              albumYear={track.album.release_date.split('-')[0]}
              releaseType={track.album.album_type}
              isSelected={props.trackMeta.selectedTrack?.id === track.id}
              onSelect={() => {
                if (props.trackMeta.selectedTrack?.id === track.id) {
                  props.handleTogglePlayback(track.id)
                  return
                }
                props.trackMeta.setSelectedTrack(track)
              }}
              isPlaying={props.trackMeta.playingTrackId === track.id}
              isPaused={
                props.trackMeta.selectedTrack?.id === track.id &&
                !props.trackMeta.playingTrackId
              }
            />
          ))}
        </div>
      )}
      {props.trackMeta.tracks.length === 0 && props.isFetching && (
        <div className="p-5 text-center">
          <IconDisc className="h-full animate-spin" /> Loading...
        </div>
      )}
    </div>
    <div
      className={cn(
        'sticky bottom-0 z-10 transition-transform ease-out md:hidden',
        { 'translate-y-full': !props.trackMeta.selectedTrack }
      )}
    >
      {props.trackMeta.selectedTrack && (
        <div className="pointer-events-none h-3 w-full bg-gradient-to-t from-background to-transparent opacity-50" />
      )}
      <div className="bg-accent">
        <Player
          selectedTrack={props.trackMeta.selectedTrack}
          setPlayingTrackId={props.trackMeta.setPlayingTrackId}
          smallPlayerRef={props.smallPlayerRef}
          onSelectAutoPlay
        />
      </div>
    </div>
  </>
)

const Message = (props: { children: ReactNode }) => {
  return (
    <div className="m-5 rounded-md p-10 text-center [&_a]:font-bold">
      {props.children}
    </div>
  )
}
