import { BlipNode, BlipNodeProps, InputNode, OutputNode } from '../core/BlipNode'

export const CHORUS_PARAM = {} as const

type ChorusParam = (typeof CHORUS_PARAM)[keyof typeof CHORUS_PARAM]

type BaseChorusProps = {}

const defaultProps: Required<BaseChorusProps> = {}

type ChorusProps = BlipNodeProps & BaseChorusProps

// TODO: Fill out this effect node
// Based on this sites diagram: https://mynewmicrophone.com/complete-guide-to-the-chorus-audio-modulation-effect/

/**
 * TODO: Update the description
 * Chorus Effect
 */
export class Chorus extends BlipNode {
  readonly name: string = 'Chorus'
  readonly inputs: InputNode[]
  readonly outputs: OutputNode[]
  readonly params: Record<ChorusParam, AudioParam>

  constructor(props: ChorusProps = {}) {
    super(props)

    // Initialize
    const initProps = { ...defaultProps, ...props }

    // Connections

    return this
  }
}
