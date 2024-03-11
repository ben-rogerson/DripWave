import { createContext, type ReactNode } from 'react'
import type { Artist, Track } from '@spotify/web-api-ts-sdk'
import { type SpotifyApi } from '@spotify/web-api-ts-sdk'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { MARKET_AU } from '@/constants'
import { useSearchQuery } from './useSearchQuery'
import { useSpotify } from '@/hooks/useSpotify'

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

  const { data, isPlaceholderData, isFetching, isLoading, error } =
    useQueryResult

  const tracks = data?.tracks ?? []
  const artist = data?.artist

  return (
    <ArtistTracksContext.Provider
      value={{
        tracks,
        artist,
        isPlaceholderData,
        isFetching,
        isLoading,
        error,
      }}
    >
      {props.children}
    </ArtistTracksContext.Provider>
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

export const ArtistTracksContext =
  createContext<ArtistTracksContextType | null>(null)
