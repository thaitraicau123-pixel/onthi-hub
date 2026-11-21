/**
 * Bùi Thái AI Studio — Google Antigravity GPU Sprite Canvas Engine
 * Based on davidpelayo/antigravity-animation (GPU sprite caching, spring pattern formation,
 * weightless negative-gravity drift, cursor repulsion force field, and radial celebration bursts).
 */
(function () {
  'use strict';

  var GOOGLE_LIGHT_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#D2E3FC', '#DADCE0'];
  var GOOGLE_DARK_COLORS = ['#8AB4F8', '#F28B82', '#FDD663', '#81C995', '#4285F4', '#5F6368'];
  var VALID_SHAPES = ['mixed', 'circle', 'square', 'triangle'];

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function sanitizeHexColor(raw) {
    var cleaned = String(raw || '').trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{6}$/.test(cleaned) || /^[0-9a-fA-F]{3}$/.test(cleaned)) {
      return '#' + cleaned.toUpperCase();
    }
    return null;
  }

  function isDarkActive() {
    if (typeof document === 'undefined' || !document.documentElement) return false;
    return document.documentElement.classList.contains('dark');
  }

  function parseConfig(searchString, isDark) {
    var params = new URLSearchParams(String(searchString || '').replace(/^\?/, ''));
    var rawCount = parseInt(params.get('count'), 10);
    var isSmallViewport = typeof window !== 'undefined' && window.innerWidth < 768;
    var defaultCount = isSmallViewport ? 32 : 60;
    var particleCount = Number.isFinite(rawCount) ? clamp(rawCount, 10, 140) : defaultCount;

    var rawSpeed = parseFloat(params.get('speed'));
    var speedFactor = Number.isFinite(rawSpeed) ? clamp(rawSpeed, 0.2, 3.2) : 0.78;

    var rawGravity = parseFloat(params.get('gravity'));
    var gravity = Number.isFinite(rawGravity) ? clamp(rawGravity, -0.4, 0.4) : -0.045;

    var rawShape = String(params.get('shape') || '').trim().toLowerCase();
    var shape = VALID_SHAPES.indexOf(rawShape) !== -1 ? rawShape : 'mixed';
    var usePattern = params.get('pattern') === 'true';

    var customColors = null;
    var fillParam = params.get('fill');
    if (fillParam) {
      var parsed = fillParam.split(',').map(sanitizeHexColor).filter(Boolean);
      if (parsed.length > 0) customColors = parsed;
    }

    return {
      particleCount: particleCount,
      speedFactor: speedFactor,
      gravity: gravity,
      shape: shape,
      usePattern: usePattern,
      customColors: customColors,
      colors: customColors ? customColors.slice() : (isDark ? GOOGLE_DARK_COLORS.slice() : GOOGLE_LIGHT_COLORS.slice()),
      interactionRadius: 165,
      friction: 0.96
    };
  }

  function resolveShapeType(shape) {
    if (shape === 'circle') return 0;
    if (shape === 'square') return 1;
    if (shape === 'triangle') return 2;
    return Math.floor(Math.random() * 3) % 3;
  }

  function getPatternTarget(index, total, width, height, shape) {
    var safeTotal = Math.max(1, total || 1);
    var cx = width * 0.5;
    var cy = Math.min(height * 0.5, 440);
    var r = Math.min(width, height) * 0.36;
    var t = (((index % safeTotal) + safeTotal) % safeTotal) / safeTotal;
    var patternType = shape === 'mixed' ? 'circle' : shape;

    var tx = cx;
    var ty = cy;

    if (patternType === 'circle') {
      var angle = t * Math.PI * 2 - Math.PI / 2;
      tx = cx + Math.cos(angle) * r;
      ty = cy + Math.sin(angle) * r;
    } else if (patternType === 'square') {
      var side = Math.floor(t * 4);
      var subT = (t * 4) % 1;
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
      var sideIdx = Math.floor(t * 3);
      var subTri = (t * 3) % 1;
      var angles = [
        -Math.PI / 2,
        -Math.PI / 2 + (Math.PI * 2) / 3,
        -Math.PI / 2 + (2 * Math.PI * 2) / 3
      ];
      var a1 = angles[sideIdx];
      var a2 = angles[(sideIdx + 1) % 3];
      var x1 = cx + Math.cos(a1) * r;
      var y1 = cy + Math.sin(a1) * r;
      var x2 = cx + Math.cos(a2) * r;
      var y2 = cy + Math.sin(a2) * r;
      tx = x1 + (x2 - x1) * subTri;
      ty = y1 + (y2 - y1) * subTri;
    }

    return { x: tx, y: ty };
  }

  function createController() {
    var canvas = null;
    var ctx = null;
    var width = 1280;
    var height = 720;
    var dpr = 1;
    var spriteCache = {};
    var particles = [];
    var config = parseConfig(typeof window !== 'undefined' ? window.location.search : '', isDarkActive());
    var pointer = { x: -10000, y: -10000 };
    var rafId = 0;
    var lastTime = 0;
    var paused = false;
    var reducedMotion = false;
    var darkMode = isDarkActive();
    var currentMode = config.usePattern ? (config.shape === 'mixed' ? 'circle' : config.shape) : 'float';
    var burstElevateTimer = 0;

    function syncCanvasLayer(elevateForBurst) {
      if (!canvas) return;
      var shouldElevate = Boolean(config.usePattern || elevateForBurst);
      canvas.style.zIndex = shouldElevate ? '25' : '0';
      canvas.setAttribute('data-ag-layer', shouldElevate ? 'foreground' : 'ambient');
    }

    function getSprite(color, shapeType) {
      var key = color + '-' + shapeType + '-' + (darkMode ? 'd' : 'l');
      if (spriteCache[key]) return spriteCache[key];

      var size = 64;
      var center = size / 2;
      var drawSize = 30;
      var off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      var cx = off.getContext('2d');
      if (!cx) return off;

      cx.shadowColor = darkMode ? 'rgba(0, 0, 0, 0.32)' : 'rgba(60, 64, 67, 0.11)';
      cx.shadowBlur = 14;
      cx.shadowOffsetX = 4;
      cx.shadowOffsetY = 5;
      cx.fillStyle = color;
      cx.translate(center, center);
      cx.beginPath();

      if (shapeType === 0) {
        cx.arc(0, 0, drawSize / 2, 0, Math.PI * 2);
      } else if (shapeType === 1) {
        var half = drawSize / 2;
        var rad = 6;
        cx.moveTo(-half + rad, -half);
        cx.lineTo(half - rad, -half);
        cx.quadraticCurveTo(half, -half, half, -half + rad);
        cx.lineTo(half, half - rad);
        cx.quadraticCurveTo(half, half, half - rad, half);
        cx.lineTo(-half + rad, half);
        cx.quadraticCurveTo(-half, half, -half, half - rad);
        cx.lineTo(-half, -half + rad);
        cx.quadraticCurveTo(-half, -half, -half + rad, -half);
        cx.closePath();
      } else {
        cx.moveTo(0, -drawSize / 2);
        cx.lineTo(drawSize / 2, drawSize / 2);
        cx.lineTo(-drawSize / 2, drawSize / 2);
        cx.closePath();
      }

      cx.fill();
      spriteCache[key] = off;
      return off;
    }

    function initParticle(p, randomY) {
      var colors = config.colors;
      p.x = Math.random() * width;
      p.y = randomY ? Math.random() * height : (config.gravity < 0 ? height + 44 : -44);
      p.visualSize = Math.random() * 14 + 8;
      p.vx = (Math.random() - 0.5) * 1.6 * config.speedFactor;
      p.vy = (Math.random() - 0.5) * 1.6 * config.speedFactor;

      if (!config.usePattern && config.gravity < 0) {
        p.vy -= Math.random() * 0.9 * Math.abs(config.gravity);
      } else if (config.usePattern && !randomY) {
        p.x = width * 0.5;
        p.y = height * 0.5;
      }

      p.color = colors[Math.floor(Math.random() * colors.length) % colors.length];
      p.rotation = Math.random() * Math.PI * 2;
      p.rotationSpeed = (Math.random() - 0.5) * 0.032;
      p.type = resolveShapeType(config.shape);
      p.sprite = getSprite(p.color, p.type);
      p.depth = Math.random() * 0.9 + 0.55;
    }

    function rebuildParticles() {
      particles = [];
      for (var i = 0; i < config.particleCount; i++) {
        var p = { index: i };
        initParticle(p, true);
        particles.push(p);
      }
    }

    function syncThemePalette() {
      var nextDark = isDarkActive();
      if (nextDark === darkMode) return;
      darkMode = nextDark;
      if (!config.customColors) {
        config.colors = darkMode ? GOOGLE_DARK_COLORS.slice() : GOOGLE_LIGHT_COLORS.slice();
      }
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.color = config.colors[i % config.colors.length];
        p.sprite = getSprite(p.color, p.type);
      }
      if (paused || reducedMotion) drawFrame();
    }

    function syncAttributesAndControls() {
      if (canvas) {
        canvas.setAttribute('data-ag-mode', currentMode);
        canvas.setAttribute('data-ag-paused', paused ? 'true' : 'false');
        canvas.setAttribute('data-ag-count', String(particles.length));
        syncCanvasLayer(Boolean(burstElevateTimer));
      }
      if (typeof document === 'undefined') return;
      var modeBtns = document.querySelectorAll('[data-ag-mode-btn]');
      modeBtns.forEach(function (btn) {
        var btnMode = btn.getAttribute('data-ag-mode-btn');
        var active = btnMode === currentMode;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        if (active) {
          btn.classList.add('is-ag-active');
        } else {
          btn.classList.remove('is-ag-active');
        }
      });
      var pauseBtn = document.getElementById('agPauseToggleBtn');
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        pauseBtn.textContent = paused ? 'Chạy tiếp' : 'Tạm dừng';
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth || 1280;
      height = window.innerHeight || 720;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (paused || reducedMotion) drawFrame();
    }

    function stepFrame(dtScale) {
      var step = clamp(dtScale || 1, 0.25, 2.2);
      var radius = config.interactionRadius;
      var friction = Math.pow(config.friction, step);
      var total = particles.length;

      for (var i = 0; i < total; i++) {
        var p = particles[i];
        if (config.usePattern) {
          var target = getPatternTarget(p.index, total, width, height, config.shape);
          p.vx += (target.x - p.x) * 0.0048 * step;
          p.vy += (target.y - p.y) * 0.0048 * step;
          p.vx += (Math.random() - 0.5) * 0.04 * step;
          p.vy += (Math.random() - 0.5) * 0.04 * step;
        } else {
          p.vy += config.gravity * 0.05 * p.depth * step;
        }

        var dx = p.x - pointer.x;
        var dy = p.y - pointer.y;
        var distSq = dx * dx + dy * dy;
        if (distSq < radius * radius && distSq > 0.0001) {
          var dist = Math.sqrt(distSq);
          var force = (radius - dist) / radius;
          var angle = Math.atan2(dy, dx);
          var push = force * 3.8 * step;
          p.vx += Math.cos(angle) * push;
          p.vy += Math.sin(angle) * push;
        }

        p.x += p.vx * p.depth * step;
        p.y += p.vy * p.depth * step;
        p.rotation += p.rotationSpeed * step;

        p.vx *= friction;
        p.vy *= friction;

        if (!config.usePattern) {
          if (p.x < -55) p.x = width + 55;
          if (p.x > width + 55) p.x = -55;
          if (config.gravity < 0) {
            if (p.y < -65) initParticle(p, false);
          } else if (config.gravity > 0) {
            if (p.y > height + 65) initParticle(p, false);
          } else {
            if (p.y < -55) p.y = height + 55;
            if (p.y > height + 55) p.y = -55;
          }
        }
      }
    }

    function drawFrame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = config.usePattern ? (darkMode ? 0.86 : 0.90) : (darkMode ? 0.78 : 0.88);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var scaleFactor = (p.visualSize * p.depth) / 30;
        var renderSize = 64 * scaleFactor;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.drawImage(p.sprite, -renderSize / 2, -renderSize / 2, renderSize, renderSize);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      if (paused || (typeof document !== 'undefined' && document.hidden)) {
        rafId = 0;
        return;
      }
      var dtMs = lastTime ? now - lastTime : 16.67;
      lastTime = now;
      var dtScale = dtMs / 16.67;
      stepFrame(dtScale);
      drawFrame();
      rafId = window.requestAnimationFrame(loop);
    }

    function startLoop() {
      if (rafId || paused) return;
      lastTime = 0;
      rafId = window.requestAnimationFrame(loop);
    }

    function stopLoop() {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function setMode(mode) {
      var normalized = String(mode || 'float').toLowerCase();
      if (normalized === 'float') {
        currentMode = 'float';
        config.usePattern = false;
        config.shape = 'mixed';
      } else if (normalized === 'circle' || normalized === 'square' || normalized === 'triangle') {
        currentMode = normalized;
        config.usePattern = true;
        config.shape = normalized;
      } else {
        return;
      }

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.type = resolveShapeType(config.shape);
        p.sprite = getSprite(p.color, p.type);
      }

      if (paused) {
        paused = false;
        reducedMotion = false;
        startLoop();
      }
      syncAttributesAndControls();
    }

    function togglePause() {
      paused = !paused;
      if (paused) {
        stopLoop();
      } else {
        reducedMotion = false;
        startLoop();
      }
      syncAttributesAndControls();
      return paused;
    }

    function burst(originX, originY, strength) {
      var ox = Number.isFinite(originX) ? originX : width * 0.5;
      var oy = Number.isFinite(originY) ? originY : Math.min(height * 0.42, 360);
      var r = Math.min(width, height) * 0.55;
      var pushMax = Number.isFinite(strength) ? strength : 9.5;
      var affected = 0;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var dx = p.x - ox;
        var dy = p.y - oy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < r) {
          var norm = 1 - dist / r;
          var angle = dist > 0.5 ? Math.atan2(dy, dx) : (i * 2.39996);
          var impulse = (0.35 + norm) * pushMax;
          p.vx += Math.cos(angle) * impulse;
          p.vy += Math.sin(angle) * impulse;
          affected++;
        }
      }
      if (typeof window !== 'undefined') {
        if (burstElevateTimer) window.clearTimeout(burstElevateTimer);
        syncCanvasLayer(true);
        burstElevateTimer = window.setTimeout(function () {
          burstElevateTimer = 0;
          syncCanvasLayer(false);
        }, 1350);
      }
      if (paused) {
        paused = false;
        reducedMotion = false;
        startLoop();
        syncAttributesAndControls();
      }
      return affected;
    }

    function mount() {
      if (typeof document === 'undefined' || typeof window === 'undefined') return;
      canvas = document.getElementById('antigravityCanvas');
      if (!canvas) return;
      ctx = canvas.getContext('2d', {
        alpha: true,
        desynchronized: true,
        willReadFrequently: false
      });
      if (!ctx) return;

      reducedMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      paused = reducedMotion;

      resize();
      rebuildParticles();
      drawFrame();
      syncAttributesAndControls();

      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('mousemove', function (e) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }, { passive: true });
      window.addEventListener('touchmove', function (e) {
        if (e.touches && e.touches[0]) {
          pointer.x = e.touches[0].clientX;
          pointer.y = e.touches[0].clientY;
        }
      }, { passive: true });
      window.addEventListener('mouseleave', function () {
        pointer.x = -10000;
        pointer.y = -10000;
      }, { passive: true });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          stopLoop();
        } else if (!paused) {
          startLoop();
        }
      });

      if (typeof MutationObserver !== 'undefined') {
        var obs = new MutationObserver(syncThemePalette);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      }

      if (!paused) {
        startLoop();
      }
    }

    return {
      mount: mount,
      setMode: setMode,
      togglePause: togglePause,
      burst: burst,
      syncControls: syncAttributesAndControls,
      getState: function () {
        return {
          mode: currentMode,
          paused: paused,
          count: particles.length,
          shape: config.shape,
          usePattern: config.usePattern,
          isDark: darkMode,
          colors: config.colors.slice()
        };
      },
      _internals: {
        parseConfig: parseConfig,
        getPatternTarget: getPatternTarget,
        GOOGLE_LIGHT_COLORS: GOOGLE_LIGHT_COLORS,
        GOOGLE_DARK_COLORS: GOOGLE_DARK_COLORS
      }
    };
  }

  var api = createController();
  if (typeof window !== 'undefined') {
    window.ShopVietAntigravity = api;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', api.mount);
    } else {
      api.mount();
    }
  }
})();
