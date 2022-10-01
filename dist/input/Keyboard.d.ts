import { NoteInfo, Octave } from '../util/noteUtil';
declare type KeyboardProps = {
    onPress?: (noteInfo: NoteInfo, e: KeyboardEvent) => void;
    onRelease?: (noteInfo: NoteInfo, e: KeyboardEvent) => void;
};
/**
 * A general-purpose Keyboard input class to give users a piano-like interface to interact with projects.
 * Uses A-; keys to play notes. The Z and X keys change the octave
 */
export declare class Keyboard {
    readonly onPress: (noteInfo: NoteInfo, e: KeyboardEvent) => void;
    readonly onRelease: (noteInfo: NoteInfo, e: KeyboardEvent) => void;
    private octave;
    private velocity;
    constructor(props: KeyboardProps);
    /** Start event listening for the keyboard. */
    on: () => void;
    /** Stop event listening for the keyboard. */
    off: () => void;
    /** Get the current octave */
    getOctave: () => Octave;
    /** Get the current velocity */
    getVelocity: () => number;
    /** Set the current octave */
    setOctave: (val: Octave) => Octave;
    /** Set the current velocity */
    setVelocity: (val: number) => number;
    private _keydown;
    private _keyup;
    private _octaveDown;
    private _octaveUp;
    private _velocityDown;
    private _velocityUp;
}
export {};
