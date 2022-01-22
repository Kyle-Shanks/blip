import { Envelope, EnvelopeProps } from './Envelope';
import { InputNode, OutputNode } from '../core/BlipNode';
import { FilterType } from '../../util/constants';
export declare const FILTER_ENVELOPE_PARAM: {
    readonly DETUNE: "detune";
    readonly FREQUENCY: "frequency";
    readonly GAIN: "gain";
    readonly Q: "q";
};
declare type FilterEnvelopeParam = typeof FILTER_ENVELOPE_PARAM[keyof typeof FILTER_ENVELOPE_PARAM];
declare type FilterEnvelopeProps = EnvelopeProps & {
    frequency?: number;
    q?: number;
    detune?: number;
    gain?: number;
    type?: FilterType;
};
/**
 * An envelope connected to a filter node.
 * Can be used to modulate the sound and tone of the incoming signal over time.
 */
export declare class FilterEnvelope extends Envelope {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<FilterEnvelopeParam, AudioParam>;
    private filter;
    constructor(props?: FilterEnvelopeProps);
    /** Get the cutoff frequency of the filter node. */
    getFrequency: () => number;
    /** Get the q factor of the filter node. */
    getQ: () => number;
    /** Get the detune value of the filter node. */
    getDetune: () => number;
    /** Get the gain value of the filter node. */
    getGain: () => number;
    /** Get the filter node's type. */
    getType: () => BiquadFilterType;
    /** Set the cutoff frequency of the filter node. */
    setFrequency: (val: number, time?: number) => void;
    /** Set the q factor value of the filter node. */
    setQ: (val: number, time?: number) => void;
    /** Set the detune value of the filter node. */
    setDetune: (val: number, time?: number) => void;
    /** Set the gain value of the filter node. */
    setGain: (val: number, time?: number) => void;
    /** Set the filter node's type. */
    setType: (val: FilterType) => FilterType;
}
export {};
