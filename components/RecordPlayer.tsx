"use client";

import { useMemo } from "react";

interface RecordPlayerProps {
  albumArtUrl: string | null;
  accentColor: string;
  isPlaying: boolean;
  progress: number; // 0..1
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate a stable set of tiny speckle dots scattered across the vinyl
// surface, like flecks baked into colored vinyl pressings. Only used on the
// plain black disc (no album art supplied).
function useSpeckles(seed: number, count: number) {
  return useMemo(() => {
    const rand = mulberry32(seed);
    const speckles: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const dist = Math.sqrt(rand()) * 48; // keep within the disc radius (50%)
      speckles.push({
        x: 50 + Math.cos(angle) * dist,
        y: 50 + Math.sin(angle) * dist,
        r: rand() * 0.9 + 0.3,
        o: rand() * 0.5 + 0.25,
      });
    }
    return speckles;
  }, [seed, count]);
}

// Resting angle keeps the playhead swung away, off the disc, near its cradle.
// Playing angle swings it onto the record; it creeps further inward as the
// track progresses, mimicking a needle tracking toward the label.
const REST_ANGLE = -8;
const PLAY_ANGLE = 42;
const MAX_CREEP = 8;

export function RecordPlayer({ albumArtUrl, accentColor, isPlaying, progress }: RecordPlayerProps) {
  const speckles = useSpeckles(7, 140);
  const angle = isPlaying ? PLAY_ANGLE + progress * MAX_CREEP : REST_ANGLE;

  return (
    <div className="turntable">
      <div className="turntable-plinth">
        <div
          className={`vinyl-disc ${isPlaying ? "vinyl-spinning" : ""} ${albumArtUrl ? "vinyl-disc-art" : ""}`}
          style={
            {
              "--track-color": accentColor,
              backgroundImage: albumArtUrl ? `url(${albumArtUrl})` : undefined,
            } as React.CSSProperties
          }
        >
          {!albumArtUrl && (
            <>
              <svg viewBox="0 0 100 100" className="vinyl-grooves" aria-hidden="true">
                {Array.from({ length: 16 }).map((_, i) => (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r={12 + i * 2.2}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="0.35"
                  />
                ))}
              </svg>
              <svg viewBox="0 0 100 100" className="vinyl-speckles" aria-hidden="true">
                {speckles.map((s, i) => (
                  <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={`rgba(var(--track-color),${s.o})`} />
                ))}
              </svg>
            </>
          )}
          {albumArtUrl && (
            <svg viewBox="0 0 100 100" className="vinyl-grooves vinyl-grooves-art" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={38 - i * 3.2}
                  fill="none"
                  stroke="rgba(0,0,0,0.18)"
                  strokeWidth="0.4"
                />
              ))}
            </svg>
          )}
          <div className="vinyl-spindle" />
        </div>

        <div className="tonearm-pivot" style={{ transform: `rotate(${angle}deg)` }}>
          <div className="tonearm-base" />
          <div className="tonearm-arm">
            <div className="tonearm-head" />
          </div>
        </div>
      </div>
    </div>
  );
}
