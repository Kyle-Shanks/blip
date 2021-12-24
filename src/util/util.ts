import { BlipNode } from '../nodes/core/BlipNode'

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
