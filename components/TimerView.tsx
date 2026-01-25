"use client";

import { useCallback } from "react";

interface TimerViewProps {
  mission: string;
  name: string;
  elapsedSeconds: number;
  isComplete: boolean;
}

const TOTAL_SECONDS = 5460; // 1 hour 31 minutes = 91 minutes = 5460 seconds

// Blocky LCD segment patterns for digits 0-9
// Pattern: [top, topRight, bottomRight, bottom, bottomLeft, topLeft, middle]
const SEGMENTS: Record<string, boolean[]> = {
  "0": [true, true, true, true, true, true, false],
  "1": [false, true, true, false, false, false, false],
  "2": [true, true, false, true, true, false, true],
  "3": [true, true, true, true, false, false, true],
  "4": [false, true, true, false, false, true, true],
  "5": [true, false, true, true, false, true, true],
  "6": [true, false, true, true, true, true, true],
  "7": [true, true, true, false, false, false, false],
  "8": [true, true, true, true, true, true, true],
  "9": [true, true, true, true, false, true, true],
};

// Blocky LCD digit - matches reference image style
function BlockyDigit({ digit }: { digit: string }) {
  const segments = SEGMENTS[digit] || SEGMENTS["0"];
  
  // Dimensions for blocky LCD look
  const w = 60;  // total width
  const h = 100; // total height
  const t = 10;  // segment thickness
  const g = 3;   // gap between segments
  
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      {/* Top horizontal */}
      <rect
        x={g + t}
        y={0}
        width={w - 2 * (g + t)}
        height={t}
        className={segments[0] ? "fill-[var(--foreground)]" : "fill-[var(--foreground)]/5"}
      />
      
      {/* Top-right vertical */}
      <rect
        x={w - t}
        y={g + t}
        width={t}
        height={(h / 2) - t - g * 2}
        className={segments[1] ? "fill-[var(--foreground)]" : "fill-[var(--foreground)]/5"}
      />
      
      {/* Bottom-right vertical */}
      <rect
        x={w - t}
        y={(h / 2) + g}
        width={t}
        height={(h / 2) - t - g * 2}
        className={segments[2] ? "fill-[var(--foreground)]" : "fill-[var(--foreground)]/5"}
      />
      
      {/* Bottom horizontal */}
      <rect
        x={g + t}
        y={h - t}
        width={w - 2 * (g + t)}
        height={t}
        className={segments[3] ? "fill-[var(--foreground)]" : "fill-[var(--foreground)]/5"}
      />
      
      {/* Bottom-left vertical */}
      <rect
        x={0}
        y={(h / 2) + g}
        width={t}
        height={(h / 2) - t - g * 2}
        className={segments[4] ? "fill-[var(--foreground)]" : "fill-[var(--foreground)]/5"}
      />
      
      {/* Top-left vertical */}
      <rect
        x={0}
        y={g + t}
        width={t}
        height={(h / 2) - t - g * 2}
        className={segments[5] ? "fill-[var(--foreground)]" : "fill-[var(--foreground)]/5"}
      />
      
      {/* Middle horizontal */}
      <rect
        x={g + t}
        y={(h / 2) - (t / 2)}
        width={w - 2 * (g + t)}
        height={t}
        className={segments[6] ? "fill-[var(--foreground)]" : "fill-[var(--foreground)]/5"}
      />
    </svg>
  );
}

// Blocky colon
function BlockyColon() {
  return (
    <svg width={24} height={100} viewBox="0 0 24 100" className="block">
      <rect x={7} y={30} width={10} height={10} className="fill-[var(--foreground)]" />
      <rect x={7} y={60} width={10} height={10} className="fill-[var(--foreground)]" />
    </svg>
  );
}

function BlockyDisplay({ time }: { time: string }) {
  const parts = time.split(":");
  const [hours, minutes, seconds] = parts.length === 3 ? parts : ["00", parts[0], parts[1]];
  
  return (
    <div className="flex items-center">
      {/* Hours */}
      <div className="flex gap-1">
        <BlockyDigit digit={hours[0]} />
        <BlockyDigit digit={hours[1]} />
      </div>
      <BlockyColon />
      {/* Minutes */}
      <div className="flex gap-1">
        <BlockyDigit digit={minutes[0]} />
        <BlockyDigit digit={minutes[1]} />
      </div>
      <BlockyColon />
      {/* Seconds */}
      <div className="flex gap-1">
        <BlockyDigit digit={seconds[0]} />
        <BlockyDigit digit={seconds[1]} />
      </div>
    </div>
  );
}

export default function TimerView({ mission, name, elapsedSeconds, isComplete }: TimerViewProps) {
  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--background)] z-40">
      {/* Mission display - subtle */}
      {mission && (
        <div className="absolute top-12 left-0 right-0 text-center px-6 sm:left-6 sm:right-auto sm:text-left">
          <p className="font-mono text-xs text-[var(--muted)]/60 max-w-md truncate">
            {name && <span className="mr-2">{name}:</span>}
            {mission}
          </p>
        </div>
      )}

      {/* Timer - offset slightly for gallery feel */}
      <div className="relative ml-0 sm:ml-[-5%] md:ml-[-15%] lg:ml-[-20%]">
        {!isComplete ? (
          <div className="scale-[0.5] sm:scale-75 md:scale-100 lg:scale-125 origin-center">
            <time dateTime={`PT${elapsedSeconds}S`}>
              <BlockyDisplay time={formatTime(elapsedSeconds)} />
            </time>
          </div>
        ) : (
          <div className="text-center space-y-10 max-w-2xl px-8">
            <div className="space-y-4">
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium">
                You made it.
              </p>
              <p className="font-serif text-xl md:text-2xl text-[var(--muted)]">
                1 hour and 31 minutes.
              </p>
            </div>
            {mission && (
              <div className="pt-4 border-t border-[var(--foreground)]/10">
                <p className="font-mono text-xs text-[var(--muted)]/60 mb-2">
                  Your mission
                </p>
                <p className="font-serif text-base md:text-lg">
                  {mission}
                </p>
              </div>
            )}
            <div className="space-y-3 pt-8">
              <p className="font-serif text-sm md:text-base text-[var(--muted)]/80">
                Same time as Alex Honnold climbing Taipei 101.
              </p>
              <p className="font-serif text-sm md:text-base text-[var(--muted)]/80">
                Different climb. Same commitment.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Tiny footer */}
      <footer className="absolute bottom-6 left-6 right-0">
        <p className="font-mono text-[10px] text-[var(--muted)]/40">
          Inspired by Alex Honnold · Taipei 101 · January 25, 2026
        </p>
      </footer>
    </div>
  );
}

export { TOTAL_SECONDS };
