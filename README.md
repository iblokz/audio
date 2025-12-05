# iblokz-audio

[![npm version](https://badge.fury.io/js/iblokz-audio.svg)](https://badge.fury.io/js/iblokz-audio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

A lightweight, functional JavaScript library providing Web Audio API utilities for building reactive audio applications, synthesizers, and audio engines.

Part of the **iblokz** family of functional utilities, designed to work seamlessly with [iblokz-state](https://github.com/iblokz/state) for reactive audio applications.

## Features

- 🎹 **Synthesizer Components** - VCO (oscillator), VCA (amplifier), VCF (filter), ADSR envelope
- 🎛️ **Audio Effects** - LFO (low-frequency oscillator), Reverb
- 🎵 **Sample Playback** - Sampler for audio file playback
- 🔗 **Node Management** - Connect, disconnect, chain, and reroute audio nodes
- 🎼 **Musical Utilities** - Note-to-frequency conversion
- 🔒 **Functional API** - Clean, functional programming patterns
- 📦 **Zero Dependencies** - No runtime dependencies, pure Web Audio API
- 📦 **ESM-first** - Modern ES modules with CommonJS build for compatibility
- ✅ **Well-tested** - Comprehensive test coverage (coming soon)

## Installation

**Requirements:** Node.js ≥ 18.12.0

```bash
npm install iblokz-audio
# or
pnpm install iblokz-audio
```

## Usage

This library is published as **ESM-first** with a CommonJS build for compatibility.

### ESM (Recommended)

```javascript
import * as a from 'iblokz-audio';
// or
import {vco, vca, adsr, connect, start, noteOn, noteOff} from 'iblokz-audio';
```

### CommonJS (Node.js compatibility)

```javascript
const a = require('iblokz-audio');
```

### Basic Example

```javascript
import {vco, vca, adsr, connect, start, noteOn, noteOff, context} from 'iblokz-audio';

// Create a simple oscillator
const vco = a.vco({ type: 'sine', freq: 440 });
const vca = a.vca({ gain: 0.5 });
const adsr = a.adsr({ attack: 0.1, release: 0.2 });

// Connect nodes: vco -> adsr -> vca -> destination
connect(vco, adsr);
connect(adsr, vca);
connect(vca, context.destination);

// Start the oscillator
start(vco);

// Trigger note on/off
noteOn(adsr, 0.7); // velocity 0.7
setTimeout(() => noteOff(adsr), 500);
```

### Creating a Synthesizer Voice

```javascript
import {vco, vcf, adsr, vca, connect, start, noteOn, noteOff, update, noteToFrequency, context} from 'iblokz-audio';

// Create a complete voice with filter and effects
const voice = {
  vco1: vco({ type: 'sawtooth', freq: 440 }),
  vco2: vco({ type: 'square', freq: 440, detune: 7 }),
  vcf: vcf({ type: 'lowpass', cutoff: 0.5, resonance: 0.3 }),
  adsr1: adsr({ attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.3 }),
  adsr2: adsr({ attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.3 }),
  vca: vca({ gain: 0.3 })
};

// Connect: VCOs -> ADSRs -> VCF -> VCA -> destination
connect(voice.vco1, voice.adsr1);
connect(voice.vco2, voice.adsr2);
connect(voice.adsr1, voice.vcf);
connect(voice.adsr2, voice.vcf);
connect(voice.vcf, voice.vca);
connect(voice.vca, context.destination);

// Play a note
const note = 'C4';
const freq = noteToFrequency(note);
update(voice.vco1, { freq });
update(voice.vco2, { freq });
start(voice.vco1);
start(voice.vco2);
noteOn(voice.adsr1, 0.8);
noteOn(voice.adsr2, 0.8);
```

### Using Effects

```javascript
import {create, lfo, vco, connect, start, context} from 'iblokz-audio';

// Create reverb effect
const reverb = create('reverb', {
  seconds: 3,
  decay: 2,
  wet: 0.3,
  dry: 0.7
});

// Create LFO for modulation
const lfoNode = lfo({
  type: 'sine',
  frequency: 2, // 2 Hz
  gain: 10
});

// Connect source -> reverb -> destination
const osc = vco({ type: 'sine', freq: 440 });
connect(osc, reverb.input);
connect(reverb.output, context.destination);

// Start LFO and connect to modulate filter cutoff
start(lfoNode);
// lfoNode.output can be connected to modulate other parameters
```

### Sample Playback

```javascript
import {connect, start, context, sampler} from 'iblokz-audio';

// Create a sampler instance
const sample = sampler.create('/path/to/sample.wav', null, { gain: 0.8 });

// When buffer is loaded, play it
sample.source.buffer.then(() => {
  connect(sample, context.destination);
  start(sample.source);
});

// Clone for polyphonic playback
const clone = sampler.clone(sample, { gain: 0.5 });
connect(clone, context.destination);
start(clone.source);
```

### Reactive Audio Engine (with iblokz-state)

```javascript
import { init, dispatch } from 'iblokz-state';
import {vca, connect, update, context} from 'iblokz-audio';

// Initialize state
const state$ = init({
  voices: {},
  volume: 0.5
});

// Create global volume control
const globalVolume = vca({ gain: 0.5 });
connect(globalVolume, context.destination);

// React to state changes
state$.subscribe(state => {
  // Update global volume
  update(globalVolume, { gain: state.volume });
  
  // Handle note on/off
  Object.keys(state.voices).forEach(note => {
    if (!state.voices[note]) {
      // Note off
      // ... cleanup voice
    }
  });
});

// Dispatch note on
dispatch(state => ({
  ...state,
  voices: { ...state.voices, 'C4': { velocity: 0.8 } }
}));
```

## API Overview

### Core Functions

- `context` - Web Audio API context instance
- `create(type, prefs, ctx)` - Create an audio node
- `update(node, prefs)` - Update node preferences
- `connect(node1, node2)` - Connect two nodes
- `disconnect(node1, node2)` - Disconnect nodes
- `reroute(node1, node2)` - Reroute node to new destination
- `chain(...nodes)` - Chain multiple nodes
- `start(node, ...args)` - Start a node
- `stop(node, ...args)` - Stop a node
- `noteToFrequency(note)` - Convert note name to frequency

### Factory Functions

- `vco(prefs)` - Voltage Controlled Oscillator
- `vca(prefs)` - Voltage Controlled Amplifier
- `vcf(prefs)` - Voltage Controlled Filter
- `adsr(prefs)` - ADSR Envelope Generator
- `lfo(prefs)` - Low-Frequency Oscillator
- `noteOn(adsr, velocity, time)` - Trigger note on
- `noteOff(adsr, time)` - Trigger note off

### Node Types

#### VCO (Oscillator)
```javascript
import {vco} from 'iblokz-audio';

const osc = vco({
  type: 'sine' | 'square' | 'sawtooth' | 'triangle',
  freq: 440,        // Frequency in Hz
  detune: 0         // Detune in cents
});
```

#### VCA (Gain)
```javascript
import {vca} from 'iblokz-audio';

const amp = vca({
  gain: 0.5  // Gain level (0-1)
});
```

#### VCF (Filter)
```javascript
import {vcf} from 'iblokz-audio';

const filter = vcf({
  type: 'lowpass' | 'highpass' | 'bandpass' | ...,
  cutoff: 0.5,      // Cutoff (0-1, mapped to frequency)
  resonance: 0.3    // Resonance (0-1)
});
```

#### ADSR (Envelope)
```javascript
import {adsr} from 'iblokz-audio';

const envelope = adsr({
  volume: 0.41,     // Maximum volume
  attack: 0.31,     // Attack time (seconds)
  decay: 0.16,      // Decay time (seconds)
  sustain: 0.8,     // Sustain level (0-1)
  release: 0.21     // Release time (seconds)
});
```

#### LFO (Low-Frequency Oscillator)
```javascript
import {lfo} from 'iblokz-audio';

const modulator = lfo({
  type: 'sine' | 'square' | 'sawtooth' | 'triangle',
  frequency: 5,      // LFO frequency in Hz
  gain: 15          // LFO amplitude
});
```

#### Reverb
```javascript
import {create} from 'iblokz-audio';

const reverb = create('reverb', {
  seconds: 3,       // Reverb duration
  decay: 2,         // Decay factor
  wet: 0.3,         // Wet signal level (0-1)
  dry: 0.7          // Dry signal level (0-1)
});
```

## Architecture

The library is organized into modules:

- **`lib/core.js`** - Core Web Audio API utilities
- **`lib/controls/adsr.js`** - ADSR envelope generator
- **`lib/effects/lfo.js`** - Low-frequency oscillator
- **`lib/effects/reverb.js`** - Reverb effect
- **`lib/sources/sampler.js`** - Audio sample player

## Use Cases

This library is designed for:

- 🎹 **Synthesizers** - Building software synthesizers and virtual instruments
- 🎛️ **DAWs** - Digital audio workstation applications
- 🎵 **Loop Stations** - Audio looping and sequencing
- 🎤 **Samplers** - Sample-based instruments (MPC-style)
- 🎧 **Audio Engines** - Reactive audio processing systems
- 🎼 **Music Applications** - Any web-based music application

## Reference Projects

This library was extracted from and is used in:

- **[jam-station](https://github.com/iblokz/jam-station)** - Groovebox, DAW, and live rig software
- **[js-loop-station](https://github.com/iblokz/js-loop-station)** - RC505-style loop station
- **[xAmplR](https://github.com/iblokz/xAmplR)** - Akai MPC-inspired sampler

## Development

```bash
# Install dependencies
pnpm install

# Build CommonJS bundle
pnpm build

# Run tests
pnpm test

# Run linter
pnpm run lint

# Generate documentation
pnpm run docs
```

## Documentation

For detailed API documentation, see [API.md](./API.md).

To generate the API documentation locally:

```bash
npm run docs
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT © iblokz

## Links

- **[GitHub Repository](https://github.com/iblokz/audio)** - Source code
- **[npm Package](https://www.npmjs.com/package/iblokz-audio)** - Published package
- **[Issues](https://github.com/iblokz/audio/issues)** - Bug reports & features
- **[Changelog](CHANGELOG.md)** - Version history

