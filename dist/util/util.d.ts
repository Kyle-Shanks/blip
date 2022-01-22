import { BlipNode } from '../nodes/core/BlipNode';
/** Returns the global audio context */
export declare const getContext: () => AudioContext;
/** Set the global audio context */
export declare const setContext: (context: AudioContext) => void;
export declare const resume: () => Promise<void>;
/** Clamp a number between a given min and max. */
export declare const clamp: (val: number, min: number, max: number) => number;
/** Connect a series of synth nodes together. */
export declare const chain: (...nodes: BlipNode[]) => void;
