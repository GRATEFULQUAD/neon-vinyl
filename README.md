# Neon Vinyl

A cyberpunk-themed music player web app built around a record player.

- Spinning vinyl disc with a hand-scattered speckle texture and etched grooves
- Tonearm anchored to the top-right corner — slides onto the record on Play, swings away and the record stops spinning instantly on Pause
- Frosted-glass panels over a neon particle starfield background
- Full playlist with real audio playback, seek bar, volume, next/prev, and an animated now-playing equalizer indicator
- Fully local — no login, no accounts, no backend. Last track + volume persist via localStorage

The default playlist uses royalty-free demo tracks so the player works out of the box — swap `lib/tracks.ts` for your own hosted MP3 URLs and cover colors any time.

## Develop

```
npm install
npm run dev
```

## Deploy

Import this repo into Vercel — zero configuration required, no environment variables needed.
