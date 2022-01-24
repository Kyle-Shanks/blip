import {
  BlipNode,
  BlipNodeProps,
  InputNode,
  OutputNode,
} from '../core/BlipNode'
import { Gain, GAIN_PARAM } from '../core/Gain'
import { WaveShaper } from '../core/WaveShaper'

type BaseDistortionProps = {
  amount?: number
  distortion?: number
}

const defaultProps: Required<BaseDistortionProps> = {
  amount: 0,
  distortion: 0,
} as const

type DistortionProps = BlipNodeProps & BaseDistortionProps

/**
 * An effect used to clip/distort the incoming signal.
 */
export class Distortion extends BlipNode {
  readonly name: string = 'Distortion'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]

  private distortion: number
  private dryGain: Gain
  private wetGain: Gain
  private waveShaper: WaveShaper

  constructor(props: DistortionProps = {}) {
    super(props)
    this.distortion = 0
    this.dryGain = new Gain({ AC: this.AC })
    this.wetGain = new Gain({ AC: this.AC })
    this.waveShaper = new WaveShaper({ AC: this.AC })
    this.inputs = [this.dryGain, this.waveShaper]
    this.outputs = [this.dryGain, this.wetGain]

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setAmount(initProps.amount)
    this.setDistortion(initProps.distortion)

    // Connections
    this.waveShaper.connect(this.wetGain)

    return this
  }

  // - Getters -
  /** Get the dry/wet amount level of the node. */
  public getAmount = () => this.wetGain.getGain()

  /** Get the distortion value of the node. */
  public getDistortion = () => this.distortion

  // - Setters -
  /** Set the dry/wet amount of the node. */
  public setAmount = (val: number, time?: number) => {
    this._linearFadeUpdate(
      this.dryGain.params[GAIN_PARAM.GAIN],
      this.wetGain.params[GAIN_PARAM.GAIN],
      val,
      time
    )
  }

  /** Set the distortion value of the node. */
  public setDistortion = (val: number) => {
    this.waveShaper.setCurve(this._createDistCurve(val))
    this.distortion = val
  }

  // Generate distortion curve
  private _createDistCurve = (gain = 0) => {
    const sampleNum = this.AC.sampleRate
    const curve = new Float32Array(sampleNum)

    return curve.map((_, i) => {
      const x = (i * 2) / sampleNum - 1
      return (
        ((3 + gain) * Math.atan(Math.sinh(x * 0.25) * 5)) /
        (Math.PI + gain * Math.abs(x))
      )
    })
  }
}
