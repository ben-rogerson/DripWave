import { useEffect, createRef } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import { formatArtists } from '@/utils/formatArtists'
import { usePlayer } from '@/hooks/usePlayer'
import { useBreakpoint } from '@/context/breakpointProvider'

/**
 * Audio player for the Spotify `preview_url`.
 */
export const PlayerLarge = () => {
  const { smallPlayerRef, selectedTrack } = usePlayer()
  const largePlayerRef = createRef<AudioPlayer>()

  // Share audio between players by setting the same audio ref
  useEffect(
    () => {
      if (!largePlayerRef.current) return
      // @ts-expect-error - Current is not read-only in this case
      largePlayerRef.current.audio.current =
        smallPlayerRef.current?.audio.current
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run on load
    []
  )

  if (!selectedTrack) return

  return (
    <AudioPlayer
      customAdditionalControls={[]} // Remove loop button
      customVolumeControls={[]} // Remove volume controls
      showJumpControls={false}
      className="player-large"
      ref={largePlayerRef}
      customControlsSection={[
        selectedTrack.preview_url ? RHAP_UI.PROGRESS_BAR : <NoPreview />,
      ]}
      customProgressBarSection={[
        <div key="empty" />,
        selectedTrack.preview_url ? (
          RHAP_UI.MAIN_CONTROLS
        ) : (
          <div key="empty2" />
        ),
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
      ]}
    />
  )
}

export const PlayerSmall = () => {
  const { smallPlayerRef, selectedTrack, setPlayingTrackId } = usePlayer()
  const bp = useBreakpoint()

  const handlePlaying = () => {
    if (!selectedTrack) return // Guard prevents undefined selectedTrack
    setPlayingTrackId(selectedTrack.id)
  }

  const handleClear = () => {
    setPlayingTrackId('')
  }

  if (!selectedTrack) return

  return (
    <AudioPlayer
      autoPlay={bp.xs}
      autoPlayAfterSrcChange={bp.xs}
      customAdditionalControls={[]} // Remove loop button
      customVolumeControls={[]} // Remove volume controls
      showJumpControls={false}
      className="player-small"
      ref={smallPlayerRef}
      src={selectedTrack.preview_url ?? ''}
      customControlsSection={[
        selectedTrack.preview_url ? RHAP_UI.MAIN_CONTROLS : <div key="empty" />,
        <div
          key={selectedTrack.name}
          className="flex flex-col justify-center delay-500 duration-500 ease-out animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards"
        >
          <div className="font-bold">
            <div className="truncate">{selectedTrack.name}</div>
          </div>
          <div className="truncate text-sm text-muted">
            {formatArtists(selectedTrack.artists)}
          </div>
        </div>,
      ]}
      customProgressBarSection={[
        selectedTrack.preview_url ? RHAP_UI.PROGRESS_BAR : <NoPreview />,
      ]}
      onPlaying={handlePlaying}
      onPause={handleClear}
      onEnded={handleClear}
      onAbort={handleClear}
    />
  )
}

const NoPreview = () => (
  <div
    key="no-preview"
    className="px-1 py-5 text-base font-bold text-destructive"
  >
    No track preview available
  </div>
)
