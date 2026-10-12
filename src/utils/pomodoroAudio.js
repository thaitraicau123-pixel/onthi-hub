// Web Audio API Sound Generator for Pomodoro Clock & Focus Ambient Sounds
// 100% Client-side high-fidelity synthetic audio - Zero external assets required

let audioCtx = null;
let currentAmbientController = null;
let currentAmbientSoundType = 'none';

export function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * High-fidelity Mechanical Clock Tick-Tock sound
 * isOdd = true  -> "Tích" (higher escapement tick, ~1180Hz)
 * isOdd = false -> "Tắc" (lower palette tock, ~760Hz)
 */
export function playClockTick(isOdd = true, volume = 0.4) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // 1. Transient Click (escapement wheel metallic impulse)
    const clickBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.015), ctx.sampleRate);
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickData.length * 0.18));
    }
    const clickSource = ctx.createBufferSource();
    clickSource.buffer = clickBuffer;

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'highpass';
    clickFilter.frequency.setValueAtTime(isOdd ? 2400 : 1600, now);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(volume * 0.35, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    clickSource.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickSource.start(now);

    // 2. Resonant Body Tone ("Tích" vs "Tắc")
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    const toneFilter = ctx.createBiquadFilter();

    const baseFreq = isOdd ? 1180 : 760;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.035);

    toneFilter.type = 'bandpass';
    toneFilter.frequency.setValueAtTime(baseFreq, now);
    toneFilter.Q.setValueAtTime(4.5, now);

    oscGain.gain.setValueAtTime(volume * 0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(toneFilter);
    toneFilter.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (err) {
    console.warn('Clock tick sound error:', err);
  }
}

/**
 * Timer Start Sound (Energetic Ding)
 */
export function playTimerStartSound(volume = 0.4) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [523.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(volume * 0.35, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.3);
    });
  } catch (e) {}
}

/**
 * Timer Pause Sound (Soft Click)
 */
export function playTimerPauseSound(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);
    gain.gain.setValueAtTime(volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {}
}

/**
 * Timer Reset Sound (Soft Swoosh)
 */
export function playTimerResetSound(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
    gain.gain.setValueAtTime(volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {}
}

/**
 * 5-Second Countdown Warning Beep (5, 4, 3, 2, 1)
 */
export function playCountdownWarningBeep(secondsLeft = 5, volume = 0.4) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const isLastOne = secondsLeft === 1;
    const freq = isLastOne ? 1480 : 880;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(volume * (isLastOne ? 0.45 : 0.28), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isLastOne ? 0.25 : 0.12));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (isLastOne ? 0.26 : 0.13));
  } catch (e) {}
}

/**
 * Pomodoro Completion Chime (Zen Bell / Celebration Gong)
 */
export function playPomodoroCompletionChime(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Harmonic bell chime chord
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(volume * 0.25, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 2.3);
    });

    // Deep warm gong fundamental
    const gong = ctx.createOscillator();
    const gongGain = ctx.createGain();
    gong.type = 'triangle';
    gong.frequency.setValueAtTime(261.63, now);
    gong.frequency.exponentialRampToValueAtTime(258, now + 2.5);
    gongGain.gain.setValueAtTime(volume * 0.35, now);
    gongGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
    gong.connect(gongGain);
    gongGain.connect(ctx.destination);
    gong.start(now);
    gong.stop(now + 2.5);
  } catch (e) {}
}

/* =========================================================================
   HIGH-FIDELITY AMBIENT FOCUS AUDIO ENGINE (RAIN / WAVES / CAFE)
   ========================================================================= */

/**
 * 1. Tiếng Mưa Rào (Natural Rain Soundscape)
 */
function createRainAmbient(ctx, initialVolume = 0.4) {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(initialVolume, ctx.currentTime + 0.3);
  masterGain.connect(ctx.destination);

  // Generate 4-second pink noise stereo buffer
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * 4;
  const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);
  
  for (let ch = 0; ch < 2; ch++) {
    const output = noiseBuffer.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.16;
      b6 = white * 0.115926;
    }
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Dual filtering for warm soothing rain
  const lpFilter = ctx.createBiquadFilter();
  lpFilter.type = 'lowpass';
  lpFilter.frequency.setValueAtTime(1400, ctx.currentTime);

  const hpFilter = ctx.createBiquadFilter();
  hpFilter.type = 'highpass';
  hpFilter.frequency.setValueAtTime(160, ctx.currentTime);

  noiseSource.connect(lpFilter);
  lpFilter.connect(hpFilter);
  hpFilter.connect(masterGain);
  noiseSource.start();

  // Droplet pitter-patter taps on glass/leaves
  const dropletInterval = setInterval(() => {
    if (!ctx || ctx.state === 'suspended') return;
    try {
      const dropOsc = ctx.createOscillator();
      const dropGain = ctx.createGain();
      const dropFreq = 2200 + Math.random() * 1400;
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(dropFreq, ctx.currentTime);
      dropOsc.frequency.exponentialRampToValueAtTime(dropFreq * 0.6, ctx.currentTime + 0.03);

      dropGain.gain.setValueAtTime(0.04 + Math.random() * 0.04, ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      dropOsc.connect(dropGain);
      dropGain.connect(masterGain);
      dropOsc.start();
      dropOsc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }, 190);

  return {
    setVolume: (v) => {
      try {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(Math.max(0.001, v), ctx.currentTime + 0.1);
      } catch (e) {}
    },
    stop: (fade = 0.25) => {
      clearInterval(dropletInterval);
      try {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + fade);
        setTimeout(() => {
          try {
            noiseSource.stop();
            noiseSource.disconnect();
            masterGain.disconnect();
          } catch (e) {}
        }, fade * 1000 + 40);
      } catch (e) {}
    }
  };
}

/**
 * 2. Tiếng Sóng Biển (Ocean Waves Ebb & Flow)
 */
function createWavesAmbient(ctx, initialVolume = 0.4) {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(initialVolume, ctx.currentTime + 0.3);
  masterGain.connect(ctx.destination);

  // 4-second looping noise buffer
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * 4;
  const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = noiseBuffer.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.04 * white) / 1.04;
      data[i] = (last * 2.2 + white * 0.15) * 0.3;
    }
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Bandpass / Lowpass filter whose frequency sweeps with the wave swell
  const waveFilter = ctx.createBiquadFilter();
  waveFilter.type = 'lowpass';
  waveFilter.frequency.setValueAtTime(340, ctx.currentTime);
  waveFilter.Q.setValueAtTime(1.8, ctx.currentTime);

  // Swell Gain (volume peaks when wave crashes, drops when it recedes)
  const swellGain = ctx.createGain();
  swellGain.gain.setValueAtTime(0.35, ctx.currentTime);

  // LFO: 0.09Hz (~11-second wave surge cycle)
  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(0.09, ctx.currentTime);

  // Modulate swellGain.gain (between ~0.15 and ~0.85)
  const lfoToGain = ctx.createGain();
  lfoToGain.gain.setValueAtTime(0.35, ctx.currentTime);
  lfo.connect(lfoToGain);
  lfoToGain.connect(swellGain.gain);

  // Modulate waveFilter.frequency (between 240Hz and 880Hz)
  const lfoToFilter = ctx.createGain();
  lfoToFilter.gain.setValueAtTime(360, ctx.currentTime);
  lfo.connect(lfoToFilter);
  lfoToFilter.connect(waveFilter.frequency);

  noiseSource.connect(waveFilter);
  waveFilter.connect(swellGain);
  swellGain.connect(masterGain);

  noiseSource.start();
  lfo.start();

  return {
    setVolume: (v) => {
      try {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(Math.max(0.001, v), ctx.currentTime + 0.1);
      } catch (e) {}
    },
    stop: (fade = 0.25) => {
      try {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + fade);
        setTimeout(() => {
          try {
            noiseSource.stop();
            lfo.stop();
            noiseSource.disconnect();
            lfo.disconnect();
            masterGain.disconnect();
          } catch (e) {}
        }, fade * 1000 + 40);
      } catch (e) {}
    }
  };
}

/**
 * 3. Quán Cafe Lofi (Cozy Cafe Ambience & Ceramic Cup Chimes)
 */
function createCafeAmbient(ctx, initialVolume = 0.4) {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(initialVolume, ctx.currentTime + 0.3);
  masterGain.connect(ctx.destination);

  // Base Room Murmur: warm brown noise + mid-frequency chatter texture
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * 4;
  const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = noiseBuffer.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.05 * white) / 1.05;
      data[i] = (last * 2.0 + white * 0.08) * 0.38;
    }
  }

  const murmurSource = ctx.createBufferSource();
  murmurSource.buffer = noiseBuffer;
  murmurSource.loop = true;

  const murmurFilter = ctx.createBiquadFilter();
  murmurFilter.type = 'lowpass';
  murmurFilter.frequency.setValueAtTime(540, ctx.currentTime);

  murmurSource.connect(murmurFilter);
  murmurFilter.connect(masterGain);
  murmurSource.start();

  // Subtle clinking porcelain coffee cups (every 2.5 - 4 seconds)
  const clinkInterval = setInterval(() => {
    if (!ctx || ctx.state === 'suspended') return;
    if (Math.random() < 0.65) {
      try {
        const now = ctx.currentTime;
        [2800, 3600].forEach((freq, idx) => {
          const clinkOsc = ctx.createOscillator();
          const clinkGain = ctx.createGain();
          clinkOsc.type = 'sine';
          clinkOsc.frequency.setValueAtTime(freq + (Math.random() * 200 - 100), now + idx * 0.06);
          clinkGain.gain.setValueAtTime(0.04, now + idx * 0.06);
          clinkGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.06);
          clinkOsc.connect(clinkGain);
          clinkGain.connect(masterGain);
          clinkOsc.start(now + idx * 0.06);
          clinkOsc.stop(now + idx * 0.06 + 0.07);
        });
      } catch (e) {}
    }
  }, 2500);

  return {
    setVolume: (v) => {
      try {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(Math.max(0.001, v), ctx.currentTime + 0.1);
      } catch (e) {}
    },
    stop: (fade = 0.25) => {
      clearInterval(clinkInterval);
      try {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + fade);
        setTimeout(() => {
          try {
            murmurSource.stop();
            murmurSource.disconnect();
            masterGain.disconnect();
          } catch (e) {}
        }, fade * 1000 + 40);
      } catch (e) {}
    }
  };
}

/**
 * Public Ambient Sound Controller
 */
export function stopAmbientSound(fadeDuration = 0.25) {
  currentAmbientSoundType = 'none';
  if (currentAmbientController) {
    currentAmbientController.stop(fadeDuration);
    currentAmbientController = null;
  }
}

export function setAmbientSoundVolume(volume) {
  if (currentAmbientController) {
    currentAmbientController.setVolume(volume);
  }
}

export function playAmbientSound(type = 'rain', volume = 0.4) {
  if (type === 'none' || type === 'tick') {
    stopAmbientSound();
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  // If already playing the same type, smoothly update volume
  if (currentAmbientSoundType === type && currentAmbientController) {
    currentAmbientController.setVolume(volume);
    return;
  }

  // Stop previous ambient sound cleanly
  stopAmbientSound(0.2);

  currentAmbientSoundType = type;

  try {
    if (type === 'rain') {
      currentAmbientController = createRainAmbient(ctx, volume);
    } else if (type === 'waves') {
      currentAmbientController = createWavesAmbient(ctx, volume);
    } else if (type === 'cafe') {
      currentAmbientController = createCafeAmbient(ctx, volume);
    }
  } catch (err) {
    console.warn('Failed to start ambient sound:', err);
  }
}
