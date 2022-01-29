import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
import { Waveform } from '../../util/constants';
export declare const TREMOLO_PARAM: {
    readonly DEPTH: "depth";
    readonly RATE: "rate";
};
declare type TremoloParam = typeof TREMOLO_PARAM[keyof typeof TREMOLO_PARAM];
declare type BaseTremoloProps = {
    depth?: number;
    rate?: number;
    type?: Waveform;
};
declare type TremoloProps = BlipNodeProps & BaseTremoloProps;
/**
 * An effect used to modulate the gain of the incoming signal at an adjustable rate and depth.
 * Composed of an LFO connected to a Gain node.
 */
export declare class Tremolo extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<TremoloParam, AudioParam>;
    private LFO;
    private gain;
    constructor(props?: TremoloProps);
    /** Get the depth of the gain modulation. */
    getDepth: () => number;
    /** Get the rate of the gain modulation. */
    getRate: () => number;
    /** Get the waveform of the gain modulation. */
    getType: () => OscillatorType;
    /** Set the depth of the gain modulation. */
    setDepth: (val: number, time?: number) => void;
    /** Set the rate of the gain modulation. */
    setRate: (val: number, time?: number) => void;
    /** Set the waveform of the gain modulation. */
    setType: (val: Waveform) => Waveform;
}
export {};
