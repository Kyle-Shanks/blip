import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
export declare const LIMITER_PARAM: {
    readonly KNEE: "knee";
    readonly THRESHOLD: "threshold";
    readonly RATIO: "ratio";
    readonly ATTACK: "attack";
    readonly RELEASE: "release";
    readonly GAIN: "gain";
};
declare type LimiterParam = typeof LIMITER_PARAM[keyof typeof LIMITER_PARAM];
declare type BaseLimiterProps = {
    threshold?: number;
    ratio?: number;
    knee?: number;
    attack?: number;
    release?: number;
    gain?: number;
};
declare type LimiterProps = BlipNodeProps & BaseLimiterProps;
/**
 * An effect used to limit the dynamic range of the incoming signal.
 * Built using a Compressor node with more aggressive settings connected to a Gain node.
 */
export declare class Limiter extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<LimiterParam, AudioParam>;
    private limiter;
    private gain;
    constructor(props?: LimiterProps);
    /** Get the current knee value. */
    getKnee: () => number;
    /** Get the threshold in dB. */
    getThreshold: () => number;
    /** Get the compression ratio. */
    getRatio: () => number;
    /** Get the attack time. */
    getAttack: () => number;
    /** Get the release time. */
    getRelease: () => number;
    /** Get the current gain reduction in dB. */
    getReduction: () => number;
    /** Get the gain value of the output gain. */
    getGain: () => number;
    /** Set the knee value. */
    setKnee: (val: number, time?: number) => void;
    /** Set the threshold. */
    setThreshold: (val: number, time?: number) => void;
    /** Set the compression ratio. */
    setRatio: (val: number, time?: number) => void;
    /** Set the attack time. */
    setAttack: (val: number, time?: number) => void;
    /** Set the release time. */
    setRelease: (val: number, time?: number) => void;
    /** Set the gain value of the output. */
    setGain: (val: number, time?: number) => void;
}
export {};
