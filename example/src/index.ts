import * as Blip from 'blip'

const context = Blip.getContext()
const poly = new Blip.PolySynth({
  type: 'triangle',
  gainAmount: 0.4,
  gainAttack: 0.004,
  gainDecay: 0.15,
  gainSustain: 0,
  gainRelease: 0.15,
})

poly.toDestination()

// Keyboard setup
const keyboard = new Blip.Keyboard({
  onPress: ({ note }) => {
    // Start context when the user tries to play a note
    if (context.state === 'suspended') context.resume()

    poly.triggerAttack(note)
  },
  onRelease: () => {
    poly.triggerRelease()
  },
})

// Start keyboard listeners
keyboard.on()

// @ts-ignore
window.Blip = Blip
// @ts-ignore
window.poly = poly

console.log({ poly })
