import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Experience } from '@/components/Experience'
import { PlayerProvider } from '@/context/player'
import { ArtistTracksProvider } from '@/context/artistTracks'
import { SpotifyProvider } from '@/context/spotify'
import { AlbumTracksProvider } from '@/context/albumTracks'
import { AppError } from '@/components/AppError'

const queryClient = new QueryClient()

function App() {
  return (
    <div className="text-foreground">
      <ErrorBoundary fallbackRender={AppError}>
        <PlayerProvider>
          <SpotifyProvider>
            <QueryClientProvider client={queryClient}>
              <ArtistTracksProvider>
                <AlbumTracksProvider>
                  <Experience />
                </AlbumTracksProvider>
              </ArtistTracksProvider>
            </QueryClientProvider>
          </SpotifyProvider>
        </PlayerProvider>
      </ErrorBoundary>
    </div>
  )
}

export default App
