import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode';
export declare const BUFFER_SOURCE_PARAM: {
    readonly DETUNE: "detune";
    readonly PLAYBACK_RATE: "playbackRate";
};
declare type BufferSourceParam = typeof BUFFER_SOURCE_PARAM[keyof typeof BUFFER_SOURCE_PARAM];
declare type BufferSourceProps = BlipNodeProps & {
    buffer?: AudioBuffer | null;
    detune?: number;
    loop?: boolean;
    playbackRate?: number;
    start?: boolean;
};
/**
 * A source node that outputs signal based on a provided audio buffer.
 * Wrapper class for the native AudioBufferSourceNode.
 */
export declare class BufferSource extends BlipNode {
    readonly name: string;
    readonly outputs: OutputNode[];
    readonly params: Record<BufferSourceParam, AudioParam>;
    private bufferSource;
    constructor(props?: BufferSourceProps);
    /** Starts output from the source node */
    start: () => void;
    /** Stops output from the source node */
    stop: () => void;
    /** Get the current buffer of the source node */
    getBuffer: () => AudioBuffer;
    /** Get the current loop setting */
    getLoop: () => boolean;
    /** Get the current detune value */
    getDetune: () => number;
    /** Get the current playback rate */
    getPlaybackRate: () => number;
    /** Set the buffer of the source node */
    setBuffer: (val: AudioBuffer | null) => AudioBuffer;
    /** Set the loop value of the source node */
    setLoop: (val: boolean) => boolean;
    /** Set the detune value of the source node */
    setDetune: (val: number, time?: number) => void;
    /** Set the playback rate of the source node */
    setPlaybackRate: (val: number, time?: number) => void;
}
export {};
