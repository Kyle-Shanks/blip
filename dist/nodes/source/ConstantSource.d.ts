import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
export declare const CONSTANT_SOURCE_PARAM: {
    readonly OFFSET: "offset";
};
declare type ConstantSourceParam = (typeof CONSTANT_SOURCE_PARAM)[keyof typeof CONSTANT_SOURCE_PARAM];
declare type BaseConstantSourceProps = {
    offset?: number;
    start?: boolean;
};
declare type ConstantSourceProps = BlipNodeProps & BaseConstantSourceProps;
/**
 * A source node that outputs a constant signal that can be adjusted.
 * Wrapper class for the native ConstantSource node.
 */
export declare class ConstantSource extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<ConstantSourceParam, AudioParam>;
    private source;
    constructor(props?: ConstantSourceProps);
    /** Starts output from the source node */
    start: () => void;
    /** Stops output from the source node */
    stop: () => void;
    /** Get the current offset value of the source node */
    getOffset: () => AudioParam;
    /** Set the offset value of the source node */
    setOffset: (val: number, time?: number) => void;
}
export {};
