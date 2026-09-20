"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleField } from "@/components/ParticleField";
import { RecordPlayer } from "@/components/RecordPlayer";
import { PlayerControls } from "@/components/PlayerControls";
import { Playlist } from "@/components/Playlist";
import {
  buildLibraryFromFiles,
  releaseLibrary,
  accentFor,
  type LocalLibrary,
} from "@/lib/localLibrary";

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

const VOLUME_KEY = "neon-vinyl-volume-v1";

function loadVolume(): number {
  if (typeof window === "undefined") return 0.8;
  const raw = window.localStorage.getItem(VOLUME_KEY);
  const n = raw ? parseFloat(raw) : NaN;
  return Number.isFinite(n) ? n : 0.8;
}

export default function MusicPlayerPage() {
  const [ready, setReady] = useState(false);
  const [library, setLibrary] = useState<LocalLibrary | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<LocalLibrary | null>(null);

  const track = library?.tracks[trackIndex] ?? null;
  const accentColor = track ? accentFor(trackIndex) : "0,255,240";

  useEffect(() => {
    setVolume(loadVolume());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(VOLUME_KEY, String(volume));
  }, [ready, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  // Ask Android/Chrome's native folder picker for a directory, build the
  // playlist + album art from whatever's inside, and start playing.
  const handlePickFolder = useCallback(() => {
    folderInputRef.current?.click();
  }, []);

  const handleFolderChosen = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);

    releaseLibrary(libraryRef.current);
    const next = buildLibraryFromFiles(files);
    libraryRef.current = next;
    setLibrary(next);
    setTrackIndex(0);
    setCurrentTime(0);
    setDuration(0);

    // Reset the input so choosing the same folder again still fires onChange.
    e.target.value = "";
  }, []);

  useEffect(() => {
    return () => releaseLibrary(libraryRef.current);
  }, []);

  // When the track changes, load the new source and resume playback if it
  // was already playing (e.g. via Next/playlist click).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    audio.load();
    setCurrentTime(0);
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex, track?.url]);

  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying, track]);

  const handleNext = useCallback(() => {
    setTrackIndex((i) => (library ? (i + 1) % library.tracks.length : i));
  }, [library]);

  const handlePrev = useCallback(() => {
    setTrackIndex((i) => (library ? (i - 1 + library.tracks.length) % library.tracks.length : i));
  }, [library]);

  const handleSelect = useCallback((i: number) => {
    setTrackIndex(i);
    setIsPlaying(true);
  }, []);

  const handleSeek = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = fraction * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  if (!ready) return null;

  const progress = duration > 0 ? currentTime / duration : 0;
  const hasTracks = !!library && library.tracks.length > 0;

  return (
    <>
      <ParticleField colors={PARTICLE_COLORS} count={2300} />
      <h1 className="sr-only">Neon Vinyl — Cyberpunk Music Player</h1>

      <div className="player-screen">
        <RecordPlayer
          albumArtUrl={library?.albumArtUrl ?? null}
          accentColor={accentColor}
          isPlaying={isPlaying}
          progress={progress}
        />

        <div className="now-playing" style={{ "--accent": accentColor } as React.CSSProperties}>
          <span className="now-playing-title">{track ? track.title : "No track loaded"}</span>
          <span className="now-playing-artist">
            {library ? library.folderName : "Choose a folder to begin"}
          </span>
        </div>

        {hasTracks ? (
          <>
            <div className="folder-bar">
              <span className="folder-bar-name">📁 {library!.folderName}</span>
              <button type="button" className="folder-bar-change" onClick={handlePickFolder}>
                Change Folder
              </button>
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
              accentColor={accentColor}
            />

            <Playlist
              tracks={library!.tracks}
              currentIndex={trackIndex}
              isPlaying={isPlaying}
              onSelect={handleSelect}
            />
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-title">
              {library ? "No audio files found in that folder" : "No music loaded yet"}
            </div>
            <div className="empty-state-sub">
              Pick a folder on your phone — every song inside plays automatically, and any image
              in the folder becomes the album art on the record.
            </div>
            <button type="button" className="folder-picker-btn" onClick={handlePickFolder}>
              📁 Choose Music Folder
            </button>
          </div>
        )}
      </div>

      <input
        ref={folderInputRef}
        type="file"
        multiple
        // @ts-expect-error non-standard attributes needed for the native folder picker
        webkitdirectory=""
        directory=""
        onChange={handleFolderChosen}
        style={{ display: "none" }}
      />

      {track && (
        <audio
          ref={audioRef}
          src={track.url}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={handleNext}
          preload="metadata"
        />
      )}
    </>
  );
}
