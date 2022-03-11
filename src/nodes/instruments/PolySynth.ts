import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'
import { MonoSynth, MONO_SYNTH_PARAM } from './MonoSynth'
import { Limiter } from '../core/Limiter'
import {
  FilterType,
  FILTER_TYPE,
  WAVEFORM,
  Waveform,
} from '../../util/constants'
import { Note } from '../../util/noteUtil'
import { clamp } from '../../util/util'

export const POLY_SYNTH_PARAM = {
  DETUNE: 'detune',
  FREQUENCY: 'frequency',
  GAIN: 'gain',
  FILTER_DETUNE: 'filterDetune',
  FILTER_FREQUENCY: 'filterFrequency',
  FILTER_GAIN: 'filterGain',
  FILTER_Q: 'filterQ',
}

type PolySynthParam = typeof POLY_SYNTH_PARAM[keyof typeof POLY_SYNTH_PARAM]

type BasePolySynthProps = {
  polyphony?: number
  waveform?: Waveform
  frequency?: number
  detune?: number
  gainAttack?: number
  gainDecay?: number
  gainSustain?: number
  gainRelease?: number
  gainAmount?: number
  filterFrequency?: number
  filterQ?: number
  filterDetune?: number
  filterGain?: number
  filterType?: FilterType
  filterAttack?: number
  filterDecay?: number
  filterSustain?: number
  filterRelease?: number
  filterAmount?: number
}

const defaultProps = {
  polyphony: 8,
  waveform: WAVEFORM.SINE,
  frequency: 440,
  detune: 0,
  gainAttack: 0,
  gainDecay: 0,
  gainSustain: 1,
  gainRelease: 0,
  gainAmount: 0.15,
  filterFrequency: 2000,
  filterQ: 0,
  filterDetune: 0,
  filterGain: 0,
  filterType: FILTER_TYPE.LOWPASS,
  filterAttack: 0,
  filterDecay: 0,
  filterSustain: 1,
  filterRelease: 0,
  filterAmount: 6000,
}

type PolySynthProps = BlipNodeProps & BasePolySynthProps

/**
 * General-purpose polyphonic synth node that supports up to 8 voices.
 * Built using MonoSynths connected to a Limiter.
 */
export class PolySynth extends BlipNode {
  readonly name: string = 'PolySynth'
  readonly outputs: OutputNode[]
  readonly params: Record<PolySynthParam, AudioParam[]>

  private voices: MonoSynth[]
  private limiter: Limiter
  private polyphony: number = 8
  private voicePos: number = 0

  constructor(props: PolySynthProps = {}) {
    super(props)
    this.voices = Array(8)
      .fill(0)
      .map((_) => new MonoSynth({ AC: this.AC }))
    this.limiter = new Limiter({ AC: this.AC })
    this.outputs = [this.limiter]

    this.params = {
      [POLY_SYNTH_PARAM.DETUNE]: this.voices.map(
        (voice) => voice.params[MONO_SYNTH_PARAM.DETUNE]
      ),
      [POLY_SYNTH_PARAM.FREQUENCY]: this.voices.map(
        (voice) => voice.params[MONO_SYNTH_PARAM.FREQUENCY]
      ),
      [POLY_SYNTH_PARAM.GAIN]: this.voices.map(
        (voice) => voice.params[MONO_SYNTH_PARAM.GAIN]
      ),
      [POLY_SYNTH_PARAM.FILTER_DETUNE]: this.voices.map(
        (voice) => voice.params[MONO_SYNTH_PARAM.FILTER_DETUNE]
      ),
      [POLY_SYNTH_PARAM.FILTER_FREQUENCY]: this.voices.map(
        (voice) => voice.params[MONO_SYNTH_PARAM.FILTER_FREQUENCY]
      ),
      [POLY_SYNTH_PARAM.FILTER_GAIN]: this.voices.map(
        (voice) => voice.params[MONO_SYNTH_PARAM.FILTER_GAIN]
      ),
      [POLY_SYNTH_PARAM.FILTER_Q]: this.voices.map(
        (voice) => voice.params[MONO_SYNTH_PARAM.FILTER_Q]
      ),
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setPolyphony(initProps.polyphony)

    this.voices.forEach((voice) => {
      voice.setType(initProps.waveform)
      voice.setFrequency(initProps.frequency)
      voice.setDetune(initProps.detune)
      voice.setGainAttack(initProps.gainAttack)
      voice.setGainDecay(initProps.gainDecay)
      voice.setGainSustain(initProps.gainSustain)
      voice.setGainRelease(initProps.gainRelease)
      voice.setGainAmount(initProps.gainAmount)
      voice.setFilterType(initProps.filterType)
      voice.setFilterFrequency(initProps.filterFrequency)
      voice.setFilterQ(initProps.filterQ)
      voice.setFilterDetune(initProps.filterDetune)
      voice.setFilterGain(initProps.filterGain)
      voice.setFilterAttack(initProps.filterAttack)
      voice.setFilterDecay(initProps.filterDecay)
      voice.setFilterSustain(initProps.filterSustain)
      voice.setFilterRelease(initProps.filterRelease)
      voice.setFilterAmount(initProps.filterAmount)

      voice.connect(this.limiter)
    })

    return this
  }

  // - Getters -
  /** Get the polyphony setting of the node */
  public getPolyphony = () => this.polyphony

  /** Get the waveform of the node's oscillators */
  public getType = () => this.voices[0].getType()

  /** Get the detune of the node's oscillators */
  public getDetune = () => this.voices[0].getDetune()

  /** Get the attack time of the gain envelope */
  public getGainAttack = () => this.voices[0].getGainAttack()

  /** Get the decay time of the gain envelope */
  public getGainDecay = () => this.voices[0].getGainDecay()

  /** Get the sustain value of the gain envelope */
  public getGainSustain = () => this.voices[0].getGainSustain()

  /** Get the release time of the gain envelope */
  public getGainRelease = () => this.voices[0].getGainRelease()

  /** Get the gain modifier of the gain envelope */
  public getGainAmount = () => this.voices[0].getGainAmount()

  /** Get the frequency of the filter envelope's filter */
  public getFilterFrequency = () => this.voices[0].getFilterFrequency()

  /** Get the detune of the filter envelope's filter */
  public getFilterDetune = () => this.voices[0].getFilterDetune()

  /** Get the Q value of the filter envelope's filter */
  public getFilterQ = () => this.voices[0].getFilterQ()

  /** Get the gain value of the filter envelope's filter */
  public getFilterGain = () => this.voices[0].getFilterGain()

  /** Get the filter type of the filter envelope's filter */
  public getFilterType = () => this.voices[0].getFilterType()

  /** Get the attack time of the filter envelope */
  public getFilterAttack = () => this.voices[0].getFilterAttack()

  /** Get the decay time of the filter envelope */
  public getFilterDecay = () => this.voices[0].getFilterDecay()

  /** Get the sustain value of the filter envelope */
  public getFilterSustain = () => this.voices[0].getFilterSustain()

  /** Get the release time of the filter envelope */
  public getFilterRelease = () => this.voices[0].getFilterRelease()

  /** Get the frequency modifier of the filter envelope */
  public getFilterAmount = () => this.voices[0].getFilterAmount()

  // - Setters -
  /** Set the maximum number of active voices for the node. (Min = 1, Max = 8) */
  public setPolyphony = (val: number) => (this.polyphony = clamp(val, 1, 8))

  /** Set the waveform for each of the node's oscillators. */
  public setType = (val: Waveform) =>
    this.voices.forEach((voice) => voice.setType(val))

  /** Set the detune for each of the node's oscillators. */
  public setDetune = (val: number, time?: number) =>
    this.voices.forEach((voice) => voice.setDetune(val, time))

  /** Set the attack time of the gain envelope. */
  public setGainAttack = (val: number) =>
    this.voices.forEach((voice) => voice.setGainAttack(val))

  /** Set the attack time of the gain envelope. */
  public setGainDecay = (val: number) =>
    this.voices.forEach((voice) => voice.setGainDecay(val))

  /** Set the sustain value of the gain envelope. */
  public setGainSustain = (val: number) =>
    this.voices.forEach((voice) => voice.setGainSustain(val))

  /** Set the release time of the gain envelope. */
  public setGainRelease = (val: number) =>
    this.voices.forEach((voice) => voice.setGainRelease(val))

  /** Set the gain modifier of the gain envelope. */
  public setGainAmount = (val: number) =>
    this.voices.forEach((voice) => voice.setGainAmount(val))

  /** Set the cutoff frequency of the filter envelope's filter. */
  public setFilterFrequency = (val: number, time?: number) =>
    this.voices.forEach((voice) => voice.setFilterFrequency(val, time))

  /** Set the detune of the filter envelope's filter. */
  public setFilterDetune = (val: number, time?: number) =>
    this.voices.forEach((voice) => voice.setFilterDetune(val, time))

  /** Set the Q value of the filter envelope's filter. */
  public setFilterQ = (val: number, time?: number) =>
    this.voices.forEach((voice) => voice.setFilterQ(val, time))

  /** Set the gain of the filter envelope's filter. */
  public setFilterGain = (val: number, time?: number) =>
    this.voices.forEach((voice) => voice.setFilterGain(val, time))

  /** Set the filter type of the filter envelope's filter. */
  public setFilterType = (val: FilterType) =>
    this.voices.forEach((voice) => voice.setFilterType(val))

  /** Set the attack time of the filter envelope. */
  public setFilterAttack = (val: number) =>
    this.voices.forEach((voice) => voice.setFilterAttack(val))

  /** Set the attack time of the filter envelope. */
  public setFilterDecay = (val: number) =>
    this.voices.forEach((voice) => voice.setFilterDecay(val))

  /** Set the sustain value of the filter envelope. */
  public setFilterSustain = (val: number) =>
    this.voices.forEach((voice) => voice.setFilterSustain(val))

  /** Set the release time of the filter envelope. */
  public setFilterRelease = (val: number) =>
    this.voices.forEach((voice) => voice.setFilterRelease(val))

  /** Set the frequency modifier of the filter envelope. */
  public setFilterAmount = (val: number) =>
    this.voices.forEach((voice) => voice.setFilterAmount(val))

  // - Note Methods -
  /** Play the given note or array of notes. */
  public triggerAttack = (note: Note | Note[]) => {
    // If note is an array of notes, play each
    if (Array.isArray(note)) {
      note.forEach((n) => this.triggerAttack(n))
      return
    }

    // Play single note
    if (this.voices[this.voicePos].getCurrentNote() === null) {
      this._voiceTriggerAttack(this.voices[this.voicePos], note)
    } else {
      const initialPos = this.voicePos
      this._incrementVoicePos()

      while (this.voicePos !== initialPos) {
        if (this.voices[this.voicePos].getCurrentNote() === null) break
        this._incrementVoicePos()
      }
      this._voiceTriggerAttack(this.voices[this.voicePos], note)
    }

    this._incrementVoicePos()
  }

  /**
   * Release the note or array of notes given.
   * If a note is not given, it will release all current notes being played.
   */
  public triggerRelease = (note?: Note | Note[]) => {
    // If note is an array of notes, release each
    if (Array.isArray(note)) {
      note.forEach((n) => this.triggerRelease(n))
      return
    }

    // Release single note
    this.voices.forEach((voice) => this._voiceTriggerRelease(voice, note))
  }

  /**
   * Stop the note or array of notes given.
   * If a note is not given, it will stop all current notes being played.
   */
  public triggerStop = (note?: Note | Note[]) => {
    // If note is an array of notes, release each
    if (Array.isArray(note)) {
      note.forEach((n) => this.triggerStop(n))
      return
    }

    // Stop single note
    const targetVoices = this.voices.filter(
      (voice) => voice.getCurrentNote() === note
    )
    targetVoices.forEach((voice) => this._voiceTriggerStop(voice))
  }

  // - Private Methods -
  private _incrementVoicePos = () =>
    (this.voicePos = (this.voicePos + 1) % this.polyphony)

  private _voiceTriggerAttack = (voice: MonoSynth, note: Note) =>
    voice.triggerAttack(note)
  private _voiceTriggerRelease = (voice: MonoSynth, note?: Note) =>
    voice.triggerRelease(note)
  private _voiceTriggerStop = (voice: MonoSynth) => voice.triggerStop()
}
