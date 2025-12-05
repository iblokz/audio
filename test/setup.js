/**
 * Test setup for Web Audio API in Node.js
 * Provides Web Audio API polyfill using node-web-audio-api
 * 
 * This file must be loaded BEFORE any modules that use Web Audio API
 */

import {JSDOM} from 'jsdom';
import {
	AudioContext,
	AudioBuffer,
	AudioNode,
	AudioParam,
	OscillatorNode,
	GainNode,
	BiquadFilterNode,
	ConvolverNode,
	AudioBufferSourceNode
} from 'node-web-audio-api';

// Setup DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
	url: 'http://localhost',
});

// Make window available globally
global.window = dom.window;
global.document = dom.window.document;

// Polyfill Web Audio API - must be set before any modules import
global.AudioContext = AudioContext;
global.AudioBuffer = AudioBuffer;
global.AudioNode = AudioNode;
global.AudioParam = AudioParam;
global.OscillatorNode = OscillatorNode;
global.GainNode = GainNode;
global.BiquadFilterNode = BiquadFilterNode;
global.ConvolverNode = ConvolverNode;
global.AudioBufferSourceNode = AudioBufferSourceNode;

// Also add to window for code that checks window.AudioContext
// This is critical - core.js checks window.AudioContext
global.window.AudioContext = AudioContext;
global.window.webkitAudioContext = AudioContext;
global.window.mozAudioContext = AudioContext;
global.window.oAudioContext = AudioContext;
global.window.msAudioContext = AudioContext;

// Export for use in tests if needed
export {AudioContext, AudioBuffer, AudioNode, AudioParam};

