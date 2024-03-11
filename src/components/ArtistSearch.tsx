import { Search } from '@/components/Search'
import { IconDisc } from '@/components/Icons'
import { ArtistLink } from '@/components/ArtistLink'
import { TrackItem } from '@/components/TrackItem'
import { Player } from '@/components/Player'
import { Header } from '@/components/Header'
import { cn } from '@/utils/cn'
import { formatArtists } from '@/utils/formatArtists'
import { usePlayer } from '@/hooks/usePlayer'
import { useSearchQuery } from '@/context/useSearchQuery'
import { useArtistTracks } from '@/hooks/useArtistTracks'
import { type ReactNode } from 'react'

export const ArtistSearch = () => {
  const query = useSearchQuery()
  const { artist, tracks, isFetching, isPlaceholderData } = useArtistTracks()
  const { selectedTrack, playingTrackId, setSelectedTrack } = usePlayer()

  return (
    <>
      <div className="items-center justify-between px-5 pt-4 @xs/side:px-6 xs:flex xl:pt-8">
        <Header />
      </div>
      <div className="sticky top-0 z-10 bg-background px-5 shadow-md shadow-background @xs/side:px-6">
        <Search />
      </div>
      {Boolean(tracks.length === 0 && query && !isFetching) && (
        <Message>No artists found</Message>
      )}
      {!query && (
        <Message>
          Enter an artist, eg: <ArtistLink>TesseracT</ArtistLink>,{' '}
          <ArtistLink>Aether</ArtistLink>,{' '}
          <ArtistLink>Sticky Fingers</ArtistLink>
        </Message>
      )}
      <div>
        {artist && (
          <div className="px-6 pb-1 text-sm text-muted @sm/side:pb-2 @sm/side:text-lg">
            Top tracks from{' '}
            <span className="text-foreground">{artist.name}</span>
          </div>
        )}
        {tracks.length > 0 && (
          <div className={cn('pb-6', isPlaceholderData && 'opacity-50')}>
            {tracks.map((track, index) => (
              <TrackItem
                key={track.id}
                trackNumber={index + 1}
                image={track.album.images[0]}
                title={track.name}
                artists={formatArtists(track.artists)}
                album={track.album.name}
                albumYear={track.album.release_date.split('-')[0]}
                releaseType={track.album.album_type}
                isSelected={selectedTrack?.id === track.id}
                isPlaying={playingTrackId === track.id}
                isPaused={selectedTrack?.id === track.id && !playingTrackId}
                onSelect={() => {
                  setSelectedTrack(track)
                }}
              />
            ))}
          </div>
        )}
        {tracks.length === 0 && isFetching && (
          <Message>
            <IconDisc className="h-full animate-spin" /> Loading...
          </Message>
        )}
      </div>
      <div
        className={cn(
          'sticky bottom-0 z-10 transition-transform ease-out sm:hidden',
          { 'translate-y-full': !selectedTrack }
        )}
      >
        {selectedTrack && (
          <div className="pointer-events-none h-3 w-full bg-gradient-to-t from-background to-transparent opacity-50" />
        )}
        <div className="bg-accent">
          <Player />
        </div>
      </div>
    </>
  )
}

const Message = (props: { children: ReactNode }) => {
  return (
    <div className="m-5 rounded-md p-10 text-center [&_a]:font-bold">
      {props.children}
    </div>
  )
}
