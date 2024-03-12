import type { AriaRole } from 'react'
import { memo, type ReactNode } from 'react'
import { TrackImage } from '@/components/TrackImage'
import { TrackItem } from '@/components/TrackItem'
import { Player } from '@/components/Player'
import { usePlayer } from '@/hooks/usePlayer'
import { useArtistTracks } from '@/hooks/useArtistTracks'
import { useAlbumTracks } from '@/hooks/useAlbumTracks'
import { formatArtists } from '@/utils/formatArtists'
import { IconDisc, IconDrip } from '@/components/Icons'
import { cn } from '@/utils/cn'
import type { Track } from '@spotify/web-api-ts-sdk'

const Empty = memo(function EmptyMemo() {
  return (
    <div className="grid min-h-[300px] place-content-center">
      <div>
        <IconDrip className="justify-self-center text-[70px] text-muted/35" />
      </div>
    </div>
  )
})

export const TrackDetail = () => {
  const { selectedTrack, playingTrackId, setSelectedTrack } = usePlayer()
  const { albumTracks, copyright, isLoading, error } = useAlbumTracks()
  const { tracks } = useArtistTracks()

  if (!selectedTrack) return <Empty />

  return (
    <div className="grid min-h-[100dvh] grid-rows-[auto_auto_minmax(0,1fr)] p-6 lg:pr-16 xl:p-10">
      <div key="img" className="w-[35%] max-w-[20rem] shrink-0">
        <TrackImage
          // Re-render image with key for fade-in effect
          key={selectedTrack.album.id}
          className="w-full overflow-hidden rounded-2xl"
          title={selectedTrack.name}
          {...selectedTrack.album.images[0]}
        />
      </div>
      <div className="sticky top-0 z-10 overflow-hidden bg-background shadow-2xl shadow-background">
        <Player
          // Re-render image with key for fade-in effect
          key={selectedTrack.album.id}
          isLarge
        />
      </div>
      <div className="sticky top-0 grid gap-10 @container/detail">
        <div className="rounded-t-2xl bg-gradient-to-t from-transparent to-accent @md/detail:py-5 @lg/detail:mt-2 @lg/detail:gap-6">
          <Box className="grid gap-2.5">
            <div>
              <h2 className="mb-1.5 text-xl font-bold @md/detail:text-2xl @xl/detail:text-3xl">
                <span className="mr-2">{selectedTrack.album.name}</span>
                <span className="text-lg font-normal text-muted">
                  {selectedTrack.album.release_date.split('-')[0]}
                </span>
              </h2>
              <div className="text-muted @md/detail:text-base @lg/detail:text-lg @xl/detail:text-xl">
                {selectedTrack.album.album_type === 'album'
                  ? `Tracks on this ${selectedTrack.album.album_type}`
                  : 'Tracks on this single'}
              </div>
            </div>
          </Box>
          {isLoading && (
            <Box
              className={cn(
                'flex gap-3 text-xl',
                'duration-1000 animate-in fade-in-0 fill-mode-backwards'
              )}
            >
              <IconDisc className="h-full animate-spin text-3xl text-primary" />
              Spinning the decks &hellip;
            </Box>
          )}
          {Boolean(error) && (
            <Box className="text-lg font-bold text-destructive" role="alert">
              <div className="animate-pulse">{String(error)}</div>
            </Box>
          )}
          <div>
            {albumTracks.map((track, index) => (
              <TrackItem
                key={track.id}
                id={track.id}
                trackNumber={index + 1}
                title={track.name}
                artists={formatArtists(track.artists)}
                isSelected={selectedTrack.id === track.id}
                isTopTrack={tracks.some(t => t.id === track.id)}
                isPlaying={playingTrackId === track.id}
                isPaused={selectedTrack.id === track.id && !playingTrackId}
                style={{ animationDelay: `${index * 0.05}s` }}
                hasEnterSlide={albumTracks.length > 2}
                onSelect={() => {
                  /**
                   * Supplemented track
                   * Spotify doesn’t supply extra album data in the 'Track' object
                   * (it's labelled 'SimplifiedTrack'), so as a workaround we
                   * add the missing data from the current selected track data
                   * to supplement it to a full 'Track' object.
                   */
                  const fullTrackData = {
                    ...track,
                    album: selectedTrack.album,
                    external_ids: selectedTrack.external_ids,
                    popularity: selectedTrack.popularity,
                  } satisfies Track
                  setSelectedTrack(fullTrackData)
                }}
              />
            ))}
          </div>
          {copyright && <Box className="text-xs text-muted">{copyright}</Box>}
        </div>
      </div>
    </div>
  )
}

const Box = (props: {
  children: ReactNode
  className?: string
  role?: AriaRole
}) => (
  <div className={cn('p-5 @md/detail:px-9', props.className)} role={props.role}>
    {props.children}
  </div>
)
