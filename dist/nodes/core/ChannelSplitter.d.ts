import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode';
declare type BaseChannelSplitterProps = {};
declare type ChannelSplitterProps = BlipNodeProps & BaseChannelSplitterProps;
/**
 * A node used to split a stereo audio signal into its left and right components.
 * Wrapper class for the native ChannelSplitter audio node.
 */
export declare class ChannelSplitter extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    private channelSplitter;
    constructor(props?: ChannelSplitterProps);
}
export {};
