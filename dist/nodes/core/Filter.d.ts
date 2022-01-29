import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
import { FilterType } from '../../util/constants';
export declare const FILTER_PARAM: {
    readonly DETUNE: "detune";
    readonly FREQUENCY: "frequency";
    readonly GAIN: "gain";
    readonly Q: "Q";
};
declare type FilterParam = typeof FILTER_PARAM[keyof typeof FILTER_PARAM];
declare type BaseFilterProps = {
    frequency?: number;
    q?: number;
    detune?: number;
    gain?: number;
    type?: FilterType;
};
declare type FilterProps = BlipNodeProps & BaseFilterProps;
/**
 * A Node used to filter frequencies of the incoming signal.
 * Wrapper class for the native BiquadFilter audio node.
 */
export declare class Filter extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<FilterParam, AudioParam>;
    private filter;
    constructor(props?: FilterProps);
    /** Get the current detune. */
    getDetune: () => number;
    /** Get the current frequency. */
    getFrequency: () => number;
    /** Get the current gain. */
    getGain: () => number;
    /** Get the current q value. */
    getQ: () => number;
    /** Get the current filter type. */
    getType: () => BiquadFilterType;
    /** Set the detune of the filter. */
    setDetune: (val: number, time?: number) => void;
    /** Set the cutoff frequency of the filter. */
    setFrequency: (val: number, time?: number) => void;
    /** Set the gain of the filter. */
    setGain: (val: number, time?: number) => void;
    /** Set the q value of the filter. */
    setQ: (val: number, time?: number) => void;
    /** Set the type of the filter. */
    setType: (val: FilterType) => FilterType;
}
export {};
