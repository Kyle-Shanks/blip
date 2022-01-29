import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
export declare const FEEDBACK_DELAY_PARAM: {
    readonly DELAY_TIME: "delayTime";
    readonly FEEDBACK: "feedback";
    readonly TONE: "tone";
};
declare type FeedbackDelayParam = typeof FEEDBACK_DELAY_PARAM[keyof typeof FEEDBACK_DELAY_PARAM];
declare type BaseFeedbackDelayProps = {
    amount?: number;
    delayTime?: number;
    feedback?: number;
    tone?: number;
};
declare type FeedbackDelayProps = BlipNodeProps & BaseFeedbackDelayProps;
/**
 * A feedback delay effect to adds echos and other delay-based effects to the incoming signal.
 */
export declare class FeedbackDelay extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<FeedbackDelayParam, AudioParam>;
    private amount;
    private dryGain;
    private delay;
    private feedbackGain;
    private tone;
    private wetGain;
    constructor(props?: FeedbackDelayProps);
    /** Get the dry/wet amount of the node. */
    getAmount: () => number;
    /** Get the delay time of the node. */
    getDelayTime: () => number;
    /** Get the feedback of the node. */
    getFeedback: () => number;
    /** Get the tone value of the node. */
    getTone: () => number;
    /** Set the dry/wet amount of the node. */
    setAmount: (val: number, time?: number) => void;
    /** Set the delay time of the node. */
    setDelayTime: (val: number, time?: number) => void;
    /** Set the feedback value of the node. */
    setFeedback: (val: number, time?: number) => void;
    /** Set the tone value of the node. */
    setTone: (val: number, time?: number) => void;
}
export {};
