import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
import { Waveform } from '../../util/constants';
export declare const AUTO_PAN_PARAM: {
    readonly DEPTH: "depth";
    readonly RATE: "rate";
};
declare type AutoPanParam = typeof AUTO_PAN_PARAM[keyof typeof AUTO_PAN_PARAM];
declare type BaseAutoPanProps = {
    depth?: number;
    rate?: number;
    type?: Waveform;
};
declare type AutoPanProps = BlipNodeProps & BaseAutoPanProps;
/**
 * An effect used to pan the incoming signal back and forth at an adjustable rate and depth.
 * Composed of an LFO connected to a StereoPanner node.
 */
export declare class AutoPan extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<AutoPanParam, AudioParam>;
    private LFO;
    private panner;
    constructor(props?: AutoPanProps);
    /** Get the depth of the pan modulation. */
    getDepth: () => number;
    /** Get the rate of the pan modulation. */
    getRate: () => number;
    /** Get the waveform of the pan modulation. */
    getType: () => OscillatorType;
    /** Set the depth of the pan modulation. */
    setDepth: (val: number, time?: number) => void;
    /** Set the rate of the pan modulation. */
    setRate: (val: number, time?: number) => void;
    /** Set the waveform of the pan modulation. */
    setType: (val: Waveform) => Waveform;
}
export {};
