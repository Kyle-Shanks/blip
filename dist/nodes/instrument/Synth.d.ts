import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
import { GainEnvelope } from '../component/GainEnvelope';
import { Oscillator } from '../source/Oscillator';
import { Note, Waveform } from '../../util/constants';
export declare const SYNTH_PARAM: {
    readonly DETUNE: "detune";
    readonly FREQUENCY: "frequency";
    readonly GAIN: "gain";
};
declare type SynthParam = typeof SYNTH_PARAM[keyof typeof SYNTH_PARAM];
export declare type SynthProps = BlipNodeProps & {
    waveform?: Waveform;
    frequency?: number;
    detune?: number;
    gainAttack?: number;
    gainDecay?: number;
    gainSustain?: number;
    gainRelease?: number;
    gainAmount?: number;
};
/**
 * General-purpose synth node consisting of an Oscillator connected to a GainEnvelope.
 */
export declare class Synth extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<SynthParam, AudioParam>;
    protected currentNote: Note | null;
    protected osc: Oscillator;
    protected gainEnv: GainEnvelope;
    constructor(props: SynthProps);
    /** Get the note that is currently being played. */
    getCurrentNote: () => "C0" | "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8" | "C#0" | "C#1" | "C#2" | "C#3" | "C#4" | "C#5" | "C#6" | "C#7" | "C#8" | "D0" | "D1" | "D2" | "D3" | "D4" | "D5" | "D6" | "D7" | "D8" | "D#0" | "D#1" | "D#2" | "D#3" | "D#4" | "D#5" | "D#6" | "D#7" | "D#8" | "E0" | "E1" | "E2" | "E3" | "E4" | "E5" | "E6" | "E7" | "E8" | "F0" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F#0" | "F#1" | "F#2" | "F#3" | "F#4" | "F#5" | "F#6" | "F#7" | "F#8" | "G0" | "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7" | "G8" | "G#0" | "G#1" | "G#2" | "G#3" | "G#4" | "G#5" | "G#6" | "G#7" | "G#8" | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A#0" | "A#1" | "A#2" | "A#3" | "A#4" | "A#5" | "A#6" | "A#7" | "A#8" | "B0" | "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7" | "B8";
    /** Get the waveform of the oscillator. */
    getWaveform: () => OscillatorType;
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
    /**
     * Plays the note given.
     * Sets the frequency of the oscillator and calls triggerAttack on the gain envelope.
     */
    triggerAttack: (note: Note) => void;
    /**
     * Releases the note given if it matches the current note.
     * If a note is not given, it will release any current note being played.
     */
    triggerRelease: (note?: Note) => void;
    /** Stops any note currently being played. */
    triggerStop: () => void;
    protected _noteOn: (note: Note) => void;
    protected _noteOff: (note?: Note) => void;
    protected _noteStop: () => void;
}
export {};
