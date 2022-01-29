import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
import { NoiseType } from '../../util/constants';
declare type BaseNoiseGeneratorProps = {
    start?: boolean;
    type?: NoiseType;
};
declare type NoiseGeneratorProps = BlipNodeProps & BaseNoiseGeneratorProps;
/**
 * A source node that outputs three types of noise using a BufferSource node.
 * Can output white, pink, or brown noise.
 */
export declare class NoiseGenerator extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    type: NoiseType;
    private bufferSource;
    constructor(props?: NoiseGeneratorProps);
    /** Starts output from the source node */
    start: () => void;
    /** Stops output from the source node */
    stop: () => void;
    /** Get the current noise type */
    getType: () => NoiseType;
    /** Set the noise type that is output */
    setType: (val: NoiseType) => void;
}
export {};
