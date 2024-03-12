import {
  useEffect,
  useRef,
  useState,
  createContext,
  type ReactNode,
} from 'react'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import type { SdkOptions } from '@spotify/web-api-ts-sdk'

interface SpotifyContextType {
  sdk: ReturnType<typeof useSpotify>
}

export const SpotifyProvider = (props: { children: ReactNode }) => {
  const sdk = useSpotify(
    String(import.meta.env.VITE_SPOTIFY_CLIENT_ID),
    String(import.meta.env.VITE_SPOTIFY_SECRET_ID),
    [] // Scopes are not required for this app
  )

  // TODO: Validate meta.env

  return (
    <SpotifyContext.Provider value={{ sdk }}>
      {props.children}
    </SpotifyContext.Provider>
  )
}

export const SpotifyContext = createContext<SpotifyContextType | null>(null)

const useSpotify = (
  clientId: string,
  secretId: string,
  scopes: string[],
  config?: SdkOptions
) => {
  const [sdk, setSdk] = useState<SpotifyApi>()
  const { current: activeScopes } = useRef(scopes)

  useEffect(() => {
    try {
      const spotifySDK = SpotifyApi.withClientCredentials(
        clientId,
        secretId,
        activeScopes
      )
      setSdk(() => spotifySDK)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      console.error(msg)
    }
  }, [clientId, config, activeScopes, secretId])

  return sdk
}
