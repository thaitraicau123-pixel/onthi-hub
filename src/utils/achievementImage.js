// =========================================================================
// ONTHIHUB ACHIEVEMENT CARD & CERTIFICATE CANVAS GENERATOR
// Tạo ảnh chứng nhận và thẻ thành tích đồ họa chất lượng cao (1080x1350)
// Hỗ trợ Tải ảnh PNG, Sao chép trực tiếp vào Clipboard và Chia sẻ lên Story/MXH
// =========================================================================

import { formatHanoiDateTime } from './hanoiTime';

/**
 * Tạo canvas đồ họa chứng nhận thành tích chuẩn Retina 2x (1080 x 1350 px)
 * Phù hợp hoàn hảo cho Facebook Post, Instagram Story, Zalo và tin nhắn
 */
export async function generateAchievementCanvas({
  type = 'exam_passed', // 'exam_passed' | 'streak' | 'rank_up' | 'quiz_completed'
  title = 'Kỳ Thi Sát Hạch Kiến Thức Chung 2026',
  subtitle = 'Nghị định 138/2020/NĐ-CP • Vòng 1',
  score = 56,
  maxScore = 60,
  percentage = 93,
  passed = true,
  streak = 15,
  rank = 'Top 10 Toàn Quốc',
  candidateName = 'Học Viên Xuất Sắc',
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

  // 1. Nền tối hiện đại Notion / Slate phong cách sang trọng
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Vầng hào quang phát sáng (Atmospheric Glow)
  const glowGrad = ctx.createRadialGradient(width / 2, 340, 50, width / 2, 340, 500);
  if (passed) {
    glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)'); // Emerald glow
    glowGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.18)');
    glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  } else {
    glowGrad.addColorStop(0, 'rgba(239, 68, 68, 0.35)'); // Rose glow
    glowGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.18)');
    glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  }
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Khung viền tinh tế bo góc kép
  ctx.save();
  ctx.strokeStyle = passed ? 'rgba(52, 211, 153, 0.35)' : 'rgba(248, 113, 113, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(55, 55, width - 110, height - 110);
  ctx.restore();

  // 4. Header: Logo & Thương hiệu ÔnThiHub
  ctx.save();
  ctx.fillStyle = '#38bdf8'; // Sky blue
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText('⚡ ONTHIHUB • NỀN TẢNG ÔN THI THÔNG MINH 2026', width / 2, 110);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('HỆ THỐNG KHẢO THÍ & BỘ THẺ FLASHCARD ANKI SM-2', width / 2, 140);
  ctx.restore();

  // 5. Đường kẻ phân cách vàng kim
  const lineGrad = ctx.createLinearGradient(160, 0, width - 160, 0);
  lineGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
  lineGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.85)');
  lineGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(160, 170);
  ctx.lineTo(width - 160, 170);
  ctx.stroke();

  // 6. Tiêu đề Chứng Nhận / Thành Tích
  ctx.save();
  ctx.textAlign = 'center';

  if (type === 'streak') {
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('CHỨNG NHẬN KỶ LỤC HỌC TẬP', width / 2, 235);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('🔥 CHUỖI ÔN THI LIÊN TỤC KHÔNG NGỪNG NGHỈ', width / 2, 275);
  } else {
    ctx.fillStyle = passed ? '#34d399' : '#f87171';
    ctx.font = '900 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(passed ? 'GIẤY CHỨNG NHẬN ĐẠT CHUẨN' : 'PHIẾU BÁO KẾT QUẢ KHẢO THÍ', width / 2, 235);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(subtitle.toUpperCase(), width / 2, 275);
  }
  ctx.restore();

  // 7. Huy Hiệu Trọng Tâm (Biểu tượng Cup / Lửa)
  ctx.save();
  const iconY = 370;
  ctx.beginPath();
  ctx.arc(width / 2, iconY, 68, 0, Math.PI * 2);
  ctx.fillStyle = passed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = passed ? '#10b981' : '#ef4444';
  ctx.stroke();

  ctx.font = '72px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(type === 'streak' ? '🔥' : passed ? '🏆' : '🎯', width / 2, iconY + 5);
  ctx.restore();

  // 8. Tên Thí Sinh & Môn Thi
  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('CHỨNG NHẬN TRAO CHO THÍ SINH', width / 2, 480);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(candidateName.toUpperCase(), width / 2, 530);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(title, width / 2, 575);
  ctx.restore();

  // 9. Bảng Điểm Số / Thành Tích (Card Nổi Lớn)
  ctx.save();
  const cardX = 110;
  const cardY = 625;
  const cardW = width - 220;
  const cardH = 260;

  // Background card
  ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.stroke();

  if (type === 'streak') {
    // Streak Layout
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 84px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${streak} NGÀY`, width / 2, cardY + 115);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('ĐÃ HOÀN THÀNH MỤC TIÊU HỌC TẬP MỖI NGÀY', width / 2, cardY + 165);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Xếp hạng hiện tại: ' + rank, width / 2, cardY + 205);
  } else {
    // Exam Score Layout
    const col1X = cardX + cardW * 0.25;
    const col2X = cardX + cardW * 0.5;
    const col3X = cardX + cardW * 0.75;

    ctx.textAlign = 'center';

    // Col 1: Điểm đúng
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SỐ CÂU ĐÚNG', col1X, cardY + 60);

    ctx.fillStyle = passed ? '#34d399' : '#f87171';
    ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${score}/${maxScore}`, col1X, cardY + 130);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(passed ? 'ĐẠT VÒNG 1' : 'CHƯA ĐẠT', col1X, cardY + 175);

    // Separator line 1
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(cardX + cardW * 0.375, cardY + 40);
    ctx.lineTo(cardX + cardW * 0.375, cardY + cardH - 40);
    ctx.stroke();

    // Col 2: Tỷ lệ
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('TỶ LỆ CHÍNH XÁC', col2X, cardY + 60);

    ctx.fillStyle = '#a855f7';
    ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${percentage}%`, col2X, cardY + 130);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('≥ 50% là ĐỖ', col2X, cardY + 175);

    // Separator line 2
    ctx.beginPath();
    ctx.moveTo(cardX + cardW * 0.625, cardY + 40);
    ctx.lineTo(cardX + cardW * 0.625, cardY + cardH - 40);
    ctx.stroke();

    // Col 3: Xếp loại
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('XẾP LOẠI', col3X, cardY + 60);

    ctx.fillStyle = percentage >= 90 ? '#38bdf8' : percentage >= 75 ? '#34d399' : passed ? '#f59e0b' : '#f87171';
    ctx.font = '900 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const grade = percentage >= 90 ? 'XUẤT SẮC' : percentage >= 75 ? 'GIỎI' : passed ? 'ĐẠT' : 'CHƯA ĐẠT';
    ctx.fillText(grade, col3X, cardY + 130);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('THEO NĐ 138', col3X, cardY + 175);
  }
  ctx.restore();

  // 10. Dấu Mộc Đỏ Khảo Thí (Official Red Stamp Seal)
  ctx.save();
  const stampX = width - 240;
  const stampY = 990;
  ctx.translate(stampX, stampY);
  ctx.rotate((12 * Math.PI) / 180);

  // Outer red circle
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, 68, 0, Math.PI * 2);
  ctx.stroke();

  // Inner dashed circle
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Stamp text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ef4444';
  ctx.font = '900 13px sans-serif';
  ctx.fillText('HỆ THỐNG KHẢO THÍ', 0, -32);

  ctx.font = '900 24px sans-serif';
  ctx.fillText(passed ? 'ĐÃ ĐẠT' : 'ĐÃ THI', 0, -4);

  ctx.font = '900 12px sans-serif';
  ctx.fillText('★ ONTHIHUB 2026 ★', 0, 24);
  ctx.restore();

  // 11. Thông tin xác thực & Mã tra cứu
  ctx.save();
  const nowStr = dateString || formatHanoiDateTime(new Date(), true);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Mã tra cứu điện tử: `, 110, 960);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(certCode, 270, 960);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Thời gian xác thực: `, 110, 995);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(nowStr, 270, 995);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Bảo chứng khảo thí: `, 110, 1030);

  ctx.fillStyle = '#34d399';
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Hệ thống OnThiHub Realtime Engine`, 270, 1030);
  ctx.restore();

  // 12. Bottom Footer Brand Bar
  ctx.save();
  const footerY = 1140;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fillRect(40, footerY, width - 80, 170);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, footerY);
  ctx.lineTo(width - 40, footerY);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('🌐 Truy cập luyện thi miễn phí tại: onthihub.vn', width / 2, footerY + 50);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Kho đề chuẩn hóa Công chức 2026 • IT System Design • Ngoại ngữ IELTS/TOEIC/JLPT', width / 2, footerY + 85);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Quét mã hoặc chụp màn hình chia sẻ cùng bạn học để nhận thêm Xu thưởng!', width / 2, footerY + 115);
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
export function downloadCanvasImage(canvas, filename = 'onthihub-thanh-tich.png') {
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
 * Người dùng có thể nhấn Ctrl+V / Command+V dán thẳng vào Facebook / Messenger / Zalo
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

    const file = new File([blob], 'onthihub-thanh-tich.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: title || 'Thành tích ÔnThiHub',
        text: text || 'Mình vừa hoàn thành xuất sắc kỳ thi thử trên ÔnThiHub!',
        url: url || window.location.origin
      });
      return { success: true, message: 'Đã mở bảng chia sẻ ứng dụng' };
    }

    if (navigator.share) {
      await navigator.share({
        title: title || 'Thành tích ÔnThiHub',
        text: text || 'Mình vừa hoàn thành xuất sắc kỳ thi thử trên ÔnThiHub!',
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
