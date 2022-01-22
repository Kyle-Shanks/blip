import {
  BlipNode,
  BlipNodeProps,
  InputNode,
  OutputNode,
} from '../core/BlipNode'
import { ConstantSource } from '../source/ConstantSource'

export type EnvelopeProps = BlipNodeProps & {
  attack?: number
  decay?: number
  sustain?: number
  release?: number
  modifier?: number
}

const defaultProps: Required<Omit<EnvelopeProps, 'AC'>> = {
  attack: 0,
  decay: 0,
  sustain: 1,
  release: 0,
  modifier: 1,
} as const

/**
 * A general-purpose ADSR envelope that can be connected to AudioParams to modulate values over time.
 * Built using a ConstantSource node.
 */
export class Envelope extends BlipNode {
  readonly name: string = 'Envelope'
  readonly outputs: OutputNode[]

  public attack: number
  public decay: number
  public sustain: number
  public release: number
  public modifier: number

  protected source: ConstantSource

  private timeoutIds: NodeJS.Timeout[]

  constructor(props: EnvelopeProps = {}) {
    super(props)
    this.source = new ConstantSource({ AC: this.AC, start: true })
    this.outputs = [this.source]

    this.timeoutIds = []
    this.attack = defaultProps.attack
    this.decay = defaultProps.decay
    this.sustain = defaultProps.sustain
    this.release = defaultProps.release
    this.modifier = defaultProps.modifier

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setAttack(initProps.attack)
    this.setDecay(initProps.decay)
    this.setSustain(initProps.sustain)
    this.setRelease(initProps.release)
    this.setModifier(initProps.modifier)

    this.source.setOffset(0)

    return this
  }

  /**
   * Connect this envelope to an AudioParam.
   * An array can be passed to connect to multiple destinations.
   */
  public connect = (destination: InputNode | InputNode[]) => {
    if (Array.isArray(destination)) {
      for (let i = 0; i < destination.length; i++) {
        if (!(destination[i] instanceof AudioParam)) {
          console.error('Envelopes must be connected to AudioParams')
          return this
        }
      }
    } else if (!(destination instanceof AudioParam)) {
      console.error('Envelopes must be connected to AudioParams')
      return this
    }

    this.connect(destination)

    return this
  }

  // - Getters -
  /** Get the attack time of the envelope. */
  public getAttack = () => this.attack

  /** Get the decay time of the envelope. */
  public getDecay = () => this.decay

  /** Get the sustain value of the envelope. */
  public getSustain = () => this.sustain

  /** Get the release time of the envelope. */
  public getRelease = () => this.release

  /** Get the modifier value of the envelope. */
  public getModifier = () => this.modifier

  // - Setters -
  /** Get the attack time of the envelope. */
  public setAttack = (val: number) => (this.attack = val)

  /** Get the decay time of the envelope. */
  public setDecay = (val: number) => (this.decay = val)

  /** Get the sustain value of the envelope. */
  public setSustain = (val: number) => (this.sustain = val)

  /** Get the release time of the envelope. */
  public setRelease = (val: number) => (this.release = val)

  /** Get the modifier value of the envelope. */
  public setModifier = (val: number) => (this.modifier = val)

  // - Trigger Methods -
  /**
   * Triggers the attack of the envelope.
   * Will automatically trigger the decay after the attack time.
   */
  public triggerAttack = () => {
    this._clearTimeouts()
    const sustainVal = this.sustain * this.modifier

    if (this.attack) {
      this.source.setOffset(0) // Reset to 0
      this.source.setOffset(this.modifier, this.attack) // Attack

      const timeoutId = setTimeout(() => {
        this.source.setOffset(sustainVal, this.decay) // Decay
      }, this.attack * 1000)

      this.timeoutIds.push(timeoutId)
    } else if (this.decay) {
      this.source.setOffset(this.modifier) // Reset to max
      this.source.setOffset(sustainVal, this.decay) // Decay
    } else if (this.sustain) {
      this.source.setOffset(sustainVal)
    }
  }

  /** Triggers the release of the envelope. */
  public triggerRelease = () => {
    this._clearTimeouts()
    this.source.setOffset(0, this.release) // Release
  }

  /** Triggers an instant stop of the envelope. */
  public triggerStop = () => {
    this._clearTimeouts()
    this.source.setOffset(0)
  }

  // - Private Methods -
  private _clearTimeouts = () =>
    this.timeoutIds.forEach((id) => clearTimeout(id))
}
