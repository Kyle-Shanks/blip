import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'
import { Note } from '../../util/noteUtil'
import { MonoSynth, MONO_SYNTH_PARAM } from './MonoSynth'
import { Osc, OSC_PARAM } from './Osc'

export const SIMPLE_FM_SYNTH_PARAM = {
  MODULATOR_DEPTH: 'modulatorDepth',
  MODULATOR_DETUNE: 'modulatorDetune',
  MODULATOR_FREQUENCY: 'modulatorFrequency',
  CARRIER_DETUNE: 'carrierDetune',
  CARRIER_FREQUENCY: 'carrierFrequency',
  CARRIER_GAIN: 'carrierGain',
  CARIER_FILTER_DETUNE: 'carrierFilterDetune',
  CARIER_FILTER_FREQUENCY: 'carrierFilterFrequency',
  CARIER_FILTER_GAIN: 'carrierFilterGain',
  CARIER_FILTER_Q: 'carrierFilterQ',
} as const

type SimpleFMSynthParam =
  typeof SIMPLE_FM_SYNTH_PARAM[keyof typeof SIMPLE_FM_SYNTH_PARAM]

type BaseSimpleFMSynthProps = {
  modulatorFrequency?: number
  modulatorDetune?: number
  modulatorDepth?: number
  carrierFrequency?: number
  carrierDetune?: number
  gainAttack?: number
  gainDecay?: number
  gainSustain?: number
  gainRelease?: number
  gainAmount?: number
  filterAttack?: number
  filterDecay?: number
  filterSustain?: number
  filterRelease?: number
  filterAmount?: number
}

type SimpleFMSynthProps = BlipNodeProps & BaseSimpleFMSynthProps

const defaultProps: Required<BaseSimpleFMSynthProps> = {
  modulatorFrequency: 440,
  modulatorDetune: 0,
  modulatorDepth: 440,
  carrierFrequency: 440,
  carrierDetune: 0,
  gainAttack: 0,
  gainDecay: 0,
  gainSustain: 1,
  gainRelease: 0,
  gainAmount: 0.75,
  filterAttack: 0,
  filterDecay: 0,
  filterSustain: 1,
  filterRelease: 0,
  filterAmount: 6000,
} as const

export class SimpleFMSynth extends BlipNode {
  readonly name: string = 'SimpleFMSynth'
  readonly outputs: OutputNode[]
  readonly params: Record<SimpleFMSynthParam, AudioParam>

  private modulator: Osc
  private carrier: MonoSynth

  constructor(props: SimpleFMSynthProps = {}) {
    super(props)
    this.modulator = new Osc({ AC: this.AC })
    this.carrier = new MonoSynth({ AC: this.AC })
    this.outputs = [this.carrier]

    this.params = {
      [SIMPLE_FM_SYNTH_PARAM.MODULATOR_DEPTH]:
        this.modulator.params[OSC_PARAM.GAIN],
      [SIMPLE_FM_SYNTH_PARAM.MODULATOR_DETUNE]:
        this.modulator.params[OSC_PARAM.DETUNE],
      [SIMPLE_FM_SYNTH_PARAM.MODULATOR_FREQUENCY]:
        this.modulator.params[OSC_PARAM.FREQUENCY],
      [SIMPLE_FM_SYNTH_PARAM.CARRIER_DETUNE]:
        this.carrier.params[MONO_SYNTH_PARAM.DETUNE],
      [SIMPLE_FM_SYNTH_PARAM.CARRIER_FREQUENCY]:
        this.carrier.params[MONO_SYNTH_PARAM.FREQUENCY],
      [SIMPLE_FM_SYNTH_PARAM.CARRIER_GAIN]:
        this.carrier.params[MONO_SYNTH_PARAM.GAIN],
      [SIMPLE_FM_SYNTH_PARAM.CARIER_FILTER_DETUNE]:
        this.carrier.params[MONO_SYNTH_PARAM.FILTER_DETUNE],
      [SIMPLE_FM_SYNTH_PARAM.CARIER_FILTER_FREQUENCY]:
        this.carrier.params[MONO_SYNTH_PARAM.FILTER_FREQUENCY],
      [SIMPLE_FM_SYNTH_PARAM.CARIER_FILTER_GAIN]:
        this.carrier.params[MONO_SYNTH_PARAM.FILTER_GAIN],
      [SIMPLE_FM_SYNTH_PARAM.CARIER_FILTER_Q]:
        this.carrier.params[MONO_SYNTH_PARAM.FILTER_Q],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setModulatorFrequency(initProps.modulatorFrequency)
    this.setModulatorDetune(initProps.modulatorDetune)
    this.setModulatorDepth(initProps.modulatorDepth)
    this.setCarrierFrequency(initProps.carrierFrequency)
    this.setCarrierDetune(initProps.carrierDetune)
    this.setGainAttack(initProps.gainAttack)
    this.setGainDecay(initProps.gainDecay)
    this.setGainSustain(initProps.gainSustain)
    this.setGainRelease(initProps.gainRelease)
    this.setGainAmount(initProps.gainAmount)

    // Connections
    this.modulator.connect(this.params[SIMPLE_FM_SYNTH_PARAM.CARRIER_FREQUENCY])

    return this
  }

  // - Getters -
  /** Get the current frequency of the modulator. */
  public getModulatorFrequency = () => this.modulator.getFrequency()

  /** Get the current detune value of the modulator. */
  public getModulatorDetune = () => this.modulator.getDetune()

  /** Get the current depth of the modulator */
  public getModulatorDepth = () => this.modulator.getGain()

  /** Get the current frequency of the carrier. */
  public getCarrierFrequency = () => this.carrier.getFrequency()

  /** Get the current detune value of the carrier. */
  public getCarrierDetune = () => this.carrier.getDetune()

  /** Get the attack time of the carrier's gain envelope. */
  public getGainAttack = () => this.carrier.getGainAttack()

  /** Get the decay time of the carrier's gain envelope. */
  public getGainDecay = () => this.carrier.getGainDecay()

  /** Get the sustain value of the carrier's gain envelope. */
  public getGainSustain = () => this.carrier.getGainSustain()

  /** Get the release time of the carrier's gain envelope. */
  public getGainRelease = () => this.carrier.getGainRelease()

  /** Get the modifier amount of the carrier's gain envelope. */
  public getGainAmount = () => this.carrier.getGainAmount()

  /** Get the attack time of the carrier's filter envelope. */
  public getFilterAttack = () => this.carrier.getFilterAttack()

  /** Get the decay time of the carrier's filter envelope. */
  public getFilterDecay = () => this.carrier.getFilterDecay()

  /** Get the sustain time of the carrier's filter envelope. */
  public getFilterSustain = () => this.carrier.getFilterSustain()

  /** Get the release time of the carrier's filter envelope. */
  public getFilterRelease = () => this.carrier.getFilterRelease()

  /** Get the modifier amount of the carrier's filter envelope. */
  public getFilterAmount = () => this.carrier.getFilterAmount()

  // - Setters -
  /** Set the frequency of the modulator. */
  public setModulatorFrequency = (val: number, time?: number) =>
    this.modulator.setFrequency(val, time)

  /** Set the detune value of the modulator. */
  public setModulatorDetune = (val: number, time?: number) =>
    this.modulator.setDetune(val, time)

  /** Set the depth of the modulator. */
  public setModulatorDepth = (val: number, time?: number) =>
    this.modulator.setGain(val, time)

  /** Set the frequency of the carrier. */
  public setCarrierFrequency = (val: number, time?: number) =>
    this.carrier.setFrequency(val, time)

  /** Set the detune value of the carrier. */
  public setCarrierDetune = (val: number, time?: number) =>
    this.carrier.setDetune(val, time)

  /** Set the attack time of the carrier's gain envelope. */
  public setGainAttack = (val: number) => this.carrier.setGainAttack(val)

  /** Set the decay time of the carrier's gain envelope. */
  public setGainDecay = (val: number) => this.carrier.setGainDecay(val)

  /** Set the sustain value of the carrier's gain envelope. */
  public setGainSustain = (val: number) => this.carrier.setGainSustain(val)

  /** Set the release time of the carrier's gain envelope. */
  public setGainRelease = (val: number) => this.carrier.setGainRelease(val)

  /** Set the modifier amount of the carrier's gain envelope. */
  public setGainAmount = (val: number) => this.carrier.setGainAmount(val)

  /** Set the attack time of the carrier's filter envelope. */
  public setFilterAttack = (val: number) => this.carrier.setFilterAttack(val)

  /** Set the decay time of the carrier's filter envelope. */
  public setFilterDecay = (val: number) => this.carrier.setFilterDecay(val)

  /** Set the sustain value of the carrier's filter envelope. */
  public setFilterSustain = (val: number) => this.carrier.setFilterSustain(val)

  /** Set the release time of the carrier's filter envelope. */
  public setFilterRelease = (val: number) => this.carrier.setFilterRelease(val)

  /** Set the modifier amount of the carrier's filter envelope. */
  public setFilterAmount = (val: number) => this.carrier.setFilterAmount(val)

  // - Note Methods -
  /** Plays the note given. */
  public triggerAttack = (note: Note) => this.carrier.triggerAttack(note)

  /**
   * Releases the note given if it matches the current note.
   * If a note is not given, it will release any current note being played.
   */
  public triggerRelease = (note?: Note) => this.carrier.triggerRelease(note)

  /** Stops any note currently being played. */
  public triggerStop = () => this.carrier.triggerStop()
}
