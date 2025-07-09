import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode'
import { ChannelMerger } from '../core/ChannelMerger'
import { Convolver } from '../core/Convolver'
import { Gain, GAIN_PARAM } from '../core/Gain'
import { NoiseGenerator } from '../source/NoiseGenerator'

type BaseReverbProps = {
  amount?: number
  buffer?: AudioBuffer | null
  normalize?: boolean
}

const defaultProps: Required<BaseReverbProps> = {
  amount: 0,
  buffer: null,
  normalize: false,
} as const

type ReverbProps = BlipNodeProps & BaseReverbProps

// TODO: Add a tone filter to adjust the brightness/darkness of the wet signal before going into the convolver

/**
 * A convolusion reverb effect to adds width and space effects to the incoming signal.
 * A default impulse response will be generated if one is not provided.
 */
export class Reverb extends BlipNode {
  readonly name: string = 'Reverb'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]

  private amount: number
  private dryGain: Gain
  private convolver: Convolver
  private wetGain: Gain

  constructor(props: ReverbProps = {}) {
    super(props)
    this.amount = 0
    this.dryGain = new Gain({ AC: this.AC })
    this.convolver = new Convolver({ AC: this.AC })
    this.wetGain = new Gain({ AC: this.AC })
    this.inputs = [this.dryGain, this.convolver]
    this.outputs = [this.dryGain, this.wetGain]

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setAmount(initProps.amount)
    this.setBuffer(initProps.buffer)
    this.setNormalize(initProps.normalize)

    // Generate a default buffer if one is not provided
    if (!this.getBuffer()) this._generateBuffer()

    // Connections
    this.convolver.connect(this.wetGain)

    return this
  }

  // - Getters -
  /** Get the dry/wet amount of the node. */
  public getAmount = () => this.amount

  /** Get the current audio buffer of the node. */
  public getBuffer = () => this.convolver.getBuffer()

  /** Get the current normalize value of the node. */
  public getNormalize = () => this.convolver.getNormalize()

  // - Setters -
  /** Set the dry/wet amount of the node. */
  public setAmount = (val: number, time?: number) => {
    this.amount = val
    this._dryWetUpdate(
      this.dryGain.params[GAIN_PARAM.GAIN],
      this.wetGain.params[GAIN_PARAM.GAIN],
      val,
      time
    )
  }

  /** Set the audio buffer of the node. */
  public setBuffer = (val: AudioBuffer | null) => this.convolver.setBuffer(val)

  /** Set the normalize value of the node. */
  public setNormalize = (val: boolean) => this.convolver.setNormalize(val)

  // Helper function to generate a default buffer
  private _generateBuffer = () => {
    const preDelay = 0.01
    const decay = 0.5
    const sampleRate = this.AC.sampleRate

    // Use noise generators to create the impulse
    const context = new OfflineAudioContext(2, (preDelay + decay) * 5 * sampleRate, sampleRate)
    const noiseL = new NoiseGenerator({ AC: context, start: true })
    const noiseR = new NoiseGenerator({ AC: context, start: true })
    const channelMerger = new ChannelMerger({ AC: context })
    const gain = new Gain({ AC: context })

    noiseL.connect(channelMerger, 0, 0)
    noiseR.connect(channelMerger, 0, 1)
    channelMerger.connect(gain)
    gain.connect(context.destination)

    // Set envelope for the gain node
    gain.params[GAIN_PARAM.GAIN].setValueAtTime(0, context.currentTime)
    gain.params[GAIN_PARAM.GAIN].setTargetAtTime(0.05, context.currentTime, preDelay)
    gain.params[GAIN_PARAM.GAIN].setTargetAtTime(0, context.currentTime + preDelay, decay)

    // Render and set the buffer
    context.startRendering().then((buffer) => this.setBuffer(buffer))
  }
}
