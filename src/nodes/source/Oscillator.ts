import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'
import { WAVEFORM, Waveform } from '../../util/constants'

export const OSCILLATOR_PARAM = {
  DETUNE: 'detune',
  FREQUENCY: 'frequency',
} as const

type OscillatorParam = typeof OSCILLATOR_PARAM[keyof typeof OSCILLATOR_PARAM]

type BaseOscillatorProps = {
  detune?: number
  frequency?: number
  start?: boolean
  type?: Waveform
}

const defaultProps: Required<BaseOscillatorProps> = {
  detune: 0,
  frequency: 440,
  start: false,
  type: WAVEFORM.SINE,
} as const

type OscillatorProps = BlipNodeProps & BaseOscillatorProps

/**
 * A source node that outputs signal of different waveforms and frequencies.
 * Wrapper class for the native Oscillator audio node.
 */
export class Oscillator extends BlipNode {
  readonly name: string = 'Oscillator'
  readonly outputs: OutputNode[]
  readonly params: Record<OscillatorParam, AudioParam>

  private oscillator: OscillatorNode

  constructor(props: OscillatorProps = {}) {
    super(props)
    this.oscillator = this.AC.createOscillator()
    this.outputs = [this.oscillator]
    this.params = {
      [OSCILLATOR_PARAM.DETUNE]: this.oscillator.detune,
      [OSCILLATOR_PARAM.FREQUENCY]: this.oscillator.frequency,
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setType(initProps.type)
    this.setFrequency(initProps.frequency)
    this.setDetune(initProps.detune)

    if (initProps.start) this.start()

    return this
  }

  /** Starts the oscillator */
  public start = () => this.oscillator.start()

  /** Stops the oscillator */
  public stop = () => this.oscillator.stop()

  // - Getters -
  /** Get the oscillator frequency */
  public getFrequency = () => this.params[OSCILLATOR_PARAM.FREQUENCY].value

  /** Get the detune of the oscillator */
  public getDetune = () => this.params[OSCILLATOR_PARAM.DETUNE].value

  /** Get the waveform of the oscillator (Alias for getType) */
  // public getWaveform = () => this.getType()

  /** Get the waveform of the oscillator */
  public getType = () => this.oscillator.type

  // - Setters -
  /** Set the frequency of the oscillator */
  public setFrequency = (val: number, time?: number) =>
    this._timeUpdate(this.params[OSCILLATOR_PARAM.FREQUENCY], val, time)

  /** Set the detune of the oscillator */
  public setDetune = (val: number, time?: number) =>
    this._timeUpdate(this.params[OSCILLATOR_PARAM.DETUNE], val, time)

  /** Set the waveform of the oscillator (Alias for setType) */
  // public setWaveform = (val: Waveform) => this.setType(val)

  /** Set the waveform of the oscillator */
  public setType = (val: Waveform) => (this.oscillator.type = val)
}
