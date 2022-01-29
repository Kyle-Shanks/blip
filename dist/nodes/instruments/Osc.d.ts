import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
import { Waveform } from '../../util/constants';
export declare const OSC_PARAM: {
    DETUNE: string;
    FREQUENCY: string;
    GAIN: string;
};
declare type OscParam = typeof OSC_PARAM[keyof typeof OSC_PARAM];
declare type BaseOscProps = {
    detune?: number;
    frequency?: number;
    gain?: number;
    type?: Waveform;
};
declare type OscProps = BlipNodeProps & BaseOscProps;
/**
 * A general-purpose instrument composed of an Oscillator connected to a Gain node.
 */
export declare class Osc extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<OscParam, AudioParam>;
    private gain;
    private oscillator;
    constructor(props?: OscProps);
    /** Get the detune of the oscillator. */
    getDetune: () => number;
    /** Get the frequency of the oscillator. */
    getFrequency: () => number;
    /** Get the gain of the gain node. */
    getGain: () => number;
    /** Get the waveform of the oscillator.*/
    getType: () => OscillatorType;
    /** Set the detune of the oscillator. */
    setDetune: (val: number, time?: number) => void;
    /** Set the frequency of the oscillator. */
    setFrequency: (val: number, time?: number) => void;
    /** Set the gain of the gain node. */
    setGain: (val: number, time?: number) => void;
    /** Set the waveform of the oscillator. */
    setType: (val: Waveform) => Waveform;
}
export {};
