import { type Track } from '@spotify/web-api-ts-sdk'
import { useEffect } from 'react'
import { createRef } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import { formatArtists } from '@/utils/formatArtists'

export const Player = (props: {
  selectedTrack?: Track
  setPlayingTrackId: (trackId: string) => void
  onSelectAutoPlay: boolean
  isLarge?: boolean
  smallPlayerRef: React.RefObject<AudioPlayer>
}) => {
  const largePlayerRef = createRef<AudioPlayer>()

  // Share audio between players by setting the same audio ref
  useEffect(
    () => {
      if (!props.isLarge) return
      if (!largePlayerRef.current) return
      // @ts-expect-error - Current is not readonly in this case
      largePlayerRef.current.audio.current =
        props.smallPlayerRef.current?.audio.current
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run once
    []
  )

  if (!props.selectedTrack?.preview_url) return

  const handlePlay = () => {
    if (!props.selectedTrack) return // Guard prevents undefined selectedTrack
    props.setPlayingTrackId(props.selectedTrack.id)
  }

  const handleClear = () => {
    props.setPlayingTrackId('')
  }

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
              <h1 className="truncate text-4xl font-bold">
                {props.selectedTrack.name}
              </h1>
              <div className="truncate text-lg text-muted">
                {formatArtists(props.selectedTrack.artists)}
              </div>
            </div>
          </div>,
        ],
      }
    : {
        ref: props.smallPlayerRef,
        src: props.selectedTrack.preview_url,
        customProgressBarSection: [
          RHAP_UI.MAIN_CONTROLS,
          <div key="meta">
            <div className="truncate font-bold">{props.selectedTrack.name}</div>
            <div className="truncate text-sm text-muted">
              {formatArtists(props.selectedTrack.artists)}
            </div>
          </div>,
        ],
      }

  return (
    <AudioPlayer
      autoPlay={props.onSelectAutoPlay}
      autoPlayAfterSrcChange={props.onSelectAutoPlay}
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
