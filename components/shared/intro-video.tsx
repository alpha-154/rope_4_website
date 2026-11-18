"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2 } from "lucide-react";

// sessionStorage lives for the lifetime of the browser tab: it survives client-side
// navigation and hard refreshes, and is cleared when the tab/browser is closed.
// So the intro plays once each time the website is freshly opened.
const STORAGE_KEY = "rope4_intro_shown";
const DISPLAY_MS = 4500;
const TITLE = "Adventure Awaits.";
const TYPE_SPEED_MS = 110;
const EXIT_MS = 800;

/**
 * Inline <head> script (see app/layout.tsx). Runs before the first paint and marks
 * the document so the server-rendered `.intro-cover` hides the page immediately,
 * instead of the page flashing until React hydrates and mounts the intro.
 * Keep the storage key in sync with STORAGE_KEY.
 */
export const INTRO_GATE_SCRIPT = `try{if(sessionStorage.getItem("${STORAGE_KEY}")!=="1"){document.documentElement.setAttribute("data-intro","pending")}}catch(e){}`;

function shouldShowIntro(): boolean {
  // The gate script already decided before paint; fall back to storage if it was blocked.
  if (document.documentElement.getAttribute("data-intro") === "pending")
    return true;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    // Storage blocked (privacy mode etc.): skip rather than replay on every refresh.
    return false;
  }
}

/** Remove the pre-paint cover (the intro overlay, if any, sits above it). */
function releaseCover() {
  document.documentElement.removeAttribute("data-intro");
}

function markShown() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

// Browser user-activation events (scroll/wheel do not count for autoplay).
const ACTIVATION_EVENTS = ["pointerdown", "keydown", "touchend"] as const;

/**
 * Full-screen intro shown once per browser session (each fresh opening of the
 * site; not on in-app navigation or refresh). Decided in an effect, so the
 * server and first client render both output nothing (no hydration mismatch).
 *
 * Sound: browsers only allow unmuted autoplay after the visitor has interacted
 * with the page. We try with sound first; if the browser refuses, the video
 * plays muted, a "Tap for sound" hint appears, and the first click/tap/key
 * unmutes it and restarts the display window so the audio is actually heard.
 */
export function IntroVideo() {
  /** Intro is running (title typing, scroll locked). */
  const [visible, setVisible] = useState(false);
  /** Overlay is in the DOM; stays true during the fade-out after `visible` ends. */
  const [mounted, setMounted] = useState(false);
  const [typed, setTyped] = useState("");
  const [needsTap, setNeedsTap] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const shownRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const scheduleHide = (ms: number) => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setVisible(false), ms);
  };

  // Decide on mount (the pre-paint cover is already hiding the page if we show).
  useEffect(() => {
    if (!shouldShowIntro()) {
      releaseCover();
      return;
    }
    markShown();
    setMounted(true);
    setVisible(true);
  }, []);

  // Intro finished: drop the cover so the overlay's fade-out reveals the page, then
  // unmount after the CSS transition. A timer (not animation frames) drives removal,
  // so the overlay can never get stuck in a background tab where rAF is paused.
  // Only after the overlay has actually been on screen, never on the initial mount pass.
  useEffect(() => {
    if (visible) {
      shownRef.current = true;
      return;
    }
    if (!shownRef.current) return;
    releaseCover();
    const t = window.setTimeout(() => setMounted(false), EXIT_MS + 50);
    return () => window.clearTimeout(t);
  }, [visible]);

  // Play with sound if allowed; otherwise play muted and unmute on first interaction.
  useEffect(() => {
    if (!mounted) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const removeListeners = () =>
      ACTIVATION_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, enableSound, true)
      );

    function enableSound() {
      removeListeners();
      if (cancelled || !video) return;
      video.muted = false;
      video.volume = 1;
      video
        .play()
        .then(() => {
          if (cancelled) return;
          setNeedsTap(false);
          // Give the visitor a full window to hear the intro with sound.
          scheduleHide(DISPLAY_MS);
        })
        .catch(() => {
          video.muted = true;
        });
    }

    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {
      if (cancelled) return;
      // Unmuted autoplay blocked by the browser: start muted, wait for a gesture.
      video.muted = true;
      video.play().catch(() => {
        /* video missing: overlay still shows the title */
      });
      setNeedsTap(true);
      ACTIVATION_EVENTS.forEach((ev) =>
        window.addEventListener(ev, enableSound, { capture: true, once: false })
      );
    });

    return () => {
      cancelled = true;
      removeListeners();
      video.pause();
    };
  }, [mounted]);

  // Typewriter + auto-dismiss + scroll lock.
  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let i = 0;
    const typer = window.setInterval(() => {
      i += 1;
      setTyped(TITLE.slice(0, i));
      if (i >= TITLE.length) window.clearInterval(typer);
    }, TYPE_SPEED_MS);
    scheduleHide(DISPLAY_MS);

    return () => {
      window.clearInterval(typer);
      window.clearTimeout(hideTimer.current);
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

  return (
    mounted && (
      <div
        className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-[opacity,transform] ease-in-out ${
          visible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-[1.04] pointer-events-none"
        }`}
        style={{ transitionDuration: `${EXIT_MS}ms` }}
        aria-hidden={!visible}
      >
        <video
          ref={videoRef}
          onPlaying={() => setVideoReady(true)}
          className={`absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          src="/footer-bg.mp4"
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        <h1 className="relative px-6 text-center font-montserrat font-extrabold tracking-tight text-white text-4xl sm:text-6xl lg:text-7xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          {typed}
          <span className="ml-1 inline-block w-[3px] h-[0.9em] align-[-0.08em] bg-white animate-pulse" />
        </h1>
        <AnimatePresence>
          {needsTap && (
            <motion.div
              key="tap-for-sound"
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30 cursor-pointer select-none"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Volume2 className="h-4 w-4 animate-pulse" aria-hidden="true" />
              <span>Tap anywhere for sound</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  );
}
