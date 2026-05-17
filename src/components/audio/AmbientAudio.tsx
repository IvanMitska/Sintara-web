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
 * Ambient soundscape — a procedurally generated drone (Web Audio API),
 * used as a royalty-free placeholder for the Lusion-style audio toggle.
 *
 * To swap in a real track later: drop a file in /public, and replace the
 * oscillator graph in `buildGraph` with an <audio> / MediaElementSource.
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

const TARGET_GAIN = 0.16;
// A minor pad: root, minor third, fifth, octave (Hz)
const VOICES = [110, 130.81, 164.81, 220];

export const AmbientAudioProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  const buildGraph = useCallback(() => {
    const AC =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    // Gentle lowpass to keep the drone soft
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 620;
    filter.Q.value = 0.6;
    filter.connect(master);

    // Slow LFO breathing the filter cutoff
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.06;
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    VOICES.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = (i - 1.5) * 6;

      const voiceGain = ctx.createGain();
      voiceGain.gain.value = 0.25 / VOICES.length + i * 0.02;

      // Slight per-voice tremolo
      const trem = ctx.createOscillator();
      const tremGain = ctx.createGain();
      trem.frequency.value = 0.08 + i * 0.035;
      tremGain.gain.value = 0.04;
      trem.connect(tremGain);
      tremGain.connect(voiceGain.gain);
      trem.start();

      osc.connect(voiceGain);
      voiceGain.connect(filter);
      osc.start();
    });
  }, []);

  const fade = useCallback((to: number) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(to, now + 1.4);
  }, []);

  const toggle = useCallback(() => {
    if (!ctxRef.current) buildGraph();
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    setPlaying((prev) => {
      const next = !prev;
      fade(next ? TARGET_GAIN : 0);
      return next;
    });
  }, [buildGraph, fade]);

  // Pause audio when the tab is hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && ctxRef.current && playing) {
        fade(0);
      } else if (!document.hidden && ctxRef.current && playing) {
        fade(TARGET_GAIN);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [playing, fade]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  return <Ctx.Provider value={{ playing, toggle }}>{children}</Ctx.Provider>;
};
