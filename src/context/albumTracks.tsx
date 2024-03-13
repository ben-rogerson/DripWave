import { createContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSpotify } from '@/hooks/useSpotify'
import { usePlayer } from '@/hooks/usePlayer'
import { MARKET_AU } from '@/constants'
import type { ReactNode } from 'react'
import type { SpotifyApi, SimplifiedTrack } from '@spotify/web-api-ts-sdk'

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

  const results = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => fetchAlbumDetail(albumId, sdk),
    enabled: Boolean(sdk && albumId),
    refetchOnWindowFocus: false,
  })

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- We need to check for null
  if (!results) throw new Error('No response from the Spotify API')

  return (
    <AlbumTracksContext.Provider
      value={{
        albumTracks: results.data?.tracks.items ?? [],
        copyright: results.data?.copyrights[0].text.replace(
          /null$/gi, // Remove bad Spotify data
          ''
        ),
        isFetching: results.isFetching,
        isLoading: results.isLoading,
        error: results.error,
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
  return await sdk.albums.get(albumId, MARKET_AU)
}
