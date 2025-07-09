import { Limiter, Osc } from '../nodes'
import { OSC_PARAM } from '../nodes/instruments/Osc'

const disconnectAll = (arr: Osc[]) => arr.forEach((mod) => mod.disconnect())

type AlgorithmFunction = (a: Osc, b: Osc, c: Osc, d: Osc, out: Limiter) => string

// Algorithms for FMSynth
export const fmAlgorithms: AlgorithmFunction[] = [
  // - Standard Algorithms -
  // A > B > C > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect(b.params[OSC_PARAM.FREQUENCY])
    b.connect(c.params[OSC_PARAM.FREQUENCY])
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return 'A > B > C > D'
  },

  // [A + B] > C > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect(c.params[OSC_PARAM.FREQUENCY])
    b.connect(c.params[OSC_PARAM.FREQUENCY])
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return '[A + B] > C > D'
  },

  // [A > B + C] > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect(b.params[OSC_PARAM.FREQUENCY])
    b.connect(d.params[OSC_PARAM.FREQUENCY])
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return '[A > B + C] > D'
  },

  // [[A > B] + [A > C]] > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([b.params[OSC_PARAM.FREQUENCY], c.params[OSC_PARAM.FREQUENCY]])
    b.connect(d.params[OSC_PARAM.FREQUENCY])
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return '[[A > B] + [A > C]] > D'
  },

  // [A > B > C] + [A > B > D]
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect(b.params[OSC_PARAM.FREQUENCY])
    b.connect([c.params[OSC_PARAM.FREQUENCY], d.params[OSC_PARAM.FREQUENCY]])
    c.connect(out)
    d.connect(out)

    return '[A > B > C] + [A > B > D]'
  },

  // [A > B > C] + D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect(b.params[OSC_PARAM.FREQUENCY])
    b.connect(c.params[OSC_PARAM.FREQUENCY])
    c.connect(out)
    d.connect(out)

    return '[A > B > C] + D'
  },

  // [A + B + C] > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect(d.params[OSC_PARAM.FREQUENCY])
    b.connect(d.params[OSC_PARAM.FREQUENCY])
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return '[A + B + C] > D'
  },

  // [A > B] + [C > D]
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect(b.params[OSC_PARAM.FREQUENCY])
    b.connect(out)
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return '[A > B] + [C > D]'
  },

  // [A > B] + [A > C] + [A > D]
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([
      b.params[OSC_PARAM.FREQUENCY],
      c.params[OSC_PARAM.FREQUENCY],
      d.params[OSC_PARAM.FREQUENCY],
    ])
    b.connect(out)
    c.connect(out)
    d.connect(out)

    return '[A > B] + [A > C] + [A > D]'
  },

  // [A > B] + C + D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect(b.params[OSC_PARAM.FREQUENCY])
    b.connect(out)
    c.connect(out)
    d.connect(out)

    return '[A > B] + C + D'
  },

  // A + B + C + D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect(out)
    b.connect(out)
    c.connect(out)
    d.connect(out)

    return 'A + B + C + D'
  },

  // - Feedback Algorithms -
  // [A > A] > B > C > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([a.params[OSC_PARAM.FREQUENCY], b.params[OSC_PARAM.FREQUENCY]])
    b.connect(c.params[OSC_PARAM.FREQUENCY])
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return '[A > A] > B > C > D'
  },

  // [[A > A] + B] > C > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([a.params[OSC_PARAM.FREQUENCY], c.params[OSC_PARAM.FREQUENCY]])
    b.connect(c.params[OSC_PARAM.FREQUENCY])
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return '[[A > A] + B] > C > D'
  },

  // [[A > A] + B > C] > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([a.params[OSC_PARAM.FREQUENCY], d.params[OSC_PARAM.FREQUENCY]])
    b.connect(c.params[OSC_PARAM.FREQUENCY])
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return '[[A > A] + B > C] > D'
  },

  // [[A > A] > B + C] > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([a.params[OSC_PARAM.FREQUENCY], b.params[OSC_PARAM.FREQUENCY]])
    b.connect(d.params[OSC_PARAM.FREQUENCY])
    c.connect(d.params[OSC_PARAM.FREQUENCY])
    d.connect(out)

    return '[[A > A] > B + C] > D'
  },

  // [A > A] > B + [C > C] > D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([a.params[OSC_PARAM.FREQUENCY], b.params[OSC_PARAM.FREQUENCY]])
    b.connect(out)
    c.connect([c.params[OSC_PARAM.FREQUENCY], d.params[OSC_PARAM.FREQUENCY]])
    d.connect(out)

    return '[A > A] > B + [C > C] > D'
  },

  // [A > A > B] + [A > A > C] + [A > A > D]
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([
      a.params[OSC_PARAM.FREQUENCY],
      b.params[OSC_PARAM.FREQUENCY],
      c.params[OSC_PARAM.FREQUENCY],
      d.params[OSC_PARAM.FREQUENCY],
    ])
    b.connect(out)
    c.connect(out)
    d.connect(out)

    return '[A > A > B] + [A > A > C] + [A > A > D]'
  },

  // [A > A > B] + C + D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([a.params[OSC_PARAM.FREQUENCY], b.params[OSC_PARAM.FREQUENCY]])
    b.connect(out)
    c.connect(out)
    d.connect(out)

    return '[A > A > B] + C + D'
  },

  // [A > A] + B + C + D
  (a, b, c, d, out) => {
    disconnectAll([a, b, c, d])

    a.connect([a.params[OSC_PARAM.FREQUENCY], out])
    b.connect(out)
    c.connect(out)
    d.connect(out)

    return '[A > A] + B + C + D'
  },
]
