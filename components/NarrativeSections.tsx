"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface NarrativeSectionsProps {
  onCommit: (mission: string, name: string) => void;
}

// Hook for intersection observer animation
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element); // Only animate once
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Typewriter effect hook
function useTypewriter(text: string, isActive: boolean, speed = 50, startDelay = 0) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayedText("");
      setIsComplete(false);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    let timeout: NodeJS.Timeout;
    let currentIndex = 0;

    const startTyping = () => {
      const type = () => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
          timeout = setTimeout(type, speed);
        } else {
          setIsComplete(true);
        }
      };
      type();
    };

    timeout = setTimeout(startTyping, startDelay);

    return () => clearTimeout(timeout);
  }, [text, isActive, speed, startDelay]);

  return { displayedText, isComplete };
}

// Sequential typewriter for multiple lines
function TypewriterSequence({
  lines,
  className = "",
  lineClassName = "",
  speed = 40,
  lineDelay = 300,
  startDelay = 0,
  onComplete,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  speed?: number;
  lineDelay?: number;
  startDelay?: number;
  onComplete?: () => void;
}) {
  const { ref, isInView } = useInView(0.3);
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCompletedLines(lines);
      setCurrentLine(lines.length);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const timeout = setTimeout(() => {
      setIsTyping(true);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [isInView, startDelay, lines, onComplete]);

  const handleLineComplete = useCallback(() => {
    setCompletedLines((prev) => [...prev, lines[currentLine]]);

    setTimeout(() => {
      if (currentLine < lines.length - 1) {
        setCurrentLine((prev) => prev + 1);
      } else {
        setIsTyping(false);
        if (onComplete) {
          onComplete();
        }
      }
    }, lineDelay);
  }, [currentLine, lineDelay, lines, onComplete]);

  return (
    <div ref={ref} className={className}>
      {completedLines.map((line, index) => (
        <p key={index} className={lineClassName}>
          {line}
        </p>
      ))}
      {isTyping && currentLine < lines.length && !completedLines.includes(lines[currentLine]) && (
        <p className={lineClassName}>
          <TypewriterInline
            text={lines[currentLine]}
            speed={speed}
            onComplete={handleLineComplete}
          />
        </p>
      )}
    </div>
  );
}

// Inline typewriter (no intersection observer, just types)
function TypewriterInline({
  text,
  speed = 50,
  onComplete,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
}) {
  const { displayedText, isComplete } = useTypewriter(text, true, speed, 0);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (isComplete && onComplete && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-[2px] h-[1em] bg-current ml-[1px] animate-blink align-middle" />
      )}
    </>
  );
}

// Animated text wrapper component
function AnimatedSection({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}) {
  const { ref, isInView } = useInView(0.2);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function NarrativeSections({ onCommit }: NarrativeSectionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(2);
      setIsTransitioning(false);
    }, 600);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(1);
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Page 1: Story & Context */}
      <div
        className={`transition-all duration-600 ease-in-out ${
          currentPage === 1 && !isTransitioning
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-full pointer-events-none absolute inset-0"
        }`}
      >
        {/* Section 1: Context (Museum Label) - Typewriter effect */}
        <section className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-16 gap-16">
          <div className="max-w-xl w-full text-center">
            <div className="font-mono text-sm text-[var(--muted)] tracking-wide">
              <TypewriterSequence
                lines={[
                  "January 25, 2026",
                  "",
                  "Alex Honnold climbed Taipei 101.",
                  "101 floors. 1,667 feet.",
                  "1 hr 31 mins.",
                  "",
                  "No ropes.",
                ]}
                className="space-y-4"
                speed={35}
                lineDelay={400}
                startDelay={500}
              />
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="font-mono text-sm tracking-wider hover:text-[var(--foreground)]
                       transition-all duration-300 py-3 px-8 border border-[#59AEC5]/30
                       hover:border-[var(--foreground)]/50 rounded-sm"
            style={{ color: '#59AEC5' }}
          >
            next →
          </button>
        </section>
      </div>

      {/* Page 2: Commitment */}
      <div
        className={`transition-all duration-600 ease-in-out ${
          currentPage === 2 && !isTransitioning
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full pointer-events-none absolute inset-0"
        }`}
      >
        {/* Section 4: Commitment Form */}
        <section className="min-h-screen flex items-center justify-center px-8 md:px-16 lg:px-24 py-16">
          <div className="w-full max-w-md">
            <AnimatedSection>
              <MissionForm onCommit={onCommit} />
            </AnimatedSection>
          </div>
        </section>

        {/* Back button */}
        <div className="absolute top-8 left-8 md:top-10 md:left-16 lg:left-24">
          <button
            onClick={handleBack}
            className="font-mono text-xs tracking-wider text-[var(--muted)] hover:text-[var(--foreground)]
                       transition-colors duration-300 py-2 px-4"
          >
            ← back
          </button>
        </div>
      </div>
    </div>
  );
}

// Signature Canvas Component
function SignatureCanvas({ onSignatureChange }: { onSignatureChange: (signature: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      onSignatureChange(canvas.toDataURL());
    }
  }, [hasSignature, onSignatureChange]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange("");
  }, [onSignatureChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas context
    ctx.strokeStyle = "currentColor";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }, []);

  return (
    <div className="space-y-2">
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-24 border-b-2 border-[var(--foreground)]/30 cursor-crosshair touch-none"
          style={{ width: "100%", height: "96px" }}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-serif text-sm text-[var(--muted)]/40">
              Sign here
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-[var(--muted)]/60">
          Your signature
        </p>
        {hasSignature && (
          <button
            type="button"
            onClick={clearSignature}
            className="font-mono text-xs text-[var(--muted)] hover:text-[var(--foreground)]
                       transition-colors duration-300"
          >
            clear
          </button>
        )}
      </div>
    </div>
  );
}

function MissionForm({ onCommit }: { onCommit: (mission: string, name: string) => void }) {
  const [signature, setSignature] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mission = formData.get("mission") as string;
    const name = formData.get("name") as string;

    if (mission.trim()) {
      onCommit(mission.trim(), name?.trim() || "");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-12 text-center">
      <p className="font-serif text-lg md:text-xl leading-relaxed">
        What are you going to achieve<br />
        in the next <span className="font-mono text-base">1 hour and 31 minutes</span>?
      </p>

      {/* Paper Note Box - All Fields */}
      <div className="bg-white/5 backdrop-blur-sm border border-[var(--foreground)]/10 rounded-sm p-8 md:p-10 shadow-sm space-y-6">
        {/* Mission Field */}
        <div>
          <label htmlFor="mission" className="sr-only">Your mission</label>
          <textarea
            id="mission"
            name="mission"
            required
            rows={3}
            placeholder="Your mission"
            className="w-full bg-transparent border-none outline-none
                       font-serif text-lg resize-none text-center
                       placeholder:text-[var(--muted)]/50 transition-colors duration-300"
          />
        </div>

        {/* Name and Signature Fields - closer together */}
        <div className="space-y-3 pt-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="sr-only">Your name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              className="w-full bg-transparent border-b border-[var(--foreground)]/20 focus:border-[var(--foreground)]/60
                         outline-none py-2 px-1 font-mono text-xs text-center
                         placeholder:text-[var(--muted)]/50 transition-colors duration-300"
            />
          </div>

          {/* Signature Field */}
          <div>
            <SignatureCanvas onSignatureChange={setSignature} />
          </div>
        </div>
      </div>

      <div className="pt-8">
        <button
          type="submit"
          className="font-mono text-sm tracking-wider text-[var(--accent)] hover:text-[var(--foreground)]
                     transition-colors duration-300 py-2 px-6"
        >
          commit.
        </button>
      </div>
    </form>
  );
}
