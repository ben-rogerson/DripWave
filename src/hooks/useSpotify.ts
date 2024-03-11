import { useContext } from 'react'
import { SpotifyContext } from '@/context/spotify'

export const useSpotify = () => {
  const context = useContext(SpotifyContext)
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider')
  }
  return context
}
