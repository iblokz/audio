/**
 * Audio Sampler
 * @module sources/sampler
 */

import {context, create as _create, set, chain, duration, chData} from '../core.js';

/**
 * Creates a sampler (audio sample player)
 * @param {string|null} file - URL to audio file (optional if buffer is provided)
 * @param {AudioBuffer|null} buffer - Pre-loaded audio buffer (optional if file is provided)
 * @param {Object} [prefs={}] - Sampler preferences
 * @param {number} [prefs.gain=0.7] - Output gain (0-1)
 * @returns {Object} Sampler node with source (AudioBufferSourceNode), output (GainNode), and prefs
 */
const create = (file, buffer, prefs = {}) => [{
	prefs: Object.assign({
		gain: 0.7
	}, prefs),
	source: _create('bufferSource'),
	output: _create('gain')
}].map(n => (
	chain(n.source, n.output),
	set(n.output.gain, 'value', n.prefs.gain),
	(!buffer)
		? fetch(file)
			.then(res => res.arrayBuffer())
			.then(buffer => context.decodeAudioData(buffer,
				buffer => set(n.source, 'buffer', buffer)
			))
		: set(n.source, 'buffer', buffer),
	n)).pop();

/**
 * Updates sampler preferences (placeholder for future implementation)
 * @param {Object} n - Sampler node
 * @param {Object} prefs - New preferences
 * @returns {Object} Updated sampler node
 */
const update = (n, prefs) => {
	// TODO: Implement update logic
	return n;
};

/**
 * Clones a sampler instance with new preferences
 * @param {Object} n - Source sampler node
 * @param {Object} prefs - New preferences to merge
 * @returns {Object} New sampler node with cloned buffer
 */
const clone = (n, prefs) => create(null, n.source.buffer, Object.assign({}, n.prefs, prefs));

export {
	create,
	update,
	clone
};

