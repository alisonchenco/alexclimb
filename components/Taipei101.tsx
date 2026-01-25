"use client";

import { useEffect, useState } from "react";

interface Taipei101Props {
  isTimerActive: boolean;
  elapsedSeconds?: number;
  isComplete?: boolean;
}

const TOTAL_SECONDS = 5460; // 91 minutes = 1h31m

export default function Taipei101({ isTimerActive, elapsedSeconds = 0, isComplete = false }: Taipei101Props) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [lastReducedMotionUpdate, setLastReducedMotionUpdate] = useState(0);
  const [reducedMotionProgress, setReducedMotionProgress] = useState(0);

  // Calculate progress from elapsed seconds (single source of truth)
  const progress = Math.min(elapsedSeconds / TOTAL_SECONDS, 1);
  const hasReachedTop = elapsedSeconds >= TOTAL_SECONDS;

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle reduced motion updates (every ~10 seconds)
  useEffect(() => {
    if (!prefersReducedMotion || !isTimerActive) return;

    const now = Date.now();
    if (now - lastReducedMotionUpdate >= 10000) {
      setReducedMotionProgress(progress);
      setLastReducedMotionUpdate(now);
    }
  }, [prefersReducedMotion, isTimerActive, progress, lastReducedMotionUpdate]);

  // Calculate Alex's position on the building
  // At progress=0: at the bottom of the building (1%)
  // At progress=1: at the top (88%)
  const effectiveProgress = prefersReducedMotion ? reducedMotionProgress : progress;
  // Alex climbs from bottom (1%) to top (88%) of the container height
  const climbPercent = effectiveProgress * 87; // 0 to 87, then add 1 = 1% to 88%

  return (
    <>
      {/* Desktop: Right-side anchor */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-[35vw] md:w-[28vw] lg:w-[22vw] 
                    overflow-hidden pointer-events-none z-[60]
                    transition-opacity duration-1000
                    ${isTimerActive ? "opacity-100" : "opacity-40"}`}
        aria-hidden="true"
      >
        {/* Building container */}
        <div className="relative w-full h-full flex items-end justify-center">
          {/* Taipei 101 Image */}
          <img
            src="/taipei101.svg"
            alt=""
            className="h-[90%] w-auto max-w-full object-contain object-bottom"
          />

          {/* Alex climbing or at the top */}
          {isTimerActive && (
            <div
              className="absolute left-1/2 z-20"
              style={{
                bottom: hasReachedTop ? "88%" : `${1 + climbPercent}%`,
                width: hasReachedTop ? "6%" : "8%",
                transform: hasReachedTop ? "translateX(calc(-50% + 1px))" : "translateX(-50%)",
                transition: prefersReducedMotion ? "none" : "bottom 1s linear, width 1s linear",
              }}
            >
              <div className={prefersReducedMotion || hasReachedTop ? "" : "animate-climb-wiggle"}>
                <img
                  src={hasReachedTop ? "/missionaccomplished.svg" : "/alex.svg"}
                  alt=""
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
