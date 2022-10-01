import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
export declare const FM_SYNTH_PARAM: {
    MOD_A_GAIN: string;
    MOD_A_DETUNE: string;
    MOD_A_FREQUENCY: string;
    MOD_B_GAIN: string;
    MOD_B_DETUNE: string;
    MOD_B_FREQUENCY: string;
    MOD_C_GAIN: string;
    MOD_C_DETUNE: string;
    MOD_C_FREQUENCY: string;
    MOD_D_GAIN: string;
    MOD_D_DETUNE: string;
    MOD_D_FREQUENCY: string;
};
declare type FMSynthParam = typeof FM_SYNTH_PARAM[keyof typeof FM_SYNTH_PARAM];
declare type BaseFMSynthProps = {
    algorithm?: number;
    modAGain?: number;
    modADetune?: number;
    modAFrequency?: number;
    modBGain?: number;
    modBDetune?: number;
    modBFrequency?: number;
    modCGain?: number;
    modCDetune?: number;
    modCFrequency?: number;
    modDGain?: number;
    modDDetune?: number;
    modDFrequency?: number;
    gainAttack?: number;
    gainDecay?: number;
    gainSustain?: number;
    gainRelease?: number;
    gainAmount?: number;
};
declare type FMSynthProps = BlipNodeProps & BaseFMSynthProps;
export declare class FMSynth extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<FMSynthParam, AudioParam>;
    private algorithm;
    private modA;
    private modB;
    private modC;
    private modD;
    private limiter;
    private gainEnv;
    constructor(props?: FMSynthProps);
    /** Get an diagram for the current algorithm. */
    getAlgorithm: () => string;
    /** Get the frequency of modulator A. */
    getModAFrequency: () => number;
    /** Get the detune of modulator A. */
    getModADetune: () => number;
    /** Get the gain of modulator A. */
    getModAGain: () => number;
    /** Get the frequency of modulator B. */
    getModBFrequency: () => number;
    /** Get the detune of modulator B. */
    getModBDetune: () => number;
    /** Get the gain of modulator B. */
    getModBGain: () => number;
    /** Get the frequency of modulator C. */
    getModCFrequency: () => number;
    /** Get the detune of modulator C. */
    getModCDetune: () => number;
    /** Get the gain of modulator C. */
    getModCGain: () => number;
    /** Get the frequency of modulator D. */
    getModDFrequency: () => number;
    /** Get the detune of modulator D. */
    getModDDetune: () => number;
    /** Get the gain of modulator D. */
    getModDGain: () => number;
    /** Get the attack time of the gain envelope. */
    getGainAttack: () => number;
    /** Get the decay time of the gain envelope. */
    getGainDecay: () => number;
    /** Get the sustain value of the gain envelope. */
    getGainSustain: () => number;
    /** Get the release time of the gain envelope. */
    getGainRelease: () => number;
    /** Get the gain modifier of the gain envelope. */
    getGainAmount: () => number;
    /** Set the algorithm and reconnect the modulators. */
    setAlgorithm: (idx: number) => string | void;
    /** Set the frequency of modulator A. */
    setModAFrequency: (val: number, time?: number) => void;
    /** Set the detune of modulator A. */
    setModADetune: (val: number, time?: number) => void;
    /** Set the gain of modulator A. */
    setModAGain: (val: number, time?: number) => void;
    /** Set the frequency of modulator B. */
    setModBFrequency: (val: number, time?: number) => void;
    /** Set the detune of modulator B. */
    setModBDetune: (val: number, time?: number) => void;
    /** Set the gain of modulator B. */
    setModBGain: (val: number, time?: number) => void;
    /** Set the frequency of modulator C. */
    setModCFrequency: (val: number, time?: number) => void;
    /** Set the detune of modulator C. */
    setModCDetune: (val: number, time?: number) => void;
    /** Set the gain of modulator C. */
    setModCGain: (val: number, time?: number) => void;
    /** Set the frequency of modulator D. */
    setModDFrequency: (val: number, time?: number) => void;
    /** Set the detune of modulator D. */
    setModDDetune: (val: number, time?: number) => void;
    /** Set the gain of modulator D. */
    setModDGain: (val: number, time?: number) => void;
    /** Set the attack time of the gain envelope. */
    setGainAttack: (val: number) => number;
    /** Set the decay time of the gain envelope. */
    setGainDecay: (val: number) => number;
    /** Set the sustain value of the gain envelope. */
    setGainSustain: (val: number) => number;
    /** Set the release time of the gain envelope. */
    setGainRelease: (val: number) => number;
    /** Set the gain modifier of the gain envelope. */
    setGainAmount: (val: number) => number;
    /** Trigger the attack of the gain envelope. */
    triggerAttack: () => void;
    /** Trigger the release of the gain envelope. */
    triggerRelease: () => void;
    /** Trigger a stop on the gain envelope. */
    triggerStop: () => void;
}
export {};
