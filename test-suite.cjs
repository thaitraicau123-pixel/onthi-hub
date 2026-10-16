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

  // Verify Mario theme has Toad 4K metadata & proper wallpaper
  const marioTheme = THEMES.find(t => t.id === 'super-mario-3d');
  assert(marioTheme && marioTheme.subtitle.includes('Bé Nấm Toad'), 'Mario theme subtitle features Bé Nấm Toad 4K');
  const marioImgStats = fs.statSync(path.join(process.cwd(), 'public', 'wallpapers', 'mario-4k.png'));
  assert(marioImgStats.size > 200000, `Mario Toad 4K image is high-res (${marioImgStats.size} bytes)`);

  // Verify Sleep Mode (Chế độ ngủ) Engine & Day Mode Theme Allocation
  console.log('\n--- 2b. Testing Sleep Mode & Day Theme Allocation ---');
  const { getSleepMode, setSleepMode, toggleSleepMode, isDayTheme, DAY_THEMES, applyTheme } = themeModule;
  assert(typeof getSleepMode === 'function', 'getSleepMode is defined');
  assert(typeof setSleepMode === 'function', 'setSleepMode is defined');
  assert(typeof toggleSleepMode === 'function', 'toggleSleepMode is defined');
  assert(Array.isArray(DAY_THEMES) && DAY_THEMES.length === 5, `Exactly 5 daylight themes allocated (found ${DAY_THEMES.length})`);

  // Verify that only the 5 daylight themes return isDayTheme === true
  assert(isDayTheme('default') === true, 'Notion Tối Giản is a Day Theme');
  assert(isDayTheme('sakura-blossom') === true, 'Sakura Blossom is a Day Theme');
  assert(isDayTheme('botanical-garden') === true, 'Botanical Avocado is a Day Theme');
  assert(isDayTheme('lofi-cafe') === true, 'Lofi Cafe is a Day Theme');
  assert(isDayTheme('lemon-citrus') === true, 'Lemon Citrus is a Day Theme');

  // Verify that 4K cinema & night themes are NOT day themes
  assert(isDayTheme('super-mario-3d') === false, 'Mario Toad 4K is strictly NOT a Day Theme');
  assert(isDayTheme('cyberpunk-city-3d') === false, 'Cyberpunk 4K is strictly NOT a Day Theme');
  assert(isDayTheme('your-name-anime') === false, 'Your Name 4K is strictly NOT a Day Theme');
  assert(isDayTheme('alps-milkyway-4k') === false, 'Alps 4K is strictly NOT a Day Theme');
  assert(isDayTheme('totoro-ghibli-4k') === false, 'Totoro 4K is strictly NOT a Day Theme');

  // Verify Mario 3D strictly locks to Sleep Mode (dark)
  applyTheme('super-mario-3d');
  assert(getSleepMode('super-mario-3d') === 'dark', 'Mario Toad 4K always returns dark mode');
  setSleepMode('light'); // should be ignored/enforced to dark for 4K theme
  assert(getSleepMode() === 'dark', '4K theme resists light mode override to prevent contrast issues');

  // Verify a daylight theme can run in day mode ('light') and toggle
  applyTheme('default');
  setSleepMode('light');
  assert(getSleepMode('default') === 'light', 'Notion Default runs in Day mode');
  toggleSleepMode();
  assert(getSleepMode('default') === 'dark', 'Day theme toggled to sleep mode');
  toggleSleepMode();
  assert(getSleepMode('default') === 'light', 'Day theme toggled back to day mode');

  // Switch back to Mario 4K as default exciting theme
  applyTheme('super-mario-3d');
  assert(getSleepMode() === 'dark', 'Switched back to Mario 4K, automatically in Sleep Mode');

  // 2c. TESTING HIGH-CONTRAST TEXT STANDARDS ACROSS ALL THEMES & UI
  console.log('\n--- 2c. Testing High-Contrast Text Standards Across All Themes & UI ---');
  THEMES.forEach(t => {
    if (DAY_THEMES.includes(t.id)) {
      assert(t.textClass === 'text-slate-900 font-medium', `Day Theme "${t.name}" uses clean high-contrast dark text (#0f172a)`);
      assert(t.subtextClass === 'text-slate-600', `Day Theme "${t.name}" uses readable slate secondary text (#475569)`);
    } else {
      assert(t.textClass === 'text-white font-medium', `Dark Theme "${t.name}" uses pure white heading/body text (#ffffff)`);
      assert(t.subtextClass === 'text-slate-200', `Dark Theme "${t.name}" uses high-contrast light slate secondary text (#e2e8f0)`);
    }
  });

  // Verify no invalid Tailwind classes in codebase
  const themePickerCode = fs.readFileSync(path.resolve(__dirname, 'src/components/ThemePickerModal.jsx'), 'utf8');
  assert(!themePickerCode.includes('slate-850'), 'ThemePickerModal has zero invalid slate-850 classes');
  const homeViewCode = fs.readFileSync(path.resolve(__dirname, 'src/views/HomeView.jsx'), 'utf8');
  assert(!homeViewCode.includes('slate-850'), 'HomeView has zero invalid slate-850 classes');
  assert(!homeViewCode.includes('slate-750'), 'HomeView has zero invalid slate-750 classes');
  const themeManagerCode = fs.readFileSync(path.resolve(__dirname, 'src/utils/themeManager.js'), 'utf8');
  assert(!themeManagerCode.includes('/92'), 'themeManager.js has zero invalid /92 Tailwind opacity modifiers');
  THEMES.forEach(t => {
    assert(t.sidebarBgClass && !t.sidebarBgClass.includes('/92'), `Theme "${t.id}" sidebarBgClass uses valid Tailwind opacity`);
    if (DAY_THEMES.includes(t.id)) {
      assert(t.sidebarBgClass.includes('dark:bg-'), `Day Theme "${t.id}" sidebarBgClass has explicit dark:bg- class for Sleep Mode`);
    }
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
