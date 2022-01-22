import {
  BlipNode,
  BlipNodeProps,
  InputNode,
  OutputNode,
} from '../core/BlipNode'
import { Gain, GAIN_PARAM } from '../core/Gain'
import { LFO, LFO_PARAM } from '../source/LFO'
import { Waveform, WAVEFORM } from '../../util/constants'

export const TREMOLO_PARAM = {
  DEPTH: 'depth',
  RATE: 'rate',
} as const

type TremoloParam = typeof TREMOLO_PARAM[keyof typeof TREMOLO_PARAM]

type TremoloProps = BlipNodeProps & {
  depth?: number
  rate?: number
  type?: Waveform
}

const defaultProps: Required<Omit<TremoloProps, 'AC'>> = {
  depth: 1,
  rate: 1,
  type: WAVEFORM.SINE,
} as const

/**
 * An effect used to modulate the gain of the incoming signal at an adjustable rate and depth.
 * Composed of an LFO connected to a Gain node.
 */
export class Tremolo extends BlipNode {
  readonly name: string = 'Tremolo'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<TremoloParam, AudioParam>

  private LFO: LFO
  private gain: Gain

  constructor(props: TremoloProps = {}) {
    super(props)
    this.LFO = new LFO({ AC: this.AC, start: true })
    this.gain = new Gain({ AC: this.AC, gain: 0 })
    this.inputs = [this.gain]
    this.outputs = [this.gain]
    this.params = {
      depth: this.LFO.params[LFO_PARAM.DEPTH],
      rate: this.LFO.params[LFO_PARAM.RATE],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setRate(initProps.rate)
    this.setDepth(initProps.depth)
    this.setType(initProps.type)

    // Connections
    this.LFO.connect(this.gain.params[GAIN_PARAM.GAIN])

    return this
  }

  // - Getters -
  /** Get the depth of the gain modulation. */
  public getDepth = () => this.LFO.getDepth()

  /** Get the rate of the gain modulation. */
  public getRate = () => this.LFO.getRate()

  /** Get the waveform of the gain modulation. */
  public getType = () => this.LFO.getType()

  // - Setters -
  /** Set the depth of the gain modulation. */
  public setDepth = (val: number, time?: number) => this.LFO.setDepth(val, time)

  /** Set the rate of the gain modulation. */
  public setRate = (val: number, time?: number) => this.LFO.setRate(val, time)

  /** Set the waveform of the gain modulation. */
  public setType = (val: Waveform) => this.LFO.setType(val)
}
