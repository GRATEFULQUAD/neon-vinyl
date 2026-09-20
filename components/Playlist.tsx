"use client";

import type { Track } from "@/lib/tracks";

interface PlaylistProps {
  tracks: Track[];
  currentIndex: number;
  isPlaying: boolean;
  onSelect: (index: number) => void;
}

export function Playlist({ tracks, currentIndex, isPlaying, onSelect }: PlaylistProps) {
  return (
    <div className="playlist-panel">
      <div className="playlist-header">
        <span>Playlist</span>
        <span className="playlist-count">{tracks.length} tracks</span>
      </div>
      <div className="playlist-list">
        {tracks.map((track, i) => {
          const active = i === currentIndex;
          return (
            <button
              type="button"
              key={track.id}
              className={`playlist-row ${active ? "playlist-row-active" : ""}`}
              style={{ "--row-color": track.color } as React.CSSProperties}
              onClick={() => onSelect(i)}
            >
              <span className="playlist-row-index">
                {active && isPlaying ? (
                  <span className="playlist-eq">
                    <i /> <i /> <i />
                  </span>
                ) : (
                  (i + 1).toString().padStart(2, "0")
                )}
              </span>
              <span className="playlist-row-info">
                <span className="playlist-row-title">{track.title}</span>
                <span className="playlist-row-artist">{track.artist}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
