import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'
import { Gain, GAIN_PARAM } from '../core/Gain'
import { Oscillator, OSCILLATOR_PARAM } from './Oscillator'
import { Waveform, WAVEFORM } from '../../util/constants'
import { clamp } from '../../util/util'

const MIN_RATE = 0
const MAX_RATE = 100

export const LFO_PARAM = {
  DEPTH: 'depth',
  DETUNE: 'detune',
  RATE: 'rate',
} as const

type LFOParam = (typeof LFO_PARAM)[keyof typeof LFO_PARAM]

type BaseLFOProps = {
  depth?: number
  detune?: number
  rate?: number
  start?: boolean
  type?: Waveform
}

const defaultProps: Required<BaseLFOProps> = {
  depth: 1,
  detune: 0,
  rate: 1,
  start: false,
  type: WAVEFORM.SINE,
} as const

type LFOProps = BlipNodeProps & BaseLFOProps

/**
 * A source node that outputs low frequency oscillations for modulating audio params over time.
 * Built using an oscillator connected to a gain node.
 */
export class LFO extends BlipNode {
  readonly name: string = 'LFO'
  readonly outputs: OutputNode[]
  readonly params: Record<LFOParam, AudioParam>

  private depth: Gain
  private osc: Oscillator

  constructor(props: LFOProps = {}) {
    super(props)
    this.depth = new Gain({ AC: this.AC })
    this.osc = new Oscillator({ AC: this.AC })
    this.outputs = [this.depth]
    this.params = {
      [LFO_PARAM.DEPTH]: this.depth.params[GAIN_PARAM.GAIN],
      [LFO_PARAM.DETUNE]: this.osc.params[OSCILLATOR_PARAM.DETUNE],
      [LFO_PARAM.RATE]: this.osc.params[OSCILLATOR_PARAM.FREQUENCY],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setRate(initProps.rate)
    this.setDepth(initProps.depth)
    this.setDetune(initProps.detune)
    this.setType(initProps.type)

    // Connections
    this.osc.connect(this.depth)
    if (initProps.start) this.start()

    return this
  }

  /** Starts the oscillator */
  public start = () => this.osc.start()

  /** Stops the oscillator */
  public stop = () => this.osc.stop()

  // - Getters -
  /** Get the rate of the LFO */
  public getRate = () => this.osc.getFrequency()

  /** Get the detune of the LFO */
  public getDetune = () => this.osc.getDetune()

  /** Get the depth of the LFO */
  public getDepth = () => this.depth.getGain()

  /** Get the waveform of the LFO */
  public getType = () => this.osc.getType()

  // - Setters -
  /** Set the rate of the LFO. Max frequency is 100Hz. */
  public setRate = (val: number, time?: number) =>
    this.osc.setFrequency(clamp(val, MIN_RATE, MAX_RATE), time)

  /** Set the detune of the LFO. */
  public setDetune = (val: number, time?: number) => this.osc.setDetune(val, time)

  /** Set the depth of the LFO. */
  public setDepth = (val: number, time?: number) => this.depth.setGain(val, time)

  /** Set the waveform of the LFO. */
  public setType = (val: Waveform) => this.osc.setType(val)
}
