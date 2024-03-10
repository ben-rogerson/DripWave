import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Experience } from '@/Experience'

const queryClient = new QueryClient()

function App() {
  return (
    <ErrorBoundary fallback={<p>⚠️ Something went wrong</p>}>
      <QueryClientProvider client={queryClient}>
        <Experience />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
