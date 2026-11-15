"use client";

import { useCallback } from "react";

interface TimerViewProps {
  mission: string;
  name: string;
  signature: string;
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
        className={segments[0] ? "fill-[var(--muted)]" : "fill-[var(--muted)]/5"}
      />
      
      {/* Top-right vertical */}
      <rect
        x={w - t}
        y={g + t}
        width={t}
        height={(h / 2) - t - g * 2}
        className={segments[1] ? "fill-[var(--muted)]" : "fill-[var(--muted)]/5"}
      />
      
      {/* Bottom-right vertical */}
      <rect
        x={w - t}
        y={(h / 2) + g}
        width={t}
        height={(h / 2) - t - g * 2}
        className={segments[2] ? "fill-[var(--muted)]" : "fill-[var(--muted)]/5"}
      />
      
      {/* Bottom horizontal */}
      <rect
        x={g + t}
        y={h - t}
        width={w - 2 * (g + t)}
        height={t}
        className={segments[3] ? "fill-[var(--muted)]" : "fill-[var(--muted)]/5"}
      />
      
      {/* Bottom-left vertical */}
      <rect
        x={0}
        y={(h / 2) + g}
        width={t}
        height={(h / 2) - t - g * 2}
        className={segments[4] ? "fill-[var(--muted)]" : "fill-[var(--muted)]/5"}
      />
      
      {/* Top-left vertical */}
      <rect
        x={0}
        y={g + t}
        width={t}
        height={(h / 2) - t - g * 2}
        className={segments[5] ? "fill-[var(--muted)]" : "fill-[var(--muted)]/5"}
      />
      
      {/* Middle horizontal */}
      <rect
        x={g + t}
        y={(h / 2) - (t / 2)}
        width={w - 2 * (g + t)}
        height={t}
        className={segments[6] ? "fill-[var(--muted)]" : "fill-[var(--muted)]/5"}
      />
    </svg>
  );
}

// Blocky colon
function BlockyColon() {
  return (
    <svg width={24} height={100} viewBox="0 0 24 100" className="block">
      <rect x={7} y={30} width={10} height={10} className="fill-[var(--muted)]" />
      <rect x={7} y={60} width={10} height={10} className="fill-[var(--muted)]" />
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

export default function TimerView({ mission, name, signature, elapsedSeconds, isComplete }: TimerViewProps) {
  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 bg-[var(--background)] z-40">
      {/* Mission display - subtle */}
      {!isComplete && mission && (
        <div className="absolute top-12 left-0 right-0 text-left px-8 md:px-16 lg:px-24">
          <p className="font-mono text-xs text-[var(--muted)]/60 max-w-md truncate">
            {name && <span className="mr-2">{name}:</span>}
            {mission}
          </p>
        </div>
      )}

      <div className="relative">
        {!isComplete ? (
          <div className="scale-[0.5] sm:scale-75 md:scale-100 lg:scale-125 origin-left">
            <time dateTime={`PT${elapsedSeconds}S`}>
              <BlockyDisplay time={formatTime(elapsedSeconds)} />
            </time>
          </div>
        ) : (
          <div className="text-left space-y-10 max-w-2xl">
            <div className="space-y-4">
              <p className="font-mono text-sm text-[var(--muted)] tracking-wide">
                Mission accomplished
              </p>
              <p className="font-mono text-sm text-[#59AEC5] tracking-wide">
                1 hour and 31 minutes.
              </p>
            </div>
            {mission && (
              <div className="space-y-6 mt-4">
                {/* Mission */}
                <div>
                  <p className="font-mono text-base md:text-lg text-left">
                    {mission}
                  </p>
                </div>

                {/* Name and Signature */}
                <div className="space-y-3 pt-4">
                  {/* Name */}
                  {name && (
                    <div className="space-y-2">
                      <div className="border-b border-[var(--foreground)]/20 py-2 px-1">
                        <p className="font-mono text-xs text-left">{name}</p>
                      </div>
                      <p className="font-mono text-xs text-[var(--muted)]/60 text-left">
                        Your name
                      </p>
                    </div>
                  )}

                  {/* Signature */}
                  {signature && (
                    <div className="space-y-2">
                      <div className="border-b border-[var(--foreground)]/20 h-24 flex items-center justify-start">
                        <img src={signature} alt="Signature" className="max-h-20 max-w-full" />
                      </div>
                      <p className="font-mono text-xs text-[var(--muted)]/60 text-left">
                        Your signature
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Tiny footer */}
      <footer className="absolute bottom-6 left-0 right-0 text-left px-8 md:px-16 lg:px-24">
        <p className="font-mono text-[10px] text-[var(--muted)]/40">
          Inspired by Alex Honnold · Taipei 101 · January 25, 2026
        </p>
      </footer>
    </div>
  );
}

export { TOTAL_SECONDS };
