import { useEffect, useRef, useState } from 'react'
import type { SdkOptions } from '@spotify/web-api-ts-sdk'
import {
  SpotifyApi,
  AuthorizationCodeWithPKCEStrategy,
} from '@spotify/web-api-ts-sdk'

export function useSpotify(
  clientId: string,
  redirectUrl: string,
  scopes: string[],
  config?: SdkOptions
) {
  const [sdk, setSdk] = useState<SpotifyApi>()
  const { current: activeScopes } = useRef(scopes)

  useEffect(() => {
    // ;(() => {
    try {
      const auth = new AuthorizationCodeWithPKCEStrategy(
        clientId,
        redirectUrl,
        activeScopes
      )
      const internalSdk = new SpotifyApi(auth, config)
      setSdk(() => internalSdk)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      console.error(msg)
    }
    // try {
    //   const { authenticated } = await internalSdk.authenticate()

    //   if (authenticated) {
    //     setSdk(() => internalSdk)
    //   }
    // } catch (e: unknown) {
    //   const error = e as Error
    //   if (
    //     error.message &&
    //     error.message.includes('No verifier found in cache')
    //   ) {
    //     console.error(
    //       "If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
    //       error
    //     )
    //   } else {
    //     console.error(e)
    //   }
    // }
    // })()
  }, [clientId, redirectUrl, config, activeScopes])

  return sdk
}
