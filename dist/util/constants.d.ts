export declare const minTime = 0.001;
export declare const OVERSAMPLE: {
    readonly NONE: "none";
    readonly TWO_TIMES: "2x";
    readonly FOUR_TIMES: "4x";
};
export declare type Oversample = (typeof OVERSAMPLE)[keyof typeof OVERSAMPLE];
export declare const NOISE_TYPE: {
    readonly WHITE: "white";
    readonly PINK: "pink";
    readonly BROWN: "brown";
};
export declare type NoiseType = (typeof NOISE_TYPE)[keyof typeof NOISE_TYPE];
export declare const WAVEFORM: {
    readonly SINE: "sine";
    readonly TRIANGLE: "triangle";
    readonly SQUARE: "square";
    readonly SAWTOOTH: "sawtooth";
};
export declare type Waveform = (typeof WAVEFORM)[keyof typeof WAVEFORM];
export declare const FILTER_TYPE: {
    readonly LOWPASS: "lowpass";
    readonly BANDPASS: "bandpass";
    readonly HIGHPASS: "highpass";
    readonly ALLPASS: "allpass";
    readonly NOTCH: "notch";
    readonly PEAKING: "peaking";
    readonly LOW_SHELF: "lowshelf";
    readonly HIGH_SHELF: "highshelf";
};
export declare type FilterType = (typeof FILTER_TYPE)[keyof typeof FILTER_TYPE];
