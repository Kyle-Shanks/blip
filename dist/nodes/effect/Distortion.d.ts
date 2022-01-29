import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
declare type BaseDistortionProps = {
    amount?: number;
    distortion?: number;
};
declare type DistortionProps = BlipNodeProps & BaseDistortionProps;
/**
 * An effect used to clip/distort the incoming signal.
 */
export declare class Distortion extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    private distortion;
    private dryGain;
    private wetGain;
    private waveShaper;
    constructor(props?: DistortionProps);
    /** Get the dry/wet amount level of the node. */
    getAmount: () => number;
    /** Get the distortion value of the node. */
    getDistortion: () => number;
    /** Set the dry/wet amount of the node. */
    setAmount: (val: number, time?: number) => void;
    /** Set the distortion value of the node. */
    setDistortion: (val: number) => void;
    private _createDistCurve;
}
export {};
