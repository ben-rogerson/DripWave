# DripWave

<p><a href="https://dripwave.vercel.app/" target="_blank"><img src="./.github/preview-logo.png" width="300" alt="DripWave Logo" /></a></p>

A web app to search for artists and preview their music.

<p>
    <a href="https://dripwave.vercel.app/" target="_blank"><img src="./.github/preview-large.png" alt="Desktop" height="400" /></a>
    <span></span>
    <a href="https://dripwave.vercel.app/" target="_blank"><img src="./.github/preview-small.png" alt="Mobile" height="400" /></a>
</p>

💧 [dripwave.benrogerson.dev](https://dripwave.benrogerson.dev/)

Early state chart: 📊 [Early DripWave planning @ stately.ai](https://stately.ai/registry/editor/71914a7e-b08d-4032-809f-e9e0acb1892e?mode=Design&machineId=1efcb27a-d19b-42b2-a2ad-b464c6903b08)

This SPA was bootstrapped with [Vite](https://vitejs.dev/) using their React + SWC template.
Track data is grabbed from the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) using the [TS Spotify Web API SDK](https://github.com/spotify/spotify-web-api-ts-sdk).
Data fetching and caching is handled by [TanStack Query](https://tanstack.com/query/v5/).
The responsive UI uses [CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) and is built with [React](https://reactjs.org/) and [TailwindCSS](https://tailwindcss.com/) with animations from [Tailwind CSS Animate](https://github.com/jamiebuilds/tailwindcss-animate).
The app is deployed on [Vercel](https://vercel.com/).

## Features

- [x] Play/Pause track preview
- [x] Time seeking track preview
- [x] Track playing / Top track indicators
- [x] Playback during new search (no interruptions)
- [x] Maintain url state (search keywords + selected track)
- [x] Mobile: Tap a track to play
- [x] Desktop: Single click a track to open the track detail
- [x] Desktop: Double click a track to play

## Future features

- [ ] Add next/previous track buttons
- [ ] Add playlist functionality
- [ ] Switch to Spotify auth
- [ ] Add customized track/artist suggestions
- [ ] Add unit tests for the player
- [ ] Add E2E tests
- [ ] Performance improvements (re-rendering)

## Run this project locally

1. Clone the project:

```shell
npx degit https://github.com/ben-rogerson/DripWave DripWave
```

2. cd into the project and install the dependencies:

```shell
cd $_ && npm install
```

3. Duplicate and rename `env.example` to `.env`.

4. [Create a new Spotify app via the dashboard](https://developer.spotify.com/dashboard/create)<br/>- "App name" and "App description" can be anything<br/>- For "Redirect URI" you can enter `http://localhost:5173/`<br/>- For "Which API/SDKs are you planning to use?", choose `Web API`.

> Note: When trying to add the app, if you see the error: "You need to verify your email address before you can create an app." then [head to the dashboard](https://developer.spotify.com/dashboard) and you’ll see a prompt to start the verification process.

5. Open your new Spotify app, hit "Settings" then "View client secret".

6. Add your "Client ID" and "Client Secret" to your new `.env` file.

7. Then choose one of these tasks:

Start the development server:

```shell
npm run dev
```

Or build and preview the project:

```shell
npm run build
npm run preview
```

## Supported browsers

Tested in:

- Chrome (122)
- Firefox (123.0.1)
- Safari (17)
- Edge (119)

Also tested on mobile Chrome and Safari.

## Technologies

- [Vite](https://vitejs.dev/) - Frontend tooling
- [React](https://reactjs.org/) - Framework
- [Million.js](https://million.dev/) - Faster React compiler
- [Wouter](https://github.com/molefrog/wouter) - Tiny router for React
- [TailwindCSS](https://tailwindcss.com/) - Styling framework
- [TanStack Query](https://tanstack.com/query/v5/) - Data fetching and caching
- [Spotify Web API SDK - TypeScript](https://github.com/spotify/spotify-web-api-ts-sdk) - Data fetching
- [React H5 Audio Player](https://github.com/lhz516/react-h5-audio-player) - Cross browser, A11y supported HTML5 audio player
