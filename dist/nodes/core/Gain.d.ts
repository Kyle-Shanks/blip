import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
export declare const GAIN_PARAM: {
    readonly GAIN: "gain";
};
declare type GainParam = typeof GAIN_PARAM[keyof typeof GAIN_PARAM];
declare type BaseGainProps = {
    gain?: number;
};
declare type GainProps = BlipNodeProps & BaseGainProps;
/**
 * A node used to adjust the gain, or volume, of the incoming signal.
 * Wrapper class for the native Gain audio node.
 */
export declare class Gain extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<GainParam, AudioParam>;
    private gain;
    constructor(props?: GainProps);
    /** Get the current gain value. */
    getGain: () => number;
    /** Set the gain of the node. */
    setGain: (val: number, time?: number) => void;
}
export {};
