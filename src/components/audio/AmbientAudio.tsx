import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';

/**
 * Ambient soundscape — plays a looped MP3 in /public/audio.
 *
 * Looped playback starts at START_OFFSET (the intro of the track is skipped
 * on first play and on every loop). Toggle from the navbar fades the volume
 * over FADE_MS; pausing the tab fades out and pauses the element.
 */

interface AmbientAudioValue {
  playing: boolean;
  toggle: () => void;
}

const Ctx = createContext<AmbientAudioValue>({
  playing: false,
  toggle: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAmbientAudio = () => useContext(Ctx);

const SRC = '/audio/music-for-sintara-web.mp3';
const START_OFFSET = 53; // seconds — skip intro, loop back here
const TARGET_VOLUME = 0.5;
const FADE_MS = 1400;

export const AmbientAudioProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const playingRef = useRef(false);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(SRC);
    audio.preload = 'auto';
    audio.loop = false; // we loop manually to honour START_OFFSET
    audio.volume = 0;

    const seekToStart = () => {
      try {
        audio.currentTime = START_OFFSET;
      } catch {
        /* metadata not ready yet — handled by loadedmetadata */
      }
    };

    audio.addEventListener('loadedmetadata', seekToStart, { once: true });
    audio.addEventListener('ended', () => {
      audio.currentTime = START_OFFSET;
      if (playingRef.current) audio.play().catch(() => {});
    });

    audioRef.current = audio;
    return audio;
  }, []);

  const fadeTo = useCallback((target: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }

    const startVol = audio.volume;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / FADE_MS);
      // ease-out for a softer landing
      const eased = 1 - (1 - t) * (1 - t);
      audio.volume = Math.max(0, Math.min(1, startVol + (target - startVol) * eased));
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        fadeRafRef.current = null;
        if (target === 0) audio.pause();
      }
    };
    fadeRafRef.current = requestAnimationFrame(tick);
  }, []);

  // Removes the one-shot "first user interaction" listeners (see below).
  const detachAutoplayUnlockRef = useRef<(() => void) | null>(null);

  const seekToOffsetIfNeeded = useCallback((audio: HTMLAudioElement) => {
    if (audio.readyState >= 1 && audio.currentTime < START_OFFSET) {
      audio.currentTime = START_OFFSET;
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = ensureAudio();

    if (playingRef.current) {
      playingRef.current = false;
      setPlaying(false);
      fadeTo(0);
      return;
    }

    audio.muted = false;
    seekToOffsetIfNeeded(audio);
    audio.play().catch(() => {
      /* user gesture should satisfy autoplay policy; bail gracefully */
    });
    playingRef.current = true;
    setPlaying(true);
    fadeTo(TARGET_VOLUME);
    detachAutoplayUnlockRef.current?.();
    detachAutoplayUnlockRef.current = null;
  }, [ensureAudio, fadeTo, seekToOffsetIfNeeded]);

  // Autoplay strategy:
  //   1. Try unmuted autoplay — works when the browser has prior media
  //      engagement (e.g. a regular F5 after the user has interacted).
  //   2. If that's blocked, try muted autoplay — browsers almost always
  //      allow this. The track buffers and plays silently in the
  //      background, and on the first user gesture anywhere on the page
  //      we unmute and fade in (no buffering delay).
  //   3. If even muted autoplay is blocked, wait for a gesture and start
  //      from scratch then.
  useEffect(() => {
    let cancelled = false;
    const audio = ensureAudio();

    const events: Array<keyof DocumentEventMap> = [
      'pointerdown',
      'touchstart',
      'keydown',
      'wheel',
      'scroll',
    ];

    const attachUnlock = (mode: 'unmute' | 'start') => {
      const handler = (e: Event) => {
        // Skip the audio toggle — its own onClick fully handles starting,
        // and double-firing here would flip the state back to paused.
        const t = e.target;
        if (t instanceof Element && t.closest('[data-audio-toggle]')) return;

        if (mode === 'unmute') {
          audio.muted = false;
          if (audio.paused) audio.play().catch(() => {});
        } else {
          audio.muted = false;
          seekToOffsetIfNeeded(audio);
          audio.play().catch(() => {});
        }
        playingRef.current = true;
        setPlaying(true);
        fadeTo(TARGET_VOLUME);
        detachAutoplayUnlockRef.current?.();
        detachAutoplayUnlockRef.current = null;
      };
      events.forEach((ev) =>
        document.addEventListener(ev, handler, { passive: true, once: false }),
      );
      detachAutoplayUnlockRef.current = () => {
        events.forEach((ev) => document.removeEventListener(ev, handler));
      };
    };

    // 1) Try unmuted autoplay.
    audio.muted = false;
    seekToOffsetIfNeeded(audio);
    audio
      .play()
      .then(() => {
        if (cancelled) return;
        playingRef.current = true;
        setPlaying(true);
        fadeTo(TARGET_VOLUME);
      })
      .catch(() => {
        if (cancelled) return;

        // 2) Try muted autoplay so the track is already running silently
        //    by the time the user does anything.
        audio.muted = true;
        seekToOffsetIfNeeded(audio);
        audio
          .play()
          .then(() => {
            if (cancelled) return;
            // Music is buffering & playing silently. Unmute on first gesture.
            attachUnlock('unmute');
          })
          .catch(() => {
            if (cancelled) return;
            // 3) Even muted blocked. Cold-start on first gesture.
            attachUnlock('start');
          });
      });

    return () => {
      cancelled = true;
      detachAutoplayUnlockRef.current?.();
      detachAutoplayUnlockRef.current = null;
    };
  }, [ensureAudio, fadeTo, seekToOffsetIfNeeded]);

  // Pause audio when the tab is hidden, resume on return.
  useEffect(() => {
    const onVis = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden && playingRef.current) {
        fadeTo(0);
      } else if (!document.hidden && playingRef.current) {
        audio.play().catch(() => {});
        fadeTo(TARGET_VOLUME);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [fadeTo]);

  useEffect(() => {
    return () => {
      if (fadeRafRef.current !== null) cancelAnimationFrame(fadeRafRef.current);
      // Pause but don't tear down — Strict Mode in dev remounts this effect,
      // and clearing src would leave the next mount with a dead element.
      audioRef.current?.pause();
    };
  }, []);

  return <Ctx.Provider value={{ playing, toggle }}>{children}</Ctx.Provider>;
};
