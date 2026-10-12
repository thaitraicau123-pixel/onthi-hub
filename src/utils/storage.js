// LocalStorage keys
const PURCHASED_KEY = 'onthi_purchased_items';
const USER_EMAIL_KEY = 'onthi_user_email';
const BANK_CONFIG_KEY = 'onthi_bank_config';

// Default receiving bank settings
const DEFAULT_BANK_CONFIG = {
  bank: 'MB', // Mã VietQR: MB, VCB, TCB, VPB, TPB, ACB, ICB (VietinBank), BIDV
  bankName: 'MB Bank (Ngân Hàng Quân Đội)',
  accountNo: '0388999888',
  accountName: 'HOANG MINH DUC'
};

// Get current bank settings
export function getBankConfig() {
  try {
    const raw = localStorage.getItem(BANK_CONFIG_KEY);
    return raw ? { ...DEFAULT_BANK_CONFIG, ...JSON.parse(raw) } : DEFAULT_BANK_CONFIG;
  } catch (e) {
    return DEFAULT_BANK_CONFIG;
  }
}

// Save bank settings
export function saveBankConfig(config) {
  try {
    localStorage.setItem(BANK_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save bank config', e);
  }
}

// Get list of purchased course IDs
export function getPurchasedCourses() {
  try {
    const raw = localStorage.getItem(PURCHASED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to get purchased items', e);
    return [];
  }
}

// Check if user owns a course
export function isCoursePurchased(courseId) {
  const purchased = getPurchasedCourses();
  if (purchased.includes('combo-all-access')) return true;
  return purchased.includes(courseId);
}

// Save purchased course ID
export function savePurchasedCourse(courseId, email = '') {
  try {
    const current = getPurchasedCourses();
    if (!current.includes(courseId)) {
      current.push(courseId);
      localStorage.setItem(PURCHASED_KEY, JSON.stringify(current));
    }
    if (email) {
      localStorage.setItem(USER_EMAIL_KEY, email);
    }
  } catch (e) {
    console.error('Failed to save purchased course', e);
  }
}

// Get saved user email
export function getSavedEmail() {
  return localStorage.getItem(USER_EMAIL_KEY) || '';
}

// Generate VietQR payment URL
export function generateVietQRUrl({ bank = 'MB', accountNo = '0388999888', accountName = 'HOANG MINH DUC', amount = 69000, memo = 'ONTHI123' }) {
  const encodedName = encodeURIComponent(accountName);
  const encodedMemo = encodeURIComponent(memo);
  return `https://img.vietqr.io/image/${bank}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodedMemo}&accountName=${encodedName}`;
}

// Validate discount code
export function validateCoupon(code, currentAmount) {
  const upper = code.trim().toUpperCase();
  if (upper === 'KHAITRUONG') {
    return { valid: true, discount: 20000, message: 'Áp dụng mã KHAITRUONG: Giảm ngay 20.000đ!' };
  }
  if (upper === 'VIP2026') {
    const disc = Math.round(currentAmount * 0.2);
    return { valid: true, discount: disc, message: 'Áp dụng mã VIP2026: Giảm 20% tổng đơn!' };
  }
  if (upper === 'PASSNHANH') {
    return { valid: true, discount: 15000, message: 'Áp dụng mã PASSNHANH: Giảm 15.000đ!' };
  }
  return { valid: false, discount: 0, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
}

// Export Flashcards as Anki compatible tab-delimited text file (with UTF-8 BOM)
export function exportAnkiDeckFile(courseTitle, cards = []) {
  // UTF-8 BOM \uFEFF ensures Vietnamese diacritics render perfectly
  let content = '\uFEFF#separator:tab\n#html:true\n#tags column:3\n';
  cards.forEach((card) => {
    const front = (card.front || '').replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const back = (card.back || '').replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const tag = (card.tag || 'OnThiHub').replace(/\s+/g, '_');
    content += `${front}\t${back}\t${tag}\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = courseTitle.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_');
  link.href = url;
  link.download = `AnkiDeck_${safeName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export Summary as Printable PDF/HTML view
export function printSummaryGuide(course) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const cardsHtml = (course.previewCards || []).map((c, i) => `
    <div style="margin-bottom: 20px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; page-break-inside: avoid;">
      <div style="font-size: 13px; font-weight: bold; color: #4f46e5; margin-bottom: 6px;">CÂU ${i + 1} • [${c.tag || 'Kiến thức trọng tâm'}]</div>
      <div style="font-weight: 600; font-size: 16px; color: #0f172a; margin-bottom: 8px;">${c.front}</div>
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 14px; color: #334155; white-space: pre-line;">${c.back}</div>
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${course.title} - Tóm Tắt Ôn Tập</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; padding: 30px; color: #1e293b; }
          h1 { color: #1e1b4b; font-size: 22px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
          .header-meta { color: #64748b; font-size: 14px; margin-bottom: 24px; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1>ÔnThiHub | ${course.title}</h1>
          <button onclick="window.print()" style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">In hoặc Lưu PDF</button>
        </div>
        <div class="header-meta">Biên soạn bởi Ban Học Thuật ÔnThiHub • Định dạng tóm tắt ghi nhớ nhanh • Cập nhật: ${course.updatedAt || '2026'}</div>
        <div>${cardsHtml}</div>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Mute Sound Toggle
const MUTE_KEY = 'onthi_sound_muted';

export function isSoundMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function toggleSoundMute() {
  const current = isSoundMuted();
  localStorage.setItem(MUTE_KEY, (!current).toString());
  return !current;
}

// Export Flashcards as Printable Cut-out Sheet (In thẻ giấy A4 cắt rời)
export function printFlashcardCutoutSheet(course) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const cardsHtml = (course.previewCards || []).map((c, i) => `
    <div style="border: 2px dashed #94a3b8; border-radius: 12px; padding: 14px; margin-bottom: 12px; page-break-inside: avoid; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; background: #fff;">
      <div style="font-size: 11px; font-weight: bold; color: #6366f1; text-transform: uppercase;">Thẻ #${i + 1} • ${c.tag || 'Kiến thức cốt lõi'}</div>
      <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin: 8px 0;">${c.front}</div>
      <div style="border-top: 1px dotted #cbd5e1; padding-top: 8px; font-size: 12px; color: #475569; white-space: pre-line;">${c.back}</div>
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${course.title} - Thẻ Giấy In A4</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #0f172a; }
          h2 { font-size: 18px; color: #1e1b4b; border-bottom: 2px solid #6366f1; padding-bottom: 6px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h2>ÔnThiHub | Bảng In Thẻ Cắt Giấy A4: ${course.title}</h2>
          <button onclick="window.print()" style="padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Bấm In Ngay</button>
        </div>
        <p style="font-size: 11px; color: #64748b; margin-bottom: 16px;">💡 Mẹo: In ra giấy và cắt theo đường nét đứt để có ngay bộ Flashcard cầm tay học mọi lúc mọi nơi!</p>
        <div class="grid">${cardsHtml}</div>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Synthetic Sound Effects via Web Audio API (Zero dependencies)
export function playSound(type = 'click') {
  if (isSoundMuted()) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'flip') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } else if (type === 'correct') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // Audio might be blocked by browser autoplay policy until user gesture
  }
}
