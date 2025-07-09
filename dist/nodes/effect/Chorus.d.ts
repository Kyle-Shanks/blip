import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode';
export declare const CHORUS_PARAM: {};
declare type ChorusParam = (typeof CHORUS_PARAM)[keyof typeof CHORUS_PARAM];
declare type BaseChorusProps = {};
declare type ChorusProps = BlipNodeProps & BaseChorusProps;
/**
 * TODO: Update the description
 * Chorus Effect
 */
export declare class Chorus extends BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<ChorusParam, AudioParam>;
    constructor(props?: ChorusProps);
}
export {};
