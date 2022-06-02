import { maxOctave, midiNoteMap, minOctave, Note, Octave } from 'util/noteUtil'
import { clamp } from 'util/util'

// Key to midi mapping for 0th octave
const keyMidiMap: Record<string, number> = {
  'a': 12,
  'w': 13,
  's': 14,
  'e': 15,
  'd': 16,
  'f': 17,
  't': 18,
  'g': 19,
  'y': 20,
  'h': 21,
  'u': 22,
  'j': 23,
  'k': 24,
  'o': 25,
  'l': 26,
  'p': 27,
  ';': 28
}

const keyToNote = (key: string, octave: Octave): Note | null => {
  const midi = keyMidiMap[key]
  if (!midi) return null

  return `${midiNoteMap[midi]}${octave}`
}

type KeyboardProps = {
  onPress?: (note: Note, e: KeyboardEvent) => void
  onRelease?: (note: Note, e: KeyboardEvent) => void
}

const defaultProps: Required<KeyboardProps> = {
  onPress: () => {},
  onRelease: () => {}
}

/**
 * A general-purpose Keyboard input class to give users a piano-like interface to interact with projects.
 * Uses A-; keys to play notes. The Z and X keys change the octave
 */
export class Keyboard {
  readonly onPress: (note: Note, e: KeyboardEvent) => void
  readonly onRelease: (note: Note, e: KeyboardEvent) => void

  private octave: Octave = 4
  private velocity: number = 100

  constructor(props: KeyboardProps) {
    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.onPress = initProps.onPress
    this.onRelease = initProps.onRelease

    return this
  }

  /** Start event listening for the keyboard. */
  public on = () => {
    window.addEventListener('keydown', this._keydown)
    window.addEventListener('keyup', this._keyup)
  }

  /** Stop event listening for the keyboard. */
  public off = () => {
    window.removeEventListener('keydown', this._keydown)
    window.removeEventListener('keyup', this._keyup)
  }

  // - Getters -
  /** Get the current octave */
  public getOctave = () => this.octave

  /** Get the current velocity */
  public getVelocity = () => this.velocity

  // - Setters -
  /** Set the current octave */
  public setOctave = (val: Octave) => (this.octave = val)

  /** Set the current velocity */
  public setVelocity = (val: number) => (this.velocity = val)

  // - Private Methods -
  // Event handling methods
  private _keydown = (e: KeyboardEvent) => {
    if (e.repeat) return

    // Additional commands
    switch (e.key) {
      case 'z':
        return this._octaveDown()
      case 'x':
        return this._octaveUp()
      case 'c':
        return this._velocityDown()
      case 'v':
        return this._velocityUp()
    }

    const note = keyToNote(e.key, this.octave)
    if (note !== null) this.onPress(note, e)
  }

  private _keyup = (e: KeyboardEvent) => {
    const note = keyToNote(e.key, this.octave)
    if (note !== null) this.onRelease(note, e)
  }

  // Octave methods
  private _octaveDown = () => {
    if (this.octave > minOctave) this.octave--
  }

  private _octaveUp = () => {
    if (this.octave < maxOctave) this.octave++
  }

  // Velocity methods
  private _velocityDown = () => {
    this.velocity = clamp(this.velocity - 8, 0, 127)
  }

  private _velocityUp = () => {
    this.velocity = clamp(this.velocity + 8, 0, 127)
  }
}
