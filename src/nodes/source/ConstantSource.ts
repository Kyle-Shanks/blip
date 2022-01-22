import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'

export const CONSTANT_SOURCE_PARAM = {
  OFFSET: 'offset',
} as const

type ConstantSourceParam =
  typeof CONSTANT_SOURCE_PARAM[keyof typeof CONSTANT_SOURCE_PARAM]

type ConstantSourceProps = BlipNodeProps & {
  offset?: number
  start?: boolean
}

const defaultProps: Required<Omit<ConstantSourceProps, 'AC'>> = {
  offset: 1,
  start: false,
} as const

/**
 * A source node that outputs a constant signal that can be adjusted.
 * Wrapper class for the native ConstantSource node.
 */
export class ConstantSource extends BlipNode {
  readonly name: string = 'ConstantSource'
  readonly outputs: OutputNode[]
  readonly params: Record<ConstantSourceParam, AudioParam>

  private source: ConstantSourceNode

  constructor(props: ConstantSourceProps = {}) {
    super(props)
    this.source = this.AC.createConstantSource()
    this.outputs = [this.source]
    this.params = {
      [CONSTANT_SOURCE_PARAM.OFFSET]: this.source.offset,
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setOffset(initProps.offset)

    if (initProps.start) this.start()

    return this
  }

  /** Starts output from the source node */
  public start = () => this.source.start()

  /** Stops output from the source node */
  public stop = () => this.source.stop()

  // - Getters -
  /** Get the current offset value of the source node */
  public getOffset = () => this.params[CONSTANT_SOURCE_PARAM.OFFSET]

  // - Setters -
  /** Set the offset value of the source node */
  public setOffset = (val: number, time?: number) =>
    this._timeUpdate(this.params[CONSTANT_SOURCE_PARAM.OFFSET], val, time)
}
