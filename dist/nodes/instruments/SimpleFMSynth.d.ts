import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
import { Note } from '../../util/noteUtil';
export declare const SIMPLE_FM_SYNTH_PARAM: {
    readonly MODULATOR_DEPTH: "modulatorDepth";
    readonly MODULATOR_DETUNE: "modulatorDetune";
    readonly MODULATOR_FREQUENCY: "modulatorFrequency";
    readonly CARRIER_DETUNE: "carrierDetune";
    readonly CARRIER_FREQUENCY: "carrierFrequency";
    readonly CARRIER_GAIN: "carrierGain";
    readonly CARIER_FILTER_DETUNE: "carrierFilterDetune";
    readonly CARIER_FILTER_FREQUENCY: "carrierFilterFrequency";
    readonly CARIER_FILTER_GAIN: "carrierFilterGain";
    readonly CARIER_FILTER_Q: "carrierFilterQ";
};
declare type SimpleFMSynthParam = (typeof SIMPLE_FM_SYNTH_PARAM)[keyof typeof SIMPLE_FM_SYNTH_PARAM];
declare type BaseSimpleFMSynthProps = {
    modulatorFrequency?: number;
    modulatorDetune?: number;
    modulatorDepth?: number;
    carrierFrequency?: number;
    carrierDetune?: number;
    gainAttack?: number;
    gainDecay?: number;
    gainSustain?: number;
    gainRelease?: number;
    gainAmount?: number;
    filterAttack?: number;
    filterDecay?: number;
    filterSustain?: number;
    filterRelease?: number;
    filterAmount?: number;
};
declare type SimpleFMSynthProps = BlipNodeProps & BaseSimpleFMSynthProps;
export declare class SimpleFMSynth extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<SimpleFMSynthParam, AudioParam>;
    private modulator;
    private carrier;
    constructor(props?: SimpleFMSynthProps);
    /** Get the current frequency of the modulator. */
    getModulatorFrequency: () => number;
    /** Get the current detune value of the modulator. */
    getModulatorDetune: () => number;
    /** Get the current depth of the modulator */
    getModulatorDepth: () => number;
    /** Get the current frequency of the carrier. */
    getCarrierFrequency: () => number;
    /** Get the current detune value of the carrier. */
    getCarrierDetune: () => number;
    /** Get the attack time of the carrier's gain envelope. */
    getGainAttack: () => number;
    /** Get the decay time of the carrier's gain envelope. */
    getGainDecay: () => number;
    /** Get the sustain value of the carrier's gain envelope. */
    getGainSustain: () => number;
    /** Get the release time of the carrier's gain envelope. */
    getGainRelease: () => number;
    /** Get the modifier amount of the carrier's gain envelope. */
    getGainAmount: () => number;
    /** Get the attack time of the carrier's filter envelope. */
    getFilterAttack: () => number;
    /** Get the decay time of the carrier's filter envelope. */
    getFilterDecay: () => number;
    /** Get the sustain time of the carrier's filter envelope. */
    getFilterSustain: () => number;
    /** Get the release time of the carrier's filter envelope. */
    getFilterRelease: () => number;
    /** Get the modifier amount of the carrier's filter envelope. */
    getFilterAmount: () => number;
    /** Set the frequency of the modulator. */
    setModulatorFrequency: (val: number, time?: number) => void;
    /** Set the detune value of the modulator. */
    setModulatorDetune: (val: number, time?: number) => void;
    /** Set the depth of the modulator. */
    setModulatorDepth: (val: number, time?: number) => void;
    /** Set the frequency of the carrier. */
    setCarrierFrequency: (val: number, time?: number) => void;
    /** Set the detune value of the carrier. */
    setCarrierDetune: (val: number, time?: number) => void;
    /** Set the attack time of the carrier's gain envelope. */
    setGainAttack: (val: number) => number;
    /** Set the decay time of the carrier's gain envelope. */
    setGainDecay: (val: number) => number;
    /** Set the sustain value of the carrier's gain envelope. */
    setGainSustain: (val: number) => number;
    /** Set the release time of the carrier's gain envelope. */
    setGainRelease: (val: number) => number;
    /** Set the modifier amount of the carrier's gain envelope. */
    setGainAmount: (val: number) => number;
    /** Set the attack time of the carrier's filter envelope. */
    setFilterAttack: (val: number) => number;
    /** Set the decay time of the carrier's filter envelope. */
    setFilterDecay: (val: number) => number;
    /** Set the sustain value of the carrier's filter envelope. */
    setFilterSustain: (val: number) => number;
    /** Set the release time of the carrier's filter envelope. */
    setFilterRelease: (val: number) => number;
    /** Set the modifier amount of the carrier's filter envelope. */
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
