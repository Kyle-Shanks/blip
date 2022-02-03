import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
import { FilterType, Waveform } from '../../util/constants';
import { Note } from '../../util/noteUtil';
export declare const MONO_SYNTH_PARAM: {
    DETUNE: string;
    FREQUENCY: string;
    GAIN: string;
    FILTER_DETUNE: string;
    FILTER_FREQUENCY: string;
    FILTER_GAIN: string;
    FILTER_Q: string;
};
declare type MonoSynthParam = typeof MONO_SYNTH_PARAM[keyof typeof MONO_SYNTH_PARAM];
declare type BaseMonoSynthProps = {
    detune?: number;
    frequency?: number;
    type?: Waveform;
    gainAttack?: number;
    gainDecay?: number;
    gainSustain?: number;
    gainRelease?: number;
    gainAmount?: number;
    filterFrequency?: number;
    filterQ?: number;
    filterDetune?: number;
    filterGain?: number;
    filterType?: FilterType;
    filterAttack?: number;
    filterDecay?: number;
    filterSustain?: number;
    filterRelease?: number;
    filterAmount?: number;
};
declare type MonoSynthProps = BlipNodeProps & BaseMonoSynthProps;
/**
 * General-purpose monophonic synth node.
 * Consists of an Oscillator connected to a GainEnvelope and FilterEnvelope.
 */
export declare class MonoSynth extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<MonoSynthParam, AudioParam>;
    private gainEnv;
    private filterEnv;
    private oscillator;
    private currentNote;
    constructor(props?: MonoSynthProps);
    /** Get the note that is currently being played. */
    getCurrentNote: () => "C0" | "C1" | "C2" | "C6" | "C3" | "C5" | "C4" | "C7" | "C8" | "C#0" | "C#1" | "C#2" | "C#6" | "C#3" | "C#5" | "C#4" | "C#7" | "C#8" | "D0" | "D1" | "D2" | "D6" | "D3" | "D5" | "D4" | "D7" | "D8" | "D#0" | "D#1" | "D#2" | "D#6" | "D#3" | "D#5" | "D#4" | "D#7" | "D#8" | "E0" | "E1" | "E2" | "E6" | "E3" | "E5" | "E4" | "E7" | "E8" | "F0" | "F1" | "F2" | "F6" | "F3" | "F5" | "F4" | "F7" | "F8" | "F#0" | "F#1" | "F#2" | "F#6" | "F#3" | "F#5" | "F#4" | "F#7" | "F#8" | "G0" | "G1" | "G2" | "G6" | "G3" | "G5" | "G4" | "G7" | "G8" | "G#0" | "G#1" | "G#2" | "G#6" | "G#3" | "G#5" | "G#4" | "G#7" | "G#8" | "A0" | "A1" | "A2" | "A6" | "A3" | "A5" | "A4" | "A7" | "A8" | "A#0" | "A#1" | "A#2" | "A#6" | "A#3" | "A#5" | "A#4" | "A#7" | "A#8" | "B0" | "B1" | "B2" | "B6" | "B3" | "B5" | "B4" | "B7" | "B8";
    /** Get the waveform of the oscillator. */
    getType: () => OscillatorType;
    /** Get the frequency of the oscillator. */
    getFrequency: () => number;
    /** Get the detune value of the oscillator. */
    getDetune: () => number;
    /** Get the attack time of the gain envelope. */
    getGainAttack: () => number;
    /** Get the decay time of the gain envelope. */
    getGainDecay: () => number;
    /** Get the sustain value of the gain envelope. */
    getGainSustain: () => number;
    /** Get the release time of the gain envelope. */
    getGainRelease: () => number;
    /** Get the modifier value of the gain envelope. */
    getGainAmount: () => number;
    /** Get the frequency of the filter envelope's filter. */
    getFilterFrequency: () => number;
    /** Get the detune value of the filter envelope's filter. */
    getFilterDetune: () => number;
    /** Get the Q value of the filter envelope's filter. */
    getFilterQ: () => number;
    /** Get the gain of the filter envelope's filter. */
    getFilterGain: () => number;
    /** Get the filter type of the filter envelope's filter. */
    getFilterType: () => BiquadFilterType;
    /** Get the attack time of the filter envelope. */
    getFilterAttack: () => number;
    /** Get the decay time of the filter envelope. */
    getFilterDecay: () => number;
    /** Get the sustain value of the filter envelope. */
    getFilterSustain: () => number;
    /** Get the release time of the filter envelope. */
    getFilterRelease: () => number;
    /** Get the modifier amount of the filter envelope. */
    getFilterAmount: () => number;
    /** Set the waveform of the oscillator. */
    setWaveform: (val: Waveform) => Waveform;
    /** Set the frequency of the oscillator. */
    setFrequency: (val: number, time?: number) => void;
    /** Set the detune of the oscillator. */
    setDetune: (val: number, time?: number) => void;
    /** Set the attack time of the gain envelope. */
    setGainAttack: (val: number) => number;
    /** Set the decay time of the gain envelope. */
    setGainDecay: (val: number) => number;
    /** Set the sustain value of the gain envelope. */
    setGainSustain: (val: number) => number;
    /** Set the release time of the gain envelope. */
    setGainRelease: (val: number) => number;
    /** Set the gain modifier of the gain envelope. */
    setGainAmount: (val: number) => number;
    /** Set the frequency of the filter envelope's filter. */
    setFilterFrequency: (val: number, time?: number) => void;
    /** Set the detune value of the filter envelope's filter. */
    setFilterDetune: (val: number, time?: number) => void;
    /** Set the q value of the filter envelope's filter. */
    setFilterQ: (val: number, time?: number) => void;
    /** Set the gain of the filter envelope's filter. */
    setFilterGain: (val: number, time?: number) => void;
    /** Set the type of the filter envelope's filter. */
    setFilterType: (val: FilterType) => FilterType;
    /** Set the attack time of the filter envelope. */
    setFilterAttack: (val: number) => number;
    /** Set the decay time of the filter envelope. */
    setFilterDecay: (val: number) => number;
    /** Set the sustain value of the filter envelope. */
    setFilterSustain: (val: number) => number;
    /** Set the release time of the filter envelope. */
    setFilterRelease: (val: number) => number;
    /** Set the modifier value of the filter envelope. */
    setFilterAmount: (val: number) => number;
    /** Plays the note given. */
    triggerAttack: (note: Note) => void;
    /**
     * Releases the note given if it matches the current note.
     * If a note is not given, it will release any current note being played.
     */
    triggerRelease: (note?: Note) => void;
    /** Stops any note currently being played. */
    triggerStop: () => void;
}
export {};
