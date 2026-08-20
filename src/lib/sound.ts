/**
 * Generates an in-memory 16-bit PCM WAV Data URI sound effect for the TV show intro.
 * Plays via standard HTML5 Audio element and automatically triggers on load or
 * on the first user interaction (click, tap, keypress) to satisfy browser autoplay policies.
 */
function createWavDataUri(): string {
  const sampleRate = 22050;
  const duration = 2.2; // 2.2 seconds
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  // Synthesize PCM audio samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // 1. Sub-bass Stage Boom Impact (0.0s - 0.8s)
    if (t < 0.8) {
      const boomFreq = 140 * Math.exp(-t * 3.8);
      const boomEnv = Math.exp(-t * 4.2);
      sample += Math.sin(2 * Math.PI * boomFreq * t) * boomEnv * 0.5;
    }

    // 2. Brass Fanfare Swell Chord (0.1s - 1.8s)
    const chordNotes = [196.0, 261.63, 329.63, 392.0, 523.25, 659.25];
    if (t >= 0.1 && t < 1.8) {
      const relT = t - 0.1;
      const env = Math.min(relT / 0.18, 1) * Math.exp(-relT * 1.8);
      let chordSample = 0;
      chordNotes.forEach((f) => {
        chordSample += (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(4 * Math.PI * f * t)) * 0.1;
      });
      sample += chordSample * env;
    }

    // 3. Crystal Sparkles (0.25s - 1.6s)
    const chimes = [1318.51, 1567.98, 1975.53, 2637.02, 3135.96, 3951.07];
    chimes.forEach((f, idx) => {
      const chimeStart = 0.25 + idx * 0.12;
      if (t >= chimeStart && t < chimeStart + 0.6) {
        const ct = t - chimeStart;
        const cEnv = Math.exp(-ct * 6.5);
        sample += Math.sin(2 * Math.PI * f * t) * cEnv * 0.08;
      }
    });

    // Clamp to 16-bit signed PCM
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }

  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return "data:audio/wav;base64," + btoa(binary);
}

let cachedWavUri: string | null = null;

export function playShowIntroSting(): () => void {
  if (typeof window === "undefined") return () => {};

  let activeAudio: HTMLAudioElement | null = null;
  let hasPlayed = false;

  const validGestureEvents = ["pointerdown", "touchstart", "click", "keydown"];

  const cleanupListeners = () => {
    validGestureEvents.forEach((ev) => {
      window.removeEventListener(ev, onGesture, { capture: true });
    });
  };

  const onGesture = () => {
    if (hasPlayed) return;
    try {
      if (!cachedWavUri) {
        cachedWavUri = createWavDataUri();
      }
      const audio = new Audio(cachedWavUri);
      audio.volume = 0.7;
      audio
        .play()
        .then(() => {
          activeAudio = audio;
          hasPlayed = true;
          cleanupListeners();
        })
        .catch(() => {
          // Keep gesture listeners active until audio successfully plays
        });
    } catch {
      /* noop */
    }
  };

  const attachGestureFallback = () => {
    validGestureEvents.forEach((ev) => {
      window.addEventListener(ev, onGesture, { capture: true });
    });
  };

  const playInitial = () => {
    try {
      if (!cachedWavUri) {
        cachedWavUri = createWavDataUri();
      }
      const audio = new Audio(cachedWavUri);
      audio.volume = 0.7;
      audio
        .play()
        .then(() => {
          activeAudio = audio;
          hasPlayed = true;
          cleanupListeners();
        })
        .catch(() => {
          // Autoplay blocked by browser. Keep gesture listeners active.
          attachGestureFallback();
        });
    } catch {
      attachGestureFallback();
    }
  };

  playInitial();

  return () => {
    cleanupListeners();
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch {
        /* noop */
      }
    }
  };
}
