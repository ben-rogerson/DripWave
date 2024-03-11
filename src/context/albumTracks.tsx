import { createContext, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MARKET_AU } from '@/constants'
import { useSpotify } from '@/hooks/useSpotify'
import { usePlayer } from '@/hooks/usePlayer'
import type { SimplifiedTrack } from '@spotify/web-api-ts-sdk'
import { type SpotifyApi } from '@spotify/web-api-ts-sdk'

interface AlbumTracksContextType {
  albumTracks: SimplifiedTrack[]
  copyright?: string
  isFetching: boolean
  isLoading: boolean
  error: unknown
}

export const AlbumTracksProvider = (props: { children: ReactNode }) => {
  const { sdk } = useSpotify()
  const { selectedTrack } = usePlayer()

  const albumId = selectedTrack?.album.id

  const useQueryResult = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => fetchAlbumDetail(albumId, sdk),
    enabled: Boolean(sdk && albumId),
    refetchOnWindowFocus: false,
  })

  const { data, isFetching, isLoading, error } = useQueryResult

  const albumTracks = data?.tracks.items ?? []

  return (
    <AlbumTracksContext.Provider
      value={{
        albumTracks,
        copyright: data?.copyrights[0].text,
        isFetching,
        isLoading,
        error,
      }}
    >
      {props.children}
    </AlbumTracksContext.Provider>
  )
}

export const AlbumTracksContext = createContext<AlbumTracksContextType | null>(
  null
)

const fetchAlbumDetail = async (albumId?: string, sdk?: SpotifyApi) => {
  if (!albumId || !sdk) return
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return await sdk.albums.get(albumId, MARKET_AU)
}
