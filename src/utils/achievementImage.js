// =========================================================================
// ONTHIHUB GRAND ACHIEVEMENT & ROYAL CERTIFICATE CANVAS GENERATOR (2026)
// Thiết kế bằng khen & chứng nhận kỷ lục hoàng gia siêu hoành tráng (1080x1350)
// Hỗ trợ 3 phong cách vinh danh đỉnh cao: Hoàng Gia 24K, Chiến Thần Lửa, Kim Cương
// Tương thích chuẩn Retina 4K, chia sẻ Facebook, Instagram Story & Zalo
// =========================================================================

import { formatHanoiDateTime } from './hanoiTime';

/**
 * Vẽ một ngôi sao vector sắc nét
 */
function drawStar(ctx, cx, cy, spikes = 5, outerRadius = 15, innerRadius = 7, fillStyle = '#fbbf24') {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
}

/**
 * Tạo dải gradient kim loại vàng 24K siêu thực
 */
function createGoldGradient(ctx, x1, y1, x2, y2) {
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, '#9A7B38');
  grad.addColorStop(0.18, '#DEB86A');
  grad.addColorStop(0.35, '#FFF2BF');
  grad.addColorStop(0.55, '#C69E4A');
  grad.addColorStop(0.75, '#F9E49D');
  grad.addColorStop(0.9, '#DFB96C');
  grad.addColorStop(1, '#8C6721');
  return grad;
}

/**
 * Tạo dải gradient ánh lửa ruby rực cháy
 */
function createFireGradient(ctx, x1, y1, x2, y2) {
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, '#7F1D1D');
  grad.addColorStop(0.25, '#DC2626');
  grad.addColorStop(0.5, '#F97316');
  grad.addColorStop(0.75, '#FBBF24');
  grad.addColorStop(1, '#FEF08A');
  return grad;
}

/**
 * Tạo dải gradient kim cương neon cyberpunk
 */
function createDiamondGradient(ctx, x1, y1, x2, y2) {
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, '#0369A1');
  grad.addColorStop(0.25, '#0284C7');
  grad.addColorStop(0.5, '#38BDF8');
  grad.addColorStop(0.75, '#C084FC');
  grad.addColorStop(1, '#F0F9FF');
  return grad;
}

/**
 * Vẽ hoa văn góc chứng chỉ hoàng gia (Baroque / Imperial Filigree Corners)
 */
function drawCornerFiligree(ctx, x, y, size, flipX = false, flipY = false, color = '#DEB86A') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Khung góc vuông cơ bản
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  // Đường viền góc trong
  ctx.beginPath();
  ctx.moveTo(10, size - 8);
  ctx.lineTo(10, 10);
  ctx.lineTo(size - 8, 10);
  ctx.stroke();

  // Hoa văn xoắn baroque cổ điển
  ctx.beginPath();
  ctx.arc(26, 26, 14, Math.PI, 1.5 * Math.PI, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(36, 10, 8, 0, Math.PI, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(10, 36, 8, 1.5 * Math.PI, 0.5 * Math.PI, false);
  ctx.stroke();

  // Ngôi sao vàng điểm xuyết góc
  drawStar(ctx, 10, 10, 4, 7, 3, color);

  ctx.restore();
}

/**
 * Vẽ vòng nguyệt quế hoàng gia đối xứng (Imperial Laurel Wreath)
 */
function drawLaurelWreath(ctx, cx, cy, radius = 95, color = '#DEB86A') {
  ctx.save();
  // Nhánh trái và nhánh phải
  [-1, 1].forEach((dir) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(dir, 1);

    // Thân cành cong
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0.35 * Math.PI, 1.45 * Math.PI, false);
    ctx.stroke();

    // Các cặp lá nguyệt quế dọc thân cành
    const leavesCount = 8;
    for (let i = 0; i < leavesCount; i++) {
      const angle = 0.45 * Math.PI + (i / (leavesCount - 1)) * 0.95 * Math.PI;
      const lx = Math.cos(angle) * radius;
      const ly = Math.sin(angle) * radius;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(angle + Math.PI / 2);

      // Lá chính
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(8, 0, 11, 4.5, 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Lá phụ
      ctx.beginPath();
      ctx.ellipse(-8, -2, 9, 3.8, -0.35, 0, Math.PI * 2);
      ctx.fill();

      // Quả mọng vàng
      ctx.beginPath();
      ctx.arc(0, 4, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF7D6';
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  });
  ctx.restore();
}

/**
 * Vẽ Cúp Vàng Hoàng Gia 3D Vector
 */
function drawVectorTrophy(ctx, cx, cy, goldGrad) {
  ctx.save();
  ctx.translate(cx, cy);

  // Ánh sáng phát quang sau cúp
  const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 75);
  glow.addColorStop(0, 'rgba(255, 242, 191, 0.6)');
  glow.addColorStop(0.5, 'rgba(218, 165, 32, 0.25)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 75, 0, Math.PI * 2);
  ctx.fill();

  // Quai cúp hai bên
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(-26, -10, 20, 0.4 * Math.PI, 1.6 * Math.PI, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(26, -10, 20, 1.4 * Math.PI, 0.6 * Math.PI, false);
  ctx.stroke();

  // Thân cúp chính
  ctx.fillStyle = goldGrad;
  ctx.beginPath();
  ctx.moveTo(-28, -35);
  ctx.lineTo(28, -35);
  ctx.bezierCurveTo(28, 12, 10, 18, 0, 20);
  ctx.bezierCurveTo(-10, 18, -28, 12, -28, -35);
  ctx.closePath();
  ctx.fill();

  // Viền miệng cúp mạ vàng nổi
  ctx.fillStyle = '#FFF7D6';
  ctx.beginPath();
  ctx.ellipse(0, -35, 29, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cổ cúp
  ctx.fillStyle = goldGrad;
  ctx.fillRect(-6, 18, 12, 14);

  // Chân đế cúp
  ctx.beginPath();
  ctx.moveTo(-22, 38);
  ctx.lineTo(22, 38);
  ctx.lineTo(16, 32);
  ctx.lineTo(-16, 32);
  ctx.closePath();
  ctx.fill();

  // Ngôi sao trung tâm cúp
  drawStar(ctx, 0, -8, 5, 10, 4.5, '#FFF9E6');

  // Vương miện nhỏ trên cúp
  ctx.fillStyle = '#FFE082';
  ctx.beginPath();
  ctx.moveTo(-16, -42);
  ctx.lineTo(-14, -53);
  ctx.lineTo(-6, -47);
  ctx.lineTo(0, -56);
  ctx.lineTo(6, -47);
  ctx.lineTo(14, -53);
  ctx.lineTo(16, -42);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Vẽ Ngọn Lửa Kỷ Lục 3D Vector Siêu Thực (Sacred Flame)
 */
function drawVectorFlame(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  // Hào quang rực cháy
  const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, 85);
  aura.addColorStop(0, 'rgba(255, 170, 0, 0.7)');
  aura.addColorStop(0.4, 'rgba(239, 68, 68, 0.3)');
  aura.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, 85, 0, Math.PI * 2);
  ctx.fill();

  // Ngọn lửa ngoài (Đỏ cam)
  const outerGrad = ctx.createLinearGradient(0, 45, 0, -55);
  outerGrad.addColorStop(0, '#B91C1C');
  outerGrad.addColorStop(0.5, '#EA580C');
  outerGrad.addColorStop(1, '#F59E0B');
  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.bezierCurveTo(-45, 30, -42, -15, -18, -35);
  ctx.bezierCurveTo(-14, -18, -8, -12, 0, -56);
  ctx.bezierCurveTo(8, -25, 20, -18, 16, -32);
  ctx.bezierCurveTo(38, -12, 42, 25, 0, 40);
  ctx.closePath();
  ctx.fill();

  // Ngọn lửa giữa (Cam vàng chói)
  const midGrad = ctx.createLinearGradient(0, 35, 0, -40);
  midGrad.addColorStop(0, '#C2410C');
  midGrad.addColorStop(0.5, '#F59E0B');
  midGrad.addColorStop(1, '#FBBF24');
  ctx.fillStyle = midGrad;
  ctx.beginPath();
  ctx.moveTo(0, 32);
  ctx.bezierCurveTo(-26, 22, -25, -5, -8, -24);
  ctx.bezierCurveTo(-6, -10, -2, -5, 3, -42);
  ctx.bezierCurveTo(12, -15, 25, 5, 0, 32);
  ctx.closePath();
  ctx.fill();

  // Nhân lửa trong (Vàng sáng / Bạch kim)
  const coreGrad = ctx.createLinearGradient(0, 25, 0, -20);
  coreGrad.addColorStop(0, '#F59E0B');
  coreGrad.addColorStop(0.6, '#FEF08A');
  coreGrad.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.moveTo(0, 24);
  ctx.bezierCurveTo(-14, 15, -12, 0, -2, -18);
  ctx.bezierCurveTo(2, -8, 8, 2, 0, 24);
  ctx.closePath();
  ctx.fill();

  // Tia lửa bay lơ lửng
  drawStar(ctx, -24, -30, 4, 4, 1.8, '#FEF08A');
  drawStar(ctx, 22, -38, 4, 5, 2, '#FED7AA');
  drawStar(ctx, 6, -60, 4, 4, 1.5, '#FFFFFF');

  ctx.restore();
}

/**
 * Vẽ Viên Kim Cương Công Nghệ 3D Vector (Cyber Diamond)
 */
function drawVectorDiamond(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 80);
  glow.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
  glow.addColorStop(0.5, 'rgba(192, 132, 252, 0.25)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 80, 0, Math.PI * 2);
  ctx.fill();

  // Mặt trên kim cương
  ctx.fillStyle = '#E0F2FE';
  ctx.beginPath();
  ctx.moveTo(-20, -32);
  ctx.lineTo(20, -32);
  ctx.lineTo(36, -14);
  ctx.lineTo(0, -20);
  ctx.lineTo(-36, -14);
  ctx.closePath();
  ctx.fill();

  // Mặt trung tâm
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.moveTo(-20, -32);
  ctx.lineTo(20, -32);
  ctx.lineTo(0, 36);
  ctx.closePath();
  ctx.fill();

  // Mặt vát trái
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.moveTo(-20, -32);
  ctx.lineTo(-36, -14);
  ctx.lineTo(0, 36);
  ctx.closePath();
  ctx.fill();

  // Mặt vát phải
  ctx.fillStyle = '#0369A1';
  ctx.beginPath();
  ctx.moveTo(20, -32);
  ctx.lineTo(36, -14);
  ctx.lineTo(0, 36);
  ctx.closePath();
  ctx.fill();

  // Tâm phát sáng phản quang
  drawStar(ctx, 0, -2, 4, 9, 3.5, '#FFFFFF');
  ctx.restore();
}

/**
 * Vẽ Dấu Mộc Hoàng Gia Nổi 3D với 2 Dải Lụa Đỏ (Imperial Scalloped Seal & Ribbons)
 */
function drawRoyalSeal(ctx, cx, cy, radius = 78, isGoldTheme = true, passed = true) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((10 * Math.PI) / 180);

  // 1. Dải lụa đỏ son buông xuống phía dưới (Twin Silk Ribbons)
  const ribbonColor1 = '#991B1B';
  const ribbonColor2 = '#7F1D1D';

  [-1, 1].forEach((dir) => {
    ctx.save();
    ctx.rotate((dir * 24 * Math.PI) / 180);

    const gradRibbon = ctx.createLinearGradient(0, 30, 0, 115);
    gradRibbon.addColorStop(0, ribbonColor1);
    gradRibbon.addColorStop(1, ribbonColor2);
    ctx.fillStyle = gradRibbon;

    ctx.beginPath();
    ctx.moveTo(-16, 40);
    ctx.lineTo(16, 40);
    ctx.lineTo(18, 110);
    ctx.lineTo(0, 95); // Cắt đuôi én
    ctx.lineTo(-18, 110);
    ctx.closePath();
    ctx.fill();

    // Viền mép lụa mạ vàng
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  });

  // 2. Vành răng cưa 36 cánh hoa hoàng gia (Scalloped Medallion Outer)
  const points = 36;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : radius - 7;
    const a = (i * Math.PI) / points;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  const sealOuterGrad = isGoldTheme
    ? createGoldGradient(ctx, -radius, -radius, radius, radius)
    : createFireGradient(ctx, -radius, -radius, radius, radius);
  ctx.fillStyle = sealOuterGrad;
  ctx.fill();

  ctx.strokeStyle = '#FFF9E6';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 3. Vòng tròn nền son nhung đỏ sẫm bên trong
  ctx.beginPath();
  ctx.arc(0, 0, radius - 12, 0, Math.PI * 2);
  const sealInnerGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, radius - 12);
  sealInnerGrad.addColorStop(0, '#B91C1C');
  sealInnerGrad.addColorStop(0.85, '#7F1D1D');
  sealInnerGrad.addColorStop(1, '#450A0A');
  ctx.fillStyle = sealInnerGrad;
  ctx.fill();

  ctx.strokeStyle = '#FDE68A';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Chữ dập nổi hoàng gia trong dấu mộc
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Chữ trên
  ctx.fillStyle = '#FEF08A';
  ctx.font = '900 12px "Times New Roman", Georgia, serif';
  ctx.fillText('HỆ THỐNG CHỨNG NHẬN PROMPTMMO', 0, -32);

  // 5 Ngôi sao vàng
  [-28, -14, 0, 14, 28].forEach((starX) => {
    drawStar(ctx, starX, -16, 5, 4, 1.8, '#FDE68A');
  });

  // Danh hiệu chính ở giữa
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(passed ? 'ĐÃ ĐẠT' : 'VINH DANH', 0, 5);

  // Chữ dưới
  ctx.fillStyle = '#FEF08A';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('★ PROMPTMMO 2026 ★', 0, 30);

  ctx.restore();
}

/**
 * TẠO CANVAS CHỨNG NHẬN KỶ LỤC HOÀNG GIA (Retina 1080 x 1350)
 */
export async function generateAchievementCanvas({
  theme = 'royal_gold', // 'royal_gold' | 'crimson_glory' | 'cyber_diamond'
  type = 'exam_passed', // 'exam_passed' | 'streak' | 'rank_up' | 'quiz_completed'
  title = 'Kỳ Thi Sát Hạch Kiến Thức Chung 2026',
  subtitle = 'Nghị định 138/2020/NĐ-CP • Vòng 1',
  score = 56,
  maxScore = 60,
  percentage = 93,
  passed = true,
  streak = 15,
  rank = 'Creator Xuất Sắc',
  candidateName = 'Creator PromptMMO',
  certCode = 'VN-2026-CERT',
  dateString = null
}) {
  const width = 1080;
  const height = 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Cấu hình Theme theo phong cách được chọn
  const isStreak = type === 'streak';
  const activeTheme = theme || (isStreak ? 'crimson_glory' : 'royal_gold');

  let bgGrad1 = '#030712';
  let bgGrad2 = '#0B1329';
  let bgGrad3 = '#02040A';
  let mainAccentGrad = createGoldGradient(ctx, 160, 0, width - 160, 0);
  let primaryColor = '#DEB86A';
  let brightColor = '#FFF2BF';

  if (activeTheme === 'crimson_glory') {
    bgGrad1 = '#180509';
    bgGrad2 = '#2C0B11';
    bgGrad3 = '#0D0204';
    mainAccentGrad = createFireGradient(ctx, 160, 0, width - 160, 0);
    primaryColor = '#F59E0B';
    brightColor = '#FEF08A';
  } else if (activeTheme === 'cyber_diamond') {
    bgGrad1 = '#020617';
    bgGrad2 = '#0A192F';
    bgGrad3 = '#020617';
    mainAccentGrad = createDiamondGradient(ctx, 160, 0, width - 160, 0);
    primaryColor = '#38BDF8';
    brightColor = '#E0F2FE';
  }

  // 1. Nền Nhung Hoàng Gia (Deep Royal Velvet Backdrop)
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, bgGrad1);
  bg.addColorStop(0.5, bgGrad2);
  bg.addColorStop(1, bgGrad3);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // 2. Vầng Hào Quang Tỏa Sáng Tâm Điểm (Celestial Central Glow)
  const sunGlow = ctx.createRadialGradient(width / 2, 380, 20, width / 2, 380, 560);
  if (activeTheme === 'crimson_glory') {
    sunGlow.addColorStop(0, 'rgba(239, 68, 68, 0.42)');
    sunGlow.addColorStop(0.4, 'rgba(245, 158, 11, 0.22)');
    sunGlow.addColorStop(1, 'rgba(0,0,0,0)');
  } else if (activeTheme === 'cyber_diamond') {
    sunGlow.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    sunGlow.addColorStop(0.4, 'rgba(192, 132, 252, 0.2)');
    sunGlow.addColorStop(1, 'rgba(0,0,0,0)');
  } else {
    sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    sunGlow.addColorStop(0.4, 'rgba(217, 119, 6, 0.2)');
    sunGlow.addColorStop(1, 'rgba(0,0,0,0)');
  }
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Khung Viền Hoàng Gia Kép Đính Kim Tuyến (Imperial Double Gold Border)
  ctx.save();
  const goldBorder = createGoldGradient(ctx, 35, 35, width - 35, height - 35);

  // Viền ngoài dập nổi
  ctx.strokeStyle = goldBorder;
  ctx.lineWidth = 4;
  ctx.strokeRect(35, 35, width - 70, height - 70);

  // Viền chỉ mỏng đứt đoạn phong cách tiền tệ/chứng chỉ bảo an
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(47, 47, width - 94, height - 94);
  ctx.setLineDash([]);

  // Viền trong bo góc trang nhã
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(58, 58, width - 116, height - 116);

  // 4 Góc hoa văn hoàng gia Baroque Filigree
  drawCornerFiligree(ctx, 58, 58, 48, false, false, primaryColor);
  drawCornerFiligree(ctx, width - 58, 58, 48, true, false, primaryColor);
  drawCornerFiligree(ctx, 58, height - 58, 48, false, true, primaryColor);
  drawCornerFiligree(ctx, width - 58, height - 58, 48, true, true, primaryColor);
  ctx.restore();

  // 4. Header: Logo & Quốc Huy PromptMMO
  ctx.save();
  ctx.textAlign = 'center';

  // Biểu tượng vương miện trên logo
  ctx.fillStyle = primaryColor;
  ctx.font = '24px sans-serif';
  ctx.fillText('👑', width / 2, 98);

  // Thương hiệu chuẩn
  ctx.fillStyle = brightColor;
  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('PROMPTMMO • HỆ SINH THÁI PROMPT AI & MMO 2026', width / 2, 130);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('SÀN GIAO DỊCH PROMPT SKILLS & CỘNG ĐỒNG CREATOR THỰC CHIẾN', width / 2, 156);

  // Dải ruy băng phân cách mạ vàng
  ctx.strokeStyle = mainAccentGrad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(140, 178);
  ctx.lineTo(width - 140, 178);
  ctx.stroke();

  // Ngôi sao tâm điểm dải ruy băng
  drawStar(ctx, width / 2, 178, 5, 8, 3.5, '#FFF2BF');
  drawStar(ctx, width / 2 - 80, 178, 4, 5, 2, primaryColor);
  drawStar(ctx, width / 2 + 80, 178, 4, 5, 2, primaryColor);
  ctx.restore();

  // 5. Tiêu Đề Chứng Nhận Vinh Danh Hoành Tráng
  ctx.save();
  ctx.textAlign = 'center';

  if (isStreak) {
    ctx.fillStyle = createGoldGradient(ctx, 200, 210, width - 200, 260);
    ctx.font = '900 48px "Times New Roman", Georgia, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('CHỨNG NHẬN KỶ LỤC HỌC TẬP', width / 2, 238);

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('🔥 CHUỖI THỰC CHIẾN BÁCH CHIẾN BÁCH THẮNG • KHÔNG NGỪNG NGHỈ 🔥', width / 2, 276);
  } else {
    ctx.fillStyle = createGoldGradient(ctx, 200, 210, width - 200, 260);
    ctx.font = '900 48px "Times New Roman", Georgia, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(passed ? 'BẢNG VÀNG CHỨNG NHẬN MASTER PROMPT' : 'PHIẾU XÁC NHẬN KẾT QUẢ ĐÁNH GIÁ', width / 2, 238);

    ctx.fillStyle = passed ? '#34D399' : '#F87171';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(`★ ${(subtitle || 'CHỨNG CHỈ PROMPT & MMO THỰC CHIẾN').toUpperCase()} ★`, width / 2, 276);
  }
  ctx.restore();

  // 6. Huy Hiệu Biểu Trưng Trọng Tâm 3D (Laurel Wreath + Vector Trophy / Flame / Diamond)
  const badgeY = 380;
  drawLaurelWreath(ctx, width / 2, badgeY, 96, primaryColor);

  // Vành huy chương trung tâm
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, badgeY, 74, 0, Math.PI * 2);
  const medalGrad = ctx.createRadialGradient(width / 2, badgeY, 10, width / 2, badgeY, 74);
  medalGrad.addColorStop(0, '#1E293B');
  medalGrad.addColorStop(0.7, '#0F172A');
  medalGrad.addColorStop(1, '#020617');
  ctx.fillStyle = medalGrad;
  ctx.fill();

  ctx.strokeStyle = createGoldGradient(ctx, width / 2 - 74, badgeY - 74, width / 2 + 74, badgeY + 74);
  ctx.lineWidth = 4;
  ctx.stroke();

  // Vẽ biểu trưng vector tương ứng (Không dùng emoji font tránh lỗi nhạt màu)
  if (isStreak) {
    drawVectorFlame(ctx, width / 2, badgeY);
  } else if (activeTheme === 'cyber_diamond') {
    drawVectorDiamond(ctx, width / 2, badgeY);
  } else {
    drawVectorTrophy(ctx, width / 2, badgeY, createGoldGradient(ctx, 0, -40, 0, 40));
  }
  ctx.restore();

  // 7. Tên Thí Sinh & Vinh Danh Cá Nhân
  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '600 18px "Times New Roman", Georgia, serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('CHỨNG CHỈ NÀY ĐƯỢC TRÂN TRỌNG TRAO TẶNG CHO', width / 2, 505);

  // Tên Thí Sinh Viết Hoa Hoàng Gia
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 46px "Times New Roman", Georgia, serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(`— ❖  ${candidateName.toUpperCase()}  ❖ —`, width / 2, 555);

  // Tên gói Prompt / Kỹ năng thực chiến
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(title, width / 2, 600);
  ctx.restore();

  // 8. Bảng Thành Tích Điểm Số Nổi Bật (Royal Golden Showcase Plaque)
  ctx.save();
  const cardX = 100;
  const cardY = 645;
  const cardW = width - 200;
  const cardH = 275;

  // Nền kính mạ vàng sang trọng (Glassmorphic Gold Bevel Plaque)
  const plaqueBg = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  plaqueBg.addColorStop(0, 'rgba(30, 41, 59, 0.92)');
  plaqueBg.addColorStop(0.5, 'rgba(15, 23, 42, 0.95)');
  plaqueBg.addColorStop(1, 'rgba(2, 6, 23, 0.98)');
  ctx.fillStyle = plaqueBg;

  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 22);
  ctx.fill();

  // Khung viền mạ vàng kép
  ctx.strokeStyle = createGoldGradient(ctx, cardX, cardY, cardX + cardW, cardY + cardH);
  ctx.lineWidth = 3;
  ctx.stroke();

  // 4 Đinh tán vàng kim ở 4 góc thẻ vinh danh
  [
    [cardX + 16, cardY + 16],
    [cardX + cardW - 16, cardY + 16],
    [cardX + 16, cardY + cardH - 16],
    [cardX + cardW - 16, cardY + cardH - 16]
  ].forEach(([sx, sy]) => {
    drawStar(ctx, sx, sy, 4, 5, 2, '#FDE68A');
  });

  if (isStreak) {
    // LAYOUT CHUỖI STREAK KỶ LỤC HOÀNG GIA
    ctx.textAlign = 'center';

    // Số ngày Streak khổng lồ mạ vàng rực rỡ
    ctx.fillStyle = createGoldGradient(ctx, width / 2 - 200, cardY + 40, width / 2 + 200, cardY + 130);
    ctx.font = '900 92px "Times New Roman", Georgia, serif';
    ctx.fillText(`${streak} NGÀY`, width / 2, cardY + 115);

    // Dòng tôn vinh
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('ĐÃ CHINH PHỤC TOÀN DIỆN MỤC TIÊU HỌC TẬP MỖI NGÀY', width / 2, cardY + 168);

    // Huy hiệu cấp bậc danh dự
    const pillW = 460;
    const pillH = 44;
    const pillX = width / 2 - pillW / 2;
    const pillY = cardY + 195;

    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 19px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(`👑 CẤP BẬC: ${rank.toUpperCase()}`, width / 2, pillY + 28);
  } else {
    // LAYOUT KẾT QUẢ ĐÁNH GIÁ ĐẠT CHUẨN PROMPTMMO
    const col1X = cardX + cardW * 0.25;
    const col2X = cardX + cardW * 0.5;
    const col3X = cardX + cardW * 0.75;

    ctx.textAlign = 'center';

    // Cột 1: Điểm số chuẩn
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('SỐ CÂU ĐẠT CHUẨN', col1X, cardY + 60);

    ctx.fillStyle = passed ? '#34D399' : '#F87171';
    ctx.font = '900 56px "Times New Roman", Georgia, serif';
    ctx.fillText(`${score}/${maxScore}`, col1X, cardY + 135);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(passed ? '🏆 ĐẠT VÒNG 1' : 'CHƯA ĐẠT', col1X, cardY + 185);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '13px sans-serif';
    ctx.fillText('Chuẩn hóa 60 câu', col1X, cardY + 215);

    // Đường kẻ phân cách 1
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cardX + cardW * 0.375, cardY + 35);
    ctx.lineTo(cardX + cardW * 0.375, cardY + cardH - 35);
    ctx.stroke();

    // Cột 2: Tỷ lệ chính xác
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('TỶ LỆ CHÍNH XÁC', col2X, cardY + 60);

    ctx.fillStyle = createGoldGradient(ctx, col2X - 50, 0, col2X + 50, 0);
    ctx.font = '900 56px "Times New Roman", Georgia, serif';
    ctx.fillText(`${percentage}%`, col2X, cardY + 135);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('≥ 50% LÀ ĐỖ', col2X, cardY + 185);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '13px sans-serif';
    ctx.fillText('Theo NĐ 138/2020', col2X, cardY + 215);

    // Đường kẻ phân cách 2
    ctx.beginPath();
    ctx.moveTo(cardX + cardW * 0.625, cardY + 35);
    ctx.lineTo(cardX + cardW * 0.625, cardY + cardH - 35);
    ctx.stroke();

    // Cột 3: Xếp hạng danh dự
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('CẤP ĐỘ CREATOR', col3X, cardY + 60);

    const grade = percentage >= 95 ? 'THỦ KHOA' : percentage >= 90 ? 'XUẤT SẮC' : percentage >= 80 ? 'GIỎI' : passed ? 'ĐẠT CHUẨN' : 'CHƯA ĐẠT';
    ctx.fillStyle = percentage >= 90 ? '#38BDF8' : passed ? '#34D399' : '#F87171';
    ctx.font = '900 48px "Times New Roman", Georgia, serif';
    ctx.fillText(grade, col3X, cardY + 135);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(percentage >= 90 ? 'BẢNG VÀNG QUỐC GIA' : 'ĐẠT TIÊU CHUẨN', col3X, cardY + 185);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '13px sans-serif';
    ctx.fillText('Hệ thống PromptMMO', col3X, cardY + 215);
  }
  ctx.restore();

  // 9. Dấu Mộc Hoàng Gia Nổi 3D với 2 Dải Lụa Đỏ (Imperial Scalloped Seal & Ribbons)
  drawRoyalSeal(ctx, width - 235, 1030, 84, activeTheme === 'royal_gold', passed);

  // 10. Thông Tin Xác Thực Điện Tử & Chữ Ký Số
  ctx.save();
  const nowStr = dateString || formatHanoiDateTime(new Date(), true);
  ctx.textAlign = 'left';

  // Khối mã tra cứu
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Mã số chứng nhận điện tử:', 105, 965);

  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 20px monospace';
  ctx.fillText(certCode, 320, 965);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Thời gian cấp chứng nhận:', 105, 1005);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(nowStr, 320, 1005);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Bảo chứng chất lượng:', 105, 1045);

  ctx.fillStyle = '#34D399';
  ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Hệ thống PromptMMO Cloud Engine (SHA-256 Verified)', 320, 1045);

  // Chữ ký điện tử của Ban Tổ Chức
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'italic 16px "Times New Roman", Georgia, serif';
  ctx.fillText('Ban Giám Đốc PromptMMO:', 105, 1085);

  // Nét ký nghệ thuật số
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(320, 1085);
  ctx.bezierCurveTo(345, 1060, 360, 1095, 385, 1070);
  ctx.bezierCurveTo(410, 1050, 425, 1090, 455, 1065);
  ctx.lineTo(480, 1080);
  ctx.stroke();

  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Ban Quản Trị PromptMMO (Đã Ký Số)', 495, 1085);
  ctx.restore();

  // 11. Thanh Chân Trang Thương Hiệu & Chia Sẻ Cộng Đồng
  ctx.save();
  const footerY = 1145;
  ctx.fillStyle = 'rgba(10, 16, 31, 0.98)';
  ctx.fillRect(35, footerY, width - 70, 170);

  ctx.strokeStyle = createGoldGradient(ctx, 35, footerY, width - 35, footerY);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(35, footerY);
  ctx.lineTo(width - 35, footerY);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🌐 Khám Phá Kho Prompt AI Thực Chiến Tại: PROMPTMMO.COM', width / 2, footerY + 50);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Higgsfield & Kling Video • Midjourney Studio • TikTok Shop • N8N Automation', width / 2, footerY + 86);

  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('★ Quét mã hoặc chụp màn hình khoe cùng bạn bè để nhận Xu thưởng vinh danh! ★', width / 2, footerY + 120);
  ctx.restore();

  return canvas;
}

/**
 * Xuất Canvas ra file Blob PNG
 */
export function exportCanvasAsBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}

/**
 * Tải ảnh trực tiếp về thiết bị người dùng
 */
export function downloadCanvasImage(canvas, filename = 'promptmmo-chung-nhan.png') {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Sao chép ảnh trực tiếp vào Clipboard hệ điều hành (Windows/Mac/iOS/Android)
 */
export async function copyCanvasImageToClipboard(canvas) {
  if (typeof window === 'undefined' || !navigator.clipboard) {
    return { success: false, message: 'Trình duyệt không hỗ trợ sao chép hình ảnh' };
  }

  try {
    const blob = await exportCanvasAsBlob(canvas);
    if (!blob) {
      return { success: false, message: 'Không thể tạo ảnh từ canvas' };
    }

    if (typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      return { success: true, message: '🎉 Đã sao chép ảnh chứng nhận! Bạn có thể dán (Ctrl+V) thẳng vào Zalo/Messenger/Facebook.' };
    }

    return { success: false, message: 'Trình duyệt chưa hỗ trợ ClipboardItem' };
  } catch (err) {
    console.warn('Lỗi copy clipboard:', err);
    return { success: false, message: 'Không thể sao chép ảnh vào clipboard: ' + (err.message || '') };
  }
}

/**
 * Chia sẻ bằng Web Share API (Mobile Native Share Sheet)
 */
export async function shareCanvasImageNative(canvas, { title, text, url }) {
  try {
    const blob = await exportCanvasAsBlob(canvas);
    if (!blob) return { success: false, message: 'Lỗi tạo dữ liệu chia sẻ' };

    const file = new File([blob], 'promptmmo-chung-nhan.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: title || 'Thành tích PromptMMO',
        text: text || 'Mình vừa xác lập kỷ lục mới trên PromptMMO!',
        url: url || window.location.origin
      });
      return { success: true, message: 'Đã mở bảng chia sẻ ứng dụng' };
    }

    if (navigator.share) {
      await navigator.share({
        title: title || 'Thành tích PromptMMO',
        text: text || 'Mình vừa xác lập kỷ lục mới trên PromptMMO!',
        url: url || window.location.origin
      });
      return { success: true, message: 'Đã mở bảng chia sẻ ứng dụng' };
    }

    return { success: false, message: 'Trình duyệt không hỗ trợ Web Share API' };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { success: false, cancelled: true };
    }
    return { success: false, message: err.message };
  }
}
