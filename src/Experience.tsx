import { type SpotifyApi, type Track } from '@spotify/web-api-ts-sdk'
import { useState } from 'react'
import { useSearch } from 'wouter'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createRef } from 'react'
import type AudioPlayer from 'react-h5-audio-player'
import { PARAM_SEARCH, MARKET_AU } from '@/constants'
import { cn } from '@/utils/cn'
import { useSpotify } from '@/hooks/useSpotify'
import { TrackImage } from '@/components/TrackImage'
import { TrackDetail } from '@/components/TrackDetail'
import { ArtistSearch } from '@/components/ArtistSearch'

export const Experience = () => {
  const sdk = useSpotify(
    String(import.meta.env.VITE_SPOTIFY_CLIENT_ID),
    String(import.meta.env.VITE_REDIRECT_TARGET),
    [] // Scopes are not required for this app
  )

  const query = new URLSearchParams(useSearch()).get(PARAM_SEARCH) ?? ''

  const useQueryResult = useQuery({
    queryKey: ['query', query],
    queryFn: () => fetchArtists(query, sdk),
    placeholderData: keepPreviousData,
    enabled: Boolean(sdk),
    refetchOnWindowFocus: false,
  })

  const { selectedTrack, setSelectedTrack, playingTrackId, setPlayingTrackId } =
    useTrackState()
  const smallPlayerRef = createRef<AudioPlayer>()

  const { data, isPlaceholderData, isFetching, isLoading, error } =
    useQueryResult

  const tracks = data?.tracks ?? []
  const artist = data?.artist

  const handleTogglePlayback = (trackId: string) => {
    if (!selectedTrack) return

    if (selectedTrack.id === trackId && smallPlayerRef.current) {
      if (playingTrackId === trackId) {
        smallPlayerRef.current.audio.current?.pause()
        return
      }
      void smallPlayerRef.current.audio.current?.play()
      return
    }
  }

  return (
    <Layout
      side={
        <ArtistSearch
          query={query}
          trackMeta={{
            tracks,
            artist,
            selectedTrack,
            playingTrackId,
            setSelectedTrack,
            setPlayingTrackId,
          }}
          smallPlayerRef={smallPlayerRef}
          isFetching={isFetching}
          isPlaceholderData={isPlaceholderData}
          handleTogglePlayback={handleTogglePlayback}
        />
      }
      detail={
        <>
          {selectedTrack ? (
            <div className="p-10">
              <TrackDetail
                sdk={sdk}
                trackMeta={{
                  tracks,
                  artist,
                  selectedTrack,
                  playingTrackId,
                  setSelectedTrack,
                  setPlayingTrackId,
                }}
                smallPlayerRef={smallPlayerRef}
                handleTogglePlayback={handleTogglePlayback}
              />
            </div>
          ) : (
            <div className="h-full bg-accent text-center">Images</div>
          )}
        </>
      }
      background={
        selectedTrack && (
          <div
            className="pointer-events-none fixed left-0 top-0 h-full w-full"
            key={selectedTrack.album.id}
          >
            <TrackImage
              title={selectedTrack.album.name}
              className="scale-[200%] rounded-none opacity-15 blur-md md:blur-xl"
              {...selectedTrack.album.images[0]}
              aria-hidden
            />
          </div>
        )
      }
    />
  )
}

const Layout = (props: {
  side: ReactNode
  detail: ReactNode
  background: ReactNode
}) => {
  return (
    <div
      className={cn(
        'md:grid md:grid-cols-[minmax(0,40%)_repeat(2,_minmax(0,_1fr))] xl:grid-cols-[minmax(0,550px)_repeat(2,_minmax(0,_1fr))]'
      )}
    >
      <div
        className={cn(
          'container-side grid min-h-[100dvh] grid-rows-[auto_auto_minmax(0,1fr)_auto] bg-background @container/side',
          'md:sticky md:top-0 md:h-[100dvh] md:overflow-y-scroll md:overscroll-contain'
        )}
      >
        {props.side}
      </div>
      <div className="container-detail col-span-2 hidden @container/detail md:block">
        {props.detail}
      </div>
      {props.background}
    </div>
  )
}

const fetchArtists = async (query: string, sdk?: SpotifyApi) => {
  if (!query || !sdk) return {}

  const res = await sdk.search(
    query,
    ['artist'],
    MARKET_AU,
    // To receive the correct artist, the API needs a higher limit
    // Otherwise it returns an incorrect result.
    5
  )

  if (res.artists.items.length === 0) return {}

  const artist = res.artists.items[0]

  const artistTopTracks = await sdk.artists.topTracks(artist.id, MARKET_AU)

  return { artist, tracks: artistTopTracks.tracks }
}

// TODO: Move to context
const useTrackState = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track>()
  const [playingTrackId, setPlayingTrackId] = useState<string>()

  return { selectedTrack, setSelectedTrack, playingTrackId, setPlayingTrackId }
}
