import { BlipNode, BlipNodeProps, OutputNode } from '../core/BlipNode'
import { Limiter } from '../core/Limiter'
import { GainEnvelope } from '../component/GainEnvelope'
import { fmAlgorithms } from '../../util/fmAlgorithms'
import { Osc, OSC_PARAM } from './Osc'

// TODO: Add filter Env to the end of this

export const FM_SYNTH_PARAM = {
  MOD_A_GAIN: 'modulatorAGain',
  MOD_A_DETUNE: 'modulatorADetune',
  MOD_A_FREQUENCY: 'modulatorAFrequency',
  MOD_B_GAIN: 'modulatorBGain',
  MOD_B_DETUNE: 'modulatorBDetune',
  MOD_B_FREQUENCY: 'modulatorBFrequency',
  MOD_C_GAIN: 'modulatorCGain',
  MOD_C_DETUNE: 'modulatorCDetune',
  MOD_C_FREQUENCY: 'modulatorCFrequency',
  MOD_D_GAIN: 'modulatorDGain',
  MOD_D_DETUNE: 'modulatorDDetune',
  MOD_D_FREQUENCY: 'modulatorDFrequency',
}

type FMSynthParam = typeof FM_SYNTH_PARAM[keyof typeof FM_SYNTH_PARAM]

type BaseFMSynthProps = {
  algorithm?: number
  modAGain?: number
  modADetune?: number
  modAFrequency?: number
  modBGain?: number
  modBDetune?: number
  modBFrequency?: number
  modCGain?: number
  modCDetune?: number
  modCFrequency?: number
  modDGain?: number
  modDDetune?: number
  modDFrequency?: number
  gainAttack?: number
  gainDecay?: number
  gainSustain?: number
  gainRelease?: number
  gainAmount?: number
}

type FMSynthProps = BlipNodeProps & BaseFMSynthProps

const defaultProps: Required<BaseFMSynthProps> = {
  algorithm: 0,
  modAGain: 440,
  modADetune: 0,
  modAFrequency: 440,
  modBGain: 440,
  modBDetune: 0,
  modBFrequency: 440,
  modCGain: 440,
  modCDetune: 0,
  modCFrequency: 440,
  modDGain: 440,
  modDDetune: 0,
  modDFrequency: 440,
  gainAttack: 0,
  gainDecay: 0,
  gainSustain: 1,
  gainRelease: 0,
  gainAmount: 0.75,
}

export class FMSynth extends BlipNode {
  readonly name: string = 'FMSynth'
  readonly outputs: OutputNode[]
  readonly params: Record<FMSynthParam, AudioParam>

  private algorithm: string
  private modA: Osc
  private modB: Osc
  private modC: Osc
  private modD: Osc
  private limiter: Limiter
  private gainEnv: GainEnvelope

  constructor(props: FMSynthProps = {}) {
    super(props)
    this.modA = new Osc({ AC: this.AC })
    this.modB = new Osc({ AC: this.AC })
    this.modC = new Osc({ AC: this.AC })
    this.modD = new Osc({ AC: this.AC })
    this.limiter = new Limiter({ AC: this.AC })
    this.gainEnv = new GainEnvelope({ AC: this.AC })
    this.outputs = [this.gainEnv]

    this.algorithm = null
    this.params = {
      [FM_SYNTH_PARAM.MOD_A_GAIN]: this.modA.params[OSC_PARAM.GAIN],
      [FM_SYNTH_PARAM.MOD_A_DETUNE]: this.modA.params[OSC_PARAM.DETUNE],
      [FM_SYNTH_PARAM.MOD_A_FREQUENCY]: this.modA.params[OSC_PARAM.FREQUENCY],
      [FM_SYNTH_PARAM.MOD_B_GAIN]: this.modB.params[OSC_PARAM.GAIN],
      [FM_SYNTH_PARAM.MOD_B_DETUNE]: this.modB.params[OSC_PARAM.DETUNE],
      [FM_SYNTH_PARAM.MOD_B_FREQUENCY]: this.modB.params[OSC_PARAM.FREQUENCY],
      [FM_SYNTH_PARAM.MOD_C_GAIN]: this.modC.params[OSC_PARAM.GAIN],
      [FM_SYNTH_PARAM.MOD_C_DETUNE]: this.modC.params[OSC_PARAM.DETUNE],
      [FM_SYNTH_PARAM.MOD_C_FREQUENCY]: this.modC.params[OSC_PARAM.FREQUENCY],
      [FM_SYNTH_PARAM.MOD_D_GAIN]: this.modD.params[OSC_PARAM.GAIN],
      [FM_SYNTH_PARAM.MOD_D_DETUNE]: this.modD.params[OSC_PARAM.DETUNE],
      [FM_SYNTH_PARAM.MOD_D_FREQUENCY]: this.modD.params[OSC_PARAM.FREQUENCY],
    }

    // Initialize
    const initProps = { ...defaultProps, ...props }

    this.setAlgorithm(initProps.algorithm)
    this.setModAFrequency(initProps.modAFrequency)
    this.setModADetune(initProps.modADetune)
    this.setModAGain(initProps.modAGain)
    this.setModBFrequency(initProps.modBFrequency)
    this.setModBDetune(initProps.modBDetune)
    this.setModBGain(initProps.modBGain)
    this.setModCFrequency(initProps.modCFrequency)
    this.setModCDetune(initProps.modCDetune)
    this.setModCGain(initProps.modCGain)
    this.setModDFrequency(initProps.modDFrequency)
    this.setModDDetune(initProps.modDDetune)
    this.setModDGain(initProps.modDGain)
    this.setGainAttack(initProps.gainAttack)
    this.setGainDecay(initProps.gainDecay)
    this.setGainSustain(initProps.gainSustain)
    this.setGainRelease(initProps.gainRelease)
    this.setGainAmount(initProps.gainAmount)

    // Connections
    this.limiter.connect(this.gainEnv)

    return this
  }

  // - Getters -
  /** Get a diagram for the current algorithm. */
  public getAlgorithm = () => this.algorithm

  /** Get the frequency of modulator A. */
  public getModAFrequency = () => this.modA.getFrequency()

  /** Get the detune of modulator A. */
  public getModADetune = () => this.modA.getDetune()

  /** Get the gain of modulator A. */
  public getModAGain = () => this.modA.getGain()

  /** Get the frequency of modulator B. */
  public getModBFrequency = () => this.modB.getFrequency()

  /** Get the detune of modulator B. */
  public getModBDetune = () => this.modB.getDetune()

  /** Get the gain of modulator B. */
  public getModBGain = () => this.modB.getGain()

  /** Get the frequency of modulator C. */
  public getModCFrequency = () => this.modC.getFrequency()

  /** Get the detune of modulator C. */
  public getModCDetune = () => this.modC.getDetune()

  /** Get the gain of modulator C. */
  public getModCGain = () => this.modC.getGain()

  /** Get the frequency of modulator D. */
  public getModDFrequency = () => this.modD.getFrequency()

  /** Get the detune of modulator D. */
  public getModDDetune = () => this.modD.getDetune()

  /** Get the gain of modulator D. */
  public getModDGain = () => this.modD.getGain()

  /** Get the attack time of the gain envelope. */
  public getGainAttack = () => this.gainEnv.getAttack()

  /** Get the decay time of the gain envelope. */
  public getGainDecay = () => this.gainEnv.getDecay()

  /** Get the sustain value of the gain envelope. */
  public getGainSustain = () => this.gainEnv.getSustain()

  /** Get the release time of the gain envelope. */
  public getGainRelease = () => this.gainEnv.getRelease()

  /** Get the gain modifier of the gain envelope. */
  public getGainAmount = () => this.gainEnv.getModifier()

  // - Setters -
  /** Set the algorithm and reconnect the modulators. */
  public setAlgorithm = (idx: number) => {
    if (!fmAlgorithms[idx]) return console.error('Invalid algorithm index')
    this.algorithm = fmAlgorithms[idx](
      this.modA,
      this.modB,
      this.modC,
      this.modD,
      this.limiter
    )
    return this.algorithm
  }

  /** Set the frequency of modulator A. */
  public setModAFrequency = (val: number, time?: number) =>
    this.modA.setFrequency(val, time)

  /** Set the detune of modulator A. */
  public setModADetune = (val: number, time?: number) =>
    this.modA.setDetune(val, time)

  /** Set the gain of modulator A. */
  public setModAGain = (val: number, time?: number) =>
    this.modA.setGain(val, time)

  /** Set the frequency of modulator B. */
  public setModBFrequency = (val: number, time?: number) =>
    this.modB.setFrequency(val, time)

  /** Set the detune of modulator B. */
  public setModBDetune = (val: number, time?: number) =>
    this.modB.setDetune(val, time)

  /** Set the gain of modulator B. */
  public setModBGain = (val: number, time?: number) =>
    this.modB.setGain(val, time)

  /** Set the frequency of modulator C. */
  public setModCFrequency = (val: number, time?: number) =>
    this.modC.setFrequency(val, time)

  /** Set the detune of modulator C. */
  public setModCDetune = (val: number, time?: number) =>
    this.modC.setDetune(val, time)

  /** Set the gain of modulator C. */
  public setModCGain = (val: number, time?: number) =>
    this.modC.setGain(val, time)

  /** Set the frequency of modulator D. */
  public setModDFrequency = (val: number, time?: number) =>
    this.modD.setFrequency(val, time)

  /** Set the detune of modulator D. */
  public setModDDetune = (val: number, time?: number) =>
    this.modD.setDetune(val, time)

  /** Set the gain of modulator D. */
  public setModDGain = (val: number, time?: number) =>
    this.modD.setGain(val, time)

  /** Set the attack time of the gain envelope. */
  public setGainAttack = (val: number) => this.gainEnv.setAttack(val)

  /** Set the decay time of the gain envelope. */
  public setGainDecay = (val: number) => this.gainEnv.setDecay(val)

  /** Set the sustain value of the gain envelope. */
  public setGainSustain = (val: number) => this.gainEnv.setSustain(val)

  /** Set the release time of the gain envelope. */
  public setGainRelease = (val: number) => this.gainEnv.setRelease(val)

  /** Set the gain modifier of the gain envelope. */
  public setGainAmount = (val: number) => this.gainEnv.setModifier(val)

  // - Trigger Methods -
  /** Trigger the attack of the gain envelope. */
  public triggerAttack = () => this.gainEnv.triggerAttack()

  /** Trigger the release of the gain envelope. */
  public triggerRelease = () => this.gainEnv.triggerRelease()

  /** Trigger a stop on the gain envelope. */
  public triggerStop = () => this.gainEnv.triggerStop()
}
