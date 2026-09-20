export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  color: string; // "r,g,b" — neon accent for this track's label + glow
}

// Demo playlist (royalty-free library tracks) — swap `src` for your own
// hosted MP3 URLs any time; everything else (UI, tonearm, progress) just works.
export const TRACKS: Track[] = [
  {
    id: "1",
    title: "Izzamuzzic",
    artist: "Neon Vinyl Radio",
    src: "https://assets.galaxy.ai/galaxymainsiteexamples/video/remotion/bg-music/bg-music-1.mp3",
    color: "0,255,240",
  },
  {
    id: "2",
    title: "Motion",
    artist: "Neon Vinyl Radio",
    src: "https://assets.galaxy.ai/galaxymainsiteexamples/video/remotion/bg-music/bg-music-6.mp3",
    color: "255,0,230",
  },
  {
    id: "3",
    title: "Gongs",
    artist: "Neon Vinyl Radio",
    src: "https://assets.galaxy.ai/galaxymainsiteexamples/video/remotion/bg-music/bg-music-3.mp3",
    color: "150,90,255",
  },
  {
    id: "4",
    title: "Snowfall",
    artist: "Neon Vinyl Radio",
    src: "https://assets.galaxy.ai/galaxymainsiteexamples/video/remotion/bg-music/bg-music-5.mp3",
    color: "90,235,110",
  },
  {
    id: "5",
    title: "Stomp",
    artist: "Neon Vinyl Radio",
    src: "https://assets.galaxy.ai/galaxymainsiteexamples/video/remotion/bg-music/bg-music-8.mp3",
    color: "255,140,0",
  },
];
