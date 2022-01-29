export declare const noteRegex: RegExp;
export declare type BaseNote = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
export declare type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export declare type Note = `${BaseNote}${Octave}`;
export declare type NoteInfo = {
    note: Note;
    baseNote: BaseNote;
    octave: Octave;
    frequency: number;
    midi: number;
};
export declare const noteMidiMap: Record<BaseNote, number>;
/** Frequencies in 4th octave */
export declare const noteFreqMap: Record<BaseNote, number>;
export declare const isNote: (note: any) => note is "C0" | "C1" | "C2" | "C6" | "C3" | "C5" | "C4" | "C7" | "C8" | "C#0" | "C#1" | "C#2" | "C#6" | "C#3" | "C#5" | "C#4" | "C#7" | "C#8" | "D0" | "D1" | "D2" | "D6" | "D3" | "D5" | "D4" | "D7" | "D8" | "D#0" | "D#1" | "D#2" | "D#6" | "D#3" | "D#5" | "D#4" | "D#7" | "D#8" | "E0" | "E1" | "E2" | "E6" | "E3" | "E5" | "E4" | "E7" | "E8" | "F0" | "F1" | "F2" | "F6" | "F3" | "F5" | "F4" | "F7" | "F8" | "F#0" | "F#1" | "F#2" | "F#6" | "F#3" | "F#5" | "F#4" | "F#7" | "F#8" | "G0" | "G1" | "G2" | "G6" | "G3" | "G5" | "G4" | "G7" | "G8" | "G#0" | "G#1" | "G#2" | "G#6" | "G#3" | "G#5" | "G#4" | "G#7" | "G#8" | "A0" | "A1" | "A2" | "A6" | "A3" | "A5" | "A4" | "A7" | "A8" | "A#0" | "A#1" | "A#2" | "A#6" | "A#3" | "A#5" | "A#4" | "A#7" | "A#8" | "B0" | "B1" | "B2" | "B6" | "B3" | "B5" | "B4" | "B7" | "B8";
/** Get the frequency of the given note. */
export declare const getNoteFrequency: (note: Note) => number;
/** Get the midi value for the given note. */
export declare const getNoteMidiValue: (note: Note) => number;
/** Get note information. */
export declare const getNoteInfo: (note: Note) => NoteInfo;
