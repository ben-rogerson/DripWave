import { createContext, useState, createRef, useCallback } from 'react'
import type { Track } from '@spotify/web-api-ts-sdk'
import type { ReactNode } from 'react'
import type AudioPlayer from 'react-h5-audio-player'
import { useSetTrackParam } from '@/hooks/useSetTrackParam'
import { useGetTrackFromTrackParam } from '@/hooks/useGetTrackFromTrackParam'

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
  const setTrackParam = useSetTrackParam()

  const setSelectedTrackWithPlayPause = useCallback(
    (track: Track) => {
      if (selectedTrack?.id === track.id) {
        if (!smallPlayerRef.current) return
        if (playingTrackId === track.id) {
          smallPlayerRef.current.audio.current?.pause()
          return
        }
        void smallPlayerRef.current.audio.current?.play()
        return
      }

      setTrackParam(track.id)
      setSelectedTrack(track)
    },
    [playingTrackId, selectedTrack?.id, setTrackParam, smallPlayerRef]
  )

  useGetTrackFromTrackParam(selectedTrack, setSelectedTrackWithPlayPause)

  return (
    <PlayerContext.Provider
      value={{
        selectedTrack,
        playingTrackId,
        smallPlayerRef,
        setPlayingTrackId,
        setSelectedTrack: setSelectedTrackWithPlayPause,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  )
}

export const PlayerContext = createContext<PlayerContextType | null>(null)
