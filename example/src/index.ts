import * as Blip from 'blip'

const context = Blip.getContext()
const poly = new Blip.PolySynth({
  type: 'triangle',
  gainAmount: 0.2,
  gainAttack: 0.005,
  gainDecay: 0,
  gainSustain: 0.4,
  gainRelease: 0.005,
})

poly.toDestination()

// Keyboard setup
const keyboard = new Blip.Keyboard({
  onPress: ({ note }) => {
    // Start context when the user tries to play a note
    if (context.state === 'suspended') context.resume()

    poly.triggerAttack(note)
  },
  onRelease: ({ note }) => {
    poly.triggerRelease(note)
  },
})

// Start keyboard listeners
keyboard.on()

// @ts-ignore
window.Blip = Blip
// @ts-ignore
window.poly = poly

console.log({ poly })
