import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
import { FilterType, Waveform } from '../../util/constants';
import { Note } from '../../util/noteUtil';
export declare const POLY_SYNTH_PARAM: {
    readonly DETUNE: "detune";
    readonly FREQUENCY: "frequency";
    readonly GAIN: "gain";
    readonly FILTER_DETUNE: "filterDetune";
    readonly FILTER_FREQUENCY: "filterFrequency";
    readonly FILTER_GAIN: "filterGain";
    readonly FILTER_Q: "filterQ";
};
declare type PolySynthParam = typeof POLY_SYNTH_PARAM[keyof typeof POLY_SYNTH_PARAM];
declare type BasePolySynthProps = {
    polyphony?: number;
    waveform?: Waveform;
    frequency?: number;
    detune?: number;
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
declare type PolySynthProps = BlipNodeProps & BasePolySynthProps;
/**
 * General-purpose polyphonic synth node that supports up to 8 voices.
 * Built using MonoSynths connected to a Limiter.
 */
export declare class PolySynth extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<PolySynthParam, AudioParam[]>;
    private voices;
    private limiter;
    private polyphony;
    private voicePos;
    constructor(props?: PolySynthProps);
    /** Get the polyphony setting of the node */
    getPolyphony: () => number;
    /** Get the waveform of the node's oscillators */
    getType: () => OscillatorType;
    /** Get the detune of the node's oscillators */
    getDetune: () => number;
    /** Get the attack time of the gain envelope */
    getGainAttack: () => number;
    /** Get the decay time of the gain envelope */
    getGainDecay: () => number;
    /** Get the sustain value of the gain envelope */
    getGainSustain: () => number;
    /** Get the release time of the gain envelope */
    getGainRelease: () => number;
    /** Get the gain modifier of the gain envelope */
    getGainAmount: () => number;
    /** Get the frequency of the filter envelope's filter */
    getFilterFrequency: () => number;
    /** Get the detune of the filter envelope's filter */
    getFilterDetune: () => number;
    /** Get the Q value of the filter envelope's filter */
    getFilterQ: () => number;
    /** Get the gain value of the filter envelope's filter */
    getFilterGain: () => number;
    /** Get the filter type of the filter envelope's filter */
    getFilterType: () => BiquadFilterType;
    /** Get the attack time of the filter envelope */
    getFilterAttack: () => number;
    /** Get the decay time of the filter envelope */
    getFilterDecay: () => number;
    /** Get the sustain value of the filter envelope */
    getFilterSustain: () => number;
    /** Get the release time of the filter envelope */
    getFilterRelease: () => number;
    /** Get the frequency modifier of the filter envelope */
    getFilterAmount: () => number;
    /** Set the maximum number of active voices for the node. (Min = 1, Max = 8) */
    setPolyphony: (val: number) => number;
    /** Set the waveform for each of the node's oscillators. */
    setType: (val: Waveform) => void;
    /** Set the detune for each of the node's oscillators. */
    setDetune: (val: number, time?: number) => void;
    /** Set the attack time of the gain envelope. */
    setGainAttack: (val: number) => void;
    /** Set the attack time of the gain envelope. */
    setGainDecay: (val: number) => void;
    /** Set the sustain value of the gain envelope. */
    setGainSustain: (val: number) => void;
    /** Set the release time of the gain envelope. */
    setGainRelease: (val: number) => void;
    /** Set the gain modifier of the gain envelope. */
    setGainAmount: (val: number) => void;
    /** Set the cutoff frequency of the filter envelope's filter. */
    setFilterFrequency: (val: number, time?: number) => void;
    /** Set the detune of the filter envelope's filter. */
    setFilterDetune: (val: number, time?: number) => void;
    /** Set the Q value of the filter envelope's filter. */
    setFilterQ: (val: number, time?: number) => void;
    /** Set the gain of the filter envelope's filter. */
    setFilterGain: (val: number, time?: number) => void;
    /** Set the filter type of the filter envelope's filter. */
    setFilterType: (val: FilterType) => void;
    /** Set the attack time of the filter envelope. */
    setFilterAttack: (val: number) => void;
    /** Set the attack time of the filter envelope. */
    setFilterDecay: (val: number) => void;
    /** Set the sustain value of the filter envelope. */
    setFilterSustain: (val: number) => void;
    /** Set the release time of the filter envelope. */
    setFilterRelease: (val: number) => void;
    /** Set the frequency modifier of the filter envelope. */
    setFilterAmount: (val: number) => void;
    /** Play the given note or array of notes. */
    triggerAttack: (note: Note | Note[]) => void;
    /**
     * Release the note or array of notes given.
     * If a note is not given, it will release all current notes being played.
     */
    triggerRelease: (note?: Note | Note[]) => void;
    /**
     * Stop the note or array of notes given.
     * If a note is not given, it will stop all current notes being played.
     */
    triggerStop: (note?: Note | Note[]) => void;
    private _incrementVoicePos;
    private _voiceTriggerAttack;
    private _voiceTriggerRelease;
    private _voiceTriggerStop;
}
export {};
