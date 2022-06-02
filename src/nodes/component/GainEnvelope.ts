import { Envelope, BaseEnvelopeProps } from './Envelope'
import { BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode'
import { Gain, GAIN_PARAM } from '../core/Gain'

export const GAIN_ENVELOPE_PARAM = {
  GAIN: 'gain'
} as const

type GainEnvelopeParam =
  typeof GAIN_ENVELOPE_PARAM[keyof typeof GAIN_ENVELOPE_PARAM]

type BaseGainEnvelopeProps = BaseEnvelopeProps & {
  gain?: number
}

const defaultProps: Required<BaseGainEnvelopeProps> = {
  gain: 0,
  attack: 0,
  decay: 0,
  sustain: 1,
  release: 0,
  modifier: 1
} as const

type GainEnvelopeProps = BlipNodeProps & BaseGainEnvelopeProps

/**
 * An envelope connected to a gain node.
 * Can be used to modulate the gain of the incoming signal over time.
 */
export class GainEnvelope extends Envelope {
  readonly name: string = 'GainEnvelope'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<GainEnvelopeParam, AudioParam>

  private gain: Gain

  constructor(props: GainEnvelopeProps = {}) {
    super(props)
    this.gain = new Gain({ AC: this.AC })
    this.inputs = [this.gain]
    this.outputs = [this.gain]
    this.params = {
      [GAIN_ENVELOPE_PARAM.GAIN]: this.gain.params[GAIN_PARAM.GAIN]
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setGain(initProps.gain)

    // Connections
    this.source.connect(this.gain.params[GAIN_PARAM.GAIN])

    return this
  }

  // - Getters -
  /** Get the base gain value on the gain node. */
  public getGain = () => this.gain.getGain()

  // - Setters -
  /** Set the base gain value of the gain node. */
  public setGain = (val: number, time?: number) => this.gain.setGain(val, time)
}
