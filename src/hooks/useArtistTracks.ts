import { useContext } from 'react'
import { ArtistTracksContext } from '@/context/artistTracks'

export const useArtistTracks = () => {
  const context = useContext(ArtistTracksContext)
  if (!context) {
    throw new Error(
      'useArtistTracks must be used within a ArtistTracksProvider'
    )
  }

  return context
}
