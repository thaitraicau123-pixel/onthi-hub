/**
 * Pure Antigravity Physics & Pattern Formation Engine
 * Inspired by davidpelayo/antigravity-animation & Google Antigravity Design Language
 * Zero DOM dependencies — unit-testable with node:test
 */

export const GOOGLE_LIGHT_COLORS = Object.freeze([
  '#4285F4', // Google Blue
  '#EA4335', // Google Red
  '#FBBC05', // Google Yellow
  '#34A853', // Google Green
  '#D2E3FC', // Google Blue Tint
  '#DADCE0'  // Google Hairline Gray
]);

export const GOOGLE_DARK_COLORS = Object.freeze([
  '#8AB4F8', // Google Blue 300
  '#F28B82', // Google Red 300
  '#FDD663', // Google Yellow 300
  '#81C995', // Google Green 300
  '#4285F4', // Google Blue 500
  '#5F6368'  // Google Gray 600
]);

export const VALID_SHAPES = Object.freeze(['mixed', 'circle', 'square', 'triangle']);

export const DEFAULT_ANTIGRAVITY_CONFIG = Object.freeze({
  particleCount: 60,
  speedFactor: 0.78,
  shape: 'mixed',
  gravity: -0.045,
  usePattern: false,
  interactionRadius: 165,
  friction: 0.96
});

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function sanitizeHexColor(raw) {
  const cleaned = String(raw || '').trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(cleaned) || /^[0-9a-fA-F]{3}$/.test(cleaned)) {
    return '#' + cleaned.toUpperCase();
  }
  return null;
}

export function parseAntigravityConfig(searchString = '', isDark = false) {
  const params = new URLSearchParams(String(searchString || '').replace(/^\?/, ''));

  const rawCount = parseInt(params.get('count'), 10);
  const particleCount = Number.isFinite(rawCount)
    ? clamp(rawCount, 10, 140)
    : DEFAULT_ANTIGRAVITY_CONFIG.particleCount;

  const rawSpeed = parseFloat(params.get('speed'));
  const speedFactor = Number.isFinite(rawSpeed)
    ? clamp(rawSpeed, 0.2, 3.2)
    : DEFAULT_ANTIGRAVITY_CONFIG.speedFactor;

  const rawGravity = parseFloat(params.get('gravity'));
  const gravity = Number.isFinite(rawGravity)
    ? clamp(rawGravity, -0.4, 0.4)
    : DEFAULT_ANTIGRAVITY_CONFIG.gravity;

  const rawShape = String(params.get('shape') || '').trim().toLowerCase();
  const shape = VALID_SHAPES.includes(rawShape)
    ? rawShape
    : DEFAULT_ANTIGRAVITY_CONFIG.shape;

  const usePattern = params.get('pattern') === 'true';

  let colors = isDark ? GOOGLE_DARK_COLORS.slice() : GOOGLE_LIGHT_COLORS.slice();
  const fillParam = params.get('fill');
  if (fillParam) {
    const parsedColors = fillParam
      .split(',')
      .map(sanitizeHexColor)
      .filter(Boolean);
    if (parsedColors.length > 0) {
      colors = parsedColors;
    }
  }

  return {
    particleCount,
    speedFactor,
    shape,
    gravity,
    usePattern,
    colors,
    interactionRadius: DEFAULT_ANTIGRAVITY_CONFIG.interactionRadius,
    friction: DEFAULT_ANTIGRAVITY_CONFIG.friction
  };
}

export function resolveShapeType(shape, rng = Math.random) {
  if (shape === 'circle') return 0;
  if (shape === 'square') return 1;
  if (shape === 'triangle') return 2;
  return Math.floor(rng() * 3) % 3;
}

export function getPatternTarget(index, total, width, height, shape = 'circle', centerOffset = null) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const cx = centerOffset && Number.isFinite(centerOffset.x) ? centerOffset.x : width * 0.5;
  const cy = centerOffset && Number.isFinite(centerOffset.y) ? centerOffset.y : height * 0.5;
  const r = Math.min(width, height) * 0.34;
  const t = ((index % safeTotal) + safeTotal) % safeTotal / safeTotal;
  const patternType = shape === 'mixed' ? 'circle' : shape;

  let tx = cx;
  let ty = cy;

  if (patternType === 'circle') {
    const angle = t * Math.PI * 2 - Math.PI / 2;
    tx = cx + Math.cos(angle) * r;
    ty = cy + Math.sin(angle) * r;
  } else if (patternType === 'square') {
    const side = Math.floor(t * 4);
    const subT = (t * 4) % 1;
    if (side === 0) {
      tx = cx - r + 2 * r * subT;
      ty = cy - r;
    } else if (side === 1) {
      tx = cx + r;
      ty = cy - r + 2 * r * subT;
    } else if (side === 2) {
      tx = cx + r - 2 * r * subT;
      ty = cy + r;
    } else {
      tx = cx - r;
      ty = cy + r - 2 * r * subT;
    }
  } else if (patternType === 'triangle') {
    const sideIdx = Math.floor(t * 3);
    const subT = (t * 3) % 1;
    const angles = [
      -Math.PI / 2,
      -Math.PI / 2 + (Math.PI * 2) / 3,
      -Math.PI / 2 + (2 * Math.PI * 2) / 3
    ];
    const a1 = angles[sideIdx];
    const a2 = angles[(sideIdx + 1) % 3];
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const x2 = cx + Math.cos(a2) * r;
    const y2 = cy + Math.sin(a2) * r;
    tx = x1 + (x2 - x1) * subT;
    ty = y1 + (y2 - y1) * subT;
  }

  return { x: tx, y: ty };
}

export function resetParticle(particle, config, width, height, randomY = false, rng = Math.random) {
  const w = Math.max(100, Number(width) || 1280);
  const h = Math.max(100, Number(height) || 720);
  const colors = Array.isArray(config.colors) && config.colors.length > 0
    ? config.colors
    : GOOGLE_LIGHT_COLORS;

  particle.x = rng() * w;
  particle.y = randomY ? rng() * h : (config.gravity < 0 ? h + 44 : -44);
  particle.visualSize = rng() * 13 + 6;
  particle.vx = (rng() - 0.5) * 1.6 * config.speedFactor;
  particle.vy = (rng() - 0.5) * 1.6 * config.speedFactor;

  if (!config.usePattern && config.gravity < 0) {
    particle.vy -= rng() * 0.9 * Math.abs(config.gravity);
  } else if (config.usePattern && !randomY) {
    particle.x = w * 0.5;
    particle.y = h * 0.5;
  }

  particle.color = colors[Math.floor(rng() * colors.length) % colors.length];
  particle.rotation = rng() * Math.PI * 2;
  particle.rotationSpeed = (rng() - 0.5) * 0.035;
  particle.type = resolveShapeType(config.shape, rng);
  particle.depth = rng() * 0.9 + 0.55;
  return particle;
}

export function createParticles(config, width, height, rng = Math.random) {
  const count = Math.max(1, Number(config.particleCount) || DEFAULT_ANTIGRAVITY_CONFIG.particleCount);
  const list = [];
  for (let i = 0; i < count; i++) {
    const p = { index: i };
    resetParticle(p, config, width, height, true, rng);
    list.push(p);
  }
  return list;
}

export function stepParticles(particles, config, width, height, pointer = null, dtScale = 1, rng = Math.random, centerOffset = null) {
  const w = Math.max(100, Number(width) || 1280);
  const h = Math.max(100, Number(height) || 720);
  const step = clamp(Number(dtScale) || 1, 0.25, 2.2);
  const mx = pointer && Number.isFinite(pointer.x) ? pointer.x : -10000;
  const my = pointer && Number.isFinite(pointer.y) ? pointer.y : -10000;
  const radius = Number(config.interactionRadius) || 165;
  const friction = Math.pow(Number(config.friction) || 0.96, step);
  const total = particles.length;

  for (let i = 0; i < total; i++) {
    const p = particles[i];
    if (config.usePattern) {
      const target = getPatternTarget(p.index, total, w, h, config.shape, centerOffset);
      const dxTarget = target.x - p.x;
      const dyTarget = target.y - p.y;
      p.vx += dxTarget * 0.0032 * step;
      p.vy += dyTarget * 0.0032 * step;
      p.vx += (rng() - 0.5) * 0.045 * step;
      p.vy += (rng() - 0.5) * 0.045 * step;
    } else {
      p.vy += config.gravity * 0.05 * p.depth * step;
    }

    const dxMouse = p.x - mx;
    const dyMouse = p.y - my;
    const distSq = dxMouse * dxMouse + dyMouse * dyMouse;
    if (distSq < radius * radius && distSq > 0.0001) {
      const dist = Math.sqrt(distSq);
      const force = (radius - dist) / radius;
      const angle = Math.atan2(dyMouse, dxMouse);
      const push = force * 3.8 * step;
      p.vx += Math.cos(angle) * push;
      p.vy += Math.sin(angle) * push;
    }

    p.x += p.vx * p.depth * step;
    p.y += p.vy * p.depth * step;
    p.rotation += p.rotationSpeed * step;

    p.vx *= friction;
    p.vy *= friction;

    if (!config.usePattern) {
      if (p.x < -55) p.x = w + 55;
      if (p.x > w + 55) p.x = -55;

      if (config.gravity < 0) {
        if (p.y < -65) {
          resetParticle(p, config, w, h, false, rng);
        }
      } else if (config.gravity > 0) {
        if (p.y > h + 65) {
          resetParticle(p, config, w, h, false, rng);
        }
      } else {
        if (p.y < -55) p.y = h + 55;
        if (p.y > h + 55) p.y = -55;
      }
    }
  }

  return particles;
}

export function applyRadialBurst(particles, originX, originY, radius = 340, strength = 9.5) {
  const r = Math.max(40, Number(radius) || 340);
  const maxPush = Math.max(1, Number(strength) || 9.5);
  let affected = 0;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const dx = p.x - originX;
    const dy = p.y - originY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < r) {
      const norm = 1 - dist / r;
      const angle = dist > 0.5 ? Math.atan2(dy, dx) : (i * 2.39996);
      const impulse = (0.35 + norm) * maxPush;
      p.vx += Math.cos(angle) * impulse;
      p.vy += Math.sin(angle) * impulse;
      p.rotationSpeed += (norm * 0.08) * (i % 2 === 0 ? 1 : -1);
      affected++;
    }
  }
  return affected;
}
