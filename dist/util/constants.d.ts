export declare const minTime = 0.001;
export declare const noteRegex: RegExp;
export declare const BASE_NOTE: {
    readonly C: "C";
    readonly C_SHARP: "C#";
    readonly D: "D";
    readonly D_SHARP: "D#";
    readonly E: "E";
    readonly F: "F";
    readonly F_SHARP: "F#";
    readonly G: "G";
    readonly G_SHARP: "G#";
    readonly A: "A";
    readonly A_SHARP: "A#";
    readonly B: "B";
};
export declare type BaseNote = typeof BASE_NOTE[keyof typeof BASE_NOTE];
export declare type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export declare type Note = `${BaseNote}${Octave}`;
export declare const isNote: (note: any) => note is "C0" | "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8" | "C#0" | "C#1" | "C#2" | "C#3" | "C#4" | "C#5" | "C#6" | "C#7" | "C#8" | "D0" | "D1" | "D2" | "D3" | "D4" | "D5" | "D6" | "D7" | "D8" | "D#0" | "D#1" | "D#2" | "D#3" | "D#4" | "D#5" | "D#6" | "D#7" | "D#8" | "E0" | "E1" | "E2" | "E3" | "E4" | "E5" | "E6" | "E7" | "E8" | "F0" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F#0" | "F#1" | "F#2" | "F#3" | "F#4" | "F#5" | "F#6" | "F#7" | "F#8" | "G0" | "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7" | "G8" | "G#0" | "G#1" | "G#2" | "G#3" | "G#4" | "G#5" | "G#6" | "G#7" | "G#8" | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A#0" | "A#1" | "A#2" | "A#3" | "A#4" | "A#5" | "A#6" | "A#7" | "A#8" | "B0" | "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7" | "B8";
export declare type NoteInfo = {
    note: Note;
    baseNote: BaseNote;
    octave: Octave;
    frequency: number;
    midi: number;
};
export declare const OVERSAMPLE: {
    readonly NONE: "none";
    readonly TWO_TIMES: "2x";
    readonly FOUR_TIMES: "4x";
};
export declare type Oversample = typeof OVERSAMPLE[keyof typeof OVERSAMPLE];
export declare const NOISE_TYPE: {
    readonly WHITE: "white";
    readonly PINK: "pink";
    readonly BROWN: "brown";
};
export declare type NoiseType = typeof NOISE_TYPE[keyof typeof NOISE_TYPE];
export declare const WAVEFORM: {
    readonly SINE: "sine";
    readonly TRIANGLE: "triangle";
    readonly SQUARE: "square";
    readonly SAWTOOTH: "sawtooth";
};
export declare type Waveform = typeof WAVEFORM[keyof typeof WAVEFORM];
export declare const FILTER_TYPE: {
    readonly LOWPASS: "lowpass";
    readonly BANDPASS: "bandpass";
    readonly HIGHPASS: "highpass";
    readonly ALLPASS: "allpass";
    readonly NOTCH: "notch";
    readonly PEAKING: "peaking";
    readonly LOW_SHELF: "lowshelf";
    readonly HIGH_SHELF: "highshelf";
};
export declare type FilterType = typeof FILTER_TYPE[keyof typeof FILTER_TYPE];
