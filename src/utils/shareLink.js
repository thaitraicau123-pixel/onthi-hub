// =========================================================================
// PROMPTMMO PROMPT SHARE LINK & URL ROUTING ENGINE
// Hỗ trợ tạo đường dẫn chia sẻ gói Prompt trực tiếp, chia sẻ từng câu prompt,
// và tự động mở modal xem prompt khi truy cập bằng link ?deck=...
// =========================================================================

/**
 * Tạo URL chia sẻ trực tiếp tới một gói Prompt hoặc một prompt cụ thể
 * @param {string} deckId - Mã định danh gói Prompt
 * @param {number|null} [cardIndex=null] - Thứ tự prompt tùy chọn (bắt đầu từ 0)
 * @returns {string} URL hoàn chỉnh có thể chia sẻ
 */
export function getFlashcardShareUrl(deckId, cardIndex = null) {
  if (!deckId) return '';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://onthi-hub.vercel.app';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  
  const params = new URLSearchParams();
  params.set('deck', String(deckId));
  if (cardIndex !== null && cardIndex !== undefined && !isNaN(cardIndex) && Number(cardIndex) >= 0) {
    params.set('card', String(Number(cardIndex) + 1)); // 1-based index cho người dùng dễ đọc
  }
  
  return `${origin}${pathname}?${params.toString()}`;
}

/**
 * Sao chép đường dẫn gói Prompt vào bộ nhớ tạm (Clipboard)
 * Hỗ trợ Web Share API trên di động (Zalo, Messenger, Telegram)
 * @param {Object} options
 * @param {string} options.deckId - ID gói Prompt
 * @param {string} [options.deckTitle] - Tên gói Prompt
 * @param {number|null} [options.cardIndex] - Vị trí prompt
 * @param {boolean} [options.useNativeShare=false] - Sử dụng hộp thoại chia sẻ di động nếu khả dụng
 * @returns {Promise<{success: boolean, url: string, message: string}>}
 */
export async function copyFlashcardShareLink({
  deckId,
  deckTitle = 'Gói Prompt MMO Thực Chiến',
  cardIndex = null,
  useNativeShare = false
}) {
  const url = getFlashcardShareUrl(deckId, cardIndex);
  if (!url) {
    return { success: false, url: '', message: 'Mã gói prompt không hợp lệ' };
  }

  // 1. Thử dùng Web Share API nếu trên mobile và người dùng yêu cầu
  if (useNativeShare && typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `PromptMMO • ${deckTitle}`,
        text: `Khám phá & sao chép gói Prompt "${deckTitle}" trên PromptMMO:`,
        url
      });
      return { success: true, url, message: 'Đã mở hộp thoại chia sẻ' };
    } catch (err) {
      // Nếu người dùng hủy hộp thoại share thì không báo lỗi
      if (err && err.name === 'AbortError') {
        return { success: true, url, message: 'Đã đóng hộp thoại chia sẻ' };
      }
    }
  }

  // 2. Sao chép vào Clipboard tiêu chuẩn
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      // Fallback cho trình duyệt cũ
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    return {
      success: true,
      url,
      message: cardIndex !== null && cardIndex !== undefined
        ? `Đã sao chép liên kết Thẻ #${Number(cardIndex) + 1} vào bộ nhớ tạm!`
        : `Đã sao chép liên kết gói Prompt "${deckTitle}" vào bộ nhớ tạm!`
    };
  } catch (err) {
    console.error('Không thể sao chép liên kết:', err);
    return {
      success: false,
      url,
      message: 'Không thể tự động sao chép. Vui lòng sao chép liên kết thủ công.'
    };
  }
}

/**
 * Đọc tham số từ URL hiện tại khi tải trang hoặc khi URL thay đổi
 * @returns {{deckId: string|null, cardIndex: number|null, tab: string|null, chatWith: string|null}}
 */
export function parseUrlParameters() {
  if (typeof window === 'undefined') {
    return { deckId: null, cardIndex: null, tab: null, chatWith: null };
  }

  try {
    const searchParams = new URLSearchParams(window.location.search);
    let hashParams = new URLSearchParams();
    if (window.location.hash) {
      const qIndex = window.location.hash.indexOf('?');
      if (qIndex !== -1) {
        hashParams = new URLSearchParams(window.location.hash.substring(qIndex + 1));
      } else if (window.location.hash.includes('=')) {
        hashParams = new URLSearchParams(window.location.hash.replace(/^#\/?/, ''));
      }
    }

    const deckId =
      searchParams.get('deck') ||
      searchParams.get('flashcard') ||
      searchParams.get('deckId') ||
      hashParams.get('deck') ||
      hashParams.get('flashcard') ||
      hashParams.get('deckId') ||
      null;

    const rawCard = searchParams.get('card') || hashParams.get('card');
    let cardIndex = null;
    if (rawCard && !isNaN(Number(rawCard))) {
      cardIndex = Math.max(0, Number(rawCard) - 1); // Đổi 1-based về 0-based
    }

    const tab = searchParams.get('tab') || hashParams.get('tab') || null;
    const chatWith =
      searchParams.get('chat') ||
      searchParams.get('chatWith') ||
      hashParams.get('chat') ||
      hashParams.get('chatWith') ||
      null;

    return { deckId, cardIndex, tab, chatWith };
  } catch (_e) {
    return { deckId: null, cardIndex: null, tab: null, chatWith: null };
  }
}

/**
 * Cập nhật thanh địa chỉ trình duyệt với ID gói Prompt và vị trí prompt hiện tại
 * (sử dụng replaceState để không làm tải lại trang hoặc làm bẩn history)
 * @param {string|null} deckId
 * @param {number|null} cardIndex
 */
export function syncUrlWithDeck(deckId, cardIndex = null) {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (deckId) {
      url.searchParams.set('deck', String(deckId));
      if (cardIndex !== null && cardIndex !== undefined && !isNaN(cardIndex) && Number(cardIndex) >= 0) {
        url.searchParams.set('card', String(Number(cardIndex) + 1));
      } else {
        url.searchParams.delete('card');
      }
    } else {
      url.searchParams.delete('deck');
      url.searchParams.delete('flashcard');
      url.searchParams.delete('deckId');
      url.searchParams.delete('card');
    }
    window.history.replaceState({}, '', url.toString());
  } catch (_e) {}
}

/**
 * Xóa các tham số gói Prompt khỏi URL khi đóng modal
 */
export function clearUrlDeckParams() {
  syncUrlWithDeck(null, null);
}
