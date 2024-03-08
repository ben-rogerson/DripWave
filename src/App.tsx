import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type {
  SimplifiedArtist,
  SpotifyApi,
  Track,
} from '@spotify/web-api-ts-sdk'
import { Scopes } from '@spotify/web-api-ts-sdk'
import type { ReactNode } from 'react'
import { createRef, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useSearch } from 'wouter'
import AudioPlayerH5, { RHAP_UI } from 'react-h5-audio-player'
import { Search } from '@/components/Search'
import { PARAM_SEARCH, SPOTIFY_MARKET } from '@/constants'
import { useSpotify } from '@/hooks/useSpotify'
import { cn } from '@/utils/cn'
import 'react-h5-audio-player/lib/styles.css'

const AudioPlayer = (props: {
  selectedTrack?: Track
  setPlayingTrackId: (trackId: string) => void
}) => {
  const playerRef = createRef<AudioPlayerH5>()

  if (!props.selectedTrack?.preview_url) return

  const handlePlay = () => {
    if (!props.selectedTrack) return // Guard prevents undefined selectedTrack
    props.setPlayingTrackId(props.selectedTrack.id)
  }

  const handleClear = () => {
    props.setPlayingTrackId('')
  }

  return (
    <div>
      <AudioPlayerH5
        autoPlay
        ref={playerRef}
        src={props.selectedTrack.preview_url}
        onPlaying={handlePlay}
        onPause={handleClear}
        onEnded={() => {
          handleClear()
          setTimeout(() => {
            if (!playerRef.current?.audio.current) return
            // Return to start of track
            playerRef.current.audio.current.currentTime = 0
          }, 100)
        }}
        showJumpControls={false}
        customProgressBarSection={[
          <img
            key="img"
            className="w-10"
            src={props.selectedTrack.album.images[0].url}
            alt={`${props.selectedTrack.name} cover`}
          />,
          <div key="meta">
            {props.selectedTrack.name} <span className="italic">by</span>{' '}
            {props.selectedTrack.artists.map(artist => artist.name).join(', ')}
          </div>,
          RHAP_UI.MAIN_CONTROLS,
        ]}
        customControlsSection={[RHAP_UI.PROGRESS_BAR]}
        customAdditionalControls={[]} // Remove loop button
        customVolumeControls={[]} // Remove volume controls
      />
    </div>
  )
}

const LayoutTrack = (props: {
  trackNumber: number
  image: ReactNode
  title: string
  artists: SimplifiedArtist[]
  onClick: () => void
  isPlaying: boolean
  isPaused: boolean
}) => {
  const statusDisplay = props.isPlaying ? <div>♪</div> : props.trackNumber
  return (
    <button
      type="button"
      className={cn(
        'grid w-full grid-cols-10 rounded-md p-4 pl-0 text-left hover:bg-gray-200',
        { 'text-purple-600': props.isPlaying || props.isPaused }
      )}
      onClick={props.onClick}
      disabled={props.isPlaying || props.isPaused}
    >
      <div className="grid h-full place-content-center text-center text-xl">
        {statusDisplay}
      </div>
      <div className="col-span-2 pr-5">{props.image}</div>
      <div className="col-span-7 flex h-full flex-col justify-center">
        <div className="font-bold">{props.title}</div>
        <div>{props.artists.map(artist => artist.name).join(', ')}</div>
      </div>
    </button>
  )
}

const ArtistTracks = (props: {
  data?: Track[]
  playingTrackId?: string
  selectedTrack?: Track
  setSelectedTrack: (track: Track) => void
}) => {
  if (!props.data) return null

  return props.data.map((track, index) => {
    return (
      <div key={track.id}>
        <LayoutTrack
          trackNumber={index + 1}
          image={
            <img src={track.album.images[0].url} alt={`${track.name} cover`} />
          }
          title={track.name}
          artists={track.artists}
          onClick={() => {
            props.setSelectedTrack(track)
          }}
          isPlaying={props.playingTrackId === track.id}
          isPaused={
            props.selectedTrack?.id === track.id && !props.playingTrackId
          }
        />
      </div>
    )
  })
}

const SpotifySearch = ({ sdk }: { sdk: SpotifyApi }) => {
  const [results, setResults] = useState<Track[]>([])
  const [selectedTrack, setSelectedTrack] = useState<Track>()
  const [playingTrackId, setPlayingTrackId] = useState<string>()

  const query = new URLSearchParams(useSearch()).get(PARAM_SEARCH)

  useEffect(() => {
    if (!query) return

    void (async () => {
      const res = await sdk.search(
        query,
        ['artist'],
        SPOTIFY_MARKET,
        // To receive the correct artist, the API needs a limit higher than 1
        // Otherwise it returns an incorrect result.
        4,
        0
        // 'audio'
      )

      const artist = res.artists.items[0]
      const artistId = artist.id
      const artistTopTracks = await sdk.artists.topTracks(
        artistId,
        SPOTIFY_MARKET
      )

      setResults(() => artistTopTracks.tracks)
    })()
  }, [sdk, query])

  return (
    <>
      <h1 className="px-5 pt-4 text-3xl font-bold">DripWave</h1>
      <div className="sticky top-0 border-b bg-white p-5 pt-3">
        <Search />
      </div>
      <ArtistTracks
        data={results}
        playingTrackId={playingTrackId}
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
      />
      <div className="sticky bottom-0">
        <AudioPlayer
          selectedTrack={selectedTrack}
          setPlayingTrackId={setPlayingTrackId}
        />
      </div>
    </>
  )
}

const queryClient = new QueryClient()

function App() {
  const sdk = useSpotify(
    String(import.meta.env.VITE_SPOTIFY_CLIENT_ID),
    String(import.meta.env.VITE_REDIRECT_TARGET),
    Scopes.userPlayback
  )
  return (
    <ErrorBoundary fallback={<p>⚠️ Something went wrong</p>}>
      <QueryClientProvider client={queryClient}>
        {sdk ? <SpotifySearch sdk={sdk} /> : <>Loading...</>}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
