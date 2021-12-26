import {
  BlipNode,
  BlipNodeProps,
  InputNode,
  OutputNode,
} from '../core/BlipNode'
import { Delay, DELAY_PARAM } from '../core/Delay'
import { Filter, FILTER_PARAM } from '../core/Filter'
import { Gain, GAIN_PARAM } from '../core/Gain'

export const FEEDBACK_DELAY_PARAM = {
  DELAY_TIME: 'delayTime',
  FEEDBACK: 'feedback',
  TONE: 'tone',
} as const

type FeedbackDelayParam =
  typeof FEEDBACK_DELAY_PARAM[keyof typeof FEEDBACK_DELAY_PARAM]

type FeedbackDelayProps = BlipNodeProps & {
  amount?: number
  delayTime?: number
  feedback?: number
  tone?: number
}

const defaultProps: Required<Omit<FeedbackDelayProps, 'AC'>> = {
  amount: 0,
  delayTime: 0.2,
  feedback: 0.6,
  tone: 4400,
} as const

/**
 * A feedback delay effect to adds echos and other delay-based effects to the incoming signal.
 */
export class FeedbackDelay extends BlipNode {
  readonly name: string = 'FeedbackDelay'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<FeedbackDelayParam, AudioParam>

  private amount: number
  private dryGain: Gain
  private delay: Delay
  private feedbackGain: Gain
  private tone: Filter
  private wetGain: Gain

  constructor(props: FeedbackDelayProps) {
    super(props)
    this.amount = 0
    this.dryGain = new Gain({ AC: this.AC })
    this.delay = new Delay({ AC: this.AC })
    this.feedbackGain = new Gain({ AC: this.AC })
    this.tone = new Filter({ AC: this.AC })
    this.wetGain = new Gain({ AC: this.AC })
    this.inputs = [this.dryGain, this.delay]
    this.outputs = [this.dryGain, this.wetGain]
    this.params = {
      [FEEDBACK_DELAY_PARAM.DELAY_TIME]:
        this.delay.params[DELAY_PARAM.DELAY_TIME],
      [FEEDBACK_DELAY_PARAM.FEEDBACK]:
        this.feedbackGain.params[GAIN_PARAM.GAIN],
      [FEEDBACK_DELAY_PARAM.TONE]: this.tone.params[FILTER_PARAM.FREQUENCY],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setAmount(initProps.amount)
    this.setDelayTime(initProps.delayTime)
    this.setFeedback(initProps.feedback)
    this.setTone(initProps.tone)

    // Connections
    this.delay.connect(this.feedbackGain)
    this.feedbackGain.connect(this.tone)
    this.feedbackGain.connect(this.delay)
    this.tone.connect(this.wetGain)

    return this
  }

  // - Getters -
  /** Get the dry/wet amount of the node. */
  public getAmount = () => this.amount

  /** Get the delay time of the node. */
  public getDelayTime = () => this.delay.getDelayTime()

  /** Get the feedback of the node. */
  public getFeedback = () => this.feedbackGain.getGain()

  /** Get the tone value of the node. */
  public getTone = () => this.tone.getFrequency()

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

  /** Set the delay time of the node. */
  public setDelayTime = (val: number, time?: number) =>
    this.delay.setDelayTime(val, time)

  /** Set the feedback value of the node. */
  public setFeedback = (val: number, time?: number) =>
    this.feedbackGain.setGain(val, time)

  /** Set the tone value of the node. */
  public setTone = (val: number, time?: number) =>
    this.tone.setFrequency(val, time)
}
