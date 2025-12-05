/**
 * Low-Frequency Oscillator
 * @module effects/lfo
 */

import {context, create as _create, set, chain, duration, chData} from '../core.js';

/**
 * Creates a Low-Frequency Oscillator (LFO)
 * @param {Object} prefs - LFO preferences
 * @param {string} [prefs.type='sawtooth'] - Waveform type (sine, square, sawtooth, triangle)
 * @param {number} [prefs.frequency=5] - LFO frequency in Hz
 * @param {number} [prefs.gain=15] - LFO gain/amplitude
 * @returns {Object} LFO node with effect (OscillatorNode), output (GainNode), and prefs
 */
const create = prefs => [{
	prefs: Object.assign({
		type: 'sawtooth',
		frequency: 5,
		gain: 15
	}, prefs),
	effect: _create('oscillator'),
	output: _create('gain')
}].map(n => (
	chain(n.effect, n.output),
	set(n.effect.frequency, 'value', n.prefs.frequency),
	set(n.output.gain, 'value', n.prefs.gain),
	set(n.effect, 'type', n.prefs.type),
	n
)).pop();

/**
 * Updates LFO preferences
 * @param {Object} n - LFO node
 * @param {Object} prefs - New preferences
 * @returns {Object} Updated LFO node
 */
const update = (n, prefs) => (
	set(n, 'prefs', Object.assign({}, n.prefs, prefs)),
	set(n.effect.frequency, 'value', n.prefs.frequency),
	set(n.output.gain, 'value', n.prefs.gain),
	set(n.effect, 'type', n.prefs.type),
	n
);

/**
 * Starts the LFO oscillator
 * @param {Object} n - LFO node
 * @param {...*} args - Additional arguments (unused, for API consistency)
 * @returns {Object} The LFO node
 */
const start = (n, ...args) => (
	n.effect.start(),
	n
);

export {
	create,
	update,
	start
};

