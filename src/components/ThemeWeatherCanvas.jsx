import React, { useEffect, useRef } from 'react';

/**
 * ThemeWeatherCanvas
 * High-performance 60fps HTML5 Canvas Particle & Atmosphere Engine.
 * Features 12 COMPLETELY UNIQUE, BESPOKE VISUAL SCENES for all 12 themes:
 * 1. 'snow': Crystalline 3D falling snowflakes & star flakes (Christmas Wonderland)
 * 2. 'halloween': Rising spooky Jack-o'-lantern embers, floating baby ghosts & swooping bats (Halloween Spooky)
 * 3. 'sakura': Fluttering, 3D rotating pastel pink cherry blossom petals (Sakura Blossom)
 * 4. 'stars': Pulsing celestial stardust nebulas & high-speed shooting stars (Cosmic Galaxy)
 * 5. 'fireflies': Bioluminescent lime-green fireflies hovering in breathing pulses (Botanical Avocado)
 * 6. 'coffee-steam': Rising cozy wavy coffee steam wisps & floating coffee bean motes (Lofi Cafe)
 * 7. 'digital-rain': Cyberpunk neon cyan & magenta digital matrix rain & laser streaks (Cyberpunk Neon)
 * 8. 'sunset-dust': Golden sunbeam dust motes drifting across glowing amber rays (Sunset Waves)
 * 9. 'fizzy-citrus': Effervescent rising soda bubbles with refractions & citrus sparkles (Lemon Citrus)
 * 10. 'aurora-ice': Shimmering polar Aurora Borealis waves & glinting diamond ice crystals (Nordic Frost)
 * 11. 'autumn-leaves': Golden amber & crimson maple leaves spiraling in autumn gusts (Classic Academia)
 * 12. 'minimal-sparkles': Elegant minimalist Notion geometric diamonds & micro-dust (Notion Minimalist)
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

    // Particle pool creation
    const particles = [];
    const count = getParticleCount(weatherType);
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(weatherType, width, height, true));
    }

    // Special event controllers
    let shootingStar = null;
    let nextShootingStarTime = Date.now() + 2000;
    let batEvent = null;
    let nextBatTime = Date.now() + 3000;
    let auroraTime = 0;

    let isPaused = false;
    let lastTime = performance.now();

    const render = (now) => {
      if (isPaused || document.hidden) {
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      auroraTime += dt * 0.8;

      ctx.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // SPECIAL BACKGROUND PASS (e.g. AURORA BOREALIS FOR NORDIC)
      // -------------------------------------------------------------
      if (weatherType === 'aurora-ice') {
        ctx.save();
        const grad = ctx.createLinearGradient(0, 0, width, height * 0.5);
        const wave1 = Math.sin(auroraTime) * 0.04 + 0.08;
        const wave2 = Math.cos(auroraTime * 0.7) * 0.03 + 0.06;
        grad.addColorStop(0, `rgba(6, 182, 212, ${wave1})`);
        grad.addColorStop(0.5, `rgba(52, 211, 153, ${wave2})`);
        grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = 0; x <= width; x += 40) {
          const y = Math.sin(x * 0.003 + auroraTime) * 45 + Math.cos(x * 0.006 - auroraTime * 0.5) * 25 + height * 0.18;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // -------------------------------------------------------------
      // INDIVIDUAL PARTICLES RENDER & PHYSICS
      // -------------------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. CHRISTMAS SNOW
        if (weatherType === 'snow') {
          p.y += p.speed * 60 * dt;
          p.angle += p.swaySpeed * dt;
          p.x += Math.sin(p.angle) * p.swayAmount * 60 * dt + p.wind * 60 * dt;

          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.shadowBlur = p.isSpecial ? 8 : 4;

          if (p.isSpecial) {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            p.rot += 0.015;
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.9})`;
            ctx.lineWidth = 1.2;
            for (let arm = 0; arm < 6; arm++) {
              ctx.rotate(Math.PI / 3);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(0, p.radius * 2);
              ctx.stroke();
            }
          } else {
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          if (p.y > height + 20) particles[i] = createParticle('snow', width, height, false);
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
        }

        // 2. HALLOWEEN SPOOKY (Embers & Mini Floating Ghosts)
        else if (weatherType === 'halloween') {
          if (p.isGhost) {
            // Floating Mini Ghost
            p.angle += 0.03;
            p.y -= p.speed * 40 * dt;
            p.x += Math.sin(p.angle) * 1.5;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.beginPath();
            ctx.fillStyle = `rgba(253, 244, 255, ${p.opacity})`;
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 12;
            // Ghost body curve
            ctx.arc(0, -6, 9, Math.PI, 0, false);
            ctx.lineTo(9, 6);
            ctx.quadraticCurveTo(5, 3, 0, 7);
            ctx.quadraticCurveTo(-5, 3, -9, 6);
            ctx.closePath();
            ctx.fill();
            // Ghost cute eyes
            ctx.fillStyle = '#2e1065';
            ctx.beginPath();
            ctx.arc(-3, -6, 1.3, 0, Math.PI * 2);
            ctx.arc(3, -6, 1.3, 0, Math.PI * 2);
            ctx.fill();
            // Blush dots
            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.arc(-5, -3, 1.5, 0, Math.PI * 2);
            ctx.arc(5, -3, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (p.y < -30) particles[i] = createParticle('halloween', width, height, false);
          } else {
            // Jack-o'-lantern Embers (Amber & Violet Sparks)
            p.y -= p.speed * 60 * dt;
            p.x += Math.sin(p.y * 0.03) * 0.8;
            p.pulse += 0.05;

            ctx.save();
            ctx.beginPath();
            const glow = Math.sin(p.pulse) * 0.3 + 0.7;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.globalAlpha = p.opacity * glow;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (p.y < -20) particles[i] = createParticle('halloween', width, height, false);
          }
        }

        // 3. SAKURA BLOSSOM (3D Rotating Pink Petals)
        else if (weatherType === 'sakura') {
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
          ctx.shadowColor = 'rgba(244, 114, 182, 0.45)';
          ctx.shadowBlur = 6;
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.radius, -p.radius * 1.5, -p.radius * 1.5, p.radius * 1.2, 0, p.radius * 2);
          ctx.bezierCurveTo(p.radius * 1.5, p.radius * 1.2, p.radius, -p.radius * 1.5, 0, 0);
          ctx.fill();
          ctx.restore();

          if (p.y > height + 30) particles[i] = createParticle('sakura', width, height, false);
        }

        // 4. COSMIC GALAXY (Stardust & Twinkles)
        else if (weatherType === 'stars') {
          p.pulse += p.pulseSpeed;
          const currentRadius = Math.max(0.6, p.radius + Math.sin(p.pulse) * 0.9);
          const currentOpacity = Math.max(0.2, p.opacity + Math.sin(p.pulse) * 0.35);

          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.isSpecial ? 14 : 5;
          ctx.globalAlpha = currentOpacity;
          ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 5. BIOLUMINESCENT FIREFLIES & MINT LEAVES (Botanical Avocado)
        else if (weatherType === 'fireflies') {
          p.angle += 0.03;
          p.y += Math.sin(p.angle) * 0.8 - 0.2;
          p.x += Math.cos(p.angle * 0.7) * 1.1;
          p.pulse += 0.05;

          ctx.save();
          ctx.beginPath();
          const glow = Math.sin(p.pulse) * 0.4 + 0.6;
          ctx.fillStyle = p.isLeaf ? '#547b6e' : `rgba(134, 239, 172, ${glow})`;
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = p.isLeaf ? 3 : 15;

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
        }

        // 6. COZY COFFEE STEAM & BEANS (Lofi Cafe)
        else if (weatherType === 'coffee-steam') {
          p.y -= p.speed * 55 * dt;
          p.x += Math.sin(p.y * 0.02 + p.angle) * 1.2;

          ctx.save();
          ctx.translate(p.x, p.y);

          if (p.isBean) {
            // Floating Coffee Bean Mote
            ctx.rotate(p.y * 0.02);
            ctx.fillStyle = 'rgba(140, 83, 43, 0.45)';
            ctx.beginPath();
            ctx.ellipse(0, 0, 5, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-4, 0);
            ctx.lineTo(4, 0);
            ctx.stroke();
          } else {
            // Soft warm steam puff
            ctx.fillStyle = `rgba(245, 235, 220, ${p.opacity * 0.7})`;
            ctx.shadowColor = '#d97706';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          if (p.y < -30) particles[i] = createParticle('coffee-steam', width, height, false);
        }

        // 7. DIGITAL MATRIX RAIN (Cyberpunk Neon)
        else if (weatherType === 'digital-rain') {
          p.y += p.speed * 90 * dt;

          ctx.save();
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;

          // Vertical neon trail line
          ctx.fillRect(p.x, p.y, p.width, p.length);
          // Bright leading head tip
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(p.x, p.y + p.length - 3, p.width, 3);
          ctx.restore();

          if (p.y > height + 40) particles[i] = createParticle('digital-rain', width, height, false);
        }

        // 8. GOLDEN SUNSET DUST (Sunset Waves)
        else if (weatherType === 'sunset-dust') {
          p.x += (p.speed * 40 + 0.5) * dt;
          p.y += Math.sin(p.x * 0.02) * 0.5;
          p.pulse += 0.04;

          ctx.save();
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 10;
          ctx.globalAlpha = Math.sin(p.pulse) * 0.3 + 0.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (p.x > width + 20) particles[i] = createParticle('sunset-dust', width, height, false);
        }

        // 9. EFFERVESCENT CITRUS BUBBLES (Lemon Citrus)
        else if (weatherType === 'fizzy-citrus') {
          p.y -= p.speed * 70 * dt;
          p.x += Math.sin(p.y * 0.04) * 0.7;

          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = `rgba(217, 119, 6, ${p.opacity})`;
          ctx.lineWidth = 1.6;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Gleam reflection
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (p.y < -30) particles[i] = createParticle('fizzy-citrus', width, height, false);
        }

        // 10. POLAR ICE CRYSTAL DUST (Nordic Frost)
        else if (weatherType === 'aurora-ice') {
          p.y += p.speed * 45 * dt;
          p.x += Math.sin(p.y * 0.02) * 0.6 + p.wind;
          p.rot += 0.02;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = `rgba(224, 242, 254, ${p.opacity})`;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          // Diamond / Rhombus ice crystal
          ctx.beginPath();
          ctx.moveTo(0, -p.radius * 1.5);
          ctx.lineTo(p.radius, 0);
          ctx.lineTo(0, p.radius * 1.5);
          ctx.lineTo(-p.radius, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          if (p.y > height + 20) particles[i] = createParticle('aurora-ice', width, height, false);
        }

        // 11. GOLDEN AUTUMN LEAVES (Classic Academia)
        else if (weatherType === 'autumn-leaves') {
          p.y += p.speed * 50 * dt;
          p.x += (Math.sin(p.angle) * 1.8 + 0.4) * 60 * dt;
          p.angle += 0.03;
          p.rot += p.rotSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#d97706';
          ctx.shadowBlur = 5;

          // Maple/Oak leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 1.6, p.radius * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-p.radius * 1.5, 0);
          ctx.lineTo(p.radius * 1.5, 0);
          ctx.stroke();
          ctx.restore();

          if (p.y > height + 25) particles[i] = createParticle('autumn-leaves', width, height, false);
        }

        // 12. MINIMALIST NOTION SPARKLES (Notion Minimalist)
        else if (weatherType === 'minimal-sparkles') {
          p.pulse += 0.03;
          const op = Math.max(0.15, p.opacity + Math.sin(p.pulse) * 0.25);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.fillStyle = `rgba(35, 131, 226, ${op})`;
          ctx.shadowColor = '#2383e2';
          ctx.shadowBlur = 4;

          if (p.isDiamond) {
            // Little 4-pointed micro star
            ctx.beginPath();
            ctx.moveTo(0, -p.radius * 1.4);
            ctx.lineTo(p.radius * 0.5, 0);
            ctx.lineTo(0, p.radius * 1.4);
            ctx.lineTo(-p.radius * 0.5, 0);
            ctx.closePath();
            ctx.fill();
          } else {
            // Micro circle dust
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // 13. SUPER MARIO BROS (Spinning Coins, Super Stars & 1-Up Mushrooms)
        else if (weatherType === 'mario-stars') {
          p.y += p.speed * 45 * dt;
          p.angle += 0.025;
          p.x += Math.sin(p.angle) * 1.2;

          ctx.save();
          ctx.translate(p.x, p.y);

          if (p.kind === 'coin') {
            // Spinning Golden Mario Coin
            p.flip += 0.08;
            const scaleX = Math.cos(p.flip);
            ctx.scale(scaleX, 1);
            ctx.fillStyle = '#facc15';
            ctx.strokeStyle = '#ca8a04';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius, p.radius * 1.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Inner coin shine
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -p.radius * 0.7);
            ctx.lineTo(0, p.radius * 0.7);
            ctx.stroke();
          } else if (p.kind === 'star') {
            // Super Star with 2 cute black oval eyes
            p.rot += 0.02;
            ctx.rotate(p.rot);
            ctx.fillStyle = '#fde047';
            ctx.shadowColor = '#eab308';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            for (let s = 0; s < 5; s++) {
              ctx.lineTo(Math.cos((18 + s * 72) * Math.PI / 180) * p.radius * 1.4, -Math.sin((18 + s * 72) * Math.PI / 180) * p.radius * 1.4);
              ctx.lineTo(Math.cos((54 + s * 72) * Math.PI / 180) * p.radius * 0.6, -Math.sin((54 + s * 72) * Math.PI / 180) * p.radius * 0.6);
            }
            ctx.closePath();
            ctx.fill();
            // Two cute eyes
            ctx.fillStyle = '#1e1b4b';
            ctx.beginPath();
            ctx.ellipse(-p.radius * 0.25, -p.radius * 0.1, 1, 2.2, 0, 0, Math.PI * 2);
            ctx.ellipse(p.radius * 0.25, -p.radius * 0.1, 1, 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.kind === 'mushroom') {
            // Cute Mini 1-Up / Super Mushroom
            ctx.shadowColor = p.isGreen ? '#22c55e' : '#ef4444';
            ctx.shadowBlur = 6;
            ctx.fillStyle = p.isGreen ? '#22c55e' : '#ef4444';
            ctx.beginPath();
            ctx.arc(0, -2, p.radius, Math.PI, 0, false);
            ctx.closePath();
            ctx.fill();
            // White dots
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, -p.radius * 0.6, p.radius * 0.3, 0, Math.PI * 2);
            ctx.arc(-p.radius * 0.6, -2, p.radius * 0.25, 0, Math.PI * 2);
            ctx.arc(p.radius * 0.6, -2, p.radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
            // Stalk
            ctx.fillStyle = '#fef3c7';
            ctx.beginPath();
            ctx.rect(-p.radius * 0.55, -2, p.radius * 1.1, p.radius * 0.8);
            ctx.fill();
            // Eyes
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.ellipse(-p.radius * 0.2, p.radius * 0.2, 0.8, 1.6, 0, 0, Math.PI * 2);
            ctx.ellipse(p.radius * 0.2, p.radius * 0.2, 0.8, 1.6, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Sparkle
            ctx.fillStyle = '#fef08a';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();

          if (p.y > height + 30) particles[i] = createParticle('mario-stars', width, height, false);
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
        }

        // 14. ANIME COMET TIAMAT (Kimi no Na wa)
        else if (weatherType === 'anime-comet') {
          p.pulse += 0.04;
          p.y += p.speed * 30 * dt;
          p.x += Math.sin(p.pulse) * 0.8 - 0.4;

          ctx.save();
          ctx.beginPath();
          const op = Math.max(0.2, p.opacity + Math.sin(p.pulse) * 0.3);
          ctx.fillStyle = p.isPink ? `rgba(244, 114, 182, ${op})` : `rgba(56, 189, 248, ${op})`;
          ctx.shadowColor = p.isPink ? '#f472b6' : '#38bdf8';
          ctx.shadowBlur = p.isSpecial ? 12 : 5;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (p.y > height + 20) particles[i] = createParticle('anime-comet', width, height, false);
        }
      }

      // -------------------------------------------------------------
      // OCCASIONAL DUAL SPLIT COMET TIAMAT (FOR YOUR NAME ANIME THEME)
      // -------------------------------------------------------------
      if (weatherType === 'anime-comet') {
        if (!shootingStar && Date.now() > nextShootingStarTime) {
          shootingStar = {
            x: Math.random() * (width * 0.5) + width * 0.1,
            y: -10,
            length: Math.random() * 160 + 120,
            speed: Math.random() * 8 + 9,
            angle: Math.PI / 3.2,
            opacity: 1
          };
        }

        if (shootingStar) {
          ctx.save();
          // Main Blue/White Comet
          ctx.strokeStyle = `rgba(224, 242, 254, ${shootingStar.opacity})`;
          ctx.lineWidth = 3;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
            shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
          );
          ctx.stroke();

          // Split Pink Secondary Fragment
          ctx.strokeStyle = `rgba(244, 114, 182, ${shootingStar.opacity * 0.8})`;
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x + 12, shootingStar.y - 8);
          ctx.lineTo(
            shootingStar.x + 12 - Math.cos(shootingStar.angle + 0.08) * (shootingStar.length * 0.75),
            shootingStar.y - 8 - Math.sin(shootingStar.angle + 0.08) * (shootingStar.length * 0.75)
          );
          ctx.stroke();
          ctx.restore();

          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.opacity -= 0.012;

          if (shootingStar.opacity <= 0 || shootingStar.x > width + 100 || shootingStar.y > height + 100) {
            shootingStar = null;
            nextShootingStarTime = Date.now() + Math.random() * 6000 + 4000;
          }
        }
      }

      // -------------------------------------------------------------
      // OCCASIONAL CELESTIAL SHOOTING STAR (FOR STARS THEME)
      // -------------------------------------------------------------
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
            nextShootingStarTime = Date.now() + Math.random() * 5000 + 3000;
          }
        }
      }

      // -------------------------------------------------------------
      // OCCASIONAL SWOOPING BAT SHADOW (FOR HALLOWEEN THEME)
      // -------------------------------------------------------------
      if (weatherType === 'halloween') {
        if (!batEvent && Date.now() > nextBatTime) {
          batEvent = {
            x: -40,
            y: Math.random() * (height * 0.4) + 40,
            speedX: Math.random() * 4 + 4,
            speedY: Math.random() * 2 - 1,
            wingPhase: 0,
            scale: Math.random() * 0.3 + 0.6
          };
        }

        if (batEvent) {
          batEvent.x += batEvent.speedX * 60 * dt;
          batEvent.y += Math.sin(batEvent.x * 0.03) * 1.5;
          batEvent.wingPhase += 0.3;

          ctx.save();
          ctx.translate(batEvent.x, batEvent.y);
          ctx.scale(batEvent.scale, batEvent.scale * Math.cos(batEvent.wingPhase));
          ctx.fillStyle = '#1e1b4b';
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(0, 8);
          ctx.quadraticCurveTo(-15, -12, -28, -2);
          ctx.quadraticCurveTo(-20, 10, -10, 8);
          ctx.quadraticCurveTo(-6, 16, 0, 10);
          ctx.quadraticCurveTo(6, 16, 10, 8);
          ctx.quadraticCurveTo(20, 10, 28, -2);
          ctx.quadraticCurveTo(15, -12, 0, 8);
          ctx.fill();
          // Glowing eyes
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(-2, 4, 1.2, 0, Math.PI * 2);
          ctx.arc(2, 4, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (batEvent.x > width + 50) {
            batEvent = null;
            nextBatTime = Date.now() + Math.random() * 7000 + 4000;
          }
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        if (animFrameId.current) {
          cancelAnimationFrame(animFrameId.current);
          animFrameId.current = null;
        }
      } else {
        isPaused = false;
        lastTime = performance.now();
        if (!animFrameId.current) {
          animFrameId.current = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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

function getParticleCount(type) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return 0;
  const scale = isMobile ? 0.6 : 1;
  let base = 30;

  switch (type) {
    case 'snow':
      base = 70; break;
    case 'halloween':
      base = 45; break;
    case 'sakura':
      base = 38; break;
    case 'stars':
      base = 55; break;
    case 'fireflies':
      base = 35; break;
    case 'coffee-steam':
      base = 32; break;
    case 'digital-rain':
      base = 45; break;
    case 'sunset-dust':
      base = 40; break;
    case 'fizzy-citrus':
      base = 35; break;
    case 'aurora-ice':
      base = 40; break;
    case 'autumn-leaves':
      base = 32; break;
    case 'minimal-sparkles':
      base = 26; break;
    case 'mario-stars':
      base = 35; break;
    case 'anime-comet':
      base = 45; break;
    default:
      base = 30; break;
  }
  return Math.max(12, Math.floor(base * scale));
}

function createParticle(type, width, height, randomY = true) {
  // 1. SNOW
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

  // 2. HALLOWEEN
  if (type === 'halloween') {
    const isGhost = Math.random() < 0.14;
    const colors = ['#f97316', '#ea580c', '#fb923c', '#a855f7', '#c084fc'];
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 25,
      radius: isGhost ? 9 : Math.random() * 3 + 1.5,
      speed: isGhost ? Math.random() * 0.8 + 0.5 : Math.random() * 1.2 + 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: isGhost ? Math.random() * 0.4 + 0.5 : Math.random() * 0.6 + 0.4,
      isGhost,
      angle: Math.random() * Math.PI * 2,
      pulse: Math.random() * Math.PI * 2
    };
  }

  // 3. SAKURA
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

  // 4. STARS
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
      isSpecial: Math.random() < 0.25
    };
  }

  // 5. FIREFLIES
  if (type === 'fireflies') {
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

  // 6. COFFEE STEAM
  if (type === 'coffee-steam') {
    const isBean = Math.random() < 0.2;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 20,
      radius: Math.random() * 6 + 4,
      speed: Math.random() * 0.9 + 0.5,
      opacity: Math.random() * 0.5 + 0.25,
      angle: Math.random() * Math.PI * 2,
      isBean
    };
  }

  // 7. DIGITAL MATRIX RAIN
  if (type === 'digital-rain') {
    const isCyan = Math.random() < 0.7;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -40,
      width: Math.random() * 1.5 + 1.2,
      length: Math.random() * 25 + 15,
      speed: Math.random() * 3.5 + 2.5,
      color: isCyan ? 'rgba(6, 182, 212, 0.75)' : 'rgba(236, 72, 153, 0.75)'
    };
  }

  // 8. SUNSET DUST
  if (type === 'sunset-dust') {
    const colors = ['#f59e0b', '#fb923c', '#fdba74', '#fed7aa'];
    return {
      x: randomY ? Math.random() * width : -20,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1.5,
      speed: Math.random() * 1.2 + 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2
    };
  }

  // 9. FIZZY CITRUS BUBBLES
  if (type === 'fizzy-citrus') {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 20,
      radius: Math.random() * 5 + 2.5,
      speed: Math.random() * 1.8 + 0.9,
      opacity: Math.random() * 0.6 + 0.3
    };
  }

  // 10. AURORA ICE CRYSTALS
  if (type === 'aurora-ice') {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      radius: Math.random() * 3.5 + 2,
      speed: Math.random() * 1.1 + 0.5,
      wind: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.6 + 0.35,
      rot: Math.random() * Math.PI * 2
    };
  }

  // 11. AUTUMN LEAVES
  if (type === 'autumn-leaves') {
    const colors = ['#b45309', '#d97706', '#9a3412', '#78350f', '#ca8a04'];
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -25,
      radius: Math.random() * 4 + 4,
      speed: Math.random() * 1.3 + 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05
    };
  }

  // 13. SUPER MARIO BROS (Coins, Stars & Mushrooms)
  if (type === 'mario-stars') {
    const r = Math.random();
    const kind = r < 0.4 ? 'coin' : (r < 0.7 ? 'star' : (r < 0.9 ? 'mushroom' : 'sparkle'));
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -30,
      radius: kind === 'coin' ? Math.random() * 3 + 7 : (kind === 'star' ? Math.random() * 4 + 8 : (kind === 'mushroom' ? Math.random() * 3 + 7 : Math.random() * 2 + 2)),
      speed: Math.random() * 1.2 + 0.8,
      angle: Math.random() * Math.PI * 2,
      flip: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      kind,
      isGreen: Math.random() < 0.5
    };
  }

  // 14. ANIME COMET TIAMAT DUST
  if (type === 'anime-comet') {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      radius: Math.random() * 2.5 + 1.2,
      speed: Math.random() * 1.4 + 0.8,
      pulse: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.35,
      isPink: Math.random() < 0.5,
      isSpecial: Math.random() < 0.25
    };
  }

  // 12. MINIMAL SPARKLES
  const isDiamond = Math.random() < 0.3;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: isDiamond ? Math.random() * 2.5 + 2 : Math.random() * 1.5 + 0.8,
    opacity: Math.random() * 0.5 + 0.2,
    pulse: Math.random() * Math.PI * 2,
    isDiamond
  };
}
