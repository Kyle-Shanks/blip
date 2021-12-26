import { Envelope, EnvelopeProps } from './Envelope'
import { InputNode, OutputNode } from '../core/BlipNode'
import { Filter, FILTER_PARAM } from '../core/Filter'
import { FilterType, FILTER_TYPE } from '../../util/constants'

export const FILTER_ENVELOPE_PARAM = {
  DETUNE: 'detune',
  FREQUENCY: 'frequency',
  GAIN: 'gain',
  Q: 'q',
} as const

type FilterEnvelopeParam =
  typeof FILTER_ENVELOPE_PARAM[keyof typeof FILTER_ENVELOPE_PARAM]

type FilterEnvelopeProps = EnvelopeProps & {
  frequency?: number
  q?: number
  detune?: number
  gain?: number
  type?: FilterType
}

const defaultProps: Required<Omit<FilterEnvelopeProps, 'AC'>> = {
  frequency: 2000,
  q: 0,
  detune: 0,
  gain: 0,
  type: FILTER_TYPE.LOWPASS,
  attack: 0,
  decay: 0,
  sustain: 1,
  release: 0,
  modifier: 1,
} as const

/**
 * An envelope connected to a filter node.
 * Can be used to modulate the sound and tone of the incoming signal over time.
 */
export class FilterEnvelope extends Envelope {
  readonly name: string = 'FilterEnvelope'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<FilterEnvelopeParam, AudioParam>

  private filter: Filter

  constructor(props: FilterEnvelopeProps) {
    super(props)
    this.filter = new Filter({ AC: this.AC })
    this.inputs = [this.filter]
    this.outputs = [this.filter]
    this.params = {
      [FILTER_ENVELOPE_PARAM.DETUNE]: this.filter.params[FILTER_PARAM.DETUNE],
      [FILTER_ENVELOPE_PARAM.FREQUENCY]:
        this.filter.params[FILTER_PARAM.FREQUENCY],
      [FILTER_ENVELOPE_PARAM.GAIN]: this.filter.params[FILTER_PARAM.GAIN],
      [FILTER_ENVELOPE_PARAM.Q]: this.filter.params[FILTER_PARAM.Q],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setFrequency(initProps.frequency)
    this.setQ(initProps.q)
    this.setDetune(initProps.detune)
    this.setGain(initProps.gain)
    this.setType(initProps.type)

    // Connections
    this.source.connect(this.filter.params[FILTER_PARAM.FREQUENCY])

    return this
  }

  // - Getters -
  /** Get the cutoff frequency of the filter node. */
  public getFrequency = () => this.filter.getFrequency()

  /** Get the q factor of the filter node. */
  public getQ = () => this.filter.getQ()

  /** Get the detune value of the filter node. */
  public getDetune = () => this.filter.getDetune()

  /** Get the gain value of the filter node. */
  public getGain = () => this.filter.getGain()

  /** Get the filter node's type. */
  public getType = () => this.filter.getType()

  // - Setters -
  /** Set the cutoff frequency of the filter node. */
  public setFrequency = (val: number, time?: number) =>
    this.filter.setFrequency(val, time)

  /** Set the q factor value of the filter node. */
  public setQ = (val: number, time?: number) => this.filter.setQ(val, time)

  /** Set the detune value of the filter node. */
  public setDetune = (val: number, time?: number) =>
    this.filter.setDetune(val, time)

  /** Set the gain value of the filter node. */
  public setGain = (val: number, time?: number) =>
    this.filter.setGain(val, time)

  /** Set the filter node's type. */
  public setType = (val: FilterType) => this.filter.setType(val)
}
