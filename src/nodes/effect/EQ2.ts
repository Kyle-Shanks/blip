import {
  BlipNode,
  BlipNodeProps,
  InputNode,
  OutputNode
} from '../core/BlipNode'
import { Filter, FILTER_PARAM } from '../core/Filter'
import { FILTER_TYPE } from '../../util/constants'

export const EQ2_PARAM = {
  LOW_FREQUENCY: 'lowFrequency',
  LOW_GAIN: 'lowGain',
  HIGH_FREQUENCY: 'highFrequency',
  HIGH_GAIN: 'highGain'
} as const

type EQ2Param = typeof EQ2_PARAM[keyof typeof EQ2_PARAM]

type BaseEQ2Props = {
  lowFrequency?: number
  lowGain?: number
  highFrequency?: number
  highGain?: number
}

const defaultProps: Required<BaseEQ2Props> = {
  lowFrequency: 320,
  lowGain: 0,
  highFrequency: 3200,
  highGain: 0
} as const

type EQ2Props = BlipNodeProps & BaseEQ2Props

/**
 * A 2-band equalizer node for adjusting the gain of the high and low frequencies of the incoming signal.
 */
export class EQ2 extends BlipNode {
  readonly name: string = 'EQ2'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<EQ2Param, AudioParam>

  private low: Filter
  private high: Filter

  constructor(props: EQ2Props = {}) {
    super(props)
    this.low = new Filter({
      AC: this.AC,
      type: FILTER_TYPE.LOW_SHELF,
      frequency: 320
    })
    this.high = new Filter({
      AC: this.AC,
      type: FILTER_TYPE.HIGH_SHELF,
      frequency: 3200
    })
    this.inputs = [this.low]
    this.outputs = [this.high]
    this.params = {
      lowFrequency: this.low.params[FILTER_PARAM.FREQUENCY],
      lowGain: this.low.params[FILTER_PARAM.GAIN],
      highFrequency: this.high.params[FILTER_PARAM.FREQUENCY],
      highGain: this.high.params[FILTER_PARAM.GAIN]
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setLowFrequency(initProps.lowFrequency)
    this.setLowGain(initProps.lowGain)
    this.setHighFrequency(initProps.highFrequency)
    this.setHighGain(initProps.highGain)

    // Connections
    this.low.connect(this.high)

    return this
  }

  // - Getters -
  /** Get the frequency of the low band. */
  public getLowFrequency = () => this.low.getFrequency()

  /** Get the gain value of the low band. */
  public getLowGain = () => this.low.getGain()

  /** Get the frequency of the high band. */
  public getHighFrequency = () => this.high.getFrequency()

  /** Get the gain value of the high band. */
  public getHighGain = () => this.high.getGain()

  // - Setters -
  /** Set the frequency of the low band. */
  public setLowFrequency = (val: number, time?: number) =>
    this.low.setFrequency(val, time)

  /** Set the gain value of the low band. */
  public setLowGain = (val: number, time?: number) =>
    this.low.setGain(val, time)

  /** Set the frequency of the high band. */
  public setHighFrequency = (val: number, time?: number) =>
    this.high.setFrequency(val, time)

  /** Set the gain value of the high band. */
  public setHighGain = (val: number, time?: number) =>
    this.high.setGain(val, time)
}
