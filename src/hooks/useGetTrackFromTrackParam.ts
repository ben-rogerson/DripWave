import { useEffect } from 'react'
import { useTrackParam } from '@/hooks/useTrackParam'
import { useSpotify } from '@/hooks/useSpotify'
import type { Track } from '@spotify/web-api-ts-sdk'

export const useGetTrackFromTrackParam = (
  selectedTrack: Track | undefined,
  setSelectedTrack: (param: Track) => void
) => {
  const { sdk } = useSpotify()
  const trackId = useTrackParam()

  useEffect(() => {
    if (selectedTrack) return
    if (!trackId) return
    if (!sdk) return

    const getTrack = async () => {
      const track = await sdk.tracks.get(trackId)
      setSelectedTrack(track)
    }
    void getTrack()
  }, [sdk, selectedTrack, setSelectedTrack, trackId])
}
