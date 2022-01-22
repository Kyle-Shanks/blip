import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
import { ConstantSource } from '../source/ConstantSource';
export declare type EnvelopeProps = BlipNodeProps & {
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    modifier?: number;
};
/**
 * A general-purpose ADSR envelope that can be connected to AudioParams to modulate values over time.
 * Built using a ConstantSource node.
 */
export declare class Envelope extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    modifier: number;
    protected source: ConstantSource;
    private timeoutIds;
    constructor(props?: EnvelopeProps);
    /**
     * Connect this envelope to an AudioParam.
     * An array can be passed to connect to multiple destinations.
     */
    connect: (destination: InputNode | InputNode[]) => this;
    /** Get the attack time of the envelope. */
    getAttack: () => number;
    /** Get the decay time of the envelope. */
    getDecay: () => number;
    /** Get the sustain value of the envelope. */
    getSustain: () => number;
    /** Get the release time of the envelope. */
    getRelease: () => number;
    /** Get the modifier value of the envelope. */
    getModifier: () => number;
    /** Get the attack time of the envelope. */
    setAttack: (val: number) => number;
    /** Get the decay time of the envelope. */
    setDecay: (val: number) => number;
    /** Get the sustain value of the envelope. */
    setSustain: (val: number) => number;
    /** Get the release time of the envelope. */
    setRelease: (val: number) => number;
    /** Get the modifier value of the envelope. */
    setModifier: (val: number) => number;
    /**
     * Triggers the attack of the envelope.
     * Will automatically trigger the decay after the attack time.
     */
    triggerAttack: () => void;
    /** Triggers the release of the envelope. */
    triggerRelease: () => void;
    /** Triggers an instant stop of the envelope. */
    triggerStop: () => void;
    private _clearTimeouts;
}
