// Utility to detect duplicate or plagiarized prompt decks
// Compares titles, descriptions, and card contents (front/back) against existing catalogs

import { COURSES_DATA } from '../data/coursesData';
import { getMarketplaceDecks } from '../data/marketplaceData';

// Helper to clean and tokenize text
function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1);
}

// Jaccard similarity of two token sets
function calculateJaccardSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

// Compare two cards (front + back)
function compareCardSimilarity(cardA, cardB) {
  const tokensA = tokenize(`${cardA.front} ${cardA.back}`);
  const tokensB = tokenize(`${cardB.front} ${cardB.back}`);
  return calculateJaccardSimilarity(tokensA, tokensB);
}

/**
 * Check a candidate deck against existing catalogs
 * @param {Object} candidate - { title, description, cards: [{front, back}] }
 * @param {string} excludeDeckId - ID to skip if editing
 * @returns {Object} result - { isDuplicate, similarityScore, matchedDeck, reason, details }
 */
export function checkDeckDuplication(candidate, excludeDeckId = null) {
  if (!candidate || !candidate.title) {
    return { isDuplicate: false, similarityScore: 0, reason: 'Chưa đủ dữ liệu để đối chiếu' };
  }

  // Combine official courses and marketplace decks
  const allExisting = [
    ...COURSES_DATA.map(c => ({
      id: c.id,
      title: c.title,
      description: c.subtitle || c.description,
      cards: c.cards || c.previewCards || [],
      source: 'Chính Quy PromptMMO'
    })),
    ...getMarketplaceDecks().map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      cards: m.sampleCards || [],
      source: `Chợ C2C (${m.authorName || 'Tác giả'})`
    }))
  ].filter(d => d.id !== excludeDeckId);

  const candidateTitleTokens = tokenize(candidate.title);
  const candidateCards = candidate.cards || candidate.previewCards || candidate.sampleCards || [];

  let highestScore = 0;
  let mostSimilarDeck = null;
  let duplicateReason = '';

  for (const existing of allExisting) {
    // 1. Title Similarity (Weight 40%)
    const existingTitleTokens = tokenize(existing.title);
    const titleSim = calculateJaccardSimilarity(candidateTitleTokens, existingTitleTokens);

    // 2. Card Content Overlap (Weight 60%)
    let cardOverlapCount = 0;
    const existingCards = existing.cards || [];

    if (candidateCards.length > 0 && existingCards.length > 0) {
      for (const cCard of candidateCards) {
        for (const eCard of existingCards) {
          const sim = compareCardSimilarity(cCard, eCard);
          if (sim > 0.65) {
            cardOverlapCount++;
            break;
          }
        }
      }
    }

    const cardSim = candidateCards.length > 0
      ? cardOverlapCount / candidateCards.length
      : 0;

    // Combined weighted score (0 - 100%)
    const totalSimScore = Math.round((titleSim * 0.4 + cardSim * 0.6) * 100);

    if (totalSimScore > highestScore) {
      highestScore = totalSimScore;
      mostSimilarDeck = existing;

      if (cardSim >= 0.5) {
        duplicateReason = `Phát hiện ${cardOverlapCount}/${candidateCards.length} thẻ có nội dung trùng với bộ "${existing.title}".`;
      } else if (titleSim >= 0.65) {
        duplicateReason = `Tiêu đề có độ tương đồng ${Math.round(titleSim * 100)}% với bộ "${existing.title}".`;
      } else {
        duplicateReason = `Độ tương đồng tổng thể ${totalSimScore}% so với bộ "${existing.title}".`;
      }
    }
  }

  // Threshold: >= 55% considered duplicate/warning
  const isDuplicate = highestScore >= 55;

  return {
    isDuplicate,
    similarityScore: highestScore,
    matchedDeck: mostSimilarDeck,
    reason: isDuplicate
      ? duplicateReason
      : 'Không phát hiện trùng lặp đáng kể. Gói Prompt đạt chuẩn tính nguyên bản.',
    status: highestScore < 30 ? 'safe' : highestScore < 55 ? 'warning' : 'duplicate'
  };
}
