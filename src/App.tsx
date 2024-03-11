import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Experience } from '@/Experience'
import { PlayerProvider } from '@/context/player'
import { ArtistTracksProvider } from '@/context/artistTracks'
import { SpotifyProvider } from '@/context/spotify'
import { AlbumTracksProvider } from '@/context/albumTracks'

const queryClient = new QueryClient()

function App() {
  return (
    <ErrorBoundary fallback={<p>⚠️ Something went wrong</p>}>
      <QueryClientProvider client={queryClient}>
        <PlayerProvider>
          <SpotifyProvider>
            <ArtistTracksProvider>
              <AlbumTracksProvider>
                <Experience />
              </AlbumTracksProvider>
            </ArtistTracksProvider>
          </SpotifyProvider>
        </PlayerProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
