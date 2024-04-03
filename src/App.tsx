import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { DefaultView } from '@/components/DefaultView'
import { PlayerProvider } from '@/context/player'
import { ArtistTracksProvider } from '@/context/artistTracks'
import { SpotifyProvider } from '@/context/spotify'
import { AlbumTracksProvider } from '@/context/albumTracks'
import { BreakpointProvider } from '@/context/breakpointProvider'
import { AppError } from '@/components/AppError'

const queryClient = new QueryClient()

const App = () => (
  <ErrorBoundary fallbackRender={AppError}>
    <BreakpointProvider>
      <SpotifyProvider>
        <PlayerProvider>
          <QueryClientProvider client={queryClient}>
            <ArtistTracksProvider>
              <AlbumTracksProvider>
                <DefaultView />
              </AlbumTracksProvider>
            </ArtistTracksProvider>
          </QueryClientProvider>
        </PlayerProvider>
      </SpotifyProvider>
    </BreakpointProvider>
  </ErrorBoundary>
)

export default App
