"use client";

import { useState, useEffect, useCallback } from "react";
import NarrativeSections from "@/components/NarrativeSections";
import TimerView from "@/components/TimerView";
import Taipei101 from "@/components/Taipei101";

type AppState = "narrative" | "timer" | "complete";

const TOTAL_SECONDS = 5460; // 91 minutes = 1h31m

export default function Home() {
  const [appState, setAppState] = useState<AppState>("narrative");
  const [mission, setMission] = useState("");
  const [name, setName] = useState("");
  const [signature, setSignature] = useState("");
  const [isFading, setIsFading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Lock scroll when timer is active
  useEffect(() => {
    if (appState === "timer" || appState === "complete") {
      document.documentElement.classList.add("scroll-locked");
    } else {
      document.documentElement.classList.remove("scroll-locked");
    }

    return () => {
      document.documentElement.classList.remove("scroll-locked");
    };
  }, [appState]);

  // Timer logic - single source of truth for elapsed time
  useEffect(() => {
    if (appState !== "timer") return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= TOTAL_SECONDS) {
          setAppState("complete");
          return TOTAL_SECONDS;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [appState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only work during timer phase
      if (appState !== "timer" && appState !== "complete") return;

      switch (e.key) {
        case "ArrowUp":
          // Jump forward 1 minute
          setElapsedSeconds((prev) => Math.min(prev + 60, TOTAL_SECONDS));
          break;
        case "ArrowDown":
          // Jump back 1 minute
          setElapsedSeconds((prev) => Math.max(prev - 60, 0));
          break;
        case "e":
        case "E":
          // Jump to end
          setElapsedSeconds(TOTAL_SECONDS);
          setAppState("complete");
          break;
        case "s":
        case "S":
          // Restart - jump to start
          setElapsedSeconds(0);
          setAppState("timer");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appState]);

  // Persist mission to localStorage
  useEffect(() => {
    if (mission) {
      localStorage.setItem("climb-mission", mission);
      if (name) {
        localStorage.setItem("climb-name", name);
      }
      if (signature) {
        localStorage.setItem("climb-signature", signature);
      }
    }
  }, [mission, name, signature]);

  // Load persisted mission on mount (optional - for showing what was committed)
  useEffect(() => {
    const savedMission = localStorage.getItem("climb-mission");
    const savedName = localStorage.getItem("climb-name");
    const savedSignature = localStorage.getItem("climb-signature");
    if (savedMission) {
      setMission(savedMission);
    }
    if (savedName) {
      setName(savedName);
    }
    if (savedSignature) {
      setSignature(savedSignature);
    }
  }, []);

  const handleCommit = useCallback((missionText: string, nameText: string, signatureText: string) => {
    setMission(missionText);
    setName(nameText);
    setSignature(signatureText);
    setIsFading(true);
    setElapsedSeconds(0); // Reset timer on new commit

    // Smooth transition to timer
    setTimeout(() => {
      setAppState("timer");
      setIsFading(false);
    }, 800);
  }, []);

  return (
    <main className="relative min-h-screen bg-[var(--background)]">
      {/* Taipei 101 visual with Alex climbing - always present */}
      <Taipei101
        isTimerActive={appState === "timer" || appState === "complete"}
        elapsedSeconds={elapsedSeconds}
        isComplete={appState === "complete"}
      />

      {/* Narrative sections */}
      <div
        className={`transition-opacity duration-700 ${
          appState === "narrative" && !isFading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <NarrativeSections onCommit={handleCommit} />
      </div>

      {/* Timer view */}
      {(appState === "timer" || appState === "complete") && (
        <TimerView
          mission={mission}
          name={name}
          signature={signature}
          elapsedSeconds={elapsedSeconds}
          isComplete={appState === "complete"}
        />
      )}
    </main>
  );
}
