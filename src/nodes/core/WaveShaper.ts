import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'
import { OVERSAMPLE, Oversample } from '../../util/constants'

type WaveShaperProps = BlipNodeProps & {
  curve?: Float32Array | null
  oversample?: Oversample
}

const defaultProps: Required<Omit<WaveShaperProps, 'AC'>> = {
  curve: null,
  oversample: OVERSAMPLE.NONE,
} as const

/**
 * A Node used to adjust the shape of the incoming signal based on a waveshaping curve.
 * Wrapper class for the native WaveShaper audio node.
 */
export class WaveShaper extends BlipNode {
  readonly name: string = 'WaveShaper'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]

  private waveShaper: WaveShaperNode

  constructor(props: WaveShaperProps) {
    super(props)
    this.waveShaper = this.AC.createWaveShaper()
    this.inputs = [this.waveShaper]
    this.outputs = [this.waveShaper]

    // Initialize
    const initProps = { ...defaultProps, ...props }
    this.setCurve(initProps.curve)
    this.setOversample(initProps.oversample)

    return this
  }

  // - Getters -
  /** Get the current curve. */
  public getCurve = () => this.waveShaper.curve

  /** Get the current oversample value. */
  public getOversample = () => this.waveShaper.oversample

  // - Setters -
  /** Set the node's waveshaping curve. */
  public setCurve = (val: Float32Array | null) => (this.waveShaper.curve = val)

  /** Set the node's oversample setting. */
  public setOversample = (val: Oversample) => (this.waveShaper.oversample = val)
}
