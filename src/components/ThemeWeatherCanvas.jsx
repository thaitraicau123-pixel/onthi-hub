import React, { useEffect, useRef } from 'react';

/**
 * ThemeWeatherCanvas
 * High-performance 60fps HTML5 Canvas Particle Engine.
 * Dynamically produces realistic weather and atmospheric effects:
 * - 'snow': Gentle, realistic 3D falling snowflakes with wind drift and crystalline stars (Christmas & Nordic).
 * - 'sakura': Drifting, 3D rotating pastel pink cherry blossom petals (Sakura Blossom).
 * - 'stars': Twinkling stardust nebulas and shooting stars (Cosmic Galaxy).
 * - 'leaves': Floating fireflies with soft lime bioluminescence and leaves (Avocado Garden).
 * - 'bubbles': Effervescent rising fizzy bubbles (Lemon Citrus).
 */
export default function ThemeWeatherCanvas({ weatherType = 'none', isEnabled = true }) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    if (!isEnabled || weatherType === 'none') {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle state initialization
    const particles = [];
    const count = weatherType === 'snow' ? 75 : weatherType === 'sakura' ? 42 : weatherType === 'stars' ? 55 : 35;

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(weatherType, width, height, true));
    }

    let shootingStar = null;
    let nextShootingStarTime = Date.now() + 2500;

    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Render each particle based on weather type
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (weatherType === 'snow') {
          // --- SNOWFLAKE PHYSICS ---
          p.y += p.speed * 60 * dt;
          p.angle += p.swaySpeed * dt;
          p.x += Math.sin(p.angle) * p.swayAmount * 60 * dt + p.wind * 60 * dt;

          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.shadowBlur = p.isSpecial ? 8 : 4;

          if (p.isSpecial) {
            // Draw 6-arm crystal snowflake
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            p.rot += 0.015;
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.9})`;
            ctx.lineWidth = 1.2;
            for (let arm = 0; arm < 6; arm++) {
              ctx.rotate(Math.PI / 3);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(0, p.radius * 2.2);
              ctx.stroke();
            }
          } else {
            // Soft glowing fluffy snowball
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Reset when fallen off screen
          if (p.y > height + 20) {
            particles[i] = createParticle('snow', width, height, false);
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

        } else if (weatherType === 'sakura') {
          // --- SAKURA PETAL 3D FLUTTER ---
          p.y += p.speed * 60 * dt;
          p.x += (Math.cos(p.angle) * p.swayAmount + p.wind) * 60 * dt;
          p.angle += 0.02;
          p.rot += p.rotSpeed;
          p.flip += p.flipSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, Math.sin(p.flip));

          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.shadowColor = 'rgba(244, 114, 182, 0.4)';
          ctx.shadowBlur = 6;
          // Petal heart curve
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.radius, -p.radius * 1.5, -p.radius * 1.5, p.radius * 1.2, 0, p.radius * 2);
          ctx.bezierCurveTo(p.radius * 1.5, p.radius * 1.2, p.radius, -p.radius * 1.5, 0, 0);
          ctx.fill();
          ctx.restore();

          if (p.y > height + 30) {
            particles[i] = createParticle('sakura', width, height, false);
          }

        } else if (weatherType === 'stars') {
          // --- PULSATING COSMIC STARDUST ---
          p.pulse += p.pulseSpeed;
          const currentRadius = Math.max(0.5, p.radius + Math.sin(p.pulse) * 0.8);
          const currentOpacity = Math.max(0.2, p.opacity + Math.sin(p.pulse) * 0.3);

          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.isSpecial ? 12 : 5;
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

        } else if (weatherType === 'leaves') {
          // --- GLOWING FIREFLIES & MINT LEAVES (AVOCADO THEME) ---
          p.angle += 0.025;
          p.y += Math.sin(p.angle) * 0.6 - 0.4;
          p.x += Math.cos(p.angle * 0.7) * 0.8;
          p.pulse += 0.05;

          ctx.save();
          ctx.beginPath();
          const glow = Math.sin(p.pulse) * 0.4 + 0.6;
          ctx.fillStyle = p.isLeaf ? '#547b6e' : `rgba(134, 239, 172, ${glow})`;
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = p.isLeaf ? 2 : 12;

          if (p.isLeaf) {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          if (p.y < -20) p.y = height + 20;
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

        } else if (weatherType === 'bubbles') {
          // --- EFFERVESCENT FIZZY BUBBLES ---
          p.y -= p.speed * 60 * dt;
          p.x += Math.sin(p.y * 0.05) * 0.6;

          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = `rgba(245, 158, 11, ${p.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Small bubble gleam
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (p.y < -30) {
            particles[i] = createParticle('bubbles', width, height, false);
          }
        }
      }

      // --- OCCASIONAL SHOOTING STAR (FOR COSMIC THEME) ---
      if (weatherType === 'stars') {
        if (!shootingStar && Date.now() > nextShootingStarTime) {
          shootingStar = {
            x: Math.random() * (width * 0.7),
            y: Math.random() * (height * 0.3),
            length: Math.random() * 120 + 80,
            speed: Math.random() * 14 + 10,
            angle: Math.PI / 4,
            opacity: 1
          };
        }

        if (shootingStar) {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 12;

          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
            shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
          );
          ctx.stroke();
          ctx.restore();

          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.opacity -= 0.02;

          if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar = null;
            nextShootingStarTime = Date.now() + Math.random() * 6000 + 3500;
          }
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [weatherType, isEnabled]);

  if (!isEnabled || weatherType === 'none') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-1 overflow-hidden select-none"
    />
  );
}

function createParticle(type, width, height, randomY = true) {
  if (type === 'snow') {
    const isSpecial = Math.random() < 0.18;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      radius: isSpecial ? Math.random() * 3 + 3.5 : Math.random() * 2.8 + 1.2,
      speed: Math.random() * 1.4 + 0.8,
      wind: Math.random() * 0.4 - 0.2,
      swayAmount: Math.random() * 1.5 + 0.5,
      swaySpeed: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.6 + 0.35,
      isSpecial,
      rot: Math.random() * Math.PI * 2
    };
  }

  if (type === 'sakura') {
    const colors = ['rgba(244, 114, 182, 0.75)', 'rgba(251, 207, 232, 0.85)', 'rgba(249, 168, 212, 0.8)'];
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -25,
      radius: Math.random() * 4 + 4,
      speed: Math.random() * 1.2 + 0.8,
      wind: Math.random() * 1.2 + 0.4,
      swayAmount: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.01,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  if (type === 'stars') {
    const colors = ['#ffffff', '#e9d5ff', '#c084fc', '#38bdf8', '#fef08a'];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      opacity: Math.random() * 0.7 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.04 + 0.015,
      isSpecial: Math.random() < 0.2
    };
  }

  if (type === 'leaves') {
    const isLeaf = Math.random() < 0.25;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      pulse: Math.random() * Math.PI * 2,
      isLeaf
    };
  }

  // bubbles
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + 20,
    radius: Math.random() * 5 + 3,
    speed: Math.random() * 1.5 + 0.8,
    opacity: Math.random() * 0.6 + 0.25
  };
}
