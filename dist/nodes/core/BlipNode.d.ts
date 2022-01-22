export declare type InputNode = BlipNode | AudioNode | AudioParam;
export declare type OutputNode = BlipNode | AudioNode;
export declare type BlipNodeProps = {
    AC?: BaseAudioContext;
};
/** Base class for Blip audio nodes. */
export declare class BlipNode {
    readonly name: string;
    readonly inputs: InputNode[];
    readonly outputs: OutputNode[];
    readonly params: Record<string, AudioParam>;
    protected AC: BaseAudioContext;
    constructor(props?: BlipNodeProps);
    /**
     * Connect this node to a BlipNode, AudioNode, or AudioParam.
     * An array can be passed to connect to multiple destinations.
     */
    connect: (destination: InputNode | InputNode[], outputNum?: number, inputNum?: number) => this;
    /**
     * Disconnect this node from one or more if its connections.
     * If no destination is passed, all connections will be removed.
     */
    disconnect: (destination?: InputNode | InputNode[], outputNum?: number, inputNum?: number) => this;
    /** Connect all output nodes to the AudioContext destination */
    toDestination: () => void;
    /** Internal connect handler method */
    private _connect;
    /** Internal disconnect handler method */
    private _disconnect;
    private _getInputNodes;
    private _getOutputNodes;
    protected _update: (param: AudioParam, val: number) => AudioParam;
    protected _timeUpdate: (param: AudioParam, val: number, time?: number) => void;
    protected _linearFadeUpdate: (aParam: AudioParam, bParam: AudioParam, val: number, time?: number) => void;
    protected _equalPowerFadeUpdate: (aParam: AudioParam, bParam: AudioParam, val: number, time?: number) => void;
    protected _dryWetUpdate: (dryParam: AudioParam, wetParam: AudioParam, val: number, time?: number) => void;
}
