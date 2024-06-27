import { getContext, Keyboard, PolySynth, FMSynth } from 'blip'

const context = getContext()
const poly = new PolySynth({
  type: 'triangle',
  gainAmount: 0.2,
  gainAttack: 0.005,
  gainDecay: 0,
  gainSustain: 0.7,
  gainRelease: 0.005,
})

poly.toDestination()

const fm = new FMSynth()
fm.getAlgorithm()
fm.toDestination()

// Keyboard setup
const keyboard = new Keyboard({
  onPress: ({ note }) => {
    // Start context when the user tries to play a note
    if (context.state === 'suspended') context.resume()

    poly.triggerAttack(note)
  },
  onRelease: ({ note }) => poly.triggerRelease(note),
})

// Start keyboard listeners
keyboard.on()

// window.Blip = Blip
// window.poly = poly
// console.log({ poly })
