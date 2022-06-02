import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'

export const BUFFER_SOURCE_PARAM = {
  DETUNE: 'detune',
  PLAYBACK_RATE: 'playbackRate'
} as const

type BufferSourceParam =
  typeof BUFFER_SOURCE_PARAM[keyof typeof BUFFER_SOURCE_PARAM]

type BaseBufferSourceProps = {
  buffer?: AudioBuffer | null
  detune?: number
  loop?: boolean
  playbackRate?: number
  start?: boolean
}

const defaultProps: Required<BaseBufferSourceProps> = {
  buffer: null,
  detune: 0,
  loop: false,
  playbackRate: 1.0,
  start: false
} as const

type BufferSourceProps = BlipNodeProps & BaseBufferSourceProps

/**
 * A source node that outputs signal based on a provided audio buffer.
 * Wrapper class for the native AudioBufferSourceNode.
 */
export class BufferSource extends BlipNode {
  readonly name: string = 'BufferSource'
  readonly outputs: OutputNode[]
  readonly params: Record<BufferSourceParam, AudioParam>

  private bufferSource: AudioBufferSourceNode

  constructor(props: BufferSourceProps = {}) {
    super(props)
    this.bufferSource = this.AC.createBufferSource()
    this.outputs = [this.bufferSource]
    this.params = {
      [BUFFER_SOURCE_PARAM.DETUNE]: this.bufferSource.detune,
      [BUFFER_SOURCE_PARAM.PLAYBACK_RATE]: this.bufferSource.playbackRate
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setBuffer(initProps.buffer)
    this.setLoop(initProps.loop)
    this.setDetune(initProps.detune)
    this.setPlaybackRate(initProps.playbackRate)

    if (initProps.start) this.start()

    return this
  }

  /** Starts output from the source node */
  public start = () => this.bufferSource.start()

  /** Stops output from the source node */
  public stop = () => this.bufferSource.stop()

  // - Getters -
  /** Get the current buffer of the source node */
  public getBuffer = () => this.bufferSource.buffer

  /** Get the current loop setting */
  public getLoop = () => this.bufferSource.loop

  /** Get the current detune value */
  public getDetune = () => this.params[BUFFER_SOURCE_PARAM.DETUNE].value

  /** Get the current playback rate */
  public getPlaybackRate = () =>
    this.params[BUFFER_SOURCE_PARAM.PLAYBACK_RATE].value

  // - Setters -
  /** Set the buffer of the source node */
  public setBuffer = (val: AudioBuffer | null) =>
    (this.bufferSource.buffer = val)

  /** Set the loop value of the source node */
  public setLoop = (val: boolean) => (this.bufferSource.loop = val)

  /** Set the detune value of the source node */
  public setDetune = (val: number, time?: number) =>
    this._timeUpdate(this.params[BUFFER_SOURCE_PARAM.DETUNE], val, time)

  /** Set the playback rate of the source node */
  public setPlaybackRate = (val: number, time?: number) =>
    this._timeUpdate(this.params[BUFFER_SOURCE_PARAM.PLAYBACK_RATE], val, time)
}
