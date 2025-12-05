/**
 * Reverb Effect
 * @module effects/reverb
 */

import {context, create as _create, set, chain, duration, chData} from '../core.js';

/**
 * Builds an impulse response buffer for reverb
 * @param {Object} params - Impulse parameters
 * @param {number} params.seconds - Duration of impulse in seconds
 * @param {number} params.decay - Decay factor
 * @returns {AudioBuffer} The impulse response buffer
 */
const buildImpulse = ({seconds, decay}) => {
	const impulse = _create('buffer', 2, duration(seconds), context.sampleRate);
	const channelData = [
		chData(impulse, 0),
		chData(impulse, 1)
	];
	for (let i = 0; i < duration(seconds); i++) {
		channelData[0][i] = (Math.random() * 2 - 1) * Math.pow(1 - i / duration(seconds), decay);
		channelData[1][i] = (Math.random() * 2 - 1) * Math.pow(1 - i / duration(seconds), decay);
	}
	return impulse;
};

/**
 * Creates a reverb effect node
 * @param {Object} prefs - Reverb preferences
 * @param {number} [prefs.seconds=3] - Reverb duration in seconds
 * @param {number} [prefs.decay=2] - Reverb decay factor
 * @param {number} [prefs.wet=0] - Wet signal level (0-1)
 * @param {number} [prefs.dry=1] - Dry signal level (0-1)
 * @returns {Object} Reverb node with input, output, effect (ConvolverNode), wet, and dry gain nodes
 */
const create = prefs => [{
	prefs: Object.assign({seconds: 3, decay: 2, wet: 0, dry: 1}, prefs),
	input: _create('gain'),
	output: _create('gain'),
	effect: _create('convolver'),
	wet: _create('gain'),
	dry: _create('gain')
}].map(n => (
	chain(n.input, n.dry, n.output),
	chain(n.input, n.effect, n.wet, n.output),
	set(n.dry.gain, 'value', n.prefs.dry),
	set(n.wet.gain, 'value', n.prefs.wet),
	set(n.effect, 'buffer', buildImpulse(n.prefs)),
	n
)).pop();

/**
 * Updates reverb preferences
 * @param {Object} n - Reverb node
 * @param {Object} prefs - New preferences
 * @returns {Object} Updated reverb node
 */
const update = (n, prefs) => (
	(n.prefs.seconds !== prefs.seconds || n.prefs.decay !== prefs.decay)
		&& set(n.effect, 'buffer', buildImpulse(Object.assign({}, n.prefs, prefs))),
	(n.prefs.dry !== prefs.dry)
		&& set(n.dry.gain, 'value', prefs.dry),
	(n.prefs.wet !== prefs.wet)
		&& set(n.wet.gain, 'value', prefs.wet),
	set(n, 'prefs', Object.assign({}, n.prefs, prefs)),
	n
);

export {
	create,
	update
};

