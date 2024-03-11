import { TrackImage } from '@/components/TrackImage'
import { TrackItem } from '@/components/TrackItem'
import { Player } from '@/components/Player'
import { usePlayer } from '@/hooks/usePlayer'
import { useArtistTracks } from '@/hooks/useArtistTracks'
import { useAlbumTracks } from '@/hooks/useAlbumTracks'
import { formatArtists } from '@/utils/formatArtists'
import { cn } from '@/utils/cn'
import type { Track } from '@spotify/web-api-ts-sdk'
import type { ReactNode } from 'react'

export const TrackDetail = () => {
  const { selectedTrack, playingTrackId, setSelectedTrack } = usePlayer()
  const { albumTracks, copyright, isLoading, error, isFetching } =
    useAlbumTracks()
  const { tracks } = useArtistTracks()

  if (!selectedTrack)
    return <div className="h-full bg-accent text-center">Images</div>

  return (
    <div className="p-6 xl:p-10">
      <div key="img" className="w-[35%] max-w-[20rem] shrink-0">
        <TrackImage
          // Re-render image with key for fade-in effect
          key={selectedTrack.album.id}
          className="w-full rounded-2xl"
          title={selectedTrack.name}
          {...selectedTrack.album.images[0]}
        />
      </div>
      <div className="sticky top-0 z-10 bg-background shadow-2xl shadow-background">
        <Player
          // Re-render image with key for fade-in effect
          key={selectedTrack.album.id}
          isLarge
        />
      </div>
      <div className="sticky top-0 mt-8 grid gap-10 @container/detail">
        <div className="grid gap-4 rounded-t-2xl bg-gradient-to-t from-transparent to-accent py-5 @lg/detail:gap-6 @lg/detail:py-8">
          <Box className="grid gap-2.5">
            <h2 className="text-xl font-bold @md/detail:text-2xl @xl/detail:text-3xl">
              {selectedTrack.album.name}
              <span className="text-primary"> &middot; </span>
              <span className="">
                {selectedTrack.album.release_date.split('-')[0]}
              </span>
            </h2>
            <div className="@md/detail:text-md text-muted @lg/detail:text-lg @xl/detail:text-xl">
              {selectedTrack.album.album_type === 'album'
                ? `Tracks from this ${selectedTrack.album.album_type}`
                : 'Tracks from this single'}
            </div>
          </Box>
          {isLoading && <Box className="text-center">Loading...</Box>}
          <div>
            {albumTracks.map((track, index) => (
              <TrackItem
                key={track.id}
                trackNumber={index + 1}
                title={track.name}
                artists={formatArtists(track.artists)}
                isSelected={selectedTrack.id === track.id}
                isTopTrack={tracks.some(t => t.id === track.id)}
                isPlaying={playingTrackId === track.id}
                isPaused={selectedTrack.id === track.id && !playingTrackId}
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

const Box = (props: { children: ReactNode; className?: string }) => (
  <div className={cn('px-5 @lg/detail:px-7', props.className)}>
    {props.children}
  </div>
)
