'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

// - Context Functions -
var GLOBAL_CONTEXT = null;
/** Returns the global audio context */
var getContext = function () {
    if (GLOBAL_CONTEXT === null)
        GLOBAL_CONTEXT = new AudioContext();
    return GLOBAL_CONTEXT;
};
/** Set the global audio context */
var setContext = function (context) {
    GLOBAL_CONTEXT = context;
};
var resume = function () { return getContext().resume(); };
// - Helper Functions -
/** Clamp a number between a given min and max. */
var clamp = function (val, min, max) {
    return Math.min(max, Math.max(min, val));
};
/** Connect a series of synth nodes together. */
var chain = function () {
    var nodes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nodes[_i] = arguments[_i];
    }
    if (nodes.length < 2)
        return;
    for (var i = 0; i < nodes.length - 1; i++) {
        nodes[i].connect(nodes[i + 1]);
    }
};

/** Base class for Blip audio nodes. */
var BlipNode = /** @class */ (function () {
    function BlipNode(props) {
        var _this = this;
        if (props === void 0) { props = {}; }
        var _a;
        this.name = 'BlipNode';
        this.inputs = [];
        this.outputs = [];
        this.params = {};
        // --- Public Methods ---
        /**
         * Connect this node to a BlipNode, AudioNode, or AudioParam.
         * An array can be passed to connect to multiple destinations.
         */
        this.connect = function (destination, outputNum, inputNum) {
            _this._connect(destination, outputNum, inputNum);
            return _this;
        };
        /**
         * Disconnect this node from one or more if its connections.
         * If no destination is passed, all connections will be removed.
         */
        this.disconnect = function (destination, outputNum, inputNum) {
            _this._disconnect(destination, outputNum, inputNum);
            return _this;
        };
        /** Connect all output nodes to the AudioContext destination */
        this.toDestination = function () {
            var outputNodes = _this._getOutputNodes();
            outputNodes.forEach(function (output) { return output.connect(_this.AC.destination); });
        };
        // --- Private Methods ---
        /** Internal connect handler method */
        this._connect = function (destination, outputNum, inputNum) {
            if (outputNum === void 0) { outputNum = 0; }
            if (inputNum === void 0) { inputNum = 0; }
            if (Array.isArray(destination)) {
                destination.forEach(function (dest) { return _this._connect(dest, outputNum, inputNum); });
            }
            else if (destination instanceof BlipNode) {
                if (destination.inputs.length === 0) {
                    console.error('Cannot connect to a node with no inputs');
                    return;
                }
                var inputs = destination._getInputNodes();
                inputs.forEach(function (input) {
                    _this.outputs.forEach(function (output) {
                        input instanceof AudioParam
                            ? output.connect(input, outputNum)
                            : output.connect(input, outputNum, inputNum);
                    });
                });
            }
            else if (destination instanceof AudioNode) {
                _this.outputs.forEach(function (output) {
                    return output.connect(destination, outputNum, inputNum);
                });
            }
            else if (destination instanceof AudioParam) {
                _this.outputs.forEach(function (output) { return output.connect(destination, outputNum); });
            }
            else {
                console.error('Invalid destination type');
            }
        };
        /** Internal disconnect handler method */
        this._disconnect = function (destination, outputNum, inputNum) {
            if (outputNum === void 0) { outputNum = 0; }
            if (inputNum === void 0) { inputNum = 0; }
            if (destination === undefined) {
                _this.outputs.forEach(function (output) { return output.disconnect(); });
            }
            else if (Array.isArray(destination)) {
                destination.forEach(function (dest) { return _this._disconnect(dest, outputNum, inputNum); });
            }
            else if (destination instanceof BlipNode) {
                if (destination.inputs.length === 0) {
                    console.error('Cannot disconnect from destination with no inputs');
                    return;
                }
                var inputs = destination._getInputNodes();
                inputs.forEach(function (input) {
                    _this.outputs.forEach(function (output) {
                        return output.disconnect(input, outputNum, inputNum);
                    });
                });
            }
            else if (destination instanceof AudioNode ||
                destination instanceof AudioParam) {
                _this.outputs.forEach(function (output) {
                    return output.disconnect(destination, outputNum, inputNum);
                });
            }
            else {
                console.error('Invalid destination type');
            }
        };
        // Recursively go down to get the default audio nodes/params of all inputs
        this._getInputNodes = function () {
            return _this.inputs.reduce(function (nodes, input) {
                input instanceof BlipNode
                    ? nodes.push.apply(nodes, input._getInputNodes()) : nodes.push(input);
                return nodes;
            }, []);
        };
        // Recursively go down to get the default audio nodes of all outputs
        this._getOutputNodes = function () {
            return _this.outputs.reduce(function (nodes, output) {
                output instanceof BlipNode
                    ? nodes.push.apply(nodes, output._getOutputNodes()) : nodes.push(output);
                return nodes;
            }, []);
        };
        // - Update Methods -
        this._update = function (param, val) {
            return param.setValueAtTime(val, _this.AC.currentTime);
        };
        this._timeUpdate = function (param, val, time) {
            if (time === void 0) { time = 0; }
            time
                ? param.setTargetAtTime(val, _this.AC.currentTime, time)
                : param.setValueAtTime(val, _this.AC.currentTime);
        };
        // 1:0 <-> 0.5:0.5 <-> 0:1
        this._linearFadeUpdate = function (aParam, bParam, val, time) {
            if (time === void 0) { time = 0; }
            _this._timeUpdate(aParam, 1 - val, time);
            _this._timeUpdate(bParam, val, time);
        };
        // 1:0 <-> ~0.7:~0.7 <-> 0:1
        this._equalPowerFadeUpdate = function (aParam, bParam, val, time) {
            if (time === void 0) { time = 0; }
            _this._timeUpdate(aParam, Math.cos(val * 0.5 * Math.PI), time);
            _this._timeUpdate(bParam, Math.cos((1.0 - val) * 0.5 * Math.PI), time);
        };
        // 1:0 <-> 1:1 <-> 0:1
        this._dryWetUpdate = function (dryParam, wetParam, val, time) {
            if (time === void 0) { time = 0; }
            if (val < 0.5) {
                _this._timeUpdate(dryParam, 1, time);
                _this._timeUpdate(wetParam, val * 2, time);
            }
            else {
                _this._timeUpdate(dryParam, 1 - (val - 0.5) * 2, time);
                _this._timeUpdate(wetParam, 1, time);
            }
        };
        this.AC = (_a = props === null || props === void 0 ? void 0 : props.AC) !== null && _a !== void 0 ? _a : getContext();
        return this;
    }
    return BlipNode;
}());

var CONSTANT_SOURCE_PARAM = {
    OFFSET: 'offset',
};
var defaultProps$m = {
    offset: 1,
    start: false,
};
/**
 * A source node that outputs a constant signal that can be adjusted.
 * Wrapper class for the native ConstantSource node.
 */
var ConstantSource = /** @class */ (function (_super) {
    __extends(ConstantSource, _super);
    function ConstantSource(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'ConstantSource';
        /** Starts output from the source node */
        _this.start = function () { return _this.source.start(); };
        /** Stops output from the source node */
        _this.stop = function () { return _this.source.stop(); };
        // - Getters -
        /** Get the current offset value of the source node */
        _this.getOffset = function () { return _this.params[CONSTANT_SOURCE_PARAM.OFFSET]; };
        // - Setters -
        /** Set the offset value of the source node */
        _this.setOffset = function (val, time) {
            return _this._timeUpdate(_this.params[CONSTANT_SOURCE_PARAM.OFFSET], val, time);
        };
        _this.source = _this.AC.createConstantSource();
        _this.outputs = [_this.source];
        _this.params = (_a = {},
            _a[CONSTANT_SOURCE_PARAM.OFFSET] = _this.source.offset,
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$m), props);
        _this.setOffset(initProps.offset);
        if (initProps.start)
            _this.start();
        return _this;
    }
    return ConstantSource;
}(BlipNode));

var defaultProps$l = {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0,
    modifier: 1,
};
/**
 * A general-purpose ADSR envelope that can be connected to AudioParams to modulate values over time.
 * Built using a ConstantSource node.
 */
var Envelope = /** @class */ (function (_super) {
    __extends(Envelope, _super);
    function Envelope(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Envelope';
        /**
         * Connect this envelope to an AudioParam.
         * An array can be passed to connect to multiple destinations.
         */
        _this.connect = function (destination) {
            if (Array.isArray(destination)) {
                for (var i = 0; i < destination.length; i++) {
                    if (!(destination[i] instanceof AudioParam)) {
                        console.error('Envelopes must be connected to AudioParams');
                        return _this;
                    }
                }
            }
            else if (!(destination instanceof AudioParam)) {
                console.error('Envelopes must be connected to AudioParams');
                return _this;
            }
            _this.connect(destination);
            return _this;
        };
        // - Getters -
        /** Get the attack time of the envelope. */
        _this.getAttack = function () { return _this.attack; };
        /** Get the decay time of the envelope. */
        _this.getDecay = function () { return _this.decay; };
        /** Get the sustain value of the envelope. */
        _this.getSustain = function () { return _this.sustain; };
        /** Get the release time of the envelope. */
        _this.getRelease = function () { return _this.release; };
        /** Get the modifier value of the envelope. */
        _this.getModifier = function () { return _this.modifier; };
        // - Setters -
        /** Get the attack time of the envelope. */
        _this.setAttack = function (val) { return (_this.attack = val); };
        /** Get the decay time of the envelope. */
        _this.setDecay = function (val) { return (_this.decay = val); };
        /** Get the sustain value of the envelope. */
        _this.setSustain = function (val) { return (_this.sustain = val); };
        /** Get the release time of the envelope. */
        _this.setRelease = function (val) { return (_this.release = val); };
        /** Get the modifier value of the envelope. */
        _this.setModifier = function (val) { return (_this.modifier = val); };
        // - Trigger Methods -
        /**
         * Triggers the attack of the envelope.
         * Will automatically trigger the decay after the attack time.
         */
        _this.triggerAttack = function () {
            _this._clearTimeouts();
            var sustainVal = _this.sustain * _this.modifier;
            if (_this.attack) {
                _this.source.setOffset(0); // Reset to 0
                _this.source.setOffset(_this.modifier, _this.attack); // Attack
                var timeoutId = setTimeout(function () {
                    _this.source.setOffset(sustainVal, _this.decay); // Decay
                }, _this.attack * 1000);
                _this.timeoutIds.push(timeoutId);
            }
            else if (_this.decay) {
                _this.source.setOffset(_this.modifier); // Reset to max
                _this.source.setOffset(sustainVal, _this.decay); // Decay
            }
            else if (_this.sustain) {
                _this.source.setOffset(sustainVal);
            }
        };
        /** Triggers the release of the envelope. */
        _this.triggerRelease = function () {
            _this._clearTimeouts();
            _this.source.setOffset(0, _this.release); // Release
        };
        /** Triggers an instant stop of the envelope. */
        _this.triggerStop = function () {
            _this._clearTimeouts();
            _this.source.setOffset(0);
        };
        // - Private Methods -
        _this._clearTimeouts = function () {
            return _this.timeoutIds.forEach(function (id) { return clearTimeout(id); });
        };
        _this.source = new ConstantSource({ AC: _this.AC, start: true });
        _this.outputs = [_this.source];
        _this.timeoutIds = [];
        _this.attack = defaultProps$l.attack;
        _this.decay = defaultProps$l.decay;
        _this.sustain = defaultProps$l.sustain;
        _this.release = defaultProps$l.release;
        _this.modifier = defaultProps$l.modifier;
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$l), props);
        _this.setAttack(initProps.attack);
        _this.setDecay(initProps.decay);
        _this.setSustain(initProps.sustain);
        _this.setRelease(initProps.release);
        _this.setModifier(initProps.modifier);
        _this.source.setOffset(0);
        return _this;
    }
    return Envelope;
}(BlipNode));

// Distortion oversample types
var OVERSAMPLE = {
    NONE: 'none',
    TWO_TIMES: '2x',
    FOUR_TIMES: '4x',
};
// Noise generator types
var NOISE_TYPE = {
    WHITE: 'white',
    PINK: 'pink',
    BROWN: 'brown',
};
// Oscillator waveforms
var WAVEFORM = {
    SINE: 'sine',
    TRIANGLE: 'triangle',
    SQUARE: 'square',
    SAWTOOTH: 'sawtooth',
};
// Filter node types
var FILTER_TYPE = {
    LOWPASS: 'lowpass',
    BANDPASS: 'bandpass',
    HIGHPASS: 'highpass',
    ALLPASS: 'allpass',
    NOTCH: 'notch',
    PEAKING: 'peaking',
    LOW_SHELF: 'lowshelf',
    HIGH_SHELF: 'highshelf',
};

var FILTER_PARAM = {
    DETUNE: 'detune',
    FREQUENCY: 'frequency',
    GAIN: 'gain',
    Q: 'Q',
};
var defaultProps$k = {
    frequency: 11000,
    q: 0,
    detune: 0,
    gain: 0,
    type: FILTER_TYPE.LOWPASS,
};
/**
 * A Node used to filter frequencies of the incoming signal.
 * Wrapper class for the native BiquadFilter audio node.
 */
var Filter = /** @class */ (function (_super) {
    __extends(Filter, _super);
    function Filter(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Filter';
        // - Getters -
        /** Get the current detune. */
        _this.getDetune = function () { return _this.params[FILTER_PARAM.DETUNE].value; };
        /** Get the current frequency. */
        _this.getFrequency = function () { return _this.params[FILTER_PARAM.FREQUENCY].value; };
        /** Get the current gain. */
        _this.getGain = function () { return _this.params[FILTER_PARAM.GAIN].value; };
        /** Get the current q value. */
        _this.getQ = function () { return _this.params[FILTER_PARAM.Q].value; };
        /** Get the current filter type. */
        _this.getType = function () { return _this.filter.type; };
        // - Setters -
        /** Set the detune of the filter. */
        _this.setDetune = function (val, time) {
            return _this._timeUpdate(_this.params[FILTER_PARAM.DETUNE], val, time);
        };
        /** Set the cutoff frequency of the filter. */
        _this.setFrequency = function (val, time) {
            return _this._timeUpdate(_this.params[FILTER_PARAM.FREQUENCY], val, time);
        };
        /** Set the gain of the filter. */
        _this.setGain = function (val, time) {
            return _this._timeUpdate(_this.params[FILTER_PARAM.GAIN], val, time);
        };
        /** Set the q value of the filter. */
        _this.setQ = function (val, time) {
            return _this._timeUpdate(_this.params[FILTER_PARAM.Q], val, time);
        };
        /** Set the type of the filter. */
        _this.setType = function (val) { return (_this.filter.type = val); };
        _this.filter = _this.AC.createBiquadFilter();
        _this.inputs = [_this.filter];
        _this.outputs = [_this.filter];
        _this.params = (_a = {},
            _a[FILTER_PARAM.DETUNE] = _this.filter.detune,
            _a[FILTER_PARAM.FREQUENCY] = _this.filter.frequency,
            _a[FILTER_PARAM.GAIN] = _this.filter.gain,
            _a[FILTER_PARAM.Q] = _this.filter.Q,
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$k), props);
        _this.setFrequency(initProps.frequency);
        _this.setQ(initProps.q);
        _this.setGain(initProps.gain);
        _this.setDetune(initProps.detune);
        _this.setType(initProps.type);
        return _this;
    }
    return Filter;
}(BlipNode));

var FILTER_ENVELOPE_PARAM = {
    DETUNE: 'detune',
    FREQUENCY: 'frequency',
    GAIN: 'gain',
    Q: 'q',
};
var defaultProps$j = {
    frequency: 2000,
    q: 0,
    detune: 0,
    gain: 0,
    type: FILTER_TYPE.LOWPASS,
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0,
    modifier: 1,
};
/**
 * An envelope connected to a filter node.
 * Can be used to modulate the sound and tone of the incoming signal over time.
 */
var FilterEnvelope = /** @class */ (function (_super) {
    __extends(FilterEnvelope, _super);
    function FilterEnvelope(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'FilterEnvelope';
        // - Getters -
        /** Get the cutoff frequency of the filter node. */
        _this.getFrequency = function () { return _this.filter.getFrequency(); };
        /** Get the q factor of the filter node. */
        _this.getQ = function () { return _this.filter.getQ(); };
        /** Get the detune value of the filter node. */
        _this.getDetune = function () { return _this.filter.getDetune(); };
        /** Get the gain value of the filter node. */
        _this.getGain = function () { return _this.filter.getGain(); };
        /** Get the filter node's type. */
        _this.getType = function () { return _this.filter.getType(); };
        // - Setters -
        /** Set the cutoff frequency of the filter node. */
        _this.setFrequency = function (val, time) {
            return _this.filter.setFrequency(val, time);
        };
        /** Set the q factor value of the filter node. */
        _this.setQ = function (val, time) { return _this.filter.setQ(val, time); };
        /** Set the detune value of the filter node. */
        _this.setDetune = function (val, time) {
            return _this.filter.setDetune(val, time);
        };
        /** Set the gain value of the filter node. */
        _this.setGain = function (val, time) {
            return _this.filter.setGain(val, time);
        };
        /** Set the filter node's type. */
        _this.setType = function (val) { return _this.filter.setType(val); };
        _this.filter = new Filter({ AC: _this.AC });
        _this.inputs = [_this.filter];
        _this.outputs = [_this.filter];
        _this.params = (_a = {},
            _a[FILTER_ENVELOPE_PARAM.DETUNE] = _this.filter.params[FILTER_PARAM.DETUNE],
            _a[FILTER_ENVELOPE_PARAM.FREQUENCY] = _this.filter.params[FILTER_PARAM.FREQUENCY],
            _a[FILTER_ENVELOPE_PARAM.GAIN] = _this.filter.params[FILTER_PARAM.GAIN],
            _a[FILTER_ENVELOPE_PARAM.Q] = _this.filter.params[FILTER_PARAM.Q],
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$j), props);
        _this.setFrequency(initProps.frequency);
        _this.setQ(initProps.q);
        _this.setDetune(initProps.detune);
        _this.setGain(initProps.gain);
        _this.setType(initProps.type);
        // Connections
        _this.source.connect(_this.filter.params[FILTER_PARAM.FREQUENCY]);
        return _this;
    }
    return FilterEnvelope;
}(Envelope));

var GAIN_PARAM = {
    GAIN: 'gain',
};
var defaultProps$i = {
    gain: 1,
};
/**
 * A node used to adjust the gain, or volume, of the incoming signal.
 * Wrapper class for the native Gain audio node.
 */
var Gain = /** @class */ (function (_super) {
    __extends(Gain, _super);
    function Gain(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Gain';
        // - Getters -
        /** Get the current gain value. */
        _this.getGain = function () { return _this.params[GAIN_PARAM.GAIN].value; };
        // - Setters -
        /** Set the gain of the node. */
        _this.setGain = function (val, time) {
            return _this._timeUpdate(_this.params[GAIN_PARAM.GAIN], val, time);
        };
        _this.gain = _this.AC.createGain();
        _this.inputs = [_this.gain];
        _this.outputs = [_this.gain];
        _this.params = (_a = {},
            _a[GAIN_PARAM.GAIN] = _this.gain.gain,
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$i), props);
        _this.setGain(initProps.gain);
        return _this;
    }
    return Gain;
}(BlipNode));

var GAIN_ENVELOPE_PARAM = {
    GAIN: 'gain',
};
var defaultProps$h = {
    gain: 0,
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0,
    modifier: 1,
};
/**
 * An envelope connected to a gain node.
 * Can be used to modulate the gain of the incoming signal over time.
 */
var GainEnvelope = /** @class */ (function (_super) {
    __extends(GainEnvelope, _super);
    function GainEnvelope(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'GainEnvelope';
        // - Getters -
        /** Get the base gain value on the gain node. */
        _this.getGain = function () { return _this.gain.getGain(); };
        // - Setters -
        /** Set the base gain value of the gain node. */
        _this.setGain = function (val, time) { return _this.gain.setGain(val, time); };
        _this.gain = new Gain({ AC: _this.AC });
        _this.inputs = [_this.gain];
        _this.outputs = [_this.gain];
        _this.params = (_a = {},
            _a[GAIN_ENVELOPE_PARAM.GAIN] = _this.gain.params[GAIN_PARAM.GAIN],
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$h), props);
        _this.setGain(initProps.gain);
        // Connections
        _this.source.connect(_this.gain.params[GAIN_PARAM.GAIN]);
        return _this;
    }
    return GainEnvelope;
}(Envelope));

/**
 * A node used to merge two audio signals.
 * Wrapper class for the native ChannelMerger audio node.
 */
var ChannelMerger = /** @class */ (function (_super) {
    __extends(ChannelMerger, _super);
    function ChannelMerger(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'ChannelMerger';
        _this.channelMerger = _this.AC.createChannelMerger(2);
        _this.inputs = [_this.channelMerger];
        _this.outputs = [_this.channelMerger];
        return _this;
    }
    return ChannelMerger;
}(BlipNode));

/**
 * A node used to split a stereo audio signal into its left and right components.
 * Wrapper class for the native ChannelSplitter audio node.
 */
var ChannelSplitter = /** @class */ (function (_super) {
    __extends(ChannelSplitter, _super);
    function ChannelSplitter(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'ChannelSplitter';
        _this.channelSplitter = _this.AC.createChannelSplitter(2);
        _this.inputs = [_this.channelSplitter];
        _this.outputs = [_this.channelSplitter];
        return _this;
    }
    return ChannelSplitter;
}(BlipNode));

var COMPRESSOR_PARAM = {
    ATTACK: 'attack',
    KNEE: 'knee',
    RATIO: 'ratio',
    RELEASE: 'release',
    THRESHOLD: 'threshold',
};
var defaultProps$g = {
    attack: 0.003,
    knee: 30,
    ratio: 12,
    release: 0.25,
    threshold: -24,
};
/**
 * A node used to control the dynamic range of a signal.
 * Wrapper class for the native DynamicsCompressor audio node.
 */
var Compressor = /** @class */ (function (_super) {
    __extends(Compressor, _super);
    function Compressor(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Compressor';
        // - Getters -
        /** Get the threshold in dB. */
        _this.getThreshold = function () { return _this.params[COMPRESSOR_PARAM.THRESHOLD].value; };
        /** Get the compression ratio. */
        _this.getRatio = function () { return _this.params[COMPRESSOR_PARAM.RATIO].value; };
        /** Get the current knee value. */
        _this.getKnee = function () { return _this.params[COMPRESSOR_PARAM.KNEE].value; };
        /** Get the attack time. */
        _this.getAttack = function () { return _this.params[COMPRESSOR_PARAM.ATTACK].value; };
        /** Get the release time. */
        _this.getRelease = function () { return _this.params[COMPRESSOR_PARAM.RELEASE].value; };
        /** Get the current gain reduction in dB. */
        _this.getReduction = function () { return _this.compressor.reduction; };
        // - Setters -
        /** Set the threshold. */
        _this.setThreshold = function (val, time) {
            return _this._timeUpdate(_this.params[COMPRESSOR_PARAM.THRESHOLD], val, time);
        };
        /** Set the compression ratio. */
        _this.setRatio = function (val, time) {
            return _this._timeUpdate(_this.params[COMPRESSOR_PARAM.RATIO], val, time);
        };
        /** Set the knee value. */
        _this.setKnee = function (val, time) {
            return _this._timeUpdate(_this.params[COMPRESSOR_PARAM.KNEE], val, time);
        };
        /** Set the attack time. */
        _this.setAttack = function (val, time) {
            return _this._timeUpdate(_this.params[COMPRESSOR_PARAM.ATTACK], val, time);
        };
        /** Set the release time. */
        _this.setRelease = function (val, time) {
            return _this._timeUpdate(_this.params[COMPRESSOR_PARAM.RELEASE], val, time);
        };
        _this.compressor = _this.AC.createDynamicsCompressor();
        _this.inputs = [_this.compressor];
        _this.outputs = [_this.compressor];
        _this.params = (_a = {},
            _a[COMPRESSOR_PARAM.ATTACK] = _this.compressor.attack,
            _a[COMPRESSOR_PARAM.KNEE] = _this.compressor.knee,
            _a[COMPRESSOR_PARAM.RATIO] = _this.compressor.ratio,
            _a[COMPRESSOR_PARAM.RELEASE] = _this.compressor.release,
            _a[COMPRESSOR_PARAM.THRESHOLD] = _this.compressor.threshold,
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$g), props);
        _this.setThreshold(initProps.threshold);
        _this.setRatio(initProps.ratio);
        _this.setKnee(initProps.knee);
        _this.setAttack(initProps.attack);
        _this.setRelease(initProps.release);
        return _this;
    }
    return Compressor;
}(BlipNode));

var defaultProps$f = {
    buffer: null,
    normalize: false,
};
/** Wrapper class for the native Convolver audio node. */
var Convolver = /** @class */ (function (_super) {
    __extends(Convolver, _super);
    function Convolver(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Convolver';
        // - Getters -
        /** Get the current buffer value. */
        _this.getBuffer = function () { return _this.convolver.buffer; };
        /** Get the current normalize value. */
        _this.getNormalize = function () { return _this.convolver.normalize; };
        // - Setters -
        /** Set the convolver's buffer. */
        _this.setBuffer = function (val) { return (_this.convolver.buffer = val); };
        /** Sets the normalize value. */
        _this.setNormalize = function (val) { return (_this.convolver.normalize = val); };
        _this.convolver = _this.AC.createConvolver();
        _this.inputs = [_this.convolver];
        _this.outputs = [_this.convolver];
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$f), props);
        _this.setBuffer(initProps.buffer);
        _this.setNormalize(initProps.normalize);
        return _this;
    }
    return Convolver;
}(BlipNode));

var DELAY_PARAM = {
    DELAY_TIME: 'delayTime',
};
var defaultProps$e = {
    delayTime: 0,
};
/**
 * A node used to adjust the gain, or volume, of the incoming signal.
 * Wrapper class for the native Gain audio node.
 */
var Delay = /** @class */ (function (_super) {
    __extends(Delay, _super);
    function Delay(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Delay';
        // - Getters -
        /** Get the current delay time value. */
        _this.getDelayTime = function () { return _this.params[DELAY_PARAM.DELAY_TIME].value; };
        // - Setters -
        /** Set the delay time of the node. */
        _this.setDelayTime = function (val, time) {
            return _this._timeUpdate(_this.params[DELAY_PARAM.DELAY_TIME], val, time);
        };
        _this.delay = _this.AC.createDelay();
        _this.inputs = [_this.delay];
        _this.outputs = [_this.delay];
        _this.params = (_a = {},
            _a[DELAY_PARAM.DELAY_TIME] = _this.delay.delayTime,
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$e), props);
        _this.setDelayTime(initProps.delayTime);
        return _this;
    }
    return Delay;
}(BlipNode));

var LIMITER_PARAM = {
    KNEE: 'knee',
    THRESHOLD: 'threshold',
    RATIO: 'ratio',
    ATTACK: 'attack',
    RELEASE: 'release',
    GAIN: 'gain',
};
var defaultProps$d = {
    threshold: -6,
    ratio: 20,
    knee: 0,
    attack: 0.003,
    release: 0.01,
    gain: 0.75,
};
/**
 * An effect used to limit the dynamic range of the incoming signal.
 * Built using a Compressor node with more aggressive settings connected to a Gain node.
 */
var Limiter = /** @class */ (function (_super) {
    __extends(Limiter, _super);
    function Limiter(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Limiter';
        // - Getters -
        /** Get the current knee value. */
        _this.getKnee = function () { return _this.limiter.getKnee(); };
        /** Get the threshold in dB. */
        _this.getThreshold = function () { return _this.limiter.getThreshold(); };
        /** Get the compression ratio. */
        _this.getRatio = function () { return _this.limiter.getRatio(); };
        /** Get the attack time. */
        _this.getAttack = function () { return _this.limiter.getAttack(); };
        /** Get the release time. */
        _this.getRelease = function () { return _this.limiter.getRelease(); };
        /** Get the current gain reduction in dB. */
        _this.getReduction = function () { return _this.limiter.getReduction(); };
        /** Get the gain value of the output gain. */
        _this.getGain = function () { return _this.gain.getGain(); };
        // - Setters -
        /** Set the knee value. */
        _this.setKnee = function (val, time) {
            return _this.limiter.setKnee(val, time);
        };
        /** Set the threshold. */
        _this.setThreshold = function (val, time) {
            return _this.limiter.setThreshold(val, time);
        };
        /** Set the compression ratio. */
        _this.setRatio = function (val, time) {
            return _this.limiter.setRatio(val, time);
        };
        /** Set the attack time. */
        _this.setAttack = function (val, time) {
            return _this.limiter.setAttack(val, time);
        };
        /** Set the release time. */
        _this.setRelease = function (val, time) {
            return _this.limiter.setRelease(val, time);
        };
        /** Set the gain value of the output. */
        _this.setGain = function (val, time) { return _this.gain.setGain(val, time); };
        _this.limiter = new Compressor({ AC: _this.AC });
        _this.gain = new Gain({ AC: _this.AC });
        _this.inputs = [_this.limiter];
        _this.outputs = [_this.gain];
        _this.params = (_a = {},
            _a[LIMITER_PARAM.ATTACK] = _this.limiter.params[COMPRESSOR_PARAM.ATTACK],
            _a[LIMITER_PARAM.GAIN] = _this.gain.params[GAIN_PARAM.GAIN],
            _a[LIMITER_PARAM.KNEE] = _this.limiter.params[COMPRESSOR_PARAM.KNEE],
            _a[LIMITER_PARAM.RATIO] = _this.limiter.params[COMPRESSOR_PARAM.RATIO],
            _a[LIMITER_PARAM.RELEASE] = _this.limiter.params[COMPRESSOR_PARAM.RELEASE],
            _a[LIMITER_PARAM.THRESHOLD] = _this.limiter.params[COMPRESSOR_PARAM.THRESHOLD],
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$d), props);
        _this.setThreshold(initProps.threshold);
        _this.setRatio(initProps.ratio);
        _this.setKnee(initProps.knee);
        _this.setAttack(initProps.attack);
        _this.setRelease(initProps.release);
        _this.setGain(initProps.gain);
        // Connections
        _this.limiter.connect(_this.gain);
        return _this;
    }
    return Limiter;
}(BlipNode));

var STEREO_PANNER_PARAM = {
    PAN: 'pan',
};
var defaultProps$c = {
    pan: 0,
};
/**
 * A Node used to adjust the pan of the incoming signal.
 * Wrapper class for the native StereoPanner audio node.
 */
var StereoPanner = /** @class */ (function (_super) {
    __extends(StereoPanner, _super);
    function StereoPanner(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'StereoPanner';
        // - Getters -
        /** Get the current pan value. */
        _this.getPan = function () { return _this.params[STEREO_PANNER_PARAM.PAN].value; };
        // - Setters -
        /** Set the pan of the node. */
        _this.setPan = function (val, time) {
            return _this._timeUpdate(_this.params[STEREO_PANNER_PARAM.PAN], val, time);
        };
        _this.stereoPanner = _this.AC.createStereoPanner();
        _this.inputs = [_this.stereoPanner];
        _this.outputs = [_this.stereoPanner];
        _this.params = (_a = {},
            _a[STEREO_PANNER_PARAM.PAN] = _this.stereoPanner.pan,
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$c), props);
        _this.setPan(initProps.pan);
        return _this;
    }
    return StereoPanner;
}(BlipNode));

var defaultProps$b = {
    curve: null,
    oversample: OVERSAMPLE.NONE,
};
/**
 * A Node used to adjust the shape of the incoming signal based on a waveshaping curve.
 * Wrapper class for the native WaveShaper audio node.
 */
var WaveShaper = /** @class */ (function (_super) {
    __extends(WaveShaper, _super);
    function WaveShaper(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'WaveShaper';
        // - Getters -
        /** Get the current curve. */
        _this.getCurve = function () { return _this.waveShaper.curve; };
        /** Get the current oversample value. */
        _this.getOversample = function () { return _this.waveShaper.oversample; };
        // - Setters -
        /** Set the node's waveshaping curve. */
        _this.setCurve = function (val) { return (_this.waveShaper.curve = val); };
        /** Set the node's oversample setting. */
        _this.setOversample = function (val) { return (_this.waveShaper.oversample = val); };
        _this.waveShaper = _this.AC.createWaveShaper();
        _this.inputs = [_this.waveShaper];
        _this.outputs = [_this.waveShaper];
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$b), props);
        _this.setCurve(initProps.curve);
        _this.setOversample(initProps.oversample);
        return _this;
    }
    return WaveShaper;
}(BlipNode));

var OSCILLATOR_PARAM = {
    DETUNE: 'detune',
    FREQUENCY: 'frequency',
};
var defaultProps$a = {
    detune: 0,
    frequency: 440,
    start: false,
    type: WAVEFORM.SINE,
};
/**
 * A source node that outputs signal of different waveforms and frequencies.
 * Wrapper class for the native Oscillator audio node.
 */
var Oscillator = /** @class */ (function (_super) {
    __extends(Oscillator, _super);
    function Oscillator(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Oscillator';
        /** Starts the oscillator */
        _this.start = function () { return _this.oscillator.start(); };
        /** Stops the oscillator */
        _this.stop = function () { return _this.oscillator.stop(); };
        // - Getters -
        /** Get the oscillator frequency */
        _this.getFrequency = function () { return _this.params[OSCILLATOR_PARAM.FREQUENCY].value; };
        /** Get the detune of the oscillator */
        _this.getDetune = function () { return _this.params[OSCILLATOR_PARAM.DETUNE].value; };
        /** Get the waveform of the oscillator (Alias for getType) */
        // public getWaveform = () => this.getType()
        /** Get the waveform of the oscillator */
        _this.getType = function () { return _this.oscillator.type; };
        // - Setters -
        /** Set the frequency of the oscillator */
        _this.setFrequency = function (val, time) {
            return _this._timeUpdate(_this.params[OSCILLATOR_PARAM.FREQUENCY], val, time);
        };
        /** Set the detune of the oscillator */
        _this.setDetune = function (val, time) {
            return _this._timeUpdate(_this.params[OSCILLATOR_PARAM.DETUNE], val, time);
        };
        /** Set the waveform of the oscillator (Alias for setType) */
        // public setWaveform = (val: Waveform) => this.setType(val)
        /** Set the waveform of the oscillator */
        _this.setType = function (val) { return (_this.oscillator.type = val); };
        _this.oscillator = _this.AC.createOscillator();
        _this.outputs = [_this.oscillator];
        _this.params = (_a = {},
            _a[OSCILLATOR_PARAM.DETUNE] = _this.oscillator.detune,
            _a[OSCILLATOR_PARAM.FREQUENCY] = _this.oscillator.frequency,
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$a), props);
        _this.setType(initProps.type);
        _this.setFrequency(initProps.frequency);
        _this.setDetune(initProps.detune);
        if (initProps.start)
            _this.start();
        return _this;
    }
    return Oscillator;
}(BlipNode));

var MIN_RATE = 0;
var MAX_RATE = 100;
var LFO_PARAM = {
    DEPTH: 'depth',
    DETUNE: 'detune',
    RATE: 'rate',
};
var defaultProps$9 = {
    depth: 1,
    detune: 0,
    rate: 1,
    start: false,
    type: WAVEFORM.SINE,
};
/**
 * A source node that outputs low frequency oscillations for modulating audio params over time.
 * Built using an oscillator connected to a gain node.
 */
var LFO = /** @class */ (function (_super) {
    __extends(LFO, _super);
    function LFO(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'LFO';
        /** Starts the oscillator */
        _this.start = function () { return _this.osc.start(); };
        /** Stops the oscillator */
        _this.stop = function () { return _this.osc.stop(); };
        // - Getters -
        /** Get the rate of the LFO */
        _this.getRate = function () { return _this.osc.getFrequency(); };
        /** Get the detune of the LFO */
        _this.getDetune = function () { return _this.osc.getDetune(); };
        /** Get the depth of the LFO */
        _this.getDepth = function () { return _this.depth.getGain(); };
        /** Get the waveform of the LFO */
        _this.getType = function () { return _this.osc.getType(); };
        // - Setters -
        /** Set the rate of the LFO. Max frequency is 100Hz. */
        _this.setRate = function (val, time) {
            return _this.osc.setFrequency(clamp(val, MIN_RATE, MAX_RATE), time);
        };
        /** Set the detune of the LFO. */
        _this.setDetune = function (val, time) {
            return _this.osc.setDetune(val, time);
        };
        /** Set the depth of the LFO. */
        _this.setDepth = function (val, time) {
            return _this.depth.setGain(val, time);
        };
        /** Set the waveform of the LFO. */
        _this.setType = function (val) { return _this.osc.setType(val); };
        _this.depth = new Gain({ AC: _this.AC });
        _this.osc = new Oscillator({ AC: _this.AC });
        _this.outputs = [_this.depth];
        _this.params = (_a = {},
            _a[LFO_PARAM.DEPTH] = _this.depth.params[GAIN_PARAM.GAIN],
            _a[LFO_PARAM.DETUNE] = _this.osc.params[OSCILLATOR_PARAM.DETUNE],
            _a[LFO_PARAM.RATE] = _this.osc.params[OSCILLATOR_PARAM.FREQUENCY],
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$9), props);
        _this.setRate(initProps.rate);
        _this.setDepth(initProps.depth);
        _this.setDetune(initProps.detune);
        _this.setType(initProps.type);
        // Connections
        _this.osc.connect(_this.depth);
        if (initProps.start)
            _this.start();
        return _this;
    }
    return LFO;
}(BlipNode));

var AUTO_PAN_PARAM = {
    DEPTH: 'depth',
    RATE: 'rate',
};
var defaultProps$8 = {
    depth: 1,
    rate: 1,
    type: WAVEFORM.SINE,
};
/**
 * An effect used to pan the incoming signal back and forth at an adjustable rate and depth.
 * Composed of an LFO connected to a StereoPanner node.
 */
var AutoPan = /** @class */ (function (_super) {
    __extends(AutoPan, _super);
    function AutoPan(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'AutoPan';
        // - Getters -
        /** Get the depth of the pan modulation. */
        _this.getDepth = function () { return _this.LFO.getDepth(); };
        /** Get the rate of the pan modulation. */
        _this.getRate = function () { return _this.LFO.getRate(); };
        /** Get the waveform of the pan modulation. */
        _this.getType = function () { return _this.LFO.getType(); };
        // - Setters -
        /** Set the depth of the pan modulation. */
        _this.setDepth = function (val, time) { return _this.LFO.setDepth(val, time); };
        /** Set the rate of the pan modulation. */
        _this.setRate = function (val, time) { return _this.LFO.setRate(val, time); };
        /** Set the waveform of the pan modulation. */
        _this.setType = function (val) { return _this.LFO.setType(val); };
        _this.LFO = new LFO({ AC: _this.AC, start: true });
        _this.panner = new StereoPanner({ AC: _this.AC });
        _this.inputs = [_this.panner];
        _this.outputs = [_this.panner];
        _this.params = (_a = {},
            _a[AUTO_PAN_PARAM.DEPTH] = _this.LFO.params[LFO_PARAM.DEPTH],
            _a[AUTO_PAN_PARAM.RATE] = _this.LFO.params[LFO_PARAM.RATE],
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$8), props);
        _this.setRate(initProps.rate);
        _this.setDepth(initProps.depth);
        _this.setType(initProps.type);
        // Connections
        _this.LFO.connect(_this.panner.params[STEREO_PANNER_PARAM.PAN]);
        return _this;
    }
    return AutoPan;
}(BlipNode));

var defaultProps$7 = {
    amount: 0,
    distortion: 0,
};
/**
 * An effect used to clip/distort the incoming signal.
 */
var Distortion = /** @class */ (function (_super) {
    __extends(Distortion, _super);
    function Distortion(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Distortion';
        // - Getters -
        /** Get the dry/wet amount level of the node. */
        _this.getAmount = function () { return _this.wetGain.getGain(); };
        /** Get the distortion value of the node. */
        _this.getDistortion = function () { return _this.distortion; };
        // - Setters -
        /** Set the dry/wet amount of the node. */
        _this.setAmount = function (val, time) {
            _this._linearFadeUpdate(_this.dryGain.params[GAIN_PARAM.GAIN], _this.wetGain.params[GAIN_PARAM.GAIN], val, time);
        };
        /** Set the distortion value of the node. */
        _this.setDistortion = function (val) {
            _this.waveShaper.setCurve(_this._createDistCurve(val));
            _this.distortion = val;
        };
        // Generate distortion curve
        _this._createDistCurve = function (gain) {
            if (gain === void 0) { gain = 0; }
            var sampleNum = _this.AC.sampleRate;
            var curve = new Float32Array(sampleNum);
            return curve.map(function (_, i) {
                var x = (i * 2) / sampleNum - 1;
                return (((3 + gain) * Math.atan(Math.sinh(x * 0.25) * 5)) /
                    (Math.PI + gain * Math.abs(x)));
            });
        };
        _this.distortion = 0;
        _this.dryGain = new Gain({ AC: _this.AC });
        _this.wetGain = new Gain({ AC: _this.AC });
        _this.waveShaper = new WaveShaper({ AC: _this.AC });
        _this.inputs = [_this.dryGain, _this.waveShaper];
        _this.outputs = [_this.dryGain, _this.wetGain];
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$7), props);
        _this.setAmount(initProps.amount);
        _this.setDistortion(initProps.distortion);
        // Connections
        _this.waveShaper.connect(_this.wetGain);
        return _this;
    }
    return Distortion;
}(BlipNode));

var defaultProps$6 = {
    lowFrequency: 320,
    lowGain: 0,
    highFrequency: 3200,
    highGain: 0,
};
/**
 * A 2-band equalizer node for adjusting the gain of the high and low frequencies of the incoming signal.
 */
var EQ2 = /** @class */ (function (_super) {
    __extends(EQ2, _super);
    function EQ2(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'EQ2';
        // - Getters -
        /** Get the frequency of the low band. */
        _this.getLowFrequency = function () { return _this.low.getFrequency(); };
        /** Get the gain value of the low band. */
        _this.getLowGain = function () { return _this.low.getGain(); };
        /** Get the frequency of the high band. */
        _this.getHighFrequency = function () { return _this.high.getFrequency(); };
        /** Get the gain value of the high band. */
        _this.getHighGain = function () { return _this.high.getGain(); };
        // - Setters -
        /** Set the frequency of the low band. */
        _this.setLowFrequency = function (val, time) {
            return _this.low.setFrequency(val, time);
        };
        /** Set the gain value of the low band. */
        _this.setLowGain = function (val, time) {
            return _this.low.setGain(val, time);
        };
        /** Set the frequency of the high band. */
        _this.setHighFrequency = function (val, time) {
            return _this.high.setFrequency(val, time);
        };
        /** Set the gain value of the high band. */
        _this.setHighGain = function (val, time) {
            return _this.high.setGain(val, time);
        };
        _this.low = new Filter({
            AC: _this.AC,
            type: FILTER_TYPE.LOW_SHELF,
            frequency: 320,
        });
        _this.high = new Filter({
            AC: _this.AC,
            type: FILTER_TYPE.HIGH_SHELF,
            frequency: 3200,
        });
        _this.inputs = [_this.low];
        _this.outputs = [_this.high];
        _this.params = {
            lowFrequency: _this.low.params[FILTER_PARAM.FREQUENCY],
            lowGain: _this.low.params[FILTER_PARAM.GAIN],
            highFrequency: _this.high.params[FILTER_PARAM.FREQUENCY],
            highGain: _this.high.params[FILTER_PARAM.GAIN],
        };
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$6), props);
        _this.setLowFrequency(initProps.lowFrequency);
        _this.setLowGain(initProps.lowGain);
        _this.setHighFrequency(initProps.highFrequency);
        _this.setHighGain(initProps.highGain);
        // Connections
        _this.low.connect(_this.high);
        return _this;
    }
    return EQ2;
}(BlipNode));

var FEEDBACK_DELAY_PARAM = {
    DELAY_TIME: 'delayTime',
    FEEDBACK: 'feedback',
    TONE: 'tone',
};
var defaultProps$5 = {
    amount: 0,
    delayTime: 0.2,
    feedback: 0.6,
    tone: 4400,
};
/**
 * A feedback delay effect to adds echos and other delay-based effects to the incoming signal.
 */
var FeedbackDelay = /** @class */ (function (_super) {
    __extends(FeedbackDelay, _super);
    function FeedbackDelay(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'FeedbackDelay';
        // - Getters -
        /** Get the dry/wet amount of the node. */
        _this.getAmount = function () { return _this.amount; };
        /** Get the delay time of the node. */
        _this.getDelayTime = function () { return _this.delay.getDelayTime(); };
        /** Get the feedback of the node. */
        _this.getFeedback = function () { return _this.feedbackGain.getGain(); };
        /** Get the tone value of the node. */
        _this.getTone = function () { return _this.tone.getFrequency(); };
        // - Setters -
        /** Set the dry/wet amount of the node. */
        _this.setAmount = function (val, time) {
            _this.amount = val;
            _this._dryWetUpdate(_this.dryGain.params[GAIN_PARAM.GAIN], _this.wetGain.params[GAIN_PARAM.GAIN], val, time);
        };
        /** Set the delay time of the node. */
        _this.setDelayTime = function (val, time) {
            return _this.delay.setDelayTime(val, time);
        };
        /** Set the feedback value of the node. */
        _this.setFeedback = function (val, time) {
            return _this.feedbackGain.setGain(val, time);
        };
        /** Set the tone value of the node. */
        _this.setTone = function (val, time) {
            return _this.tone.setFrequency(val, time);
        };
        _this.amount = 0;
        _this.dryGain = new Gain({ AC: _this.AC });
        _this.delay = new Delay({ AC: _this.AC });
        _this.feedbackGain = new Gain({ AC: _this.AC });
        _this.tone = new Filter({ AC: _this.AC });
        _this.wetGain = new Gain({ AC: _this.AC });
        _this.inputs = [_this.dryGain, _this.delay];
        _this.outputs = [_this.dryGain, _this.wetGain];
        _this.params = (_a = {},
            _a[FEEDBACK_DELAY_PARAM.DELAY_TIME] = _this.delay.params[DELAY_PARAM.DELAY_TIME],
            _a[FEEDBACK_DELAY_PARAM.FEEDBACK] = _this.feedbackGain.params[GAIN_PARAM.GAIN],
            _a[FEEDBACK_DELAY_PARAM.TONE] = _this.tone.params[FILTER_PARAM.FREQUENCY],
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$5), props);
        _this.setAmount(initProps.amount);
        _this.setDelayTime(initProps.delayTime);
        _this.setFeedback(initProps.feedback);
        _this.setTone(initProps.tone);
        // Connections
        _this.delay.connect(_this.feedbackGain);
        _this.feedbackGain.connect(_this.tone);
        _this.feedbackGain.connect(_this.delay);
        _this.tone.connect(_this.wetGain);
        return _this;
    }
    return FeedbackDelay;
}(BlipNode));

var defaultProps$4 = {
    amount: 0,
    preDelayTime: 0.2,
    leftDelayTime: 0.2,
    rightDelayTime: 0.2,
    leftFeedback: 0.6,
    rightFeedback: 0.6,
    tone: 4400,
};
/**
 * A ping pong delay effect to adds echos and other delay-based effects to the incoming signal.
 */
var PingPongDelay = /** @class */ (function (_super) {
    __extends(PingPongDelay, _super);
    function PingPongDelay(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'PingPongDelay';
        // - Getters -
        /** Get the dry/wet amount of the node. */
        _this.getAmount = function () { return _this.amount; };
        /** Get the initial delay time of the node. */
        _this.getPreDelayTime = function () { return _this.params.preDelayTime.value; };
        /** Get the left delay time of the node. */
        _this.getLeftDelayTime = function () { return _this.params.leftDelayTime.value; };
        /** Get the right delay time of the node. */
        _this.getRightDelayTime = function () { return _this.params.rightDelayTime.value; };
        /** Get the left feedback of the node. */
        _this.getLeftFeedback = function () { return _this.params.leftFeedback.value; };
        /** Get the right feedback of the node. */
        _this.getRightFeedback = function () { return _this.params.rightFeedback.value; };
        /** Get the tone value of the node. */
        _this.getTone = function () { return _this.params.tone.value; };
        // - Setters -
        /** Set the dry/wet amount of the node. */
        _this.setAmount = function (val, time) {
            _this.amount = val;
            _this._dryWetUpdate(_this.dryGain.params[GAIN_PARAM.GAIN], _this.wetGain.params[GAIN_PARAM.GAIN], val, time);
        };
        /** Set the initial delay time of the node. */
        _this.setPreDelayTime = function (val, time) {
            return _this.preDelay.setDelayTime(val, time);
        };
        /** Set the left delay time of the node. */
        _this.setLeftDelayTime = function (val, time) {
            return _this.leftDelay.setDelayTime(val, time);
        };
        /** Set the right delay time of the node. */
        _this.setRightDelayTime = function (val, time) {
            return _this.rightDelay.setDelayTime(val, time);
        };
        /** Set the left feedback value of the node. */
        _this.setLeftFeedback = function (val, time) {
            return _this.leftFeedbackGain.setGain(val, time);
        };
        /** Set the right feedback value of the node. */
        _this.setRightFeedback = function (val, time) {
            return _this.rightFeedbackGain.setGain(val, time);
        };
        /** Set the tone value of the node. */
        _this.setTone = function (val, time) {
            return _this.tone.setFrequency(val, time);
        };
        _this.amount = 0;
        _this.dryGain = new Gain({ AC: _this.AC });
        _this.leftDelay = new Delay({ AC: _this.AC });
        _this.preDelay = new Delay({ AC: _this.AC });
        _this.rightDelay = new Delay({ AC: _this.AC });
        _this.leftFeedbackGain = new Gain({ AC: _this.AC });
        _this.rightFeedbackGain = new Gain({ AC: _this.AC });
        _this.channelMerger = new ChannelMerger({ AC: _this.AC });
        _this.tone = new Filter({ AC: _this.AC });
        _this.wetGain = new Gain({ AC: _this.AC });
        _this.inputs = [_this.dryGain, _this.leftDelay, _this.preDelay];
        _this.outputs = [_this.dryGain, _this.wetGain];
        _this.params = {
            preDelayTime: _this.preDelay.params[DELAY_PARAM.DELAY_TIME],
            leftDelayTime: _this.leftDelay.params[DELAY_PARAM.DELAY_TIME],
            rightDelayTime: _this.rightDelay.params[DELAY_PARAM.DELAY_TIME],
            leftFeedback: _this.leftFeedbackGain.params[GAIN_PARAM.GAIN],
            rightFeedback: _this.rightFeedbackGain.params[GAIN_PARAM.GAIN],
            tone: _this.tone.params[FILTER_PARAM.FREQUENCY],
        };
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$4), props);
        _this.setAmount(initProps.amount);
        _this.setPreDelayTime(initProps.preDelayTime);
        _this.setLeftDelayTime(initProps.leftDelayTime);
        _this.setRightDelayTime(initProps.rightDelayTime);
        _this.setLeftFeedback(initProps.leftFeedback);
        _this.setRightFeedback(initProps.rightFeedback);
        _this.setTone(initProps.tone);
        // Connections
        _this.preDelay.connect(_this.rightDelay);
        _this.leftDelay.connect(_this.channelMerger, 0, 0);
        _this.rightDelay.connect(_this.channelMerger, 0, 1);
        _this.leftDelay.connect(_this.leftFeedbackGain);
        _this.leftFeedbackGain.connect(_this.rightDelay);
        _this.rightDelay.connect(_this.rightFeedbackGain);
        _this.rightFeedbackGain.connect(_this.leftDelay);
        _this.channelMerger.connect(_this.tone);
        _this.tone.connect(_this.wetGain);
        return _this;
    }
    return PingPongDelay;
}(BlipNode));

var BUFFER_SOURCE_PARAM = {
    DETUNE: 'detune',
    PLAYBACK_RATE: 'playbackRate',
};
var defaultProps$3 = {
    buffer: null,
    detune: 0,
    loop: false,
    playbackRate: 1.0,
    start: false,
};
/**
 * A source node that outputs signal based on a provided audio buffer.
 * Wrapper class for the native AudioBufferSourceNode.
 */
var BufferSource = /** @class */ (function (_super) {
    __extends(BufferSource, _super);
    function BufferSource(props) {
        var _a;
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'BufferSource';
        /** Starts output from the source node */
        _this.start = function () { return _this.bufferSource.start(); };
        /** Stops output from the source node */
        _this.stop = function () { return _this.bufferSource.stop(); };
        // - Getters -
        /** Get the current buffer of the source node */
        _this.getBuffer = function () { return _this.bufferSource.buffer; };
        /** Get the current loop setting */
        _this.getLoop = function () { return _this.bufferSource.loop; };
        /** Get the current detune value */
        _this.getDetune = function () { return _this.params[BUFFER_SOURCE_PARAM.DETUNE].value; };
        /** Get the current playback rate */
        _this.getPlaybackRate = function () {
            return _this.params[BUFFER_SOURCE_PARAM.PLAYBACK_RATE].value;
        };
        // - Setters -
        /** Set the buffer of the source node */
        _this.setBuffer = function (val) {
            return (_this.bufferSource.buffer = val);
        };
        /** Set the loop value of the source node */
        _this.setLoop = function (val) { return (_this.bufferSource.loop = val); };
        /** Set the detune value of the source node */
        _this.setDetune = function (val, time) {
            return _this._timeUpdate(_this.params[BUFFER_SOURCE_PARAM.DETUNE], val, time);
        };
        /** Set the playback rate of the source node */
        _this.setPlaybackRate = function (val, time) {
            return _this._timeUpdate(_this.params[BUFFER_SOURCE_PARAM.PLAYBACK_RATE], val, time);
        };
        _this.bufferSource = _this.AC.createBufferSource();
        _this.outputs = [_this.bufferSource];
        _this.params = (_a = {},
            _a[BUFFER_SOURCE_PARAM.DETUNE] = _this.bufferSource.detune,
            _a[BUFFER_SOURCE_PARAM.PLAYBACK_RATE] = _this.bufferSource.playbackRate,
            _a);
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$3), props);
        _this.setBuffer(initProps.buffer);
        _this.setLoop(initProps.loop);
        _this.setDetune(initProps.detune);
        _this.setPlaybackRate(initProps.playbackRate);
        if (initProps.start)
            _this.start();
        return _this;
    }
    return BufferSource;
}(BlipNode));

var _a;
var getBuffer = function (AC) {
    var bufferSize = AC.sampleRate * 2;
    return AC.createBuffer(1, bufferSize, AC.sampleRate);
};
var getWhiteNoiseBuffer = function (buffer) {
    var data = buffer.getChannelData(0);
    for (var i = 0; i < data.length; i++)
        data[i] = Math.random() * 2 - 1;
    return buffer;
};
var getBrownNoiseBuffer = function (buffer) {
    var data = buffer.getChannelData(0);
    var lastVal = 0.0;
    for (var i = 0; i < data.length; i++) {
        var gainMakeup = 4;
        var white = Math.random() * 2 - 1;
        data[i] = ((lastVal + 0.02 * white) * gainMakeup) / 1.02;
        lastVal = data[i] / gainMakeup;
    }
    return buffer;
};
var getPinkNoiseBuffer = function (buffer) {
    var data = buffer.getChannelData(0);
    var b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (var i = 0; i < data.length; i++) {
        var gainMakeup = 0.11;
        var white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * gainMakeup;
        b6 = white * 0.115926;
    }
    return buffer;
};
var typeBufferMap = (_a = {},
    _a[NOISE_TYPE.WHITE] = getWhiteNoiseBuffer,
    _a[NOISE_TYPE.PINK] = getPinkNoiseBuffer,
    _a[NOISE_TYPE.BROWN] = getBrownNoiseBuffer,
    _a);
var defaultProps$2 = {
    start: false,
    type: NOISE_TYPE.WHITE,
};
/**
 * A source node that outputs three types of noise using a BufferSource node.
 * Can output white, pink, or brown noise.
 */
var NoiseGenerator = /** @class */ (function (_super) {
    __extends(NoiseGenerator, _super);
    function NoiseGenerator(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'NoiseGenerator';
        /** Starts output from the source node */
        _this.start = function () { return _this.bufferSource.start(); };
        /** Stops output from the source node */
        _this.stop = function () { return _this.bufferSource.stop(); };
        // - Getters -
        /** Get the current noise type */
        _this.getType = function () { return _this.type; };
        // - Setters -
        /** Set the noise type that is output */
        _this.setType = function (val) {
            _this.type = val;
            var sourceBuffer = _this.bufferSource.getBuffer();
            if (sourceBuffer !== null) {
                typeBufferMap[_this.type](sourceBuffer);
            }
            else {
                var buffer = getBuffer(_this.AC);
                _this.bufferSource.setBuffer(typeBufferMap[_this.type](buffer));
            }
        };
        _this.bufferSource = new BufferSource({ AC: _this.AC, loop: true });
        _this.outputs = [_this.bufferSource];
        _this.type = NOISE_TYPE.WHITE;
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$2), props);
        _this.setType(initProps.type);
        if (initProps.start)
            _this.start();
        return _this;
    }
    return NoiseGenerator;
}(BlipNode));

var defaultProps$1 = {
    amount: 0,
    buffer: null,
    normalize: false,
};
/**
 * A convolusion reverb effect to adds width and space effects to the incoming signal.
 * A default impulse response will be generated if one is not provided.
 */
var Reverb = /** @class */ (function (_super) {
    __extends(Reverb, _super);
    function Reverb(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Reverb';
        // - Getters -
        /** Get the dry/wet amount of the node. */
        _this.getAmount = function () { return _this.amount; };
        /** Get the current audio buffer of the node. */
        _this.getBuffer = function () { return _this.convolver.getBuffer(); };
        /** Get the current normalize value of the node. */
        _this.getNormalize = function () { return _this.convolver.getNormalize(); };
        // - Setters -
        /** Set the dry/wet amount of the node. */
        _this.setAmount = function (val, time) {
            _this.amount = val;
            _this._dryWetUpdate(_this.dryGain.params[GAIN_PARAM.GAIN], _this.wetGain.params[GAIN_PARAM.GAIN], val, time);
        };
        /** Set the audio buffer of the node. */
        _this.setBuffer = function (val) { return _this.convolver.setBuffer(val); };
        /** Set the normalize value of the node. */
        _this.setNormalize = function (val) { return _this.convolver.setNormalize(val); };
        // Helper function to generate a default buffer
        _this._generateBuffer = function () {
            var preDelay = 0.01;
            var decay = 0.5;
            var sampleRate = _this.AC.sampleRate;
            // Use noise generators to create the impulse
            var context = new OfflineAudioContext(2, (preDelay + decay) * 5 * sampleRate, sampleRate);
            var noiseL = new NoiseGenerator({ AC: context, start: true });
            var noiseR = new NoiseGenerator({ AC: context, start: true });
            var channelMerger = new ChannelMerger({ AC: context });
            var gain = new Gain({ AC: context });
            noiseL.connect(channelMerger, 0, 0);
            noiseR.connect(channelMerger, 0, 1);
            channelMerger.connect(gain);
            gain.connect(context.destination);
            // Set envelope for the gain node
            gain.params[GAIN_PARAM.GAIN].setValueAtTime(0, context.currentTime);
            gain.params[GAIN_PARAM.GAIN].setTargetAtTime(0.05, context.currentTime, preDelay);
            gain.params[GAIN_PARAM.GAIN].setTargetAtTime(0, context.currentTime + preDelay, decay);
            // Render and set the buffer
            context.startRendering().then(function (buffer) { return _this.setBuffer(buffer); });
        };
        _this.amount = 0;
        _this.dryGain = new Gain({ AC: _this.AC });
        _this.convolver = new Convolver({ AC: _this.AC });
        _this.wetGain = new Gain({ AC: _this.AC });
        _this.inputs = [_this.dryGain, _this.convolver];
        _this.outputs = [_this.dryGain, _this.wetGain];
        // Initialize
        var initProps = __assign(__assign({}, defaultProps$1), props);
        _this.setAmount(initProps.amount);
        _this.setBuffer(initProps.buffer);
        _this.setNormalize(initProps.normalize);
        // Generate a default buffer if one is not provided
        if (!_this.getBuffer())
            _this._generateBuffer();
        // Connections
        _this.convolver.connect(_this.wetGain);
        return _this;
    }
    return Reverb;
}(BlipNode));

var defaultProps = {
    depth: 1,
    rate: 1,
    type: WAVEFORM.SINE,
};
/**
 * An effect used to modulate the gain of the incoming signal at an adjustable rate and depth.
 * Composed of an LFO connected to a Gain node.
 */
var Tremolo = /** @class */ (function (_super) {
    __extends(Tremolo, _super);
    function Tremolo(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.name = 'Tremolo';
        // - Getters -
        /** Get the depth of the gain modulation. */
        _this.getDepth = function () { return _this.LFO.getDepth(); };
        /** Get the rate of the gain modulation. */
        _this.getRate = function () { return _this.LFO.getRate(); };
        /** Get the waveform of the gain modulation. */
        _this.getType = function () { return _this.LFO.getType(); };
        // - Setters -
        /** Set the depth of the gain modulation. */
        _this.setDepth = function (val, time) { return _this.LFO.setDepth(val, time); };
        /** Set the rate of the gain modulation. */
        _this.setRate = function (val, time) { return _this.LFO.setRate(val, time); };
        /** Set the waveform of the gain modulation. */
        _this.setType = function (val) { return _this.LFO.setType(val); };
        _this.LFO = new LFO({ AC: _this.AC, start: true });
        _this.gain = new Gain({ AC: _this.AC, gain: 0 });
        _this.inputs = [_this.gain];
        _this.outputs = [_this.gain];
        _this.params = {
            depth: _this.LFO.params[LFO_PARAM.DEPTH],
            rate: _this.LFO.params[LFO_PARAM.RATE],
        };
        // Initialize
        var initProps = __assign(__assign({}, defaultProps), props);
        _this.setRate(initProps.rate);
        _this.setDepth(initProps.depth);
        _this.setType(initProps.type);
        // Connections
        _this.LFO.connect(_this.gain.params[GAIN_PARAM.GAIN]);
        return _this;
    }
    return Tremolo;
}(BlipNode));

console.log('Hello, Blip!');

exports.AutoPan = AutoPan;
exports.BufferSource = BufferSource;
exports.ChannelMerger = ChannelMerger;
exports.ChannelSplitter = ChannelSplitter;
exports.Compressor = Compressor;
exports.ConstantSource = ConstantSource;
exports.Convolver = Convolver;
exports.Delay = Delay;
exports.Distortion = Distortion;
exports.EQ2 = EQ2;
exports.Envelope = Envelope;
exports.FeedbackDelay = FeedbackDelay;
exports.Filter = Filter;
exports.FilterEnvelope = FilterEnvelope;
exports.Gain = Gain;
exports.GainEnvelope = GainEnvelope;
exports.LFO = LFO;
exports.Limiter = Limiter;
exports.NoiseGenerator = NoiseGenerator;
exports.Oscillator = Oscillator;
exports.PingPongDelay = PingPongDelay;
exports.Reverb = Reverb;
exports.StereoPanner = StereoPanner;
exports.Tremolo = Tremolo;
exports.WaveShaper = WaveShaper;
exports.chain = chain;
exports.getContext = getContext;
exports.resume = resume;
exports.setContext = setContext;
//# sourceMappingURL=index.js.map
