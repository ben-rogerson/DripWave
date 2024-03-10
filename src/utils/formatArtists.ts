import type { Artist, SimplifiedArtist } from '@spotify/web-api-ts-sdk'

export const formatArtists = (artist: Array<Artist | SimplifiedArtist>) =>
  artist.map(a => a.name).join(', ')
