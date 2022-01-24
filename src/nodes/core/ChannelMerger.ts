import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'

type BaseChannelMergerProps = {}

type ChannelMergerProps = BlipNodeProps & BaseChannelMergerProps

/**
 * A node used to merge two audio signals.
 * Wrapper class for the native ChannelMerger audio node.
 */
export class ChannelMerger extends BlipNode {
  readonly name: string = 'ChannelMerger'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]

  private channelMerger: ChannelMergerNode

  constructor(props: ChannelMergerProps = {}) {
    super(props)
    this.channelMerger = this.AC.createChannelMerger(2)
    this.inputs = [this.channelMerger]
    this.outputs = [this.channelMerger]

    return this
  }
}
