// =========================================================================
// ONTHIHUB LIVE MOCK EXAM ENGINE & SCHEDULED NATIONAL ROOMS
// Quản lý các kỳ thi thử trực tiếp theo lịch hẹn (Đồng bộ Giờ Hà Nội GMT+7)
// Tích hợp Đăng ký trước, Cấp SBD, Chống gian lận chuyển tab & Bảng vàng Realtime
// =========================================================================

import {
  getHanoiDateString,
  getHanoiTimeString,
  parseHanoiTargetTimestamp,
  calculateHanoiCountdown,
  toValidHanoiDate
} from '../utils/hanoiTime';
import { COURSES_DATA } from './coursesData';
import { addWalletCoins } from '../utils/wallet';
import { setUserTier, getUserTier } from '../utils/userTier';

export const LIVE_EXAM_REG_KEY = 'onthi_live_exam_registrations_v1';
export const LIVE_EXAM_RESULTS_KEY = 'onthi_live_exam_results_v1';
export const LIVE_EXAM_BROADCAST = 'onthi_live_exam_sync_v1';

/**
 * Danh sách các phòng thi thử trực tiếp theo lịch hẹn chuẩn hóa 2026
 */
export const SCHEDULED_LIVE_EXAMS = [
  {
    id: 'live_cong_chuc_2026',
    title: 'Kỳ Thi Thử Công Chức Toàn Quốc 2026 (Đợt 1)',
    subject: 'Môn Kiến Thức Chung (Nghị định 138/2020/NĐ-CP)',
    badge: '🏛️ CÔNG CHỨC VÒNG 1',
    badgeColor: 'bg-emerald-500 text-white',
    durationMinutes: 60,
    questionCount: 60,
    baseCourseId: 'pldc',
    dayOfWeek: 0, // 0 = Chủ Nhật
    startTimeStr: '20:00',
    endTimeStr: '21:00',
    passThresholdPercent: 50, // Đúng >= 30/60 câu
    rewards: {
      top1: { tier: 'ultra', name: 'Gói Hội Viên ULTRA 👑 (VIP 1 Năm)' },
      top2: { tier: 'pro', name: 'Gói Hội Viên PRO 🚀 (VIP 6 Tháng)' },
      top3: { tier: 'pro', name: 'Gói Hội Viên PRO 🚀 (VIP 3 Tháng)' },
      passed: { tier: 'plus', name: 'Gói Hội Viên PLUS 🌟 (Trải Nghiệm)' }
    },
    registeredBaseCount: 142,
    rules: [
      'Đề thi niêm phong tự động mở đúng 20:00:00 (Giờ Hà Nội).',
      'Thời gian làm bài: 60 phút gồm 60 câu trắc nghiệm chính thức.',
      'Cơ chế chống gian lận: Cảnh báo nếu chuyển tab hoặc rời màn hình quá 3 lần.',
      'Xếp hạng Realtime căn cứ vào: Số câu đúng cao nhất & Thời gian nộp bài sớm nhất.',
      'Phần thưởng: Kích hoạt Gói Hội Viên ULTRA/PRO/PLUS VIP + Bằng Khen Kỷ Lục Hoàng Gia 4K & Quyền Đăng Status Vinh Danh Lên Diễn Đàn.'
    ]
  },
  {
    id: 'live_it_system_design',
    title: 'Đấu Trường Trắc Nghiệm IT & System Design',
    subject: 'Backend Architecture, Caching, Concurrency & Database',
    badge: '💻 IT & TECH SENIOR',
    badgeColor: 'bg-sky-500 text-white',
    durationMinutes: 40,
    questionCount: 40,
    baseCourseId: 'system-design',
    dayOfWeek: 6, // 6 = Thứ Bảy
    startTimeStr: '20:30',
    endTimeStr: '21:10',
    passThresholdPercent: 60,
    rewards: {
      top1: { tier: 'ultra', name: 'Gói Hội Viên ULTRA 👑 (VIP 1 Năm)' },
      top2: { tier: 'pro', name: 'Gói Hội Viên PRO 🚀 (VIP 6 Tháng)' },
      top3: { tier: 'pro', name: 'Gói Hội Viên PRO 🚀 (VIP 3 Tháng)' },
      passed: { tier: 'plus', name: 'Gói Hội Viên PLUS 🌟 (Trải Nghiệm)' }
    },
    registeredBaseCount: 88,
    rules: [
      'Đề thi kỹ thuật chọn lọc từ ngân hàng câu hỏi phỏng vấn Tech Top tier.',
      'Thời gian: 40 phút cho 40 câu trắc nghiệm tình huống kiến trúc.',
      'Tính điểm trừ khi khoanh sai hoặc đoán mò.',
      'Phần thưởng: Kích hoạt Gói Hội Viên ULTRA/PRO VIP + Bằng Khen Hoàng Gia & Quyền Đăng Status Vinh Danh.'
    ]
  },
  {
    id: 'live_ielts_vocab',
    title: 'Sát Hạch Nhanh Từ Vựng IELTS 7.5+ & TOEIC 900+',
    subject: 'High-Yield Collocations, Phrasal Verbs & Reading Comprehension',
    badge: '🌍 NGOẠI NGỮ CHUẨN QUỐC TẾ',
    badgeColor: 'bg-purple-600 text-white',
    durationMinutes: 25,
    questionCount: 30,
    baseCourseId: 'ielts-75',
    isDaily: true,
    startTimeStr: '21:30',
    endTimeStr: '21:55',
    passThresholdPercent: 70,
    rewards: {
      top1: { tier: 'ultra', name: 'Gói Hội Viên ULTRA 👑 (VIP 1 Năm)' },
      top2: { tier: 'pro', name: 'Gói Hội Viên PRO 🚀 (VIP 6 Tháng)' },
      top3: { tier: 'pro', name: 'Gói Hội Viên PRO 🚀 (VIP 3 Tháng)' },
      passed: { tier: 'plus', name: 'Gói Hội Viên PLUS 🌟 (Trải Nghiệm)' }
    },
    registeredBaseCount: 115,
    rules: [
      'Diễn ra hàng ngày lúc 21:30 tối (Giờ Hà Nội).',
      'Luyện phản xạ từ vựng cấp tốc dưới áp lực thời gian.',
      'Phần thưởng: Kích hoạt Gói Hội Viên ULTRA/PRO VIP + Cấp chứng nhận Hoàng Gia 4K & Quyền Đăng Status Vinh Danh.'
    ]
  }
];

/**
 * Tính toán mốc thời gian diễn ra kỳ thi tiếp theo (theo giờ Hà Nội)
 */
export function getNextExamOccurrence(exam) {
  const now = new Date();
  const todayStr = getHanoiDateString(now);
  const [startH, startM] = exam.startTimeStr.split(':').map(Number);
  const [endH, endM] = exam.endTimeStr.split(':').map(Number);

  // Tạo timestamp bắt đầu theo ngày hôm nay
  const todayStartTs = parseHanoiTargetTimestamp(todayStr, exam.startTimeStr);
  const todayEndTs = parseHanoiTargetTimestamp(todayStr, exam.endTimeStr);

  if (exam.isDaily) {
    if (now.getTime() < todayEndTs) {
      return {
        dateStr: todayStr,
        startTs: todayStartTs,
        endTs: todayEndTs
      };
    }
    // Ngày mai
    const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
    const tomorrowStr = getHanoiDateString(tomorrow);
    return {
      dateStr: tomorrowStr,
      startTs: parseHanoiTargetTimestamp(tomorrowStr, exam.startTimeStr),
      endTs: parseHanoiTargetTimestamp(tomorrowStr, exam.endTimeStr)
    };
  }

  // Kỳ thi theo thứ trong tuần (e.g. Chủ Nhật hoặc Thứ Bảy)
  const currentDayOfWeek = now.getDay();
  let daysUntil = (exam.dayOfWeek - currentDayOfWeek + 7) % 7;

  if (daysUntil === 0 && now.getTime() >= todayEndTs) {
    daysUntil = 7;
  }

  const targetDate = new Date(now.getTime() + daysUntil * 24 * 3600 * 1000);
  const targetDateStr = getHanoiDateString(targetDate);

  return {
    dateStr: targetDateStr,
    startTs: parseHanoiTargetTimestamp(targetDateStr, exam.startTimeStr),
    endTs: parseHanoiTargetTimestamp(targetDateStr, exam.endTimeStr)
  };
}

/**
 * Lấy trạng thái hiện tại của kỳ thi: 'upcoming' | 'opening' | 'in_progress' | 'ended'
 */
export function getLiveExamStatus(exam) {
  const occurrence = getNextExamOccurrence(exam);
  const nowTs = Date.now();

  const openLobbyTs = occurrence.startTs - 10 * 60 * 1000; // Mở sảnh chờ 10 phút trước giờ thi

  if (nowTs < openLobbyTs) {
    return {
      status: 'upcoming',
      occurrence,
      countdown: calculateHanoiCountdown(occurrence.startTs),
      openLobbyCountdown: calculateHanoiCountdown(openLobbyTs)
    };
  }

  if (nowTs < occurrence.startTs) {
    return {
      status: 'opening',
      occurrence,
      countdown: calculateHanoiCountdown(occurrence.startTs)
    };
  }

  if (nowTs <= occurrence.endTs) {
    return {
      status: 'in_progress',
      occurrence,
      countdown: calculateHanoiCountdown(occurrence.endTs),
      elapsedSeconds: Math.floor((nowTs - occurrence.startTs) / 1000)
    };
  }

  return {
    status: 'ended',
    occurrence,
    countdown: { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  };
}

/**
 * Đọc danh sách đăng ký tham gia thi của người dùng hiện tại
 */
export function getRegisteredLiveExams() {
  try {
    const raw = localStorage.getItem(LIVE_EXAM_REG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Đăng ký tham gia kỳ thi & Cấp Số Báo Danh (SBD) chính thức
 */
export function registerForLiveExam(examId, user) {
  try {
    const list = getRegisteredLiveExams();
    const existing = list.find((item) => item.examId === examId);
    if (existing) return existing;

    const shortId = Math.floor(1000 + Math.random() * 9000);
    const candidateNumber = `SBD-${shortId}`;
    const newReg = {
      examId,
      candidateNumber,
      userEmail: user?.email || 'thi_sinh@onthihub.vn',
      userName: user?.displayName || user?.email?.split('@')[0] || `Thí Sinh #${shortId}`,
      registeredAt: new Date().toISOString()
    };

    list.push(newReg);
    localStorage.setItem(LIVE_EXAM_REG_KEY, JSON.stringify(list));
    return newReg;
  } catch (e) {
    return null;
  }
}

/**
 * Hủy đăng ký thi
 */
export function unregisterFromLiveExam(examId) {
  try {
    const list = getRegisteredLiveExams().filter((item) => item.examId !== examId);
    localStorage.setItem(LIVE_EXAM_REG_KEY, JSON.stringify(list));
  } catch (e) {}
}

/**
 * Đọc kết quả thi đã lưu của người dùng
 */
export function getSavedLiveExamResults(examId) {
  try {
    const raw = localStorage.getItem(`${LIVE_EXAM_RESULTS_KEY}_${examId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Lưu kết quả thi & Tự động xếp hạng vào Bảng Vàng trực tiếp
 */
export function submitLiveExamResult({
  examId,
  user,
  candidateNumber,
  score,
  totalQuestions,
  timeSpentSeconds,
  tabSwitchCount = 0
}) {
  const percentage = Math.round((score / Math.max(1, totalQuestions)) * 100);
  const targetExam = SCHEDULED_LIVE_EXAMS.find((e) => e.id === examId);
  const passed = percentage >= (targetExam?.passThresholdPercent || 50);

  const resultRecord = {
    examId,
    candidateNumber,
    userName: user?.displayName || user?.email?.split('@')[0] || candidateNumber,
    userEmail: user?.email || 'thi_sinh@onthihub.vn',
    score,
    totalQuestions,
    percentage,
    passed,
    timeSpentSeconds,
    tabSwitchCount,
    submittedAt: new Date().toISOString(),
    certCode: `LIVE-${Math.floor(100000 + Math.random() * 900000)}`
  };

  try {
    localStorage.setItem(`${LIVE_EXAM_RESULTS_KEY}_${examId}`, JSON.stringify(resultRecord));
  } catch (e) {}

  // Cập nhật Bảng Vàng Realtime (Leaderboard)
  const leaderboard = getLiveExamLeaderboard(examId);
  leaderboard.push(resultRecord);

  // Sắp xếp: Điểm cao hơn xếp trên; nếu bằng điểm thì nộp bài nhanh hơn xếp trên
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSpentSeconds - b.timeSpentSeconds;
  });

  try {
    localStorage.setItem(`onthi_live_leaderboard_${examId}`, JSON.stringify(leaderboard));
  } catch (e) {}

  // Tính thứ hạng của thí sinh
  const userRank = leaderboard.findIndex((r) => r.candidateNumber === candidateNumber) + 1;

  // Thưởng Gói Hội Viên danh giá dựa trên thứ hạng
  let rewardedMembership = null;
  let rewardedTier = null;

  if (userRank === 1 && targetExam?.rewards?.top1) {
    rewardedTier = targetExam.rewards.top1.tier || 'ultra';
    rewardedMembership = targetExam.rewards.top1.name;
  } else if (userRank === 2 && targetExam?.rewards?.top2) {
    rewardedTier = targetExam.rewards.top2.tier || 'pro';
    rewardedMembership = targetExam.rewards.top2.name;
  } else if (userRank === 3 && targetExam?.rewards?.top3) {
    rewardedTier = targetExam.rewards.top3.tier || 'pro';
    rewardedMembership = targetExam.rewards.top3.name;
  } else if (passed && targetExam?.rewards?.passed) {
    rewardedTier = targetExam.rewards.passed.tier || 'plus';
    rewardedMembership = targetExam.rewards.passed.name;
  }

  // Tự động kích hoạt nâng cấp gói hội viên cho thí sinh
  if (rewardedTier) {
    try {
      const currentTier = getUserTier();
      const tierRankMap = { free: 0, plus: 1, pro: 2, ultra: 3 };
      if ((tierRankMap[rewardedTier] || 0) > (tierRankMap[currentTier] || 0)) {
        setUserTier(rewardedTier);
      }
    } catch (e) {}
  }

  return {
    ...resultRecord,
    rank: userRank,
    rewardedMembership,
    rewardedTier,
    rewardedCoins: 0, // Thay thế hoàn toàn bằng Gói Hội Viên để chống thâm hụt tài chính & lạm phát
    totalParticipants: leaderboard.length
  };
}

/**
 * Lấy danh sách Bảng Vàng trực tiếp của kỳ thi
 */
export function getLiveExamLeaderboard(examId) {
  try {
    const raw = localStorage.getItem(`onthi_live_leaderboard_${examId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}

  // Danh sách thí sinh tiêu biểu mẫu nếu chưa có dữ liệu
  return [
    {
      candidateNumber: 'SBD-9182',
      userName: 'Vũ Minh Trí (Thủ khoa)',
      score: 59,
      totalQuestions: 60,
      percentage: 98,
      timeSpentSeconds: 1820,
      passed: true
    },
    {
      candidateNumber: 'SBD-4421',
      userName: 'Lê Thu Thảo',
      score: 58,
      totalQuestions: 60,
      percentage: 96,
      timeSpentSeconds: 2150,
      passed: true
    },
    {
      candidateNumber: 'SBD-6730',
      userName: 'Nguyễn Thành Nam',
      score: 56,
      totalQuestions: 60,
      percentage: 93,
      timeSpentSeconds: 2310,
      passed: true
    }
  ];
}
