import { BlipNode } from '../nodes/core/BlipNode'

// - Context Functions -
let GLOBAL_CONTEXT: AudioContext | null = null

/** Returns the global audio context */
export const getContext = () => {
  if (GLOBAL_CONTEXT === null) GLOBAL_CONTEXT = new AudioContext()

  return GLOBAL_CONTEXT
}

/** Set the global audio context */
export const setContext = (context: AudioContext) => {
  GLOBAL_CONTEXT = context
}

export const resume = () => getContext().resume()

// - Helper Functions -
/** Clamp a number between a given min and max. */
export const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val))

/** Connect a series of synth nodes together. */
export const chain = (...nodes: BlipNode[]) => {
  if (nodes.length < 2) return

  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].connect(nodes[i + 1])
  }
}
