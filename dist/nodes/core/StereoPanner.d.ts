import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
export declare const STEREO_PANNER_PARAM: {
    readonly PAN: "pan";
};
declare type StereoPannerParam = typeof STEREO_PANNER_PARAM[keyof typeof STEREO_PANNER_PARAM];
declare type StereoPannerProps = BlipNodeProps & {
    pan?: number;
};
/**
 * A Node used to adjust the pan of the incoming signal.
 * Wrapper class for the native StereoPanner audio node.
 */
export declare class StereoPanner extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<StereoPannerParam, AudioParam>;
    private stereoPanner;
    constructor(props?: StereoPannerProps);
    /** Get the current pan value. */
    getPan: () => number;
    /** Set the pan of the node. */
    setPan: (val: number, time?: number) => void;
}
export {};
