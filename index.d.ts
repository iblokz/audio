/**
 * Type definitions for iblokz-audio
 */

export interface AudioNode {
	type: string;
	out: any[];
	output?: OscillatorNode | AudioBufferSourceNode;
	through?: GainNode | BiquadFilterNode;
	input?: GainNode;
	source?: AudioBufferSourceNode;
	effect?: OscillatorNode | ConvolverNode;
	wet?: GainNode;
	dry?: GainNode;
	prefs?: any;
}

export interface ADSRNode extends AudioNode {
	through: GainNode;
	prefs: {
		volume: number;
		attack: number;
		decay: number;
		sustain: number;
		release: number;
	};
}

export interface LFONode extends AudioNode {
	effect: OscillatorNode;
	output: GainNode;
	prefs: {
		type: string;
		frequency: number;
		gain: number;
	};
}

export interface ReverbNode extends AudioNode {
	input: GainNode;
	output: GainNode;
	effect: ConvolverNode;
	wet: GainNode;
	dry: GainNode;
	prefs: {
		seconds: number;
		decay: number;
		wet: number;
		dry: number;
	};
}

export interface SamplerNode extends AudioNode {
	source: AudioBufferSourceNode;
	output: GainNode;
	prefs: {
		gain: number;
	};
}

export interface VCOPrefs {
	type?: 'sine' | 'square' | 'sawtooth' | 'triangle';
	freq?: number;
	detune?: number;
}

export interface VCAPrefs {
	gain?: number;
}

export interface VCFPrefs {
	type?: string;
	cutoff?: number;
	resonance?: number;
}

export interface ADSRPrefs {
	volume?: number;
	attack?: number;
	decay?: number;
	sustain?: number;
	release?: number;
}

export interface LFOPrefs {
	type?: 'sine' | 'square' | 'sawtooth' | 'triangle';
	frequency?: number;
	gain?: number;
}

export interface ReverbPrefs {
	seconds?: number;
	decay?: number;
	wet?: number;
	dry?: number;
}

export interface SamplerPrefs {
	gain?: number;
}

export const context: AudioContext;

export function create(type: 'vco' | 'vca' | 'vcf' | 'lfo' | 'reverb' | 'adsr', prefs?: any, ctx?: AudioContext): AudioNode;

export function update(node: AudioNode, prefs: any): AudioNode;

export function schedule(node: AudioNode, pref: string, values: number[], times: number[]): void;

export function connect(node1: AudioNode, node2: AudioNode | AudioParam): AudioNode;

export function disconnect(node1: AudioNode, node2?: AudioNode | AudioParam): AudioNode;

export function reroute(node1: AudioNode, node2: AudioNode): AudioNode;

export function chain(...nodes: AudioNode[]): AudioNode;

export function unchain(...nodes: AudioNode[]): AudioNode;

export function noteToFrequency(note: string): number;

export function start(node: AudioNode, ...args: any[]): AudioNode;

export function stop(node: AudioNode, ...args: any[]): AudioNode;

export function vco(prefs?: VCOPrefs): AudioNode;

export function vcf(prefs?: VCFPrefs): AudioNode;

export function vca(prefs?: VCAPrefs): AudioNode;

export function lfo(prefs?: LFOPrefs): LFONode;

export function adsr(prefs?: ADSRPrefs): ADSRNode;

export function noteOn(adsr: ADSRNode, velocity: number, time?: number): ADSRNode;

export function noteOff(adsr: ADSRNode, time?: number): ADSRNode;

export namespace sampler {
	export function create(file: string | null, buffer: AudioBuffer | null, prefs?: SamplerPrefs): SamplerNode;
	export function update(node: SamplerNode, prefs: SamplerPrefs): SamplerNode;
	export function clone(node: SamplerNode, prefs?: SamplerPrefs): SamplerNode;
}

