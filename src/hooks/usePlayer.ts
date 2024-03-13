import { useContext } from 'react'
import { PlayerContext } from '@/context/player'

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }

  return context
}
