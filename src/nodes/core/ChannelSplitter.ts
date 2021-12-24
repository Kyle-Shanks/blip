import { BlipNode, BlipNodeProps, InputNode, OutputNode } from './BlipNode'

type ChannelSplitterProps = BlipNodeProps & {}

/**
 * A node used to split a stereo audio signal into its left and right components.
 * Wrapper class for the native ChannelSplitter audio node.
 */
export class ChannelSplitter extends BlipNode {
  readonly name: string = 'ChannelSplitter'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]

  private channelSplitter: ChannelSplitterNode

  constructor(props: ChannelSplitterProps) {
    super(props)
    this.channelSplitter = this.AC.createChannelSplitter(2)
    this.inputs = [this.channelSplitter]
    this.outputs = [this.channelSplitter]

    return this
  }
}
