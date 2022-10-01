import {
  BlipNode,
  BlipNodeProps,
  InputNode,
  OutputNode,
} from '../core/BlipNode'
import { StereoPanner, STEREO_PANNER_PARAM } from '../core/StereoPanner'
import { LFO, LFO_PARAM } from '../source/LFO'
import { Waveform, WAVEFORM } from '../../util/constants'

export const AUTO_PAN_PARAM = {
  DEPTH: 'depth',
  RATE: 'rate',
} as const

type AutoPanParam = typeof AUTO_PAN_PARAM[keyof typeof AUTO_PAN_PARAM]

type BaseAutoPanProps = {
  depth?: number
  rate?: number
  type?: Waveform
}

const defaultProps: Required<BaseAutoPanProps> = {
  depth: 1,
  rate: 1,
  type: WAVEFORM.SINE,
} as const

type AutoPanProps = BlipNodeProps & BaseAutoPanProps

/**
 * An effect used to pan the incoming signal back and forth at an adjustable rate and depth.
 * Composed of an LFO connected to a StereoPanner node.
 */
export class AutoPan extends BlipNode {
  readonly name: string = 'AutoPan'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<AutoPanParam, AudioParam>

  private LFO: LFO
  private panner: StereoPanner

  constructor(props: AutoPanProps = {}) {
    super(props)
    this.LFO = new LFO({ AC: this.AC, start: true })
    this.panner = new StereoPanner({ AC: this.AC })
    this.inputs = [this.panner]
    this.outputs = [this.panner]
    this.params = {
      [AUTO_PAN_PARAM.DEPTH]: this.LFO.params[LFO_PARAM.DEPTH],
      [AUTO_PAN_PARAM.RATE]: this.LFO.params[LFO_PARAM.RATE],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setRate(initProps.rate)
    this.setDepth(initProps.depth)
    this.setType(initProps.type)

    // Connections
    this.LFO.connect(this.panner.params[STEREO_PANNER_PARAM.PAN])

    return this
  }

  // - Getters -
  /** Get the depth of the pan modulation. */
  public getDepth = () => this.LFO.getDepth()

  /** Get the rate of the pan modulation. */
  public getRate = () => this.LFO.getRate()

  /** Get the waveform of the pan modulation. */
  public getType = () => this.LFO.getType()

  // - Setters -
  /** Set the depth of the pan modulation. */
  public setDepth = (val: number, time?: number) => this.LFO.setDepth(val, time)

  /** Set the rate of the pan modulation. */
  public setRate = (val: number, time?: number) => this.LFO.setRate(val, time)

  /** Set the waveform of the pan modulation. */
  public setType = (val: Waveform) => this.LFO.setType(val)
}
