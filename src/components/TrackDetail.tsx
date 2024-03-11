import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrackImage } from '@/components/TrackImage'
import { TrackItem } from '@/components/TrackItem'
import { Player } from '@/components/Player'
import { cn } from '@/utils/cn'
import { formatArtists } from '@/utils/formatArtists'
import { MARKET_AU } from '@/constants'
import type { Artist, SpotifyApi, Track } from '@spotify/web-api-ts-sdk'
import type { ReactNode, RefObject } from 'react'
import type AudioPlayer from 'react-h5-audio-player'

export const TrackDetail = (props: {
  sdk?: SpotifyApi
  smallPlayerRef: RefObject<AudioPlayer>
  handleTogglePlayback: (trackId: string) => void
  trackMeta: {
    selectedTrack: Track
    setSelectedTrack: (track: Track) => void
    playingTrackId?: string
    setPlayingTrackId: (trackId: string) => void
    tracks: Track[]
    artist?: Artist
  }
}) => {
  const albumId = props.trackMeta.selectedTrack.album.id

  const useQueryResult = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => fetchAlbumDetail(albumId, props.sdk),
    enabled: Boolean(props.sdk),
    refetchOnWindowFocus: false,
  })

  const [hasAutoPlay, setHasAutoPlay] = useState(false)
  useEffect(() => {
    setHasAutoPlay(false)
  }, [props.trackMeta.selectedTrack])

  const { data, isLoading, error, isFetching } = useQueryResult

  const albumTracks = data?.tracks.items ?? []

  return (
    <div>
      <div key="img" className="w-[35%] max-w-[20rem] shrink-0">
        <TrackImage
          // Re-render image with key for fade-in effect
          key={props.trackMeta.selectedTrack.album.id}
          className="w-full rounded-2xl"
          title={props.trackMeta.selectedTrack.name}
          {...props.trackMeta.selectedTrack.album.images[0]}
        />
      </div>
      <div className="sticky top-0 z-10 bg-background shadow-2xl shadow-background">
        <Player
          // Re-render image with key for fade-in effect
          key={props.trackMeta.selectedTrack.album.id}
          selectedTrack={props.trackMeta.selectedTrack}
          setPlayingTrackId={props.trackMeta.setPlayingTrackId}
          onSelectAutoPlay={hasAutoPlay}
          smallPlayerRef={props.smallPlayerRef}
          isLarge
        />
      </div>

      <div className="sticky top-0 mt-8 grid gap-10">
        <div className="grid gap-4 rounded-t-2xl bg-gradient-to-t from-transparent to-accent py-5 @lg/detail:gap-6 @lg/detail:py-8">
          <Box className="grid gap-2.5">
            <h2 className="text-2xl font-bold @lg/detail:text-3xl">
              {props.trackMeta.selectedTrack.album.name}
              <span className="text-primary"> &middot; </span>
              <span className="">
                {props.trackMeta.selectedTrack.album.release_date.split('-')[0]}
              </span>
            </h2>
            <div className="@md/detail:text-md text-muted @lg/detail:text-lg @xl/detail:text-xl">
              {props.trackMeta.selectedTrack.album.album_type === 'album'
                ? `Tracks from this ${props.trackMeta.selectedTrack.album.album_type}`
                : 'Tracks from this single'}
            </div>
          </Box>
          {isLoading && <Box className="text-center">Loading...</Box>}
          {data && (
            <div>
              {albumTracks.map((track, index) => (
                <TrackItem
                  key={track.id}
                  trackNumber={index + 1}
                  title={track.name}
                  artists={formatArtists(track.artists)}
                  isSelected={props.trackMeta.selectedTrack.id === track.id}
                  isTopTrack={props.trackMeta.tracks.some(
                    t => t.id === track.id
                  )}
                  onSelect={() => {
                    if (props.trackMeta.selectedTrack.id === track.id) {
                      props.handleTogglePlayback(track.id)
                      return
                    }

                    setHasAutoPlay(true)

                    /**
                     * Supplemented track
                     * Spotify doesn’t supply extra album data in the 'Track' object
                     * (it's labelled 'SimplifiedTrack'), so as a workaround we
                     * add the missing data from the current selected track data
                     * to supplement it to a full 'Track' object.
                     */
                    const fullTrackData = {
                      ...track,
                      album: props.trackMeta.selectedTrack.album,
                      external_ids: props.trackMeta.selectedTrack.external_ids,
                      popularity: props.trackMeta.selectedTrack.popularity,
                    } satisfies Track
                    props.trackMeta.setSelectedTrack(fullTrackData)
                  }}
                  isPlaying={props.trackMeta.playingTrackId === track.id}
                  isPaused={
                    props.trackMeta.selectedTrack.id === track.id &&
                    !props.trackMeta.playingTrackId
                  }
                />
              ))}
            </div>
          )}
          <Box className="text-xs text-muted">{data?.copyrights[0].text}</Box>
        </div>
      </div>
    </div>
  )
}

const fetchAlbumDetail = async (albumId?: string, sdk?: SpotifyApi) => {
  if (!albumId || !sdk) return
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return await sdk.albums.get(albumId, MARKET_AU)
}

const Box = (props: { children: ReactNode; className?: string }) => (
  <div className={cn('px-5 @lg/detail:px-7', props.className)}>
    {props.children}
  </div>
)
