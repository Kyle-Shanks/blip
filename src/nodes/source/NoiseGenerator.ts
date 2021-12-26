import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'
import { BufferSource } from './BufferSource'
import { NoiseType, NOISE_TYPE } from '../../util/constants'

const getBuffer = (AC: BaseAudioContext) => {
  const bufferSize = AC.sampleRate * 2
  return AC.createBuffer(1, bufferSize, AC.sampleRate)
}

const getWhiteNoiseBuffer = (buffer: AudioBuffer) => {
  const data = buffer.getChannelData(0)

  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  return buffer
}

const getBrownNoiseBuffer = (buffer: AudioBuffer) => {
  const data = buffer.getChannelData(0)

  let lastVal = 0.0
  for (let i = 0; i < data.length; i++) {
    const gainMakeup = 4
    const white = Math.random() * 2 - 1
    data[i] = ((lastVal + 0.02 * white) * gainMakeup) / 1.02
    lastVal = data[i] / gainMakeup
  }

  return buffer
}

const getPinkNoiseBuffer = (buffer: AudioBuffer) => {
  const data = buffer.getChannelData(0)

  let b0, b1, b2, b3, b4, b5, b6
  b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0
  for (let i = 0; i < data.length; i++) {
    const gainMakeup = 0.11
    const white = Math.random() * 2 - 1

    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.969 * b2 + white * 0.153852
    b3 = 0.8665 * b3 + white * 0.3104856
    b4 = 0.55 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.016898
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * gainMakeup
    b6 = white * 0.115926
  }

  return buffer
}

const typeBufferMap: Record<NoiseType, (buffer: AudioBuffer) => AudioBuffer> = {
  [NOISE_TYPE.WHITE]: getWhiteNoiseBuffer,
  [NOISE_TYPE.PINK]: getPinkNoiseBuffer,
  [NOISE_TYPE.BROWN]: getBrownNoiseBuffer,
}

type NoiseGeneratorProps = BlipNodeProps & {
  start?: boolean
  type?: NoiseType
}

const defaultProps: Required<Omit<NoiseGeneratorProps, 'AC'>> = {
  start: false,
  type: NOISE_TYPE.WHITE,
}

/**
 * A source node that outputs three types of noise using a BufferSource node.
 * Can output white, pink, or brown noise.
 */
export class NoiseGenerator extends BlipNode {
  readonly name: string = 'NoiseGenerator'
  readonly outputs: OutputNode[]

  public type: NoiseType

  private bufferSource: BufferSource

  constructor(props: NoiseGeneratorProps) {
    super(props)
    this.bufferSource = new BufferSource({ AC: this.AC, loop: true })
    this.outputs = [this.bufferSource]
    this.type = NOISE_TYPE.WHITE

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setType(initProps.type)

    if (initProps.start) this.start()

    return this
  }

  /** Starts output from the source node */
  public start = () => this.bufferSource.start()

  /** Stops output from the source node */
  public stop = () => this.bufferSource.stop()

  // - Getters -
  /** Get the current noise type */
  public getType = () => this.type

  // - Setters -
  /** Set the noise type that is output */
  public setType = (val: NoiseType) => {
    this.type = val
    const sourceBuffer = this.bufferSource.getBuffer()

    if (sourceBuffer !== null) {
      typeBufferMap[this.type](sourceBuffer)
    } else {
      const buffer = getBuffer(this.AC)
      this.bufferSource.setBuffer(typeBufferMap[this.type](buffer))
    }
  }
}
