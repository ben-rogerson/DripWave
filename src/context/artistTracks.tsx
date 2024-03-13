import { createContext } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchQuery } from '@/context/useSearchQuery'
import { useSpotify } from '@/hooks/useSpotify'
import { MARKET_AU } from '@/constants'
import type { ReactNode } from 'react'
import type { SpotifyApi, Artist, Track } from '@spotify/web-api-ts-sdk'

interface ArtistTracksContextType {
  tracks: Track[]
  artist?: Artist
  isPlaceholderData: boolean
  isFetching: boolean
  isLoading: boolean
  error: unknown
}

export const ArtistTracksProvider = (props: { children: ReactNode }) => {
  const { sdk } = useSpotify()
  const query = useSearchQuery()

  const useQueryResult = useQuery({
    queryKey: ['query', query],
    queryFn: () => fetchArtists(query, sdk),
    placeholderData: keepPreviousData,
    enabled: Boolean(sdk),
    refetchOnWindowFocus: false,
  })

  return (
    <ArtistTracksContext.Provider
      value={{
        tracks: useQueryResult.data?.tracks ?? [],
        artist: useQueryResult.data?.artist,
        isPlaceholderData: useQueryResult.isPlaceholderData,
        isFetching: useQueryResult.isFetching,
        isLoading: useQueryResult.isLoading,
        error: useQueryResult.error,
      }}
    >
      {props.children}
    </ArtistTracksContext.Provider>
  )
}

export const ArtistTracksContext =
  createContext<ArtistTracksContextType | null>(null)

const fetchArtists = async (query: string, sdk?: SpotifyApi) => {
  if (!query || !sdk) return {}

  const results = await sdk.search(
    query,
    ['artist'],
    MARKET_AU,
    // To receive the correct artist, the API needs a higher limit
    // Otherwise it returns an incorrect result.
    5
  )

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- We need to check for null
  if (!results) throw new Error('No response from the Spotify API')

  if (results.artists.items.length === 0) return {}

  const artist = results.artists.items[0]

  const artistTopTracks = await sdk.artists.topTracks(artist.id, MARKET_AU)

  return { artist, tracks: artistTopTracks.tracks }
}
