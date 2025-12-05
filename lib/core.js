/**
 * Core Web Audio API utilities
 * @module core
 */

/**
 * Web Audio API context instance
 * @type {AudioContext}
 */
const context = new (
	typeof window !== 'undefined' && (
		window.AudioContext
		|| window.webkitAudioContext
		|| window.mozAudioContext
		|| window.oAudioContext
		|| window.msAudioContext
	)
)();

/**
 * Sets a property on an object
 * @param {Object} o - The object
 * @param {string} k - The key
 * @param {*} v - The value
 * @returns {Object} The object
 */
const set = (o, k, v) => (o[k] = v);

/**
 * Checks if a value is set (not undefined)
 * @param {*} v - The value to check
 * @returns {boolean} True if value is set
 */
const isSet = v => v !== undefined;

/**
 * Gets a value if it's set, otherwise returns null
 * @param {*} v - The value
 * @returns {*} The value or null
 */
const isGet = v => isSet(v) ? v : null;

/**
 * Applies properties from one object to another
 * @param {Object} o1 - Target object
 * @param {Object} o2 - Source object
 * @returns {Object} The target object
 */
const apply = (o1, o2) => Object.keys(o2)
	.reduce((o, k) => set(o, k, o2[k]), o1);

/**
 * Creates a Web Audio API node
 * @param {string} type - Node type (oscillator, gain, biquadFilter, etc.)
 * @param {...*} args - Additional arguments for node creation
 * @returns {AudioNode} The created node
 */
const create = (type, ...args) => (
	{
		oscillator: () => context.createOscillator(...args),
		gain: () => context.createGain(...args),
		biquadFilter: () => context.createBiquadFilter(...args),
		convolver: () => context.createConvolver(...args),
		buffer: () => context.createBuffer(...args),
		bufferSource: () => context.createBufferSource(...args)
	}[type]()
);

/**
 * Updates a node with new preferences
 * @param {AudioNode} node - The node to update
 * @param {Object} prefs - Preferences object
 * @returns {AudioNode} The updated node
 */
const update = (node, prefs) => apply(node, prefs);

/**
 * Connects two audio nodes
 * @param {AudioNode} n1 - Source node
 * @param {AudioNode} n2 - Destination node
 * @returns {AudioNode} The source node
 */
const connect = (n1, n2) => (
	n1.connect(n2),
	n1
);

/**
 * Disconnects two audio nodes
 * @param {AudioNode} n1 - Source node
 * @param {AudioNode} n2 - Destination node (optional, disconnects all if omitted)
 * @returns {AudioNode} The source node
 */
const disconnect = (n1, n2) => {
	// since there is no way to determine if they are connected
	try {
		if (n2 !== undefined) {
			n1.disconnect(n2);
		} else {
			n1.disconnect();
		}
	} catch (err) {
		console.log(err);
	}
	return n1;
};

/**
 * Chains multiple audio nodes together
 * @param {...AudioNode} nodes - Nodes to chain
 * @returns {AudioNode} The first node
 */
const chain = (...nodes) => (
	nodes.forEach((n, i) => isSet(nodes[i + 1]) && connect(n, nodes[i + 1])),
	nodes[0]
);

/**
 * Unchains multiple audio nodes
 * @param {...AudioNode} nodes - Nodes to unchain
 * @returns {AudioNode} The first node
 */
const unchain = (...nodes) => (
	nodes.slice().reverse()
		.forEach((n, i) => isSet(nodes[i - 1]) && disconnect(nodes[i - 1], n)),
	nodes[0]
);

/**
 * Converts seconds to sample duration
 * @param {number} seconds - Duration in seconds
 * @returns {number} Duration in samples
 */
const duration = seconds => context.sampleRate * seconds;

/**
 * Gets channel data from an audio buffer
 * @param {AudioBuffer} node - The audio buffer
 * @param {...*} args - Additional arguments
 * @returns {Float32Array} Channel data
 */
const chData = (node, ...args) => (
	node.getChannelData(...args)
);

/**
 * Schedules parameter changes on an audio node
 * @param {AudioNode} node - The audio node
 * @param {string} pref - Parameter name
 * @param {Array<number>} values - Array of values
 * @param {Array<number>} times - Array of times
 * @returns {void}
 */
const schedule = (node, pref, values, times) => (values.length === 1)
	? node[pref].setValueAtTime(values[0], times[0])
	: (node[pref].setValueCurveAtTime(new Float32Array(values.slice(0, 2)), times[0], times[1]),
	(values.length > 2) && schedule(node, pref, values.slice(1), [times[0] + times[1]].concat(times.slice(2))));

export {
	context,
	set,
	isSet,
	isGet,
	create,
	update,
	connect,
	disconnect,
	chain,
	unchain,
	// util
	duration,
	chData,
	schedule
};

