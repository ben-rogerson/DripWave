import { type SpotifyApi, type Track } from '@spotify/web-api-ts-sdk'
import { useEffect, useState } from 'react'
import { Link, useSearch } from 'wouter'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createRef } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import { Search } from '@/components/Search'
import { PARAM_SEARCH, SPOTIFY_MARKET as MARKET_AU } from '@/constants'
import { cn } from '@/utils/cn'
import { useSpotify } from '@/hooks/useSpotify'
import {
  IconAudio,
  IconDisc,
  IconPause,
  IconPlay,
  IconTop,
} from '@/components/Icons'
import { ArtistLink } from '@/components/ArtistLink'
import { formatArtists } from '@/utils/formatArtists'
import { TrackImage } from '@/components/TrackImage'

const Player = (props: {
  selectedTrack?: Track
  setPlayingTrackId: (trackId: string) => void
  onSelectAutoPlay: boolean
  isLarge?: boolean
  playerRef: React.RefObject<AudioPlayer>
}) => {
  if (!props.selectedTrack?.preview_url) return

  const handlePlay = () => {
    if (!props.selectedTrack) return // Guard prevents undefined selectedTrack
    props.setPlayingTrackId(props.selectedTrack.id)
  }

  const handleClear = () => {
    props.setPlayingTrackId('')
  }

  const sizeConfig = props.isLarge
    ? {
        customProgressBarSection: [
          <div key="empty" />,
          RHAP_UI.MAIN_CONTROLS,
          <div key="meta" className="ml-4 flex gap-7 truncate">
            <div key="img" className="w-full min-w-16 max-w-16">
              <TrackImage
                className="w-full"
                title={props.selectedTrack.name}
                {...props.selectedTrack.album.images[0]}
              />
            </div>
            <div className="truncate">
              <h1 className="truncate text-4xl font-bold">
                {props.selectedTrack.name}
              </h1>
              <div className="truncate text-lg text-muted">
                {formatArtists(props.selectedTrack.artists)}
              </div>
            </div>
          </div>,
        ],
      }
    : {
        customProgressBarSection: [
          RHAP_UI.MAIN_CONTROLS,
          <div key="meta">
            <div className="truncate font-bold">{props.selectedTrack.name}</div>
            <div className="truncate text-sm text-muted">
              {formatArtists(props.selectedTrack.artists)}
            </div>
          </div>,
        ],
      }

  return (
    <AudioPlayer
      ref={props.playerRef}
      autoPlay={props.onSelectAutoPlay}
      autoPlayAfterSrcChange={props.onSelectAutoPlay}
      src={props.selectedTrack.preview_url}
      customControlsSection={[RHAP_UI.PROGRESS_BAR]}
      customAdditionalControls={[]} // Remove loop button
      customVolumeControls={[]} // Remove volume controls
      showJumpControls={false}
      onPlaying={handlePlay}
      onPause={handleClear}
      onEnded={handleClear}
      className={props.isLarge ? 'player-large' : 'player-small'}
      {...sizeConfig}
    />
  )
}

const Indicator = (props: {
  showPlaying: boolean
  isSelected: boolean
  children: ReactNode
}) => {
  return (
    <div className="pointer-events-none relative h-full w-full">
      {props.isSelected && (
        <div
          className={cn(
            '@lg/trackItem:text-3xl absolute z-10 grid h-full w-full place-content-center text-2xl',
            'opacity-0 transition-all duration-500 group-hover:opacity-100',
            '-rotate-45 scale-75 ease-out group-hover:rotate-0 group-hover:scale-100'
          )}
        >
          {props.showPlaying ? <IconPause /> : <IconPlay />}
        </div>
      )}
      <div
        className={cn(
          '@md/trackItem:text-lg text-sm',
          'h-inherit w-inherit grid place-content-center',
          props.isSelected && 'group-hover:opacity-0'
        )}
      >
        <div
          className={cn(
            'h-inherit w-inherit absolute left-0 grid place-content-center',
            'transition-opacity duration-500',
            !props.showPlaying && 'opacity-0'
          )}
        >
          <IconAudio />
        </div>
        <div
          className={cn(
            '@xs/trackItem:text-sm transition-opacity duration-500',
            props.showPlaying && 'text-primary opacity-0'
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}

const TrackItem = (props: {
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
        '@container/trackItem group block w-full text-left',
        props.isSelected ? 'text-primary' : 'text-muted'
      )}
      onClick={props.onSelect}
    >
      <div
        className={cn(
          '@xs/trackItem:pl-4 @xs/trackItem:pr-7 @xs/trackItem:py-3 @xs/trackItem:gap-1 grid grid-cols-10 items-center py-2 pl-1 pr-5 group-hover:bg-accent',
          '[.detail-column_&]:rounded-lg [.detail-column_&]:group-hover:shadow-2xl'
        )}
      >
        <Indicator
          showPlaying={props.isPlaying && props.isSelected}
          isSelected={props.isSelected}
        >
          {props.trackNumber}
        </Indicator>
        {props.image && (
          <div className="@sm/trackItem:pr-4 col-span-2">
            <TrackImage title={props.title} {...props.image} />
          </div>
        )}
        <div
          className={cn(
            '"@sm/trackItem:text-md col-span-7 flex flex-col justify-center pl-3 text-sm'
          )}
        >
          <div
            className={cn(
              'truncate font-bold',
              !props.isSelected && 'text-foreground'
            )}
          >
            {props.title}
          </div>
          <div className="truncate">{props.artists}</div>
          {props.album && (
            <div className="mt-0.5 flex items-center gap-1 text-sm">
              {props.releaseType === 'single' && props.album === props.title ? (
                <span className="italic">Single</span>
              ) : (
                <span className="max-w-[calc(100%-6ch)] truncate">
                  {props.album}
                </span>
              )}
              <span>&middot;</span>
              <span>{props.albumYear}</span>
            </div>
          )}
          {props.isTopTrack && (
            <div className="text-xl text-muted">
              <IconTop />
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

const fetchArtists = async (query: string, sdk?: SpotifyApi) => {
  if (!query || !sdk) return []

  const res = await sdk.search(
    query,
    ['artist'],
    MARKET_AU,
    // To receive the correct artist, the API needs a higher limit
    // Otherwise it returns an incorrect result.
    5
  )

  if (res.artists.items.length === 0) return []

  const artist = res.artists.items[0]

  const artistTopTracks = await sdk.artists.topTracks(artist.id, MARKET_AU)

  return { artist, tracks: artistTopTracks.tracks }
}

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

  const [selectedTrack, setSelectedTrack] = useState<Track>()
  const [playingTrackId, setPlayingTrackId] = useState<string>()
  const playerRef = createRef<AudioPlayer>()

  const { data, isPlaceholderData, isFetching, isLoading, error } =
    useQueryResult

  if (!data) return

  const isLargeScreen = window.matchMedia('(min-width: 1000px)').matches
  const tracks = data?.tracks ?? []
  const artist = data?.artist

  const handleTogglePlayback = (trackId: string) => {
    if (!selectedTrack) return

    if (selectedTrack.id === trackId && playerRef.current) {
      if (playingTrackId === trackId) {
        playerRef.current.audio.current?.pause()
        return
      }
      void playerRef.current.audio.current?.play()
      return
    }
  }

  return (
    <div className={cn(isLargeScreen && 'grid grid-cols-3')}>
      <div
        className={cn(
          '@container/listColumn grid grid-rows-[auto_auto_minmax(0,1fr)_auto] bg-background',
          isLargeScreen &&
            'sticky top-0 h-[100dvh] overflow-y-scroll overscroll-contain'
        )}
      >
        <div className="xs:flex @xs/listColumn:px-6 items-center justify-between px-5 pt-4">
          <h1 className="text-xs font-bold uppercase tracking-wider">
            <Link to="/">
              <span className="">Drip</span>
              <span className="text-primary">Wave</span>
            </Link>
          </h1>
        </div>
        <div className="@xs/listColumn:px-6 sticky top-0 z-10 bg-background px-5 shadow-md shadow-background">
          <Search inProgress={isFetching} />
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
            <div className="px-6 text-sm text-muted">
              Artist “{artist.name}”
            </div>
          )}
          {tracks.length > 0 && (
            <div className={cn('pb-3', isPlaceholderData && 'opacity-50')}>
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
                  onSelect={() => {
                    if (selectedTrack?.id === track.id) {
                      handleTogglePlayback(track.id)
                      return
                    }
                    setSelectedTrack(track)
                  }}
                  isPlaying={playingTrackId === track.id}
                  isPaused={selectedTrack?.id === track.id && !playingTrackId}
                />
              ))}
            </div>
          )}
          {tracks.length === 0 && isFetching && (
            <div className="p-5 text-center">
              <IconDisc className="h-full animate-spin" /> Loading...
            </div>
          )}
        </div>
        <div
          className={cn('sticky bottom-0 z-10 transition-transform ease-out', {
            'translate-y-full': !selectedTrack,
          })}
        >
          {selectedTrack && (
            <div className="pointer-events-none h-3 w-full bg-gradient-to-t from-background to-transparent opacity-50" />
          )}
          {!isLargeScreen && (
            <div className="bg-accent">
              <Player
                selectedTrack={selectedTrack}
                setPlayingTrackId={setPlayingTrackId}
                playerRef={playerRef}
                onSelectAutoPlay
              />
            </div>
          )}
        </div>
      </div>
      {isLargeScreen && selectedTrack ? (
        <div className="col-span-2 w-full p-10">
          <TrackDetail
            sdk={sdk}
            selectedTrack={selectedTrack}
            playingTrackId={playingTrackId}
            setPlayingTrackId={setPlayingTrackId}
            setSelectedTrack={setSelectedTrack}
            playerRef={playerRef}
            topTracks={tracks}
            handleTogglePlayback={handleTogglePlayback}
          />
        </div>
      ) : null}
    </div>
  )
}

const fetchAlbumDetail = async (albumId?: string, sdk?: SpotifyApi) => {
  if (!albumId || !sdk) return
  return await sdk.albums.get(albumId, MARKET_AU)
}

export const TrackDetail = (props: {
  sdk?: SpotifyApi
  selectedTrack: Track
  setSelectedTrack: (track: Track) => void
  playingTrackId?: string
  setPlayingTrackId: (trackId: string) => void
  topTracks: Track[]
  playerRef: React.RefObject<AudioPlayer>
  handleTogglePlayback: (trackId: string) => void
}) => {
  const albumId = props.selectedTrack.album.id

  const useQueryResult = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => fetchAlbumDetail(albumId, props.sdk),
    enabled: Boolean(props.sdk),
    refetchOnWindowFocus: false,
  })

  const [hasAutoPlay, setHasAutoPlay] = useState(false)
  useEffect(() => {
    setHasAutoPlay(false)
  }, [props.selectedTrack])

  const { data, isLoading, error, isFetching } = useQueryResult

  const albumTracks = data?.tracks.items ?? []

  const imageData = props.selectedTrack.album.images[0]

  return (
    <div>
      <div
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-50 w-full opacity-[10%] transition-all duration-1000'
          // props.playingTrackId && 'opacity-10'
        )}
        key={props.selectedTrack.album.id}
      >
        <div className="fixed left-0 top-0 z-50 h-[10dvh] w-full bg-gradient-to-b from-background to-transparent blur-lg" />
        <TrackImage
          title={props.selectedTrack.album.name}
          className="-mt-[25%] scale-[400%] object-cover bg-blend-overlay blur-xl"
          {...imageData}
          aria-hidden
        />
      </div>
      <TrackImage
        key={props.selectedTrack.album.id}
        title={props.selectedTrack.album.name}
        className="w-full max-w-60"
        {...imageData}
      />
      <div className="sticky top-0 z-10 bg-background shadow-2xl shadow-background">
        <Player
          // Re-render image to get the animation working
          key={props.selectedTrack.album.id}
          selectedTrack={props.selectedTrack}
          setPlayingTrackId={props.setPlayingTrackId}
          onSelectAutoPlay={hasAutoPlay}
          playerRef={props.playerRef}
          isLarge
        />
      </div>
      <div className="detail-column sticky top-0 mt-8 grid gap-10">
        <div className="grid gap-5 rounded-lg bg-gradient-to-t from-transparent to-accent p-6">
          <div className="grid gap-1">
            <h2 className="text-2xl font-bold">
              {props.selectedTrack.album.name}
              <span className="text-primary"> &middot; </span>
              <span className="">
                {props.selectedTrack.album.release_date.split('-')[0]}
              </span>
            </h2>
            <div className="text-muted">
              {props.selectedTrack.album.album_type === 'album'
                ? `Tracks from this ${props.selectedTrack.album.album_type}`
                : 'Tracks from this single'}
            </div>
          </div>
          {isLoading && <div className="p-5 text-center">Loading...</div>}
          {data && (
            <div>
              {albumTracks.map((track, index) => (
                <TrackItem
                  key={track.id}
                  trackNumber={index + 1}
                  title={track.name}
                  artists={formatArtists(track.artists)}
                  isSelected={props.selectedTrack.id === track.id}
                  isTopTrack={props.topTracks.some(t => t.id === track.id)}
                  onSelect={() => {
                    if (props.selectedTrack.id === track.id) {
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
                      album: props.selectedTrack.album,
                      external_ids: props.selectedTrack.external_ids,
                      popularity: props.selectedTrack.popularity,
                    } satisfies Track
                    props.setSelectedTrack(fullTrackData)
                  }}
                  isPlaying={props.playingTrackId === track.id}
                  isPaused={
                    props.selectedTrack.id === track.id && !props.playingTrackId
                  }
                />
              ))}
            </div>
          )}
        </div>
        <div className="text-xs text-muted">{data?.copyrights[0].text}</div>
      </div>
    </div>
  )
}

const Message = (props: { children: ReactNode }) => {
  return (
    <div className="m-5 rounded-md p-10 text-center [&_a]:font-bold">
      {props.children}
    </div>
  )
}
