import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
declare type ConvolverProps = BlipNodeProps & {
    buffer?: AudioBuffer | null;
    normalize?: boolean;
};
/** Wrapper class for the native Convolver audio node. */
export declare class Convolver extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    private convolver;
    constructor(props?: ConvolverProps);
    /** Get the current buffer value. */
    getBuffer: () => AudioBuffer;
    /** Get the current normalize value. */
    getNormalize: () => boolean;
    /** Set the convolver's buffer. */
    setBuffer: (val: AudioBuffer | null) => AudioBuffer;
    /** Sets the normalize value. */
    setNormalize: (val: boolean) => boolean;
}
export {};
