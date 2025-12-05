import {expect} from 'chai';
import * as core from '../lib/core.js';

describe('core', () => {
  after(() => {
    // Close AudioContext to allow tests to exit
    if (core.context && typeof core.context.close === 'function') {
      return core.context.close();
    }
  });
  describe('context', () => {
    it('should create an AudioContext instance', () => {
      expect(core.context).to.exist;
      expect(core.context).to.be.instanceOf(global.AudioContext);
      expect(core.context.sampleRate).to.be.a('number');
      expect(core.context.sampleRate).to.be.above(0);
    });
  });

  describe('create', () => {
    it('should create an oscillator node', () => {
      const osc = core.create('oscillator');
      expect(osc).to.exist;
      expect(osc).to.be.instanceOf(global.OscillatorNode);
    });

    it('should create a gain node', () => {
      const gain = core.create('gain');
      expect(gain).to.exist;
      expect(gain).to.be.instanceOf(global.GainNode);
    });

    it('should create a biquad filter node', () => {
      const filter = core.create('biquadFilter');
      expect(filter).to.exist;
      expect(filter).to.be.instanceOf(global.BiquadFilterNode);
    });

    it('should create a convolver node', () => {
      const convolver = core.create('convolver');
      expect(convolver).to.exist;
      expect(convolver).to.be.instanceOf(global.ConvolverNode);
    });

    it('should create a buffer source node', () => {
      const bufferSource = core.create('bufferSource');
      expect(bufferSource).to.exist;
      expect(bufferSource).to.be.instanceOf(global.AudioBufferSourceNode);
    });
  });

  describe('connect', () => {
    it('should connect two nodes', () => {
      const osc = core.create('oscillator');
      const gain = core.create('gain');
      const result = core.connect(osc, gain);
      expect(result).to.equal(osc);
    });

    it('should connect oscillator to gain to destination', () => {
      const osc = core.create('oscillator');
      const gain = core.create('gain');
      core.connect(osc, gain);
      core.connect(gain, core.context.destination);
      // If no error, connection succeeded
      expect(osc).to.exist;
      expect(gain).to.exist;
    });
  });

  describe('disconnect', () => {
    it('should disconnect nodes', () => {
      const osc = core.create('oscillator');
      const gain = core.create('gain');
      core.connect(osc, gain);
      const result = core.disconnect(osc, gain);
      expect(result).to.equal(osc);
    });

    it('should disconnect all connections when no target specified', () => {
      const osc = core.create('oscillator');
      const gain1 = core.create('gain');
      const gain2 = core.create('gain');
      core.connect(osc, gain1);
      core.connect(osc, gain2);
      const result = core.disconnect(osc);
      expect(result).to.equal(osc);
    });
  });

  describe('isSet', () => {
    it('should return true for defined values', () => {
      expect(core.isSet(0)).to.be.true;
      expect(core.isSet('')).to.be.true;
      expect(core.isSet(null)).to.be.true;
      expect(core.isSet(false)).to.be.true;
    });

    it('should return false for undefined', () => {
      expect(core.isSet(undefined)).to.be.false;
    });
  });

  describe('isGet', () => {
    it('should return value if set', () => {
      expect(core.isGet(5)).to.equal(5);
      expect(core.isGet(null)).to.equal(null);
    });

    it('should return null for undefined', () => {
      expect(core.isGet(undefined)).to.be.null;
    });
  });
});

