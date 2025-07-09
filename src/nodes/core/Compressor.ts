import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'

export const COMPRESSOR_PARAM = {
  ATTACK: 'attack',
  KNEE: 'knee',
  RATIO: 'ratio',
  RELEASE: 'release',
  THRESHOLD: 'threshold',
} as const

export type CompressorParam = (typeof COMPRESSOR_PARAM)[keyof typeof COMPRESSOR_PARAM]

type BaseCompressorProps = {
  attack?: number
  knee?: number
  ratio?: number
  release?: number
  threshold?: number
}

const defaultProps: Required<BaseCompressorProps> = {
  attack: 0.003,
  knee: 30,
  ratio: 12,
  release: 0.25,
  threshold: -24,
} as const

type CompressorProps = BlipNodeProps & BaseCompressorProps

/**
 * A node used to control the dynamic range of a signal.
 * Wrapper class for the native DynamicsCompressor audio node.
 */
export class Compressor extends BlipNode {
  readonly name: string = 'Compressor'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<CompressorParam, AudioParam>

  private compressor: DynamicsCompressorNode

  constructor(props: CompressorProps = {}) {
    super(props)
    this.compressor = this.AC.createDynamicsCompressor()
    this.inputs = [this.compressor]
    this.outputs = [this.compressor]
    this.params = {
      [COMPRESSOR_PARAM.ATTACK]: this.compressor.attack,
      [COMPRESSOR_PARAM.KNEE]: this.compressor.knee,
      [COMPRESSOR_PARAM.RATIO]: this.compressor.ratio,
      [COMPRESSOR_PARAM.RELEASE]: this.compressor.release,
      [COMPRESSOR_PARAM.THRESHOLD]: this.compressor.threshold,
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }
    this.setThreshold(initProps.threshold)
    this.setRatio(initProps.ratio)
    this.setKnee(initProps.knee)
    this.setAttack(initProps.attack)
    this.setRelease(initProps.release)

    return this
  }

  // - Getters -
  /** Get the threshold in dB. */
  public getThreshold = () => this.params[COMPRESSOR_PARAM.THRESHOLD].value

  /** Get the compression ratio. */
  public getRatio = () => this.params[COMPRESSOR_PARAM.RATIO].value

  /** Get the current knee value. */
  public getKnee = () => this.params[COMPRESSOR_PARAM.KNEE].value

  /** Get the attack time. */
  public getAttack = () => this.params[COMPRESSOR_PARAM.ATTACK].value

  /** Get the release time. */
  public getRelease = () => this.params[COMPRESSOR_PARAM.RELEASE].value

  /** Get the current gain reduction in dB. */
  public getReduction = () => this.compressor.reduction

  // - Setters -
  /** Set the threshold. */
  public setThreshold = (val: number, time?: number) =>
    this._timeUpdate(this.params[COMPRESSOR_PARAM.THRESHOLD], val, time)

  /** Set the compression ratio. */
  public setRatio = (val: number, time?: number) =>
    this._timeUpdate(this.params[COMPRESSOR_PARAM.RATIO], val, time)

  /** Set the knee value. */
  public setKnee = (val: number, time?: number) =>
    this._timeUpdate(this.params[COMPRESSOR_PARAM.KNEE], val, time)

  /** Set the attack time. */
  public setAttack = (val: number, time?: number) =>
    this._timeUpdate(this.params[COMPRESSOR_PARAM.ATTACK], val, time)

  /** Set the release time. */
  public setRelease = (val: number, time?: number) =>
    this._timeUpdate(this.params[COMPRESSOR_PARAM.RELEASE], val, time)
}
