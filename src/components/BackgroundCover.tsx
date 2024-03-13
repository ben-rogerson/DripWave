import { TrackImage } from '@/components/TrackImage'
import { usePlayer } from '@/hooks/usePlayer'

/**
 * Full page background cover for the currently playing track.
 * This gives a custom visual effect to each track detail page.
 */
export const BackgroundCover = () => {
  const { selectedTrack } = usePlayer()
  if (!selectedTrack) return

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-50 grid h-full w-full place-content-center opacity-15 mix-blend-screen"
      key={selectedTrack.album.id}
    >
      <TrackImage
        title={selectedTrack.album.name}
        aria-hidden
        className="min-h-[100dvh] scale-[110%] rounded-none blur-md sm:scale-[140%] sm:blur-xl"
        {...selectedTrack.album.images[0]}
      />
    </div>
  )
}
