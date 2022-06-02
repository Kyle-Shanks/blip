import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'
import { Gain, GAIN_PARAM } from '../core/Gain'
import { Oscillator, OSCILLATOR_PARAM } from '../source/Oscillator'
import { WAVEFORM, Waveform } from '../../util/constants'

export const OSC_PARAM = {
  DETUNE: 'detune',
  FREQUENCY: 'frequency',
  GAIN: 'gain'
} as const

type OscParam = typeof OSC_PARAM[keyof typeof OSC_PARAM]

type BaseOscProps = {
  detune?: number
  frequency?: number
  gain?: number
  type?: Waveform
}

const defaultProps: Required<BaseOscProps> = {
  detune: 0,
  frequency: 440,
  gain: 1,
  type: WAVEFORM.SINE
} as const

type OscProps = BlipNodeProps & BaseOscProps

/**
 * A general-purpose instrument composed of an Oscillator connected to a Gain node.
 */
export class Osc extends BlipNode {
  readonly name: string = 'Osc'
  readonly outputs: OutputNode[]
  readonly params: Record<OscParam, AudioParam>

  private gain: Gain
  private oscillator: Oscillator

  constructor(props: OscProps = {}) {
    super(props)
    this.oscillator = new Oscillator({ AC: this.AC, start: true })
    this.gain = new Gain({ AC: this.AC })
    this.outputs = [this.gain]

    this.params = {
      [OSC_PARAM.DETUNE]: this.oscillator.params[OSCILLATOR_PARAM.DETUNE],
      [OSC_PARAM.FREQUENCY]: this.oscillator.params[OSCILLATOR_PARAM.FREQUENCY],
      [OSC_PARAM.GAIN]: this.gain.params[GAIN_PARAM.GAIN]
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setType(initProps.type)
    this.setFrequency(initProps.frequency)
    this.setDetune(initProps.detune)
    this.setGain(initProps.gain)

    // Connections
    this.oscillator.connect(this.gain)

    return this
  }

  // - Getters -
  /** Get the detune of the oscillator. */
  public getDetune = () => this.oscillator.getDetune()

  /** Get the frequency of the oscillator. */
  public getFrequency = () => this.oscillator.getFrequency()

  /** Get the gain of the gain node. */
  public getGain = () => this.gain.getGain()

  /** Get the waveform of the oscillator.*/
  public getType = () => this.oscillator.getType()

  // - Setters -
  /** Set the detune of the oscillator. */
  public setDetune = (val: number, time?: number) =>
    this.oscillator.setDetune(val, time)

  /** Set the frequency of the oscillator. */
  public setFrequency = (val: number, time?: number) =>
    this.oscillator.setFrequency(val, time)

  /** Set the gain of the gain node. */
  public setGain = (val: number, time?: number) => this.gain.setGain(val, time)

  /** Set the waveform of the oscillator. */
  public setType = (val: Waveform) => this.oscillator.setType(val)
}
