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

  const required4kThemes = ['super-mario-3d', 'your-name-anime', 'cyberpunk-city-3d', 'alps-milkyway-4k', 'totoro-ghibli-4k', 'classic-academia'];
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

  // Verify Cyberpunk V & Quadra Turbo-R 4K wallpaper
  const cyberpunkTheme = THEMES.find(t => t.id === 'cyberpunk-city-3d');
  assert(cyberpunkTheme && cyberpunkTheme.subtitle.includes('Quadra Turbo-R'), 'Cyberpunk theme subtitle features Quadra Turbo-R');
  const cyberpunkImgStats = fs.statSync(path.join(process.cwd(), 'public', 'wallpapers', 'cyberpunk-quadra-4k.png'));
  assert(cyberpunkImgStats.size > 500000, `Cyberpunk Quadra 4K image is ultra high-res (${cyberpunkImgStats.size} bytes)`);

  // Verify Classic Academia 4K wallpaper
  const academiaTheme = THEMES.find(t => t.id === 'classic-academia');
  assert(academiaTheme && academiaTheme.subtitle.includes('Lụa Đồng Hoàng Gia'), 'Classic Academia subtitle features Lụa Đồng Hoàng Gia 4K');
  const academiaImgStats = fs.statSync(path.join(process.cwd(), 'public', 'wallpapers', 'classic-academia-4k.png'));
  assert(academiaImgStats.size > 200000, `Classic Academia 4K image is high-res (${academiaImgStats.size} bytes)`);

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
  assert(isDayTheme('cyberpunk-city-3d') === false, 'Cyberpunk Porsche 4K is strictly NOT a Day Theme');
  assert(isDayTheme('classic-academia') === false, 'Classic Academia 4K is strictly NOT a Day Theme');
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

  // 7. HANOI TIME ENGINE & STUDY TRACE LOGS
  console.log('\n--- 7. Testing Hanoi Time Synchronization & Study Trace Logs ---');
  const hanoiModule = await import('./src/utils/hanoiTime.js');
  const {
    getHanoiDateString,
    getHanoiTimeString,
    formatHanoiDateTime,
    getHanoiNowComponents,
    recordStudyTimeLog,
    getStudyTimeLogs,
    clearStudyTimeLogs,
    getTargetStudyClock,
    saveTargetStudyClock,
    calculateTargetClockProgress
  } = hanoiModule;

  const hanoiDate = getHanoiDateString();
  assert(/^\d{4}-\d{2}-\d{2}$/.test(hanoiDate), `Hanoi date format is valid YYYY-MM-DD (${hanoiDate})`);

  const hanoiTime = getHanoiTimeString();
  assert(/^\d{2}:\d{2}:\d{2}$/.test(hanoiTime), `Hanoi time format is valid HH:mm:ss (${hanoiTime})`);

  const fullDateTime = formatHanoiDateTime();
  assert(fullDateTime.includes('Giờ Hà Nội'), `Full format includes Vietnamese label: "${fullDateTime}"`);

  const nowComps = getHanoiNowComponents();
  assert(nowComps.timezone.includes('Hà Nội'), 'Now components include Hanoi GMT+7 timezone metadata');

  // Test Study Time History Trace
  clearStudyTimeLogs();
  assert(getStudyTimeLogs().length === 0, 'Logs cleared successfully');

  const newLog = recordStudyTimeLog({
    type: 'pomodoro',
    title: 'Test Phiên Pomodoro 25p',
    durationMinutes: 25,
    xpGained: 50
  });
  assert(newLog && newLog.id.startsWith('trace_'), 'Created valid study trace log entry');
  assert(newLog.hanoiDate === hanoiDate, `Trace log contains exact Hanoi date: ${newLog.hanoiDate}`);
  assert(newLog.durationMinutes === 25, 'Trace log duration is 25 minutes');

  const fetchedLogs = getStudyTimeLogs();
  assert(fetchedLogs.length === 1 && fetchedLogs[0].title === 'Test Phiên Pomodoro 25p', 'Successfully retrieved study trace log');

  // Test Target Study Clock & Goal
  const targetConfig = saveTargetStudyClock({ dailyGoalMinutes: 90, targetEndTime: '23:30' });
  assert(targetConfig.dailyGoalMinutes === 90, 'Saved daily study goal minutes (90m)');
  assert(targetConfig.targetEndTime === '23:30', 'Saved target end time (23:30)');

  const progressCalc = calculateTargetClockProgress();
  assert(progressCalc.dailyGoalMinutes === 90, 'Progress calculator reflects daily goal');
  assert(typeof progressCalc.percent === 'number' && progressCalc.percent >= 0, `Progress percentage is valid (${progressCalc.percent}%)`);

  // 8. COMMUNITY MODERATION & POST DELETION INTEGRITY
  console.log('\n--- 8. Testing Community Moderation, Post Deletion & Tombstone Persistence ---');
  const communityModule = await import('./src/data/communityData.js');
  const {
    getCommunityPosts,
    addCommunityPost,
    togglePinCommunityPost,
    deleteCommunityPost,
    deleteCommunityComment,
    clearSpamCommunityPosts,
    getDeletedPostIds,
    mergeAndSaveCommunityPosts,
    DELETED_POSTS_STORAGE_KEY
  } = communityModule;

  const adminGuardModule = await import('./src/utils/adminGuard.js');
  const { isUserAdmin, PRIMARY_ADMIN_EMAIL } = adminGuardModule;

  // Verify Admin Guard
  assert(isUserAdmin({ email: PRIMARY_ADMIN_EMAIL }), `Primary admin ${PRIMARY_ADMIN_EMAIL} is verified admin`);
  assert(!isUserAdmin({ email: 'normal_student@gmail.com' }), 'Regular student email is NOT admin');

  // Verify Community Posting & Commenting Access by Tier (Free is restricted)
  const userTierModule = await import('./src/utils/userTier.js');
  const { canUserParticipateInCommunity, setUserTier } = userTierModule;

  setUserTier('free');
  assert(!canUserParticipateInCommunity({ tier: 'free', email: 'hocvien_free@gmail.com' }), 'Free tier user is BLOCKED from posting/commenting on community forum');
  assert(!canUserParticipateInCommunity(null), 'Guest/Anonymous free user is BLOCKED from posting/commenting on community forum');
  assert(canUserParticipateInCommunity({ tier: 'plus' }), 'Plus tier user is ALLOWED to post and comment on community forum');
  assert(canUserParticipateInCommunity({ tier: 'pro' }), 'Pro tier user is ALLOWED to post and comment on community forum');
  assert(canUserParticipateInCommunity({ tier: 'ultra' }), 'Ultra tier user is ALLOWED to post and comment on community forum');
  assert(canUserParticipateInCommunity({ email: PRIMARY_ADMIN_EMAIL, tier: 'free' }), 'Admin is ALWAYS allowed to post and moderate community forum regardless of tier');

  // Test local tier state update
  setUserTier('plus');
  assert(canUserParticipateInCommunity(null), 'User with local Plus tier is ALLOWED to post and comment');
  setUserTier('free');
  assert(!canUserParticipateInCommunity(null), 'User reverted to Free tier is BLOCKED again');

  // Verify initial posts
  const initialPosts = getCommunityPosts();
  assert(Array.isArray(initialPosts) && initialPosts.length >= 3, `Community has initial posts (found ${initialPosts.length})`);

  // Create a test post
  const testPostId = 'test_post_' + Date.now();
  const created = addCommunityPost({
    id: testPostId,
    author: 'Test User',
    content: 'Nội dung test kiểm duyệt bài viết admin',
    category: 'cong-chuc',
    comments: [
      { author: 'Spammer 1', text: 'Bình luận spam 1' },
      { author: 'Spammer 2', text: 'Bình luận spam 2' }
    ]
  });
  assert(created && created.id === testPostId, 'Successfully created test community post');

  // Verify post is present
  let activePosts = getCommunityPosts();
  assert(activePosts.some(p => p.id === testPostId), 'Test post is in active community posts');

  // Test Pin / Unpin
  const pinnedList = await togglePinCommunityPost(testPostId);
  const pinnedPost = pinnedList.find(p => p.id === testPostId);
  assert(pinnedPost && pinnedPost.isPinned === true, 'Successfully pinned community post');

  const unpinnedList = await togglePinCommunityPost(testPostId);
  const unpinnedPost = unpinnedList.find(p => p.id === testPostId);
  assert(unpinnedPost && unpinnedPost.isPinned === false, 'Successfully unpinned community post');

  // Test Delete Comment
  const afterCommentDelete = await deleteCommunityComment(testPostId, 0);
  const targetPostAfterCm = afterCommentDelete.find(p => p.id === testPostId);
  assert(targetPostAfterCm && targetPostAfterCm.comments.length === 1, 'Successfully deleted comment from post');
  assert(targetPostAfterCm.comments[0].author === 'Spammer 2', 'Correct remaining comment verified');

  // Test Delete Post Permanently
  const afterPostDelete = await deleteCommunityPost(testPostId);
  assert(!afterPostDelete.some(p => p.id === testPostId), 'Test post removed from active community posts');

  // Verify tombstone is saved
  const deletedIds = getDeletedPostIds();
  assert(deletedIds.includes(testPostId), `Post ID recorded in tombstone blacklist (${DELETED_POSTS_STORAGE_KEY})`);

  // Verify tombstone persistence against remote resurrection
  const fakeRemoteList = [{ id: testPostId, content: 'Zombie post resurrection test', author: 'Zombie' }];
  const mergedAfterResurrectionAttempt = mergeAndSaveCommunityPosts(fakeRemoteList);
  assert(!mergedAfterResurrectionAttempt.some(p => p.id === testPostId), 'Tombstone correctly prevents deleted post resurrection during sync');

  // 9. MODAL DISMISS & ACCESSIBILITY TESTS
  console.log('\n--- 9. Testing Modal Dismiss System (Escape Key & Backdrop Handlers) ---');
  const modalHookModule = await import('./src/hooks/useModalDismiss.js');
  assert(typeof modalHookModule.useModalDismiss === 'function', 'useModalDismiss hook is exported as function');

  // Verify key modal components have Escape dismiss and backdrop click
  const changelogCode = fs.readFileSync(path.join(__dirname, 'src/components/ChangelogModal.jsx'), 'utf-8');
  assert(changelogCode.includes('useModalDismiss'), 'ChangelogModal integrates useModalDismiss hook');
  assert(changelogCode.includes('fixed inset-0') && changelogCode.includes('onClick={handleClose}'), 'ChangelogModal has outer backdrop click layer');
  assert(changelogCode.includes('stopPropagation'), 'ChangelogModal card stops click propagation');

  const authModalCode = fs.readFileSync(path.join(__dirname, 'src/components/AuthModal.jsx'), 'utf-8');
  assert(authModalCode.includes('useModalDismiss'), 'AuthModal integrates useModalDismiss hook');
  assert(authModalCode.includes('stopPropagation'), 'AuthModal card stops click propagation');

  const paymentModalCode = fs.readFileSync(path.join(__dirname, 'src/components/PaymentModal.jsx'), 'utf-8');
  assert(paymentModalCode.includes('useModalDismiss'), 'PaymentModal integrates useModalDismiss hook');
  assert(paymentModalCode.includes('stopPropagation'), 'PaymentModal card stops click propagation');

  const blindBoxModalCode = fs.readFileSync(path.join(__dirname, 'src/components/BlindBoxModal.jsx'), 'utf-8');
  assert(blindBoxModalCode.includes('useModalDismiss'), 'BlindBoxModal integrates useModalDismiss hook');
  assert(blindBoxModalCode.includes('stopPropagation'), 'BlindBoxModal card stops click propagation');

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
