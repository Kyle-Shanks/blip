import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'

export const GAIN_PARAM = {
  GAIN: 'gain'
} as const

type GainParam = typeof GAIN_PARAM[keyof typeof GAIN_PARAM]

type BaseGainProps = {
  gain?: number
}

const defaultProps: Required<BaseGainProps> = {
  gain: 1
} as const

type GainProps = BlipNodeProps & BaseGainProps

/**
 * A node used to adjust the gain, or volume, of the incoming signal.
 * Wrapper class for the native Gain audio node.
 */
export class Gain extends BlipNode {
  readonly name: string = 'Gain'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<GainParam, AudioParam>

  private gain: GainNode

  constructor(props: GainProps = {}) {
    super(props)
    this.gain = this.AC.createGain()
    this.inputs = [this.gain]
    this.outputs = [this.gain]
    this.params = {
      [GAIN_PARAM.GAIN]: this.gain.gain
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }
    this.setGain(initProps.gain)

    return this
  }

  // - Getters -
  /** Get the current gain value. */
  public getGain = () => this.params[GAIN_PARAM.GAIN].value

  // - Setters -
  /** Set the gain of the node. */
  public setGain = (val: number, time?: number) =>
    this._timeUpdate(this.params[GAIN_PARAM.GAIN], val, time)
}
