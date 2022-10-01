import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'

export const DELAY_PARAM = {
  DELAY_TIME: 'delayTime',
} as const

type DelayParam = typeof DELAY_PARAM[keyof typeof DELAY_PARAM]

type BaseDelayProps = {
  delayTime?: number
}

const defaultProps: Required<BaseDelayProps> = {
  delayTime: 0,
} as const

type DelayProps = BlipNodeProps & BaseDelayProps

/**
 * A node used to adjust the gain, or volume, of the incoming signal.
 * Wrapper class for the native Gain audio node.
 */
export class Delay extends BlipNode {
  readonly name: string = 'Delay'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<DelayParam, AudioParam>

  private delay: DelayNode

  constructor(props: DelayProps = {}) {
    super(props)
    this.delay = this.AC.createDelay()
    this.inputs = [this.delay]
    this.outputs = [this.delay]
    this.params = {
      [DELAY_PARAM.DELAY_TIME]: this.delay.delayTime,
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }
    this.setDelayTime(initProps.delayTime)

    return this
  }

  // - Getters -
  /** Get the current delay time value. */
  public getDelayTime = () => this.params[DELAY_PARAM.DELAY_TIME].value

  // - Setters -
  /** Set the delay time of the node. */
  public setDelayTime = (val: number, time?: number) =>
    this._timeUpdate(this.params[DELAY_PARAM.DELAY_TIME], val, time)
}
