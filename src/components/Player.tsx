import { useEffect, useState } from 'react'
import { createRef } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import { formatArtists } from '@/utils/formatArtists'
import { usePlayer } from '@/hooks/usePlayer'

export const Player = (props: { isLarge?: boolean }) => {
  const { smallPlayerRef, selectedTrack, setPlayingTrackId } = usePlayer()
  const [hasAutoPlay, setHasAutoPlay] = useState(true)
  const largePlayerRef = createRef<AudioPlayer>()

  // Share audio between players by setting the same audio ref
  useEffect(
    () => {
      if (!props.isLarge) return
      if (!largePlayerRef.current) return
      // @ts-expect-error - Current is not readonly in this case
      largePlayerRef.current.audio.current =
        smallPlayerRef.current?.audio.current
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run once
    []
  )

  // Autoplay differs between small and large player so it's managed here
  useEffect(
    () => {
      const isSmallVisible =
        smallPlayerRef.current?.container.current?.checkVisibility() ?? true
      setHasAutoPlay(isSmallVisible)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Avoid useless dep
    [selectedTrack]
  )

  // When traversing between small and large player, avoid auto play on first selection
  useEffect(
    () => {
      if (hasAutoPlay) return
      smallPlayerRef.current?.audio.current?.pause()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Avoid useless dep
    [hasAutoPlay]
  )

  const handlePlay = () => {
    if (!selectedTrack) return // Guard prevents undefined selectedTrack
    setPlayingTrackId(selectedTrack.id)
  }

  const handleClear = () => {
    setPlayingTrackId('')
  }

  if (!selectedTrack?.preview_url) return

  const sizeConfig = props.isLarge
    ? {
        ref: largePlayerRef,
        customProgressBarSection: [
          <div key="empty" />,
          RHAP_UI.MAIN_CONTROLS,
          <div
            key="meta"
            className="ml-4 flex items-center gap-7 overflow-hidden"
          >
            <div className="overflow-hidden">
              <h1 className="truncate text-2xl font-bold md:text-3xl lg:text-4xl">
                {selectedTrack.name}
              </h1>
              <div className="truncate text-lg text-muted">
                {formatArtists(selectedTrack.artists)}
              </div>
            </div>
          </div>,
        ],
      }
    : {
        ref: smallPlayerRef,
        src: selectedTrack.preview_url,
        customProgressBarSection: [
          RHAP_UI.MAIN_CONTROLS,
          <div key="meta">
            <div className="truncate font-bold">{selectedTrack.name}</div>
            <div className="truncate text-sm text-muted">
              {formatArtists(selectedTrack.artists)}
            </div>
          </div>,
        ],
      }

  return (
    <AudioPlayer
      autoPlay={hasAutoPlay}
      autoPlayAfterSrcChange={hasAutoPlay}
      customControlsSection={[RHAP_UI.PROGRESS_BAR]}
      customAdditionalControls={[]} // Remove loop button
      customVolumeControls={[]} // Remove volume controls
      showJumpControls={false}
      onPlaying={handlePlay}
      onPause={handleClear}
      onEnded={handleClear}
      className={props.isLarge ? 'player-large' : 'player-small'}
      {...sizeConfig}
    />
  )
}
