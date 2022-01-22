import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
declare type ReverbProps = BlipNodeProps & {
    amount?: number;
    buffer?: AudioBuffer | null;
    normalize?: boolean;
};
/**
 * A convolusion reverb effect to adds width and space effects to the incoming signal.
 * A default impulse response will be generated if one is not provided.
 */
export declare class Reverb extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    private amount;
    private dryGain;
    private convolver;
    private wetGain;
    constructor(props?: ReverbProps);
    /** Get the dry/wet amount of the node. */
    getAmount: () => number;
    /** Get the current audio buffer of the node. */
    getBuffer: () => AudioBuffer;
    /** Get the current normalize value of the node. */
    getNormalize: () => boolean;
    /** Set the dry/wet amount of the node. */
    setAmount: (val: number, time?: number) => void;
    /** Set the audio buffer of the node. */
    setBuffer: (val: AudioBuffer | null) => AudioBuffer;
    /** Set the normalize value of the node. */
    setNormalize: (val: boolean) => boolean;
    private _generateBuffer;
}
export {};
