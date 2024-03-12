import { type Track } from '@spotify/web-api-ts-sdk'
import { createContext, useState, createRef, useCallback } from 'react'
import type { ReactNode } from 'react'
import type AudioPlayer from 'react-h5-audio-player'

interface PlayerContextType {
  selectedTrack?: Track
  playingTrackId?: string
  setSelectedTrack: (track: Track) => void
  setPlayingTrackId: (trackId: string) => void
  smallPlayerRef: React.RefObject<AudioPlayer>
}

export const PlayerProvider = (props: { children: ReactNode }) => {
  const smallPlayerRef = createRef<AudioPlayer>()
  const [selectedTrack, setSelectedTrack] = useState<Track>()
  const [playingTrackId, setPlayingTrackId] = useState<string>()

  const setSelectedTrackCached = useCallback(
    (track: Track) => {
      if (selectedTrack?.id === track.id) {
        if (selectedTrack.id === track.id && smallPlayerRef.current) {
          if (playingTrackId === track.id) {
            smallPlayerRef.current.audio.current?.pause()
            return
          }
          void smallPlayerRef.current.audio.current?.play()
          return
        }
        return
      }

      setSelectedTrack(track)
    },
    [playingTrackId, selectedTrack, smallPlayerRef]
  )

  return (
    <PlayerContext.Provider
      value={{
        selectedTrack,
        playingTrackId,
        smallPlayerRef,
        setPlayingTrackId,
        setSelectedTrack: setSelectedTrackCached,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  )
}

export const PlayerContext = createContext<PlayerContextType | null>(null)
