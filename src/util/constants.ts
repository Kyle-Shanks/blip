export const minTime = 0.001

// Distortion oversample types
export const OVERSAMPLE = {
  NONE: 'none',
  TWO_TIMES: '2x',
  FOUR_TIMES: '4x',
} as const

export type Oversample = (typeof OVERSAMPLE)[keyof typeof OVERSAMPLE]

// Noise generator types
export const NOISE_TYPE = {
  WHITE: 'white',
  PINK: 'pink',
  BROWN: 'brown',
} as const

export type NoiseType = (typeof NOISE_TYPE)[keyof typeof NOISE_TYPE]

// Oscillator waveforms
export const WAVEFORM = {
  SINE: 'sine',
  TRIANGLE: 'triangle',
  SQUARE: 'square',
  SAWTOOTH: 'sawtooth',
} as const

export type Waveform = (typeof WAVEFORM)[keyof typeof WAVEFORM]

// Filter node types
export const FILTER_TYPE = {
  LOWPASS: 'lowpass',
  BANDPASS: 'bandpass',
  HIGHPASS: 'highpass',
  ALLPASS: 'allpass',
  NOTCH: 'notch',
  PEAKING: 'peaking',
  LOW_SHELF: 'lowshelf',
  HIGH_SHELF: 'highshelf',
} as const

export type FilterType = (typeof FILTER_TYPE)[keyof typeof FILTER_TYPE]
