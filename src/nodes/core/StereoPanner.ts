import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'

export const STEREO_PANNER_PARAM = {
  PAN: 'pan',
} as const

type StereoPannerParam =
  typeof STEREO_PANNER_PARAM[keyof typeof STEREO_PANNER_PARAM]

type StereoPannerProps = BlipNodeProps & {
  pan?: number
}

const defaultProps: Required<Omit<StereoPannerProps, 'AC'>> = {
  pan: 0,
} as const

/**
 * A Node used to adjust the pan of the incoming signal.
 * Wrapper class for the native StereoPanner audio node.
 */
export class StereoPanner extends BlipNode {
  readonly name: string = 'StereoPanner'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<StereoPannerParam, AudioParam>

  private stereoPanner: StereoPannerNode

  constructor(props: StereoPannerProps = {}) {
    super(props)
    this.stereoPanner = this.AC.createStereoPanner()
    this.inputs = [this.stereoPanner]
    this.outputs = [this.stereoPanner]
    this.params = {
      [STEREO_PANNER_PARAM.PAN]: this.stereoPanner.pan,
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }
    this.setPan(initProps.pan)

    return this
  }

  // - Getters -
  /** Get the current pan value. */
  public getPan = () => this.params[STEREO_PANNER_PARAM.PAN].value

  // - Setters -
  /** Set the pan of the node. */
  public setPan = (val: number, time?: number) =>
    this._timeUpdate(this.params[STEREO_PANNER_PARAM.PAN], val, time)
}
