import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
import { Oversample } from '../../util/constants';
declare type BaseWaveShaperProps = {
    curve?: Float32Array | null;
    oversample?: Oversample;
};
declare type WaveShaperProps = BlipNodeProps & BaseWaveShaperProps;
/**
 * A Node used to adjust the shape of the incoming signal based on a waveshaping curve.
 * Wrapper class for the native WaveShaper audio node.
 */
export declare class WaveShaper extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    private waveShaper;
    constructor(props?: WaveShaperProps);
    /** Get the current curve. */
    getCurve: () => Float32Array;
    /** Get the current oversample value. */
    getOversample: () => OverSampleType;
    /** Set the node's waveshaping curve. */
    setCurve: (val: Float32Array | null) => Float32Array;
    /** Set the node's oversample setting. */
    setOversample: (val: Oversample) => Oversample;
}
export {};
