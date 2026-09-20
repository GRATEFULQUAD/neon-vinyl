"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleField } from "@/components/ParticleField";
import { RecordPlayer } from "@/components/RecordPlayer";
import { PlayerControls } from "@/components/PlayerControls";
import { Playlist } from "@/components/Playlist";
import { TRACKS } from "@/lib/tracks";

const PARTICLE_COLORS = [
  "255,0,230",
  "255,105,180",
  "255,140,0",
  "255,255,0",
  "57,255,20",
  "255,0,0",
  "0,150,255",
  "0,255,240",
  "64,224,208",
  "191,0,255",
];

const STORAGE_KEY = "neon-vinyl-state-v1";

interface Persisted {
  trackIndex: number;
  volume: number;
}

function loadPersisted(): Persisted {
  if (typeof window === "undefined") return { trackIndex: 0, volume: 0.8 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { trackIndex: 0, volume: 0.8 };
    return { trackIndex: 0, volume: 0.8, ...JSON.parse(raw) };
  } catch {
    return { trackIndex: 0, volume: 0.8 };
  }
}

export default function MusicPlayerPage() {
  const [ready, setReady] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement>(null);
  const track = TRACKS[trackIndex];

  useEffect(() => {
    const persisted = loadPersisted();
    setTrackIndex(persisted.trackIndex);
    setVolume(persisted.volume);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ trackIndex, volume }));
    } catch {
      // ignore
    }
  }, [ready, trackIndex, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  // When the track changes, load the new source and resume playback if it
  // was already playing (e.g. via Next/playlist click).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    audio.load();
    setCurrentTime(0);
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex, ready]);

  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    setTrackIndex((i) => (i + 1) % TRACKS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  const handleSelect = useCallback(
    (i: number) => {
      setTrackIndex(i);
      setIsPlaying(true);
    },
    []
  );

  const handleSeek = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = fraction * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  if (!ready) return null;

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <>
      <ParticleField colors={PARTICLE_COLORS} count={2300} />
      <h1 className="sr-only">Neon Vinyl — Cyberpunk Music Player</h1>

      <div className="player-screen">
        <RecordPlayer track={track} isPlaying={isPlaying} progress={progress} />

        <div className="now-playing" style={{ "--accent": track.color } as React.CSSProperties}>
          <span className="now-playing-title">{track.title}</span>
          <span className="now-playing-artist">{track.artist}</span>
        </div>

        <PlayerControls
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onPrev={handlePrev}
          onNext={handleNext}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={setVolume}
          accentColor={track.color}
        />

        <Playlist tracks={TRACKS} currentIndex={trackIndex} isPlaying={isPlaying} onSelect={handleSelect} />
      </div>

      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleNext}
        preload="metadata"
      />
    </>
  );
}
