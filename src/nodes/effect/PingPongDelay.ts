import {
  BlipNode,
  BlipNodeProps,
  InputNode,
  OutputNode,
} from '../core/BlipNode'
import { ChannelMerger } from '../core/ChannelMerger'
import { Delay, DELAY_PARAM } from '../core/Delay'
import { Gain, GAIN_PARAM } from '../core/Gain'
import { Filter, FILTER_PARAM } from '../core/Filter'

export const PING_PONG_DELAY_PARAM = {
  PRE_DELAY_TIME: 'preDelayTime',
  LEFT_DELAY_TIME: 'leftDelayTime',
  RIGHT_DELAY_TIME: 'rightDelayTime',
  LEFT_FEEDBACK: 'leftFeedback',
  RIGHT_FEEDBACK: 'rightFeedback',
  TONE: 'tone',
} as const

type PingPongDelayParam =
  typeof PING_PONG_DELAY_PARAM[keyof typeof PING_PONG_DELAY_PARAM]

type BasePingPongDelayProps = {
  amount?: number
  preDelayTime?: number
  leftDelayTime?: number
  rightDelayTime?: number
  leftFeedback?: number
  rightFeedback?: number
  tone?: number
}

const defaultProps: Required<BasePingPongDelayProps> = {
  amount: 0,
  preDelayTime: 0.2,
  leftDelayTime: 0.2,
  rightDelayTime: 0.2,
  leftFeedback: 0.6,
  rightFeedback: 0.6,
  tone: 4400,
} as const

type PingPongDelayProps = BlipNodeProps & BasePingPongDelayProps

/**
 * A ping pong delay effect to adds echos and other delay-based effects to the incoming signal.
 */
export class PingPongDelay extends BlipNode {
  readonly name: string = 'PingPongDelay'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<PingPongDelayParam, AudioParam>

  private amount: number
  private dryGain: Gain
  private leftDelay: Delay
  private preDelay: Delay
  private rightDelay: Delay
  private leftFeedbackGain: Gain
  private rightFeedbackGain: Gain
  private channelMerger: ChannelMerger
  private tone: Filter
  private wetGain: Gain

  constructor(props: PingPongDelayProps = {}) {
    super(props)
    this.amount = 0
    this.dryGain = new Gain({ AC: this.AC })
    this.leftDelay = new Delay({ AC: this.AC })
    this.preDelay = new Delay({ AC: this.AC })
    this.rightDelay = new Delay({ AC: this.AC })
    this.leftFeedbackGain = new Gain({ AC: this.AC })
    this.rightFeedbackGain = new Gain({ AC: this.AC })
    this.channelMerger = new ChannelMerger({ AC: this.AC })
    this.tone = new Filter({ AC: this.AC })
    this.wetGain = new Gain({ AC: this.AC })

    this.inputs = [this.dryGain, this.leftDelay, this.preDelay]
    this.outputs = [this.dryGain, this.wetGain]
    this.params = {
      preDelayTime: this.preDelay.params[DELAY_PARAM.DELAY_TIME],
      leftDelayTime: this.leftDelay.params[DELAY_PARAM.DELAY_TIME],
      rightDelayTime: this.rightDelay.params[DELAY_PARAM.DELAY_TIME],
      leftFeedback: this.leftFeedbackGain.params[GAIN_PARAM.GAIN],
      rightFeedback: this.rightFeedbackGain.params[GAIN_PARAM.GAIN],
      tone: this.tone.params[FILTER_PARAM.FREQUENCY],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setAmount(initProps.amount)
    this.setPreDelayTime(initProps.preDelayTime)
    this.setLeftDelayTime(initProps.leftDelayTime)
    this.setRightDelayTime(initProps.rightDelayTime)
    this.setLeftFeedback(initProps.leftFeedback)
    this.setRightFeedback(initProps.rightFeedback)
    this.setTone(initProps.tone)

    // Connections
    this.preDelay.connect(this.rightDelay)
    this.leftDelay.connect(this.channelMerger, 0, 0)
    this.rightDelay.connect(this.channelMerger, 0, 1)
    this.leftDelay.connect(this.leftFeedbackGain)
    this.leftFeedbackGain.connect(this.rightDelay)
    this.rightDelay.connect(this.rightFeedbackGain)
    this.rightFeedbackGain.connect(this.leftDelay)
    this.channelMerger.connect(this.tone)
    this.tone.connect(this.wetGain)

    return this
  }

  // - Getters -
  /** Get the dry/wet amount of the node. */
  public getAmount = () => this.amount

  /** Get the initial delay time of the node. */
  public getPreDelayTime = () => this.params.preDelayTime.value

  /** Get the left delay time of the node. */
  public getLeftDelayTime = () => this.params.leftDelayTime.value

  /** Get the right delay time of the node. */
  public getRightDelayTime = () => this.params.rightDelayTime.value

  /** Get the left feedback of the node. */
  public getLeftFeedback = () => this.params.leftFeedback.value

  /** Get the right feedback of the node. */
  public getRightFeedback = () => this.params.rightFeedback.value

  /** Get the tone value of the node. */
  public getTone = () => this.params.tone.value

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

  /** Set the initial delay time of the node. */
  public setPreDelayTime = (val: number, time?: number) =>
    this.preDelay.setDelayTime(val, time)

  /** Set the left delay time of the node. */
  public setLeftDelayTime = (val: number, time?: number) =>
    this.leftDelay.setDelayTime(val, time)

  /** Set the right delay time of the node. */
  public setRightDelayTime = (val: number, time?: number) =>
    this.rightDelay.setDelayTime(val, time)

  /** Set the left feedback value of the node. */
  public setLeftFeedback = (val: number, time?: number) =>
    this.leftFeedbackGain.setGain(val, time)

  /** Set the right feedback value of the node. */
  public setRightFeedback = (val: number, time?: number) =>
    this.rightFeedbackGain.setGain(val, time)

  /** Set the tone value of the node. */
  public setTone = (val: number, time?: number) =>
    this.tone.setFrequency(val, time)
}
