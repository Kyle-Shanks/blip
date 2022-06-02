import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'

type BaseConvolverProps = {
  buffer?: AudioBuffer | null
  normalize?: boolean
}

const defaultProps: Required<BaseConvolverProps> = {
  buffer: null,
  normalize: false
} as const

type ConvolverProps = BlipNodeProps & BaseConvolverProps

/** Wrapper class for the native Convolver audio node. */
export class Convolver extends BlipNode {
  readonly name: string = 'Convolver'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]

  private convolver: ConvolverNode

  constructor(props: ConvolverProps = {}) {
    super(props)
    this.convolver = this.AC.createConvolver()
    this.inputs = [this.convolver]
    this.outputs = [this.convolver]

    // Initialize
    const initProps = { ...defaultProps, ...props }
    this.setBuffer(initProps.buffer)
    this.setNormalize(initProps.normalize)

    return this
  }

  // - Getters -
  /** Get the current buffer value. */
  public getBuffer = () => this.convolver.buffer

  /** Get the current normalize value. */
  public getNormalize = () => this.convolver.normalize

  // - Setters -
  /** Set the convolver's buffer. */
  public setBuffer = (val: AudioBuffer | null) => (this.convolver.buffer = val)

  /** Sets the normalize value. */
  public setNormalize = (val: boolean) => (this.convolver.normalize = val)
}
