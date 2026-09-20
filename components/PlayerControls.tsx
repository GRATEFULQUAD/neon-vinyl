"use client";

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentTime: number;
  duration: number;
  onSeek: (fraction: number) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  accentColor: string;
}

function formatClock(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerControls({
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  accentColor,
}: PlayerControlsProps) {
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="controls-panel" style={{ "--accent": accentColor } as React.CSSProperties}>
      <div
        className="seek-bar"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const fraction = (e.clientX - rect.left) / rect.width;
          onSeek(Math.min(1, Math.max(0, fraction)));
        }}
      >
        <div className="seek-fill" style={{ width: `${progress * 100}%` }} />
        <div className="seek-thumb" style={{ left: `${progress * 100}%` }} />
      </div>
      <div className="seek-times">
        <span>{formatClock(currentTime)}</span>
        <span>{formatClock(duration)}</span>
      </div>

      <div className="transport-row">
        <button type="button" className="transport-btn" onClick={onPrev} aria-label="Previous track">
          ⏮
        </button>
        <button
          type="button"
          className="transport-btn transport-btn-main"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <button type="button" className="transport-btn" onClick={onNext} aria-label="Next track">
          ⏭
        </button>
      </div>

      <div className="volume-row">
        <span className="volume-icon">🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="volume-slider"
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
