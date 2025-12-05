/**
 * @module iblokz-audio
 * @description Web Audio API utilities and engine for building reactive audio applications
 * @version 0.1.0
 */

import {
	context, set, isSet, isGet,
	schedule as _schedule,
	create as _create,
	connect as _connect, disconnect as _disconnect
} from './lib/core.js';

import * as reverb from './lib/effects/reverb.js';
import * as lfo from './lib/effects/lfo.js';
import * as adsr from './lib/controls/adsr.js';
import * as sampler from './lib/sources/sampler.js';

/**
 * Creates an audio node of the specified type
 * @param {string} type - Node type (vco, vca, vcf, lfo, reverb, adsr)
 * @param {Object} [prefs={}] - Node preferences
 * @param {AudioContext} [ctx=context] - Audio context (defaults to global context)
 * @returns {Object} Audio node object
 */
const create = (type, prefs = {}, ctx = context) => Object.assign({},
	({
		vco: () => ({output: _create('oscillator')}),
		vca: () => ({through: _create('gain')}),
		vcf: () => ({through: _create('biquadFilter')}),
		lfo: () => lfo.create(prefs),
		reverb: () => reverb.create(prefs),
		adsr: () => adsr.create(prefs)
	}[type] || (() => ({})))(),
	{type, out: []}
);

/**
 * Converts a cutoff value (0-1) to frequency in Hz
 * @param {number} cutoff - Cutoff value (0-1)
 * @returns {number} Frequency in Hz
 */
const cutoffToFreq = cutoff => {
	const minValue = 40;
	const maxValue = context.sampleRate / 2;
	// Logarithm (base 2) to compute how many octaves fall in the range.
	var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
	// Compute a multiplier from 0 to 1 based on an exponential scale.
	var multiplier = Math.pow(2, numberOfOctaves * (cutoff - 1.0));
	// Get back to the frequency value between min and max.
	return maxValue * multiplier;
};

/**
 * Updates an audio node with new preferences
 * @param {Object} node - The audio node to update
 * @param {Object} prefs - New preferences
 * @returns {Object} Updated node
 */
const update = (node, prefs) => {
	const updaters = {
		vco: () => (
			isSet(prefs.type) && set(node.output, 'type', prefs.type),
			isSet(prefs.freq) && set(node.output.frequency, 'value', prefs.freq),
			isSet(prefs.detune) && set(node.output.detune, 'value', prefs.detune),
			Object.assign(node, {prefs})
		),
		vca: () => (
			isSet(prefs.gain) && set(node.through.gain, 'value', prefs.gain),
			Object.assign(node, {prefs})
		),
		vcf: () => (
			isSet(prefs.type) && set(node.through, 'type', prefs.type),
			isSet(prefs.cutoff)
				&& _schedule(node.through, 'frequency', [cutoffToFreq(prefs.cutoff)], [context.currentTime + 0.0001]),
			isSet(prefs.resonance)
				&& _schedule(node.through, 'Q', [prefs.resonance * 30], [context.currentTime + 0.0001]),
			Object.assign(node, {prefs})
		),
		reverb: () => reverb.update(node, prefs),
		adsr: () => adsr.update(node, prefs),
		lfo: () => lfo.update(node, prefs)
	};
	const updater = updaters[node.type];
	return updater ? updater() : node;
};

/**
 * Connects two audio nodes
 * @param {Object} node1 - Source node
 * @param {Object|AudioParam} node2 - Destination node or AudioParam
 * @returns {Object} Source node with updated out array
 */
const connect = (node1, node2) => !(node1.out && node1.out.indexOf(node2) > -1)
	? (_connect(
			// input
			isGet(node1.output)
			|| isGet(node1.through)
			|| isSet(node1.connect) && node1,
			// output
			(node2 instanceof AudioParam) && node2
			|| isGet(node2.input)
			|| isGet(node2.through)
			|| node2
		),
		Object.assign({}, node1, {
			out: [].concat(node1.out || [], [node2])
		}))
	: node1;

/**
 * Disconnects two audio nodes
 * @param {Object} node1 - Source node
 * @param {Object|AudioParam} [node2] - Destination node (optional, disconnects all if omitted)
 * @returns {Object} Source node with updated out array
 */
const disconnect = (node1, node2) => (
	(node1.out && node1.out.indexOf(node2) > -1)
	? (_disconnect(
			// input
			isGet(node1.output)
			|| isGet(node1.through)
			|| isSet(node1.connect) && node1,
			// output
			(node2 instanceof AudioParam) && node2
			|| isGet(node2.input)
			|| isGet(node2.through)
			|| node2
		),
		Object.assign({}, node1, {
			out: [].concat(
				node1.out.slice(0, node1.out.indexOf(node2)),
				node1.out.slice(node1.out.indexOf(node2) + 1)
			)
		}))
	: (typeof node2 === 'undefined')
		? node1.out.reduce((node1, prevNode) => disconnect(node1, prevNode), node1)
		: node1
);

/**
 * Reroutes a node from its current destination to a new one
 * @param {Object} node1 - Source node
 * @param {Object} node2 - New destination node
 * @returns {Object} Updated source node
 */
const reroute = (node1, node2) => (node1.out && node1.out.indexOf(node2) === -1)
	? connect(disconnect(node1), node2)
	: node1;

/**
 * Chains multiple audio nodes together
 * @param {...Object} nodes - Nodes to chain
 * @returns {Object} First node in chain
 */
const chain = (...nodes) => (
	nodes.forEach((n, i) => isSet(nodes[i + 1]) && connect(n, nodes[i + 1])),
	nodes[0]
);

/**
 * Unchains multiple audio nodes
 * @param {...Object} nodes - Nodes to unchain
 * @returns {Object} First node
 */
const unchain = (...nodes) => (
	nodes.slice().reverse()
		.forEach((n, i) => isSet(nodes[i - 1]) && disconnect(nodes[i - 1], n)),
	nodes[0]
);

/**
 * Starts an audio node (oscillator, buffer source, or LFO)
 * @param {Object} node - The node to start
 * @param {...*} args - Additional arguments (time, etc.)
 * @returns {Object} The node
 */
const start = (node, ...args) => (node.type === 'lfo'
	? lfo.start(node, ...args)
	: node.source
		? node.source.start(...args)
		: node.output.start(...args),
node);

/**
 * Stops an audio node
 * @param {Object} node - The node to stop
 * @param {...*} args - Additional arguments (time, etc.)
 * @returns {Object} The node
 */
const stop = (node, ...args) => (
	node.source
		? node.source.stop(...args)
		: node.output.stop(...args),
node);

/**
 * Schedules parameter changes on an audio node
 * @param {Object} node - The audio node
 * @param {string} pref - Parameter name
 * @param {Array<number>} values - Array of values
 * @param {Array<number>} times - Array of times
 * @returns {void}
 */
const schedule = (node, pref, values, times) => (values.length === 1)
	? node.through[pref].setValueAtTime(values[0], times[0])
	: (node.through[pref].setValueCurveAtTime(new Float32Array(values.slice(0, 2)), times[0], times[1]),
		(values.length > 2) && schedule(node, pref, values.slice(1), [times[0] + times[1]].concat(times.slice(2))));

/**
 * Converts a musical note to frequency in Hz
 * @param {string} note - Note name (e.g., 'C4', 'A#3', 'Bb5')
 * @returns {number} Frequency in Hz
 */
const noteToFrequency = function(note) {
	var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	var keyNumber;
	var octave;

	if (note.length === 3) {
		octave = note.charAt(2);
	} else {
		octave = note.charAt(1);
	}

	keyNumber = notes.indexOf(note.slice(0, -1));

	if (keyNumber < 3) {
		keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1;
	} else {
		keyNumber = keyNumber + ((octave - 1) * 12) + 1;
	}

	return 440 * Math.pow(2, (keyNumber - 49) / 12);
};

// Convenience factory functions
const vco = prefs => update(create('vco', {}, context), prefs);
const vcf = prefs => update(create('vcf', {}, context), prefs);
const lfoFactory = prefs => update(create('lfo', {}, context), prefs);
const vca = prefs => update(create('vca', {}, context), prefs);
const adsrFactory = prefs => create('adsr', prefs, context);

// Re-export noteOn/noteOff from adsr for convenience
const noteOn = adsr.noteOn;
const noteOff = adsr.noteOff;

export {
	context,
	create,
	update,
	schedule,
	connect,
	disconnect,
	reroute,
	chain,
	unchain,
	noteToFrequency,
	start,
	stop,
	vco,
	vcf,
	vca,
	noteOn,
	noteOff,
	sampler
};

// Export with renamed aliases
export {lfoFactory as lfo, adsrFactory as adsr};

