import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {
  GOOGLE_LIGHT_COLORS,
  GOOGLE_DARK_COLORS,
  parseAntigravityConfig,
  getPatternTarget,
  createParticles,
  stepParticles,
  applyRadialBurst
} from '../lib/antigravity-engine.js';

function createSeededRng(seed = 42) {
  let s = seed >>> 0;
  return function () {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

test('parseAntigravityConfig honors Google default palette and URL parameters with safe clamping', () => {
  const lightCfg = parseAntigravityConfig('', false);
  assert.deepEqual(lightCfg.colors, [...GOOGLE_LIGHT_COLORS]);
  assert.equal(lightCfg.gravity, -0.045);
  assert.equal(lightCfg.usePattern, false);

  const darkCfg = parseAntigravityConfig('', true);
  assert.deepEqual(darkCfg.colors, [...GOOGLE_DARK_COLORS]);

  const custom = parseAntigravityConfig('?count=999&speed=2.5&shape=triangle&pattern=true&gravity=0.2&fill=4285f4,ea4335,invalid', false);
  assert.equal(custom.particleCount, 140);
  assert.equal(custom.speedFactor, 2.5);
  assert.equal(custom.shape, 'triangle');
  assert.equal(custom.usePattern, true);
  assert.equal(custom.gravity, 0.2);
  assert.deepEqual(custom.colors, ['#4285F4', '#EA4335']);
});

test('antigravity float mode drifts particles upward when gravity is negative', () => {
  const rng = createSeededRng(101);
  const config = parseAntigravityConfig('?count=12&gravity=-0.1&speed=0.2', false);
  const particles = createParticles(config, 1280, 800, rng);

  // Zero out initial vertical velocity and place near center so upward acceleration is deterministic
  particles.forEach((p) => {
    p.x = 640;
    p.y = 400;
    p.vx = 0;
    p.vy = 0;
  });

  for (let i = 0; i < 20; i++) {
    stepParticles(particles, config, 1280, 800, null, 1, rng);
  }

  for (const p of particles) {
    assert.ok(p.y < 400, `Expected particle to drift upward (y < 400), got ${p.y}`);
    assert.ok(p.vy < 0, `Expected upward velocity (vy < 0), got ${p.vy}`);
  }
});

test('pattern formation converges particles toward circle, square, and triangle targets', () => {
  const rng = createSeededRng(7);
  for (const shape of ['circle', 'square', 'triangle']) {
    const config = parseAntigravityConfig(`?count=18&pattern=true&shape=${shape}`, false);
    const particles = createParticles(config, 1000, 800, rng);

    const initialDist = particles.reduce((sum, p) => {
      const target = getPatternTarget(p.index, particles.length, 1000, 800, shape);
      return sum + Math.hypot(target.x - p.x, target.y - p.y);
    }, 0);

    for (let f = 0; f < 120; f++) {
      stepParticles(particles, config, 1000, 800, null, 1, rng);
    }

    const finalDist = particles.reduce((sum, p) => {
      const target = getPatternTarget(p.index, particles.length, 1000, 800, shape);
      return sum + Math.hypot(target.x - p.x, target.y - p.y);
    }, 0);

    assert.ok(
      finalDist < initialDist * 0.25,
      `Expected ${shape} formation to converge significantly (initial=${initialDist.toFixed(1)}, final=${finalDist.toFixed(1)})`
    );
  }
});

test('mouse repulsion force pushes particles radially away from pointer', () => {
  const rng = createSeededRng(19);
  const config = parseAntigravityConfig('?count=4&gravity=0', false);
  const particles = createParticles(config, 1000, 800, rng);

  // Place particle directly to the right of pointer within interactionRadius
  particles[0].x = 540;
  particles[0].y = 400;
  particles[0].vx = 0;
  particles[0].vy = 0;

  stepParticles(particles, config, 1000, 800, { x: 500, y: 400 }, 1, rng);

  assert.ok(particles[0].vx > 0, `Expected particle to be pushed rightward (vx > 0), got ${particles[0].vx}`);
  assert.ok(particles[0].x > 540, `Expected particle x to move away from pointer, got ${particles[0].x}`);
});

test('applyRadialBurst imparts outward impulse to nearby particles only', () => {
  const rng = createSeededRng(33);
  const config = parseAntigravityConfig('?count=10', false);
  const particles = createParticles(config, 1000, 800, rng);
  particles.forEach((p, idx) => {
    p.x = idx < 6 ? 500 + (idx + 1) * 15 : 950;
    p.y = 400;
    p.vx = 0;
    p.vy = 0;
  });

  const affected = applyRadialBurst(particles, 500, 400, 250, 10);
  assert.equal(affected, 6);
  for (let i = 0; i < 6; i++) {
    assert.ok(particles[i].vx > 0, `Expected outward burst velocity > 0, got ${particles[i].vx}`);
  }
  for (let i = 6; i < 10; i++) {
    assert.equal(particles[i].vx, 0, `Expected distant particle to remain unaffected, got ${particles[i].vx}`);
  }
});

test('browser js/antigravity.js stays in parity with lib/antigravity-engine.js', () => {
  const browserSource = fs.readFileSync(path.resolve('js/antigravity.js'), 'utf8');
  const sandbox = {
    window: {
      location: { search: '?count=36&shape=triangle&pattern=true' },
      innerWidth: 1440,
      innerHeight: 900,
      devicePixelRatio: 1
    },
    document: {
      readyState: 'loading',
      documentElement: { classList: { contains: () => false } },
      addEventListener: () => {}
    },
    URLSearchParams,
    Math
  };
  vm.createContext(sandbox);
  vm.runInContext(browserSource, sandbox);

  const api = sandbox.window.ShopVietAntigravity;
  assert.ok(api && typeof api.setMode === 'function' && typeof api.burst === 'function' && typeof api.togglePause === 'function');

  const cfgBrowser = api._internals.parseConfig('?count=36&shape=triangle&pattern=true', false);
  const cfgLib = parseAntigravityConfig('?count=36&shape=triangle&pattern=true', false);
  assert.equal(cfgBrowser.particleCount, cfgLib.particleCount);
  assert.equal(cfgBrowser.shape, cfgLib.shape);
  assert.equal(cfgBrowser.usePattern, cfgLib.usePattern);
  assert.deepEqual([...cfgBrowser.colors], [...cfgLib.colors]);
});
