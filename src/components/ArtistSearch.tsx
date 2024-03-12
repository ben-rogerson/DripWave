import { Search } from '@/components/Search'
import { ArtistLink } from '@/components/ArtistLink'
import { TrackItem } from '@/components/TrackItem'
import { Player } from '@/components/Player'
import { cn } from '@/utils/cn'
import { formatArtists } from '@/utils/formatArtists'
import { usePlayer } from '@/hooks/usePlayer'
import { useSearchQuery } from '@/context/useSearchQuery'
import { useArtistTracks } from '@/hooks/useArtistTracks'
import type { AriaRole, ReactNode } from 'react'

export const ArtistSearch = () => {
  const query = useSearchQuery()
  const { artist, tracks, isFetching, isPlaceholderData, error } =
    useArtistTracks()
  const { selectedTrack, playingTrackId, setSelectedTrack } = usePlayer()

  return (
    <>
      <div className="sticky top-0 z-10 bg-background px-5 pt-1 shadow-md shadow-background @xs/side:px-6">
        <Search />
      </div>
      <div>
        {Boolean(error) && (
          <Message className="text-lg font-bold text-destructive" role="alert">
            <div className="animate-pulse">{String(error)}</div>
          </Message>
        )}
        {Boolean(tracks.length === 0 && query && !isFetching && !error) && (
          <Message className="text-lg font-bold text-destructive" role="alert">
            <div className="animate-pulse">No artists matched your search</div>
          </Message>
        )}
        {tracks.length === 0 && (
          <Message
            className={cn(
              'grid gap-3',
              'delay-100 duration-1000 animate-in fade-in-0 fill-mode-backwards'
            )}
          >
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
              You might like
            </h2>
            <ul className="ml-5 grid list-decimal gap-2 text-lg text-muted [&_li_a]:pl-2 [&_li_a]:text-foreground">
              <li>
                <ArtistLink>Goth Babe</ArtistLink>
              </li>
              <li>
                <ArtistLink>Little Dragon</ArtistLink>
              </li>
              <li>
                <ArtistLink>Kishi Bashi</ArtistLink>
              </li>
              <li>
                <ArtistLink>TesseracT</ArtistLink>
              </li>
              <li>
                <ArtistLink>Aether</ArtistLink>
              </li>
            </ul>
          </Message>
        )}
        {artist && (
          <div
            className={cn(
              'px-5 pb-1 text-sm text-muted @sm/side:pb-2 @sm/side:text-lg',
              'ease-out animate-in fade-in-0 fill-mode-backwards'
            )}
          >
            Top tracks from{' '}
            <span className="text-foreground">{artist.name}</span>
          </div>
        )}
        {tracks.length > 0 && (
          <div
            className={cn(
              'pb-6',
              isPlaceholderData &&
                'duration-100 ease-in animate-out fade-out-50 fill-mode-forwards'
            )}
          >
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
                canPlay={Boolean(track.preview_url)}
                style={{ animationDelay: `${index * 0.05}s` }}
                hasEnterSlide
                onSelect={() => {
                  setSelectedTrack(track)
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div
        className={cn(
          'sticky bottom-0 z-10 overflow-hidden sm:hidden',
          selectedTrack &&
            'duration-500 ease-out animate-in fade-in-0 slide-in-from-bottom-3'
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

const Message = (props: {
  children: ReactNode
  className?: string
  role?: AriaRole
}) => {
  return (
    <div
      className={cn(
        'relative mx-5 px-5 pb-6 pt-5 hover:[&_a]:text-primary focus:[&_a]:text-primary',
        props.className
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-md rounded-t-2xl bg-gradient-to-t from-transparent to-muted/15',
          'delay-300 duration-1000 ease-out animate-in fade-in-0 fill-mode-backwards'
        )}
      />
      {props.children}
    </div>
  )
}
