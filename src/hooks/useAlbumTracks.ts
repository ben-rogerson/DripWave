import { useContext } from 'react'
import { AlbumTracksContext } from '@/context/albumTracks'

export const useAlbumTracks = () => {
  const context = useContext(AlbumTracksContext)
  if (!context) {
    throw new Error('useAlbumTracks must be used within a AlbumTracksProvider')
  }
  return context
}
