// Daily Flash Deals Generator (Sale Theo Ngày 24h)
// Generates date-based rotating discounts with countdown to 23:59:59

import { COURSES_DATA } from '../data/coursesData';
import { getMarketplaceDecks } from '../data/marketplaceData';

/**
 * Returns today's featured flash sale items and time remaining until midnight
 */
export function getDailyDeals() {
  const now = new Date();
  
  // Calculate seconds until midnight 23:59:59
  const midnight = new Date(now);
  midnight.setHours(23, 59, 59, 999);
  const secondsLeft = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));

  // Today's date formatted
  const dateStr = now.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Pick deterministic items based on day of month
  const dayOfMonth = now.getDate();
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
      flashPrice: Math.round(item1.price * 0.4), // 60% OFF
      discountPercent: 60,
      priceXu: 15, // Flash Xu price
      originalPriceXu: 40,
      soldPercent: 88,
      stockRemaining: 3,
      badge: '🔥 DEAL NGÀY HÔM NAY -60%',
      previewCards: item1.previewCards
    },
    {
      id: item2.id,
      title: item2.title,
      subtitle: item2.subtitle,
      category: item2.category,
      categoryLabel: item2.categoryLabel,
      originalPrice: item2.price,
      flashPrice: Math.round(item2.price * 0.35), // 65% OFF
      discountPercent: 65,
      priceXu: 12,
      originalPriceXu: 35,
      soldPercent: 92,
      stockRemaining: 2,
      badge: '⚡ GIỜ VÀNG GIẢM SỐC -65%',
      previewCards: item2.previewCards
    }
  ];

  return {
    dateStr,
    secondsLeft,
    deals
  };
}
