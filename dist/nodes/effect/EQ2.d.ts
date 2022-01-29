import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
export declare const EQ2_PARAM: {
    readonly LOW_FREQUENCY: "lowFrequency";
    readonly LOW_GAIN: "lowGain";
    readonly HIGH_FREQUENCY: "highFrequency";
    readonly HIGH_GAIN: "highGain";
};
declare type EQ2Param = typeof EQ2_PARAM[keyof typeof EQ2_PARAM];
declare type BaseEQ2Props = {
    lowFrequency?: number;
    lowGain?: number;
    highFrequency?: number;
    highGain?: number;
};
declare type EQ2Props = BlipNodeProps & BaseEQ2Props;
/**
 * A 2-band equalizer node for adjusting the gain of the high and low frequencies of the incoming signal.
 */
export declare class EQ2 extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<EQ2Param, AudioParam>;
    private low;
    private high;
    constructor(props?: EQ2Props);
    /** Get the frequency of the low band. */
    getLowFrequency: () => number;
    /** Get the gain value of the low band. */
    getLowGain: () => number;
    /** Get the frequency of the high band. */
    getHighFrequency: () => number;
    /** Get the gain value of the high band. */
    getHighGain: () => number;
    /** Set the frequency of the low band. */
    setLowFrequency: (val: number, time?: number) => void;
    /** Set the gain value of the low band. */
    setLowGain: (val: number, time?: number) => void;
    /** Set the frequency of the high band. */
    setHighFrequency: (val: number, time?: number) => void;
    /** Set the gain value of the high band. */
    setHighGain: (val: number, time?: number) => void;
}
export {};
