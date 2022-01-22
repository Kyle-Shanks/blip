import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
export declare const DELAY_PARAM: {
    readonly DELAY_TIME: "delayTime";
};
declare type DelayParam = typeof DELAY_PARAM[keyof typeof DELAY_PARAM];
declare type DelayProps = BlipNodeProps & {
    delayTime?: number;
};
/**
 * A node used to adjust the gain, or volume, of the incoming signal.
 * Wrapper class for the native Gain audio node.
 */
export declare class Delay extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<DelayParam, AudioParam>;
    private delay;
    constructor(props?: DelayProps);
    /** Get the current delay time value. */
    getDelayTime: () => number;
    /** Set the delay time of the node. */
    setDelayTime: (val: number, time?: number) => void;
}
export {};
