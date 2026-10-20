// Daily Flash Deals Generator (Sale Theo Ngày 24h)
// Generates date-based rotating discounts with countdown to 23:59:59 Giờ Hà Nội (UTC+7)

import { COURSES_DATA } from '../data/coursesData';
import { getMarketplaceDecks } from '../data/marketplaceData';
import { getHanoiMidnightTimestamp, getHanoiDateString } from './hanoiTime';

/**
 * Returns today's featured flash sale items and time remaining until midnight (Hanoi ICT UTC+7)
 */
export function getDailyDeals() {
  const now = Date.now();
  const midnightTs = getHanoiMidnightTimestamp();
  const secondsLeft = Math.max(0, Math.floor((midnightTs - now) / 1000));

  // Today's date formatted in Hanoi
  const dateStr = getHanoiDateString().split('-').reverse().join('/');

  // Pick deterministic items based on day of month in Hanoi
  const [y, m, dayOfMonth] = getHanoiDateString().split('-').map(Number);
  const allCourses = COURSES_DATA;
  
  // Rotate 3 featured deals for today
  const deal1Index = dayOfMonth % allCourses.length;
  const deal2Index = (dayOfMonth + 1) % allCourses.length;

  const item1 = allCourses[deal1Index];
  const item2 = allCourses[deal2Index];

  const deals = [
    {
      id: item1.id,
      title: item1.title,
      subtitle: item1.subtitle,
      category: item1.category,
      categoryLabel: item1.categoryLabel,
      originalPrice: item1.price,
      flashPrice: 4000,
      discountPercent: 60,
      priceXu: 4, // Flash Xu price siêu rẻ
      originalPriceXu: 10,
      soldPercent: 88,
      stockRemaining: 3,
      badge: '🔥 DEAL NGÀY HÔM NAY -60%',
      previewCards: item1.previewCards,
      previewQuiz: item1.previewQuiz
    },
    {
      id: item2.id,
      title: item2.title,
      subtitle: item2.subtitle,
      category: item2.category,
      categoryLabel: item2.categoryLabel,
      originalPrice: item2.price,
      flashPrice: 3000,
      discountPercent: 65,
      priceXu: 3, // Flash Xu price siêu rẻ
      originalPriceXu: 8,
      soldPercent: 92,
      stockRemaining: 2,
      badge: '⚡ GIỜ VÀNG GIẢM SỐC -65%',
      previewCards: item2.previewCards,
      previewQuiz: item2.previewQuiz
    }
  ];

  return {
    dateStr,
    secondsLeft,
    deals
  };
}
