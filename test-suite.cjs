// Autonomous Comprehensive Test Suite for OnThi Hub
// Run with: node test-suite.cjs

const fs = require('fs');
const path = require('path');

// Polyfill localStorage & window for Node runtime testing
if (typeof global.localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 ONTHI HUB - AUTONOMOUS SYSTEM VERIFICATION SUITE');
  console.log('====================================================\n');

  // 1. COURSES & FLASHCARDS INTEGRITY
  console.log('--- 1. Testing Course Catalog & Flashcards Data ---');
  const coursesModule = await import('./src/data/coursesData.js');
  const { COURSES_DATA, COMBO_PACKAGE } = coursesModule;

  assert(Array.isArray(COURSES_DATA), 'COURSES_DATA is an array');
  assert(COURSES_DATA.length >= 7, `COURSES_DATA has at least 7 massive courses (found ${COURSES_DATA.length})`);

  let totalCards = 0;
  let totalQuizzes = 0;

  COURSES_DATA.forEach((course) => {
    assert(course.id && course.title, `Course "${course.id}" has valid id and title`);
    assert(Array.isArray(course.previewCards), `Course "${course.id}" has previewCards array`);
    assert(course.previewCards.length >= 50, `Course "${course.id}" has at least 50 cards (has ${course.previewCards.length})`);
    totalCards += course.previewCards.length;

    // Check each card has front, back, id
    course.previewCards.forEach((card, idx) => {
      if (!card.front || !card.back) {
        assert(false, `Course "${course.id}" card index ${idx} missing front or back`);
      }
    });

    // Check quizzes
    if (course.quizQuestions) {
      assert(Array.isArray(course.quizQuestions), `Course "${course.id}" has quiz questions array`);
      assert(course.quizQuestions.length >= 10, `Course "${course.id}" has at least 10 quiz questions (has ${course.quizQuestions.length})`);
      totalQuizzes += course.quizQuestions.length;

      course.quizQuestions.forEach((q, qIdx) => {
        const correctVal = q.correct !== undefined ? q.correct : q.correctIndex;
        if (!q.question || !Array.isArray(q.options) || q.options.length < 4 || correctVal === undefined) {
          assert(false, `Course "${course.id}" quiz ${qIdx} invalid schema`);
        }
        if (correctVal < 0 || correctVal >= q.options.length) {
          assert(false, `Course "${course.id}" quiz ${qIdx} correct index out of bounds (${correctVal})`);
        }
      });
    }
  });

  assert(totalCards >= 350, `Total cards in catalog >= 350 (found ${totalCards})`);
  assert(COMBO_PACKAGE && COMBO_PACKAGE.id, `COMBO_PACKAGE exists: ${COMBO_PACKAGE?.title}`);

  // 2. THEMES & WEATHER INTEGRITY
  console.log('\n--- 2. Testing Themes & 4K Wallpaper Engine ---');
  const themeModule = await import('./src/utils/themeManager.js');
  const { THEMES } = themeModule;

  assert(Array.isArray(THEMES) && THEMES.length === 16, `Exactly 16 themes configured (found ${THEMES.length})`);

  const required4kThemes = ['super-mario-3d', 'your-name-anime', 'cyberpunk-city-3d', 'alps-milkyway-4k', 'totoro-ghibli-4k'];
  required4kThemes.forEach(id => {
    const t = THEMES.find(item => item.id === id);
    assert(!!t, `Theme "${id}" exists`);
    assert(!!t.bgImageUrl, `Theme "${id}" has 4K bgImageUrl: ${t?.bgImageUrl}`);
    assert(!!t.weatherType, `Theme "${id}" has weatherType: ${t?.weatherType}`);

    // Verify wallpaper image file exists in public/wallpapers
    const relPath = t.bgImageUrl.replace(/^\//, '');
    const fullPath = path.join(process.cwd(), 'public', relPath);
    assert(fs.existsSync(fullPath), `Wallpaper file exists on disk: ${relPath}`);
  });

  // Verify all icons exist for all themes
  const requiredIconKeys = ['logo', 'workspace', 'home', 'library', 'create', 'marketplace', 'community', 'analytics', 'mistakes', 'leaderboard', 'blindbox', 'changelog', 'wallet'];
  THEMES.forEach(t => {
    assert(t.icons && typeof t.icons === 'object', `Theme "${t.id}" has icons object`);
    requiredIconKeys.forEach(k => {
      if (!t.icons[k]) {
        assert(false, `Theme "${t.id}" missing icon key "${k}"`);
      }
    });
  });

  // 3. BLIND BOX REWARDS (No useless vouchers, profitable for user & platform)
  console.log('\n--- 3. Testing Lucky Blind Box Utility & Rewards ---');
  const blindBoxModule = await import('./src/utils/blindBox.js');
  const { DEFAULT_BLIND_BOXES } = blindBoxModule;

  assert(Array.isArray(DEFAULT_BLIND_BOXES) && DEFAULT_BLIND_BOXES.length > 0, `Blind boxes available (${DEFAULT_BLIND_BOXES.length})`);
  DEFAULT_BLIND_BOXES.forEach(box => {
    assert(box.dropRates && box.dropRates.length > 0, `Box "${box.id}" has dropRates (${box.dropRates.length})`);
    // Ensure no rewards have useless discount voucher
    const hasUselessVoucher = box.dropRates.some(r => r.name && r.name.toLowerCase().includes('voucher'));
    assert(!hasUselessVoucher, `Box "${box.id}" has ZERO useless vouchers (pure coins, VIP, AI queries, streak freeze)`);
  });

  // 4. SM-2 SPACED REPETITION ENGINE
  console.log('\n--- 4. Testing Spaced Repetition (SM-2) ---');
  const sm2Module = await import('./src/utils/spacedRepetition.js');
  const { calculateNextSrs } = sm2Module;

  // New card rating 'easy'
  const firstReview = calculateNextSrs({ reps: 0, intervalDays: 0, easeFactor: 2.5 }, 'easy');
  assert(firstReview.reps === 1, 'First repetition count is 1');
  assert(firstReview.intervalDays >= 3, 'First interval for easy is at least 3 days');
  assert(firstReview.easeFactor >= 2.5, 'Ease factor increased for easy card');

  // Second review rating 'good'
  const secondReview = calculateNextSrs(firstReview, 'good');
  assert(secondReview.reps === 2, 'Second repetition count is 2');
  assert(secondReview.intervalDays >= 3, 'Second interval increased');

  // Hard card rating 'again'
  const failedReview = calculateNextSrs(secondReview, 'again');
  assert(failedReview.reps === 0, 'Reset repetitions on again');
  assert(failedReview.easeFactor < secondReview.easeFactor, 'Reduced ease factor on failure');

  // 5. WALLET COIN TRANSACTIONS
  console.log('\n--- 5. Testing Wallet & Coin Transactions ---');
  const walletModule = await import('./src/utils/wallet.js');
  const { getWalletBalance, addWalletCoins, deductWalletCoins } = walletModule;

  const currentBal = getWalletBalance();
  assert(typeof currentBal === 'number' && !isNaN(currentBal), `Wallet balance is valid number (${currentBal} Xu)`);

  // Test deduct boundary
  const deductTooMuch = deductWalletCoins(currentBal + 999999);
  assert(deductTooMuch === false, 'Cannot deduct more coins than wallet balance');

  // 6. MARKETPLACE INTEGRITY
  console.log('\n--- 6. Testing C2C Marketplace Catalog ---');
  const marketModule = await import('./src/data/marketplaceData.js');
  const { INITIAL_MARKETPLACE_DECKS } = marketModule;

  assert(Array.isArray(INITIAL_MARKETPLACE_DECKS) && INITIAL_MARKETPLACE_DECKS.length >= 5, `Marketplace has at least 5 decks (found ${INITIAL_MARKETPLACE_DECKS.length})`);
  INITIAL_MARKETPLACE_DECKS.forEach(deck => {
    assert(deck.id && deck.title && deck.authorName, `Deck "${deck.id}" has id, title, authorName`);
    assert(deck.priceXu !== undefined && deck.priceXu >= 0, `Deck "${deck.id}" has valid priceXu (${deck.priceXu} Xu)`);
    assert(Array.isArray(deck.previewCards) && deck.previewCards.length > 0, `Deck "${deck.id}" has previewCards (${deck.previewCards.length})`);
  });

  // SUMMARY
  console.log('\n====================================================');
  console.log(`TOTAL TESTS: ${testsPassed + testsFailed}`);
  console.log(`PASSED: ${testsPassed}`);
  console.log(`FAILED: ${testsFailed}`);
  console.log('====================================================');

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
