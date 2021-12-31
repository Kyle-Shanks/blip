import * as Blip from 'blip-nodes'

const AC = new AudioContext()
const osc1 = new Blip.Oscillator({ AC, start: true, type: 'triangle' })
const gain1 = new Blip.Gain({ AC, gain: 0 })

osc1.connect(gain1)
gain1.toDestination()

// @ts-ignore
window.AC = AC
// @ts-ignore
window.osc1 = osc1
// @ts-ignore
window.gain1 = gain1

console.log({ osc1 })
