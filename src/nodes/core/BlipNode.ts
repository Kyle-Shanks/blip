import { getContext } from '../../util/util'

export type InputNode = BlipNode | AudioNode | AudioParam
export type OutputNode = BlipNode | AudioNode

export type BlipNodeProps = {
  AC?: BaseAudioContext
}

/** Base class for Blip audio nodes. */
export class BlipNode {
  readonly name: string = 'BlipNode'
  readonly inputs: InputNode[] = []
  readonly outputs: OutputNode[] = []
  readonly params: Record<string, AudioParam | AudioParam[]> = {}

  protected AC: BaseAudioContext

  constructor(props: BlipNodeProps = {}) {
    this.AC = props?.AC ?? getContext()

    return this
  }

  // --- Public Methods ---
  /**
   * Connect this node to a BlipNode, AudioNode, or AudioParam.
   * An array can be passed to connect to multiple destinations.
   */
  public connect = (
    destination: InputNode | InputNode[],
    outputNum?: number,
    inputNum?: number
  ) => {
    this._connect(destination, outputNum, inputNum)
    return this
  }

  /**
   * Disconnect this node from one or more if its connections.
   * If no destination is passed, all connections will be removed.
   */
  public disconnect = (
    destination?: InputNode | InputNode[],
    outputNum?: number,
    inputNum?: number
  ) => {
    this._disconnect(destination, outputNum, inputNum)
    return this
  }

  /** Connect all output nodes to the AudioContext destination */
  public toDestination = () => {
    const outputNodes = this._getOutputNodes()
    outputNodes.forEach((output) => output.connect(this.AC.destination))
  }

  // --- Private Methods ---
  /** Internal connect handler method */
  protected _connect = (
    destination: InputNode | InputNode[],
    outputNum: number = 0,
    inputNum: number = 0
  ) => {
    if (Array.isArray(destination)) {
      destination.forEach((dest) => this._connect(dest, outputNum, inputNum))
    } else if (destination instanceof BlipNode) {
      if (destination.inputs.length === 0) {
        console.error('Cannot connect to a node with no inputs')
        return
      }

      const inputs = destination._getInputNodes()
      inputs.forEach((input) => {
        this.outputs.forEach((output) => {
          input instanceof AudioParam
            ? output.connect(input, outputNum)
            : output.connect(input, outputNum, inputNum)
        })
      })
    } else if (destination instanceof AudioNode) {
      this.outputs.forEach((output) => output.connect(destination, outputNum, inputNum))
    } else if (destination instanceof AudioParam) {
      this.outputs.forEach((output) => output.connect(destination, outputNum))
    } else {
      console.error('Invalid destination type')
    }
  }

  /** Internal disconnect handler method */
  protected _disconnect = (
    destination?: InputNode | InputNode[],
    outputNum: number = 0,
    inputNum: number = 0
  ) => {
    if (destination === undefined) {
      this.outputs.forEach((output) => output.disconnect())
    } else if (Array.isArray(destination)) {
      destination.forEach((dest) => this._disconnect(dest, outputNum, inputNum))
    } else if (destination instanceof BlipNode) {
      if (destination.inputs.length === 0) {
        console.error('Cannot disconnect from destination with no inputs')
        return
      }

      const inputs = destination._getInputNodes()
      inputs.forEach((input) => {
        this.outputs.forEach((output) => output.disconnect(input, outputNum, inputNum))
      })
    } else if (destination instanceof AudioNode || destination instanceof AudioParam) {
      this.outputs.forEach((output) => output.disconnect(destination, outputNum, inputNum))
    } else {
      console.error('Invalid destination type')
    }
  }

  // Recursively go down to get the default audio nodes/params of all inputs
  private _getInputNodes = (): (AudioNode | AudioParam)[] =>
    this.inputs.reduce<(AudioNode | AudioParam)[]>((nodes, input) => {
      input instanceof BlipNode ? nodes.push(...input._getInputNodes()) : nodes.push(input)

      return nodes
    }, [])

  // Recursively go down to get the default audio nodes of all outputs
  private _getOutputNodes = (): AudioNode[] =>
    this.outputs.reduce<AudioNode[]>((nodes, output) => {
      output instanceof BlipNode ? nodes.push(...output._getOutputNodes()) : nodes.push(output)

      return nodes
    }, [])

  // - Update Methods -
  protected _update = (param: AudioParam, val: number) =>
    param.setValueAtTime(val, this.AC.currentTime)

  protected _timeUpdate = (param: AudioParam, val: number, time: number = 0) => {
    time
      ? param.setTargetAtTime(val, this.AC.currentTime, time)
      : param.setValueAtTime(val, this.AC.currentTime)
  }

  // 1:0 <-> 0.5:0.5 <-> 0:1
  protected _linearFadeUpdate = (
    aParam: AudioParam,
    bParam: AudioParam,
    val: number,
    time: number = 0
  ) => {
    this._timeUpdate(aParam, 1 - val, time)
    this._timeUpdate(bParam, val, time)
  }

  // 1:0 <-> ~0.7:~0.7 <-> 0:1
  protected _equalPowerFadeUpdate = (
    aParam: AudioParam,
    bParam: AudioParam,
    val: number,
    time: number = 0
  ) => {
    this._timeUpdate(aParam, Math.cos(val * 0.5 * Math.PI), time)
    this._timeUpdate(bParam, Math.cos((1.0 - val) * 0.5 * Math.PI), time)
  }

  // 1:0 <-> 1:1 <-> 0:1
  protected _dryWetUpdate = (
    dryParam: AudioParam,
    wetParam: AudioParam,
    val: number,
    time: number = 0
  ) => {
    if (val < 0.5) {
      this._timeUpdate(dryParam, 1, time)
      this._timeUpdate(wetParam, val * 2, time)
    } else {
      this._timeUpdate(dryParam, 1 - (val - 0.5) * 2, time)
      this._timeUpdate(wetParam, 1, time)
    }
  }
}
