# Neon Vinyl

A cyberpunk-themed music player web app built around a record player.

- Spinning vinyl disc with a hand-scattered speckle texture and etched grooves
- Playhead anchored to the top-right corner of the screen — slides onto the record on Play, swings away and the record stops spinning instantly on Pause
- **Pick a folder on your phone** via Android/Chrome's native folder picker — every audio file inside becomes a playlist track automatically
- **Automatic album art**: if the folder contains an image, it becomes the spinning face of the record; otherwise you get a plain black neon-speckled disc
- Frosted-glass panels over a neon particle starfield background
- Full playlist with real audio playback, seek bar, volume, next/prev, and an animated now-playing equalizer indicator
- Fully local — no login, no accounts, no backend, nothing uploaded. Files are read straight from your device via object URLs for the life of the tab

## Develop

```
npm install
npm run dev
```

## Deploy

Import this repo into Vercel — zero configuration required, no environment variables needed.

## Note on folder selection

Browsers don't allow persisting a folder handle across page reloads for privacy reasons (especially on Android), so you'll need to pick the folder again each time you open the app in a fresh tab. Everything else (last volume) still persists.
