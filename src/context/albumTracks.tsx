import { createContext, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MARKET_AU } from '@/constants'
import { useSpotify } from '@/hooks/useSpotify'
import { usePlayer } from '@/hooks/usePlayer'
import type { SimplifiedTrack } from '@spotify/web-api-ts-sdk'
import { type SpotifyApi } from '@spotify/web-api-ts-sdk'
import { useLocation } from 'wouter'
// import { useArtistTracks } from '@/hooks/useArtistTracks'

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
  // const { tracks } = useArtistTracks()
  // const [location] = useLocation()
  const [location] = useLocation()

  const albumId = selectedTrack?.album.id ?? location.split('/')[1]

  // if (!albumId) {
  //   const selectedTrackFromParam = useQueryResult.data.tracks.items.find(
  //     track => track.id === location.split('/')[1]
  //   )
  //   location.split('/')[1]
  // }

  // const [location] = useLocation()

  // const albumId = selectedTrack?.album.id ?? location.split('/')[1]

  const results = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => fetchAlbumDetail(albumId, sdk),
    enabled: Boolean(sdk && albumId),
    refetchOnWindowFocus: false,
  })

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- We need to check for null
  if (!results) throw new Error('No response from the Spotify API')

  // Grab the selected track from the URL on load
  // useEffect(() => {
  // if (selectedTrack) return
  // console.log({ asd: results.data })
  // console.log({ location })
  // if (!results.data?.tracks) return

  // const selectedTrackFromParam = tracks.find(
  //   track => track.id === location.split('/')[1]
  // )
  // console.log({ selectedTrackFromParam })

  // results.data.artists
  // if (!selectedTrackFromParam) return

  // const selectedTrackFromParam = tracks.find(
  //   track => track.album.id === location.split('/')[1]
  // )
  // if (!selectedTrackFromParam) return
  // navigate(`/${selectedTrackFromParam.id}/${window.location.search}`)

  // navigate(`/${track.id}/${window.location.search}`)

  // const fullTrackData = {
  //   ...selectedTrackFromParam,
  //   album: {
  //     // album_group: results.data.album_group,
  //     album_group: results.data.album_group,
  //     artists: results.data.artists,
  //     // artists, results.data.artists,
  //   },
  //   external_ids: results.data.external_ids,
  //   popularity: results.data.popularity,
  // } as Track

  // setSelectedTrack(fullTrackData)

  // eslint-disable-next-line react-hooks/exhaustive-deps -- G
  // }, [results.isFetched])

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
