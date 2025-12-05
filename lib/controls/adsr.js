/**
 * ADSR Envelope Generator
 * @module controls/adsr
 */

import {context, create as _create, set, chain, duration, chData, schedule} from '../core.js';

/**
 * Creates an ADSR envelope generator
 * @param {Object} prefs - Envelope preferences
 * @param {number} [prefs.volume=0.41] - Maximum volume
 * @param {number} [prefs.attack=0.31] - Attack time in seconds
 * @param {number} [prefs.decay=0.16] - Decay time in seconds
 * @param {number} [prefs.sustain=0.8] - Sustain level (0-1)
 * @param {number} [prefs.release=0.21] - Release time in seconds
 * @returns {Object} ADSR node with through (GainNode) and prefs
 */
const create = prefs => [{
	prefs: Object.assign({
		volume: 0.41,
		attack: 0.31,
		decay: 0.16,
		sustain: 0.8,
		release: 0.21
	}, prefs),
	through: _create('gain')
}].map(n => (
	set(n.through.gain, 'value', 0),
	n
)).pop();

/**
 * Updates ADSR preferences
 * @param {Object} n - ADSR node
 * @param {Object} prefs - New preferences
 * @returns {Object} Updated ADSR node
 */
const update = (n, prefs) => (
	set(n, 'prefs', Object.assign({}, n.prefs, prefs)),
	n
);

/**
 * Triggers note on (attack/decay/sustain phase)
 * @param {Object} node - ADSR node
 * @param {number} velocity - Note velocity (0-1)
 * @param {number} [time] - Start time (defaults to current time)
 * @returns {Object} The ADSR node
 */
const noteOn = (node, velocity, time) => {
	const now = context.currentTime;
	time = (time || now) + 0.0001;

	node.through.gain.cancelScheduledValues(0);

	const changes = [].concat(
		// attack
		(node.prefs.attack > 0)
			? [[0, time], [velocity * node.prefs.volume, node.prefs.attack]]
			: [[velocity * node.prefs.volume, time]],
		// decay
		(node.prefs.decay > 0)
			? [[node.prefs.sustain * velocity * node.prefs.volume, node.prefs.decay]] : []
	).reduce((a, c) => [[].concat(a[0], c[0]), [].concat(a[1], c[1])], [[], []]);

	schedule(node.through, 'gain', changes[0], changes[1]);
	return node;
};

/**
 * Triggers note off (release phase)
 * @param {Object} node - ADSR node
 * @param {number} [time] - Release time (defaults to current time)
 * @returns {Object} The ADSR node
 */
const noteOff = (node, time) => {
	const now = context.currentTime;
	time = time || now + 0.0001;

	setTimeout(() => (
		node.through.gain.cancelScheduledValues(0),
		node.through.gain.setValueCurveAtTime(new Float32Array([node.through.gain.value, 0]),
			time, node.prefs.release > 0 && node.prefs.release || 0.00001)
	), (time - now) * 1000);
	return node;
};

export {
	create,
	update,
	noteOn,
	noteOff
};

