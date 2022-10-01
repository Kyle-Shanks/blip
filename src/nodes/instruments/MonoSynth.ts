import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'
import {
  FilterEnvelope,
  FILTER_ENVELOPE_PARAM,
} from '../component/FilterEnvelope'
import { GainEnvelope, GAIN_ENVELOPE_PARAM } from '../component/GainEnvelope'
import { Oscillator, OSCILLATOR_PARAM } from '../source/Oscillator'
import {
  FILTER_TYPE,
  FilterType,
  WAVEFORM,
  Waveform,
} from '../../util/constants'
import { getNoteFrequency, Note } from '../../util/noteUtil'

export const MONO_SYNTH_PARAM = {
  DETUNE: 'detune',
  FREQUENCY: 'frequency',
  GAIN: 'gain',
  FILTER_DETUNE: 'filterDetune',
  FILTER_FREQUENCY: 'filterFrequency',
  FILTER_GAIN: 'filterGain',
  FILTER_Q: 'filterQ',
} as const

type MonoSynthParam = typeof MONO_SYNTH_PARAM[keyof typeof MONO_SYNTH_PARAM]

type BaseMonoSynthProps = {
  detune?: number
  frequency?: number
  type?: Waveform
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

const defaultProps: Required<BaseMonoSynthProps> = {
  detune: 0,
  frequency: 440,
  type: WAVEFORM.SINE,
  gainAttack: 0,
  gainDecay: 0,
  gainSustain: 1,
  gainRelease: 0,
  gainAmount: 0.75,
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
} as const

type MonoSynthProps = BlipNodeProps & BaseMonoSynthProps

/**
 * General-purpose monophonic synth node.
 * Consists of an Oscillator connected to a GainEnvelope and FilterEnvelope.
 */
export class MonoSynth extends BlipNode {
  readonly name: string = 'MonoSynth'
  readonly outputs: OutputNode[]
  readonly params: Record<MonoSynthParam, AudioParam>

  private gainEnv: GainEnvelope
  private filterEnv: FilterEnvelope
  private oscillator: Oscillator
  private currentNote: Note | null

  constructor(props: MonoSynthProps = {}) {
    super(props)
    this.oscillator = new Oscillator({ AC: this.AC, start: true })
    this.gainEnv = new GainEnvelope({ AC: this.AC })
    this.filterEnv = new FilterEnvelope({ AC: this.AC })
    this.outputs = [this.filterEnv]
    this.currentNote = null

    this.params = {
      [MONO_SYNTH_PARAM.DETUNE]:
        this.oscillator.params[OSCILLATOR_PARAM.DETUNE],
      [MONO_SYNTH_PARAM.FREQUENCY]:
        this.oscillator.params[OSCILLATOR_PARAM.FREQUENCY],
      [MONO_SYNTH_PARAM.GAIN]: this.gainEnv.params[GAIN_ENVELOPE_PARAM.GAIN],
      [MONO_SYNTH_PARAM.FILTER_DETUNE]:
        this.filterEnv.params[FILTER_ENVELOPE_PARAM.DETUNE],
      [MONO_SYNTH_PARAM.FILTER_FREQUENCY]:
        this.filterEnv.params[FILTER_ENVELOPE_PARAM.FREQUENCY],
      [MONO_SYNTH_PARAM.FILTER_GAIN]:
        this.filterEnv.params[FILTER_ENVELOPE_PARAM.GAIN],
      [MONO_SYNTH_PARAM.FILTER_Q]:
        this.filterEnv.params[FILTER_ENVELOPE_PARAM.Q],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setType(initProps.type)
    this.setFrequency(initProps.frequency)
    this.setDetune(initProps.detune)
    this.setGainAttack(initProps.gainAttack)
    this.setGainDecay(initProps.gainDecay)
    this.setGainSustain(initProps.gainSustain)
    this.setGainRelease(initProps.gainRelease)
    this.setGainAmount(initProps.gainAmount)
    this.setFilterType(initProps.filterType)
    this.setFilterFrequency(initProps.filterFrequency)
    this.setFilterQ(initProps.filterQ)
    this.setFilterDetune(initProps.filterDetune)
    this.setFilterGain(initProps.filterGain)
    this.setFilterAttack(initProps.filterAttack)
    this.setFilterDecay(initProps.filterDecay)
    this.setFilterSustain(initProps.filterSustain)
    this.setFilterRelease(initProps.filterRelease)
    this.setFilterAmount(initProps.filterAmount)

    // Connections
    this.oscillator.connect(this.gainEnv)
    this.gainEnv.connect(this.filterEnv)

    return this
  }

  // - Getters -
  /** Get the note that is currently being played. */
  public getCurrentNote = () => this.currentNote

  /** Get the waveform of the oscillator. */
  public getType = () => this.oscillator.getType()

  /** Get the frequency of the oscillator. */
  public getFrequency = () => this.oscillator.getFrequency()

  /** Get the detune value of the oscillator. */
  public getDetune = () => this.oscillator.getDetune()

  /** Get the attack time of the gain envelope. */
  public getGainAttack = () => this.gainEnv.getAttack()

  /** Get the decay time of the gain envelope. */
  public getGainDecay = () => this.gainEnv.getDecay()

  /** Get the sustain value of the gain envelope. */
  public getGainSustain = () => this.gainEnv.getSustain()

  /** Get the release time of the gain envelope. */
  public getGainRelease = () => this.gainEnv.getRelease()

  /** Get the modifier value of the gain envelope. */
  public getGainAmount = () => this.gainEnv.getModifier()

  /** Get the frequency of the filter envelope's filter. */
  public getFilterFrequency = () => this.filterEnv.getFrequency()

  /** Get the detune value of the filter envelope's filter. */
  public getFilterDetune = () => this.filterEnv.getDetune()

  /** Get the Q value of the filter envelope's filter. */
  public getFilterQ = () => this.filterEnv.getQ()

  /** Get the gain of the filter envelope's filter. */
  public getFilterGain = () => this.filterEnv.getGain()

  /** Get the filter type of the filter envelope's filter. */
  public getFilterType = () => this.filterEnv.getType()

  /** Get the attack time of the filter envelope. */
  public getFilterAttack = () => this.filterEnv.getAttack()

  /** Get the decay time of the filter envelope. */
  public getFilterDecay = () => this.filterEnv.getDecay()

  /** Get the sustain value of the filter envelope. */
  public getFilterSustain = () => this.filterEnv.getSustain()

  /** Get the release time of the filter envelope. */
  public getFilterRelease = () => this.filterEnv.getRelease()

  /** Get the modifier amount of the filter envelope. */
  public getFilterAmount = () => this.filterEnv.getModifier()

  // - Setters -
  /** Set the waveform of the oscillator. */
  public setType = (val: Waveform) => this.oscillator.setType(val)

  /** Set the frequency of the oscillator. */
  public setFrequency = (val: number, time?: number) =>
    this.oscillator.setFrequency(val, time)

  /** Set the detune of the oscillator. */
  public setDetune = (val: number, time?: number) =>
    this.oscillator.setDetune(val, time)

  /** Set the attack time of the gain envelope. */
  public setGainAttack = (val: number) => this.gainEnv.setAttack(val)

  /** Set the decay time of the gain envelope. */
  public setGainDecay = (val: number) => this.gainEnv.setDecay(val)

  /** Set the sustain value of the gain envelope. */
  public setGainSustain = (val: number) => this.gainEnv.setSustain(val)

  /** Set the release time of the gain envelope. */
  public setGainRelease = (val: number) => this.gainEnv.setRelease(val)

  /** Set the gain modifier of the gain envelope. */
  public setGainAmount = (val: number) => this.gainEnv.setModifier(val)

  /** Set the frequency of the filter envelope's filter. */
  public setFilterFrequency = (val: number, time?: number) =>
    this.filterEnv.setFrequency(val, time)

  /** Set the detune value of the filter envelope's filter. */
  public setFilterDetune = (val: number, time?: number) =>
    this.filterEnv.setDetune(val, time)

  /** Set the q value of the filter envelope's filter. */
  public setFilterQ = (val: number, time?: number) =>
    this.filterEnv.setQ(val, time)

  /** Set the gain of the filter envelope's filter. */
  public setFilterGain = (val: number, time?: number) =>
    this.filterEnv.setGain(val, time)

  /** Set the type of the filter envelope's filter. */
  public setFilterType = (val: FilterType) => this.filterEnv.setType(val)

  /** Set the attack time of the filter envelope. */
  public setFilterAttack = (val: number) => this.filterEnv.setAttack(val)

  /** Set the decay time of the filter envelope. */
  public setFilterDecay = (val: number) => this.filterEnv.setDecay(val)

  /** Set the sustain value of the filter envelope. */
  public setFilterSustain = (val: number) => this.filterEnv.setSustain(val)

  /** Set the release time of the filter envelope. */
  public setFilterRelease = (val: number) => this.filterEnv.setRelease(val)

  /** Set the modifier value of the filter envelope. */
  public setFilterAmount = (val: number) => this.filterEnv.setModifier(val)

  // - Note Methods -
  /** Plays the note given. */
  public triggerAttack = (note: Note) => {
    this.currentNote = note
    this.oscillator.setFrequency(getNoteFrequency(note))
    this.gainEnv.triggerAttack()
    this.filterEnv.triggerAttack()
  }

  /**
   * Releases the note given if it matches the current note.
   * If a note is not given, it will release any current note being played.
   */
  public triggerRelease = (note?: Note) => {
    // Do not release if the note if different from the current note
    if (note && note !== this.currentNote) return

    this.gainEnv.triggerRelease()
    this.filterEnv.triggerRelease()
    this.currentNote = null
  }

  /** Stops any note currently being played. */
  public triggerStop = () => {
    this.gainEnv.triggerStop()
    this.filterEnv.triggerStop()
    this.currentNote = null
  }
}
