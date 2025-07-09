import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
import { Waveform } from '../../util/constants';
export declare const OSCILLATOR_PARAM: {
    readonly DETUNE: "detune";
    readonly FREQUENCY: "frequency";
};
declare type OscillatorParam = (typeof OSCILLATOR_PARAM)[keyof typeof OSCILLATOR_PARAM];
declare type BaseOscillatorProps = {
    detune?: number;
    frequency?: number;
    start?: boolean;
    type?: Waveform;
};
declare type OscillatorProps = BlipNodeProps & BaseOscillatorProps;
/**
 * A source node that outputs signal of different waveforms and frequencies.
 * Wrapper class for the native Oscillator audio node.
 */
export declare class Oscillator extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<OscillatorParam, AudioParam>;
    private oscillator;
    constructor(props?: OscillatorProps);
    /** Starts the oscillator */
    start: () => void;
    /** Stops the oscillator */
    stop: () => void;
    /** Get the oscillator frequency */
    getFrequency: () => number;
    /** Get the detune of the oscillator */
    getDetune: () => number;
    /** Get the waveform of the oscillator (Alias for getType) */
    /** Get the waveform of the oscillator */
    getType: () => OscillatorType;
    /** Set the frequency of the oscillator */
    setFrequency: (val: number, time?: number) => void;
    /** Set the detune of the oscillator */
    setDetune: (val: number, time?: number) => void;
    /** Set the waveform of the oscillator (Alias for setType) */
    /** Set the waveform of the oscillator */
    setType: (val: Waveform) => Waveform;
}
export {};
