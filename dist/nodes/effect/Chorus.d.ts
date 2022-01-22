import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
export declare const CHORUS_PARAM: {
    readonly PRE_DELAY_TIME: "preDelayTime";
    readonly LEFT_DELAY_TIME: "leftDelayTime";
    readonly RIGHT_DELAY_TIME: "rightDelayTime";
    readonly LEFT_FEEDBACK: "leftFeedback";
    readonly RIGHT_FEEDBACK: "rightFeedback";
    readonly TONE: "tone";
};
declare type ChorusParam = typeof CHORUS_PARAM[keyof typeof CHORUS_PARAM];
declare type ChorusProps = BlipNodeProps & {
    amount?: number;
    preDelayTime?: number;
    leftDelayTime?: number;
    rightDelayTime?: number;
    leftFeedback?: number;
    rightFeedback?: number;
    tone?: number;
};
/**
 * A ping pong delay effect to adds echos and other delay-based effects to the incoming signal.
 */
export declare class Chorus extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<ChorusParam, AudioParam>;
    private amount;
    private dryGain;
    private leftDelay;
    private preDelay;
    private rightDelay;
    private leftFeedbackGain;
    private rightFeedbackGain;
    private channelMerger;
    private tone;
    private wetGain;
    constructor(props: ChorusProps);
    /** Get the dry/wet amount of the node. */
    getAmount: () => number;
    /** Get the initial delay time of the node. */
    getPreDelayTime: () => number;
    /** Get the left delay time of the node. */
    getLeftDelayTime: () => number;
    /** Get the right delay time of the node. */
    getRightDelayTime: () => number;
    /** Get the left feedback of the node. */
    getLeftFeedback: () => number;
    /** Get the right feedback of the node. */
    getRightFeedback: () => number;
    /** Get the tone value of the node. */
    getTone: () => number;
    /** Set the dry/wet amount of the node. */
    setAmount: (val: number, time?: number) => void;
    /** Set the initial delay time of the node. */
    setPreDelayTime: (val: number, time?: number) => any;
    /** Set the left delay time of the node. */
    setLeftDelayTime: (val: number, time?: number) => any;
    /** Set the right delay time of the node. */
    setRightDelayTime: (val: number, time?: number) => any;
    /** Set the left feedback value of the node. */
    setLeftFeedback: (val: number, time?: number) => void;
    /** Set the right feedback value of the node. */
    setRightFeedback: (val: number, time?: number) => void;
    /** Set the tone value of the node. */
    setTone: (val: number, time?: number) => any;
}
export {};
