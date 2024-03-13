import type { SimplifiedArtist } from '@spotify/web-api-ts-sdk'

/**
 * Format artists into a string.
 * @param artist - The artist or artists to format.
 * @returns The formatted string.
 */
export const formatArtists = (artist: SimplifiedArtist[]) =>
  artist.map(a => a.name).join(', ')
