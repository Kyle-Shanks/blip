import { Envelope, BaseEnvelopeProps } from './Envelope';
import { BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
export declare const GAIN_ENVELOPE_PARAM: {
    readonly GAIN: "gain";
};
declare type GainEnvelopeParam = typeof GAIN_ENVELOPE_PARAM[keyof typeof GAIN_ENVELOPE_PARAM];
declare type BaseGainEnvelopeProps = BaseEnvelopeProps & {
    gain?: number;
};
declare type GainEnvelopeProps = BlipNodeProps & BaseGainEnvelopeProps;
/**
 * An envelope connected to a gain node.
 * Can be used to modulate the gain of the incoming signal over time.
 */
export declare class GainEnvelope extends Envelope {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<GainEnvelopeParam, AudioParam>;
    private gain;
    constructor(props?: GainEnvelopeProps);
    /** Get the base gain value on the gain node. */
    getGain: () => number;
    /** Set the base gain value of the gain node. */
    setGain: (val: number, time?: number) => void;
}
export {};
