import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'
import { Compressor, COMPRESSOR_PARAM } from './Compressor'
import { Gain, GAIN_PARAM } from './Gain'

export const LIMITER_PARAM = {
  KNEE: 'knee',
  THRESHOLD: 'threshold',
  RATIO: 'ratio',
  ATTACK: 'attack',
  RELEASE: 'release',
  GAIN: 'gain',
} as const

type LimiterParam = typeof LIMITER_PARAM[keyof typeof LIMITER_PARAM]

type BaseLimiterProps = {
  threshold?: number
  ratio?: number
  knee?: number
  attack?: number
  release?: number
  gain?: number
}

const defaultProps: Required<BaseLimiterProps> = {
  threshold: -6,
  ratio: 20,
  knee: 0,
  attack: 0.003,
  release: 0.01,
  gain: 0.75,
} as const

type LimiterProps = BlipNodeProps & BaseLimiterProps

/**
 * An effect used to limit the dynamic range of the incoming signal.
 * Built using a Compressor node with more aggressive settings connected to a Gain node.
 */
export class Limiter extends BlipNode {
  readonly name: string = 'Limiter'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<LimiterParam, AudioParam>

  private limiter: Compressor
  private gain: Gain

  constructor(props: LimiterProps = {}) {
    super(props)
    this.limiter = new Compressor({ AC: this.AC })
    this.gain = new Gain({ AC: this.AC })
    this.inputs = [this.limiter]
    this.outputs = [this.gain]
    this.params = {
      [LIMITER_PARAM.ATTACK]: this.limiter.params[COMPRESSOR_PARAM.ATTACK],
      [LIMITER_PARAM.GAIN]: this.gain.params[GAIN_PARAM.GAIN],
      [LIMITER_PARAM.KNEE]: this.limiter.params[COMPRESSOR_PARAM.KNEE],
      [LIMITER_PARAM.RATIO]: this.limiter.params[COMPRESSOR_PARAM.RATIO],
      [LIMITER_PARAM.RELEASE]: this.limiter.params[COMPRESSOR_PARAM.RELEASE],
      [LIMITER_PARAM.THRESHOLD]:
        this.limiter.params[COMPRESSOR_PARAM.THRESHOLD],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setThreshold(initProps.threshold)
    this.setRatio(initProps.ratio)
    this.setKnee(initProps.knee)
    this.setAttack(initProps.attack)
    this.setRelease(initProps.release)
    this.setGain(initProps.gain)

    // Connections
    this.limiter.connect(this.gain)

    return this
  }

  // - Getters -
  /** Get the current knee value. */
  public getKnee = () => this.limiter.getKnee()

  /** Get the threshold in dB. */
  public getThreshold = () => this.limiter.getThreshold()

  /** Get the compression ratio. */
  public getRatio = () => this.limiter.getRatio()

  /** Get the attack time. */
  public getAttack = () => this.limiter.getAttack()

  /** Get the release time. */
  public getRelease = () => this.limiter.getRelease()

  /** Get the current gain reduction in dB. */
  public getReduction = () => this.limiter.getReduction()

  /** Get the gain value of the output gain. */
  public getGain = () => this.gain.getGain()

  // - Setters -
  /** Set the knee value. */
  public setKnee = (val: number, time?: number) =>
    this.limiter.setKnee(val, time)

  /** Set the threshold. */
  public setThreshold = (val: number, time?: number) =>
    this.limiter.setThreshold(val, time)

  /** Set the compression ratio. */
  public setRatio = (val: number, time?: number) =>
    this.limiter.setRatio(val, time)

  /** Set the attack time. */
  public setAttack = (val: number, time?: number) =>
    this.limiter.setAttack(val, time)

  /** Set the release time. */
  public setRelease = (val: number, time?: number) =>
    this.limiter.setRelease(val, time)

  /** Set the gain value of the output. */
  public setGain = (val: number, time?: number) => this.gain.setGain(val, time)
}
