export const noteRegex = /^(?![ebEB]#)([a-gA-G]#?)([0-8])$/

// - Types -
export type BaseNote =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B'

export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export const minOctave = 0
export const maxOctave = 8

export type Note = `${BaseNote}${Octave}`

export type NoteInfo = {
  note: Note
  baseNote: BaseNote
  octave: Octave
  frequency: number
  midi: number
}

// - Useful constants -
// MIDI numbers for 0th octave
export const noteMidiMap: Record<BaseNote, number> = {
  'C': 12,
  'C#': 13,
  'D': 14,
  'D#': 15,
  'E': 16,
  'F': 17,
  'F#': 18,
  'G': 19,
  'G#': 20,
  'A': 21,
  'A#': 22,
  'B': 23
}

// MIDI numbers for 0th octave
export const midiNoteMap: Record<number, BaseNote> = {
  12: 'C',
  13: 'C#',
  14: 'D',
  15: 'D#',
  16: 'E',
  17: 'F',
  18: 'F#',
  19: 'G',
  20: 'G#',
  21: 'A',
  22: 'A#',
  23: 'B'
}

/** Frequencies in 4th octave */
export const noteFreqMap: Record<BaseNote, number> = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.0,
  'G#': 415.3,
  'A': 440.0,
  'A#': 466.16,
  'B': 493.88
}

// - Note Functions -
export const isNote = (note: any): note is Note => noteRegex.test(note)

const parseNote = (val: string) => {
  const match = val.match(noteRegex)
  if (!match) return null

  return {
    note: val.toUpperCase() as Note,
    baseNote: match[1].toUpperCase() as BaseNote,
    octave: parseInt(match[2]) as Octave
  }
}

/** Get the frequency of the given note. */
export const getNoteFrequency = (note: Note) => {
  const noteInfo = parseNote(note)
  return noteInfo
    ? noteFreqMap[noteInfo.baseNote] * Math.pow(2, noteInfo.octave - 4)
    : null
}

/** Get the midi value for the given note. */
export const getNoteMidiValue = (note: Note) => {
  const noteInfo = parseNote(note)
  return noteInfo ? noteMidiMap[noteInfo.baseNote] + 12 * noteInfo.octave : null
}

/** Get note information. */
export const getNoteInfo = (note: Note): NoteInfo => {
  const noteInfo = parseNote(note)
  if (!noteInfo) return null

  return {
    note: noteInfo.note,
    baseNote: noteInfo.baseNote,
    octave: noteInfo.octave,
    frequency: getNoteFrequency(note),
    midi: getNoteMidiValue(note)
  }
}
