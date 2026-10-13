// SuperMemo SM-2 Spaced Repetition System (SRS) for OnThiHub
// Calculates optimal review intervals based on forgetting curve & retention ratings

const SRS_STORAGE_KEY = 'onthi_srs_cards_v1';

/**
 * Get all stored SRS card records
 */
export function getAllSrsData() {
  try {
    const raw = localStorage.getItem(SRS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load SRS data', e);
    return {};
  }
}

/**
 * Generate unique key for a card in a deck
 */
export function getCardSrsKey(deckId, cardIndex) {
  return `${deckId}_card_${cardIndex}`;
}

/**
 * Get SRS state of a single card
 */
export function getCardSrs(deckId, cardIndex) {
  const all = getAllSrsData();
  const key = getCardSrsKey(deckId, cardIndex);
  return all[key] || {
    deckId,
    cardIndex,
    reps: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    dueDate: 0, // 0 means new/unlearned
    lastReviewed: 0,
    totalReviews: 0,
    history: []
  };
}

/**
 * Format interval into human readable badge
 */
export function formatIntervalText(intervalDays) {
  if (!intervalDays || intervalDays <= 0) return 'Mới';
  if (intervalDays < 0.05) return '10m';
  if (intervalDays < 1) return `${Math.round(intervalDays * 24)}h`;
  if (intervalDays === 1) return '1d';
  if (intervalDays < 30) return `${Math.round(intervalDays)}d`;
  if (intervalDays < 365) return `${Math.round(intervalDays / 30)} tháng`;
  return `${Math.round(intervalDays / 365)} năm`;
}

/**
 * Calculate next SM-2 interval given current state & rating
 * @param {Object} current - current SRS state
 * @param {string} rating - 'again' | 'hard' | 'good' | 'easy'
 */
export function calculateNextSrs(current, rating) {
  const now = Date.now();
  let reps = current.reps || 0;
  let ef = current.easeFactor || 2.5;
  let interval = current.intervalDays || 0;
  let nextIntervalDays = 1;

  if (rating === 'again') {
    // Quên / Cần lặp lại ngay: Reset reps, review lại sau 10 phút
    reps = 0;
    ef = Math.max(1.3, ef - 0.2);
    nextIntervalDays = 10 / (24 * 60); // 10 minutes in days (~0.0069)
  } else if (rating === 'hard') {
    // Khó nhớ: Tăng nhẹ khoảng cách, giảm nhẹ EF
    reps = reps + 1;
    ef = Math.max(1.3, ef - 0.15);
    nextIntervalDays = Math.max(1, Math.round((interval || 1) * 1.2));
  } else if (rating === 'good') {
    // Nhớ tốt: Tiến độ chuẩn SM-2
    if (reps === 0) {
      nextIntervalDays = 1;
    } else if (reps === 1) {
      nextIntervalDays = 3;
    } else {
      nextIntervalDays = Math.round(Math.max(1, interval) * ef);
    }
    reps = reps + 1;
  } else if (rating === 'easy') {
    // Quá dễ: Nhảy cóc khoảng cách, thưởng EF
    if (reps === 0) {
      nextIntervalDays = 3;
    } else if (reps === 1) {
      nextIntervalDays = 6;
    } else {
      nextIntervalDays = Math.round(Math.max(1, interval) * ef * 1.35);
    }
    reps = reps + 1;
    ef = Math.min(3.0, ef + 0.15);
  }

  const dueDate = now + Math.round(nextIntervalDays * 86400000);

  return {
    ...current,
    reps,
    easeFactor: Math.round(ef * 100) / 100,
    intervalDays: Math.round(nextIntervalDays * 100) / 100,
    dueDate,
    lastReviewed: now,
    totalReviews: (current.totalReviews || 0) + 1,
    history: [...(current.history || []).slice(-9), { rating, at: now, nextIntervalDays }]
  };
}

/**
 * Preview next interval label for rating buttons
 */
export function getNextIntervalPreview(deckId, cardIndex, rating) {
  const current = getCardSrs(deckId, cardIndex);
  const next = calculateNextSrs(current, rating);
  return formatIntervalText(next.intervalDays);
}

/**
 * Record user review result for a card
 */
export function recordCardReview(deckId, cardIndex, rating) {
  try {
    const all = getAllSrsData();
    const key = getCardSrsKey(deckId, cardIndex);
    const current = all[key] || {
      deckId,
      cardIndex,
      reps: 0,
      intervalDays: 0,
      easeFactor: 2.5,
      dueDate: 0,
      lastReviewed: 0,
      totalReviews: 0,
      history: []
    };

    const updated = calculateNextSrs(current, rating);
    all[key] = updated;
    localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(all));
    return updated;
  } catch (e) {
    console.error('Failed to save SRS review', e);
    return null;
  }
}

/**
 * Check if a card is due for review today
 */
export function isCardDue(srsState) {
  if (!srsState || !srsState.dueDate) return true; // Chưa học bao giờ -> Coi như cần học
  return srsState.dueDate <= Date.now();
}

/**
 * Get review stats for a single deck
 */
export function getDeckDueStats(deck) {
  if (!deck || !deck.previewCards) {
    return { total: 0, due: 0, learned: 0, newCards: 0 };
  }

  const cards = deck.previewCards;
  let dueCount = 0;
  let learnedCount = 0;
  let newCardsCount = 0;
  const now = Date.now();

  cards.forEach((_, idx) => {
    const srs = getCardSrs(deck.id, idx);
    if (!srs.lastReviewed) {
      newCardsCount++;
      dueCount++; // New cards count as queue to learn
    } else if (srs.dueDate <= now) {
      dueCount++;
      learnedCount++;
    } else {
      learnedCount++;
    }
  });

  return {
    total: cards.length,
    due: dueCount,
    learned: learnedCount,
    newCards: newCardsCount
  };
}

/**
 * Get overall review stats across all unlocked decks
 */
export function getAllDecksDueStats(unlockedDecks = []) {
  let totalDue = 0;
  let totalLearned = 0;
  let totalNew = 0;
  let totalCards = 0;
  const decksWithDue = [];

  unlockedDecks.forEach((deck) => {
    const stats = getDeckDueStats(deck);
    totalCards += stats.total;
    totalDue += stats.due;
    totalLearned += stats.learned;
    totalNew += stats.newCards;

    if (stats.due > 0) {
      decksWithDue.push({
        deck,
        ...stats
      });
    }
  });

  return {
    totalDue,
    totalLearned,
    totalNew,
    totalCards,
    decksWithDue
  };
}

/**
 * Build a virtual smart review deck containing all cards due today
 */
export function buildDueCardsDeck(unlockedDecks = []) {
  const dueCards = [];
  const now = Date.now();

  unlockedDecks.forEach((deck) => {
    (deck.previewCards || []).forEach((card, idx) => {
      const srs = getCardSrs(deck.id, idx);
      if (!srs.lastReviewed || srs.dueDate <= now) {
        dueCards.push({
          ...card,
          originalDeckId: deck.id,
          originalCardIndex: idx,
          deckTitle: deck.title,
          tag: card.tag || deck.categoryLabel || 'Ôn tập SRS'
        });
      }
    });
  });

  return {
    id: 'srs-daily-due-session',
    title: `Ôn Tập Lặp Lại Ngắt Quãng (${dueCards.length} Thẻ Đến Hạn)`,
    subtitle: 'Tổng hợp các thẻ cần củng cố trí nhớ hôm nay theo thuật toán SuperMemo SM-2',
    category: 'cong-chuc',
    categoryLabel: 'Spaced Repetition',
    badge: 'Ôn Tập Trí Nhớ Vĩnh Viễn',
    price: 0,
    rating: 5.0,
    previewCards: dueCards,
    previewQuiz: []
  };
}
