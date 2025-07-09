import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
import { Waveform } from '../../util/constants';
export declare const LFO_PARAM: {
    readonly DEPTH: "depth";
    readonly DETUNE: "detune";
    readonly RATE: "rate";
};
declare type LFOParam = (typeof LFO_PARAM)[keyof typeof LFO_PARAM];
declare type BaseLFOProps = {
    depth?: number;
    detune?: number;
    rate?: number;
    start?: boolean;
    type?: Waveform;
};
declare type LFOProps = BlipNodeProps & BaseLFOProps;
/**
 * A source node that outputs low frequency oscillations for modulating audio params over time.
 * Built using an oscillator connected to a gain node.
 */
export declare class LFO extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<LFOParam, AudioParam>;
    private depth;
    private osc;
    constructor(props?: LFOProps);
    /** Starts the oscillator */
    start: () => void;
    /** Stops the oscillator */
    stop: () => void;
    /** Get the rate of the LFO */
    getRate: () => number;
    /** Get the detune of the LFO */
    getDetune: () => number;
    /** Get the depth of the LFO */
    getDepth: () => number;
    /** Get the waveform of the LFO */
    getType: () => OscillatorType;
    /** Set the rate of the LFO. Max frequency is 100Hz. */
    setRate: (val: number, time?: number) => void;
    /** Set the detune of the LFO. */
    setDetune: (val: number, time?: number) => void;
    /** Set the depth of the LFO. */
    setDepth: (val: number, time?: number) => void;
    /** Set the waveform of the LFO. */
    setType: (val: Waveform) => Waveform;
}
export {};
