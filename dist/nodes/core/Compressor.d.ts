import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
export declare const COMPRESSOR_PARAM: {
    readonly ATTACK: "attack";
    readonly KNEE: "knee";
    readonly RATIO: "ratio";
    readonly RELEASE: "release";
    readonly THRESHOLD: "threshold";
};
export declare type CompressorParam = (typeof COMPRESSOR_PARAM)[keyof typeof COMPRESSOR_PARAM];
declare type BaseCompressorProps = {
    attack?: number;
    knee?: number;
    ratio?: number;
    release?: number;
    threshold?: number;
};
declare type CompressorProps = BlipNodeProps & BaseCompressorProps;
/**
 * A node used to control the dynamic range of a signal.
 * Wrapper class for the native DynamicsCompressor audio node.
 */
export declare class Compressor extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<CompressorParam, AudioParam>;
    private compressor;
    constructor(props?: CompressorProps);
    /** Get the threshold in dB. */
    getThreshold: () => number;
    /** Get the compression ratio. */
    getRatio: () => number;
    /** Get the current knee value. */
    getKnee: () => number;
    /** Get the attack time. */
    getAttack: () => number;
    /** Get the release time. */
    getRelease: () => number;
    /** Get the current gain reduction in dB. */
    getReduction: () => number;
    /** Set the threshold. */
    setThreshold: (val: number, time?: number) => void;
    /** Set the compression ratio. */
    setRatio: (val: number, time?: number) => void;
    /** Set the knee value. */
    setKnee: (val: number, time?: number) => void;
    /** Set the attack time. */
    setAttack: (val: number, time?: number) => void;
    /** Set the release time. */
    setRelease: (val: number, time?: number) => void;
}
export {};
