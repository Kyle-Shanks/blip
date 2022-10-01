import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'
import { FilterType, FILTER_TYPE } from '../../util/constants'

export const FILTER_PARAM = {
  DETUNE: 'detune',
  FREQUENCY: 'frequency',
  GAIN: 'gain',
  Q: 'Q',
} as const

type FilterParam = typeof FILTER_PARAM[keyof typeof FILTER_PARAM]

type BaseFilterProps = {
  frequency?: number
  q?: number
  detune?: number
  gain?: number
  type?: FilterType
}

const defaultProps: Required<BaseFilterProps> = {
  frequency: 11000,
  q: 0,
  detune: 0,
  gain: 0,
  type: FILTER_TYPE.LOWPASS,
} as const

type FilterProps = BlipNodeProps & BaseFilterProps

/**
 * A Node used to filter frequencies of the incoming signal.
 * Wrapper class for the native BiquadFilter audio node.
 */
export class Filter extends BlipNode {
  readonly name: string = 'Filter'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<FilterParam, AudioParam>

  private filter: BiquadFilterNode

  constructor(props: FilterProps = {}) {
    super(props)
    this.filter = this.AC.createBiquadFilter()
    this.inputs = [this.filter]
    this.outputs = [this.filter]
    this.params = {
      [FILTER_PARAM.DETUNE]: this.filter.detune,
      [FILTER_PARAM.FREQUENCY]: this.filter.frequency,
      [FILTER_PARAM.GAIN]: this.filter.gain,
      [FILTER_PARAM.Q]: this.filter.Q,
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }
    this.setFrequency(initProps.frequency)
    this.setQ(initProps.q)
    this.setGain(initProps.gain)
    this.setDetune(initProps.detune)
    this.setType(initProps.type)

    return this
  }

  // - Getters -
  /** Get the current detune. */
  public getDetune = () => this.params[FILTER_PARAM.DETUNE].value

  /** Get the current frequency. */
  public getFrequency = () => this.params[FILTER_PARAM.FREQUENCY].value

  /** Get the current gain. */
  public getGain = () => this.params[FILTER_PARAM.GAIN].value

  /** Get the current q value. */
  public getQ = () => this.params[FILTER_PARAM.Q].value

  /** Get the current filter type. */
  public getType = () => this.filter.type

  // - Setters -
  /** Set the detune of the filter. */
  public setDetune = (val: number, time?: number) =>
    this._timeUpdate(this.params[FILTER_PARAM.DETUNE], val, time)

  /** Set the cutoff frequency of the filter. */
  public setFrequency = (val: number, time?: number) =>
    this._timeUpdate(this.params[FILTER_PARAM.FREQUENCY], val, time)

  /** Set the gain of the filter. */
  public setGain = (val: number, time?: number) =>
    this._timeUpdate(this.params[FILTER_PARAM.GAIN], val, time)

  /** Set the q value of the filter. */
  public setQ = (val: number, time?: number) =>
    this._timeUpdate(this.params[FILTER_PARAM.Q], val, time)

  /** Set the type of the filter. */
  public setType = (val: FilterType) => (this.filter.type = val)
}
