export const minTime = 0.001
export const noteRegex = /^(?![ebEB]#)([a-gA-G]#?)([0-9])$/

export const BASE_NOTE = {
  C: 'C',
  C_SHARP: 'C#',
  D: 'D',
  D_SHARP: 'D#',
  E: 'E',
  F: 'F',
  F_SHARP: 'F#',
  G: 'G',
  G_SHARP: 'G#',
  A: 'A',
  A_SHARP: 'A#',
  B: 'B',
} as const

export type BaseNote = typeof BASE_NOTE[keyof typeof BASE_NOTE]

export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Note = `${BaseNote}${Octave}`

export const isNote = (note: any): note is Note => noteRegex.test(note)

export type NoteInfo = {
  note: Note
  baseNote: BaseNote
  octave: Octave
  frequency: number
  midi: number
}

// Distortion oversample types
export const OVERSAMPLE = {
  NONE: 'none',
  TWO_TIMES: '2x',
  FOUR_TIMES: '4x',
} as const

export type Oversample = typeof OVERSAMPLE[keyof typeof OVERSAMPLE]

// Noise generator types
export const NOISE_TYPE = {
  WHITE: 'white',
  PINK: 'pink',
  BROWN: 'brown',
} as const

export type NoiseType = typeof NOISE_TYPE[keyof typeof NOISE_TYPE]

// Oscillator waveforms
export const WAVEFORM = {
  SINE: 'sine',
  TRIANGLE: 'triangle',
  SQUARE: 'square',
  SAWTOOTH: 'sawtooth',
} as const

export type Waveform = typeof WAVEFORM[keyof typeof WAVEFORM]

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

export type FilterType = typeof FILTER_TYPE[keyof typeof FILTER_TYPE]
