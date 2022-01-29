import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
declare type BaseChannelMergerProps = {};
declare type ChannelMergerProps = BlipNodeProps & BaseChannelMergerProps;
/**
 * A node used to merge two audio signals.
 * Wrapper class for the native ChannelMerger audio node.
 */
export declare class ChannelMerger extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    private channelMerger;
    constructor(props?: ChannelMergerProps);
}
export {};
