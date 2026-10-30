// =========================================================================
// HANOI TIME ENGINE & STUDY TIME TRACE LOGS (VIETNAM ICT - GMT+7)
// Đồng bộ toàn diện múi giờ Hà Nội (UTC+7) & Hệ thống lưu vết thời gian học tập
// =========================================================================

export const HANOI_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const STUDY_LOGS_KEY = 'onthi_study_time_logs_v1';
export const TARGET_CLOCK_KEY = 'onthi_target_study_clock_v1';

/**
 * Chuyển đổi an toàn mọi đầu vào (Date, ISO string, timestamp) thành đối tượng Date hợp lệ
 */
export function toValidHanoiDate(val) {
  if (!val) return new Date();
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? new Date() : val;
  }
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date() : d;
  }
  if (typeof val === 'string') {
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
}

/**
 * Lấy chuỗi ngày YYYY-MM-DD theo giờ Hà Nội (GMT+7)
 * Đảm bảo sau 00:00 đêm tính đúng ngày mới của Việt Nam
 */
export function getHanoiDateString(input = new Date()) {
  const date = toValidHanoiDate(input) || new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: HANOI_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  } catch (e) {
    // Fallback if Intl fails
    const d = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  }
}

/**
 * Lấy chuỗi giờ HH:mm:ss hoặc HH:mm theo giờ Hà Nội (GMT+7)
 */
export function getHanoiTimeString(input = new Date(), includeSeconds = true) {
  const date = toValidHanoiDate(input) || new Date();
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: HANOI_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      hour12: false
    }).format(date);
  } catch (e) {
    const d = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const h = String(d.getUTCHours()).padStart(2, '0');
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    const s = String(d.getUTCSeconds()).padStart(2, '0');
    return includeSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
  }
}

/**
 * Lấy chuỗi định dạng đầy đủ ngày & giờ theo chuẩn Việt Nam
 * Hỗ trợ nhận Date, chuỗi ISO, timestamp hoặc chuỗi mô tả (fallback an toàn)
 * Ví dụ: "17/10/2026, 00:05:12 (Giờ Hà Nội)"
 */
export function formatHanoiDateTime(input = new Date(), includeLabel = true) {
  const date = toValidHanoiDate(input);
  if (!date) {
    return String(input || 'Vừa xong');
  }
  try {
    const dStr = new Intl.DateTimeFormat('vi-VN', {
      timeZone: HANOI_TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
    const tStr = getHanoiTimeString(date, true);
    return `${dStr} ${tStr}${includeLabel ? ' (Giờ Hà Nội)' : ''}`;
  } catch (e) {
    return `${getHanoiDateString(date)} ${getHanoiTimeString(date, true)}`;
  }
}

/**
 * Định dạng thời gian tương đối theo giờ Hà Nội (GMT+7)
 * Ví dụ: "Vừa xong", "5 phút trước", "2 giờ trước", "3 ngày trước", "18/10/2026 14:30"
 */
export function formatHanoiRelativeTime(input) {
  if (!input) return 'Vừa xong';
  const date = toValidHanoiDate(input);
  if (!date) return String(input);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // If in the future or under 1 minute
  if (diffMs < 60 * 1000) {
    return 'Vừa xong';
  }

  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }

  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }

  // Older than 7 days: format DD/MM/YYYY HH:mm (Hanoi timezone)
  try {
    const dStr = new Intl.DateTimeFormat('vi-VN', {
      timeZone: HANOI_TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
    const tStr = getHanoiTimeString(date, false);
    return `${dStr} ${tStr}`;
  } catch (e) {
    return `${getHanoiDateString(date)} ${getHanoiTimeString(date, false)}`;
  }
}

/**
 * Lấy tên thứ trong tuần theo giờ Hà Nội (Thứ Hai, Thứ Ba...)
 */
export function getHanoiDayOfWeekName(input = new Date()) {
  const date = toValidHanoiDate(input) || new Date();
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: HANOI_TIMEZONE,
      weekday: 'long'
    }).format(date);
  } catch (e) {
    return 'Hôm nay';
  }
}

/**
 * Lấy đối tượng ngày giờ hiện tại chuẩn theo Hà Nội
 */
export function getHanoiNowComponents() {
  const date = new Date();
  const dateString = getHanoiDateString(date);
  const timeString = getHanoiTimeString(date, true);
  const timeShort = getHanoiTimeString(date, false);
  const dayName = getHanoiDayOfWeekName(date);
  const fullFormatted = formatHanoiDateTime(date, true);

  return {
    date,
    dateString,
    timeString,
    timeShort,
    dayName,
    fullFormatted,
    timezone: 'GMT+7 (Hà Nội)'
  };
}

// =========================================================================
// STUDY TIME HISTORY TRACE (HỆ THỐNG LƯU VẾT THỜI GIAN HỌC TẬP)
// =========================================================================

/**
 * Ghi nhận một vết thời gian học tập vào nhật ký hệ thống
 * @param {Object} entry
 * @param {string} entry.type - 'pomodoro' | 'quiz' | 'flashcard' | 'checkin' | 'target_goal'
 * @param {string} entry.title - Tiêu đề hoạt động
 * @param {number} entry.durationMinutes - Số phút học (mặc định 1)
 * @param {number} entry.xpGained - Số XP nhận được
 * @param {Object} [entry.metadata] - Thông tin chi tiết bổ sung
 */
export function recordStudyTimeLog({
  type = 'study',
  title = 'Phiên làm việc & sáng tạo PromptMMO',
  durationMinutes = 1,
  xpGained = 10,
  metadata = {}
}) {
  try {
    const now = new Date();
    const hanoiDate = getHanoiDateString(now);
    const hanoiTime = getHanoiTimeString(now, true);
    const hanoiFormatted = formatHanoiDateTime(now, false);

    const newEntry = {
      id: `trace_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      title,
      durationMinutes: Math.max(1, Math.round(durationMinutes)),
      xpGained,
      hanoiDate,
      hanoiTime,
      hanoiFormatted,
      timestamp: Date.now(),
      metadata
    };

    const logs = getStudyTimeLogs();
    // Giữ 120 vết thời gian mới nhất để tối ưu hiệu năng
    const updated = [newEntry, ...logs].slice(0, 120);

    localStorage.setItem(STUDY_LOGS_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-study-log-added', { detail: newEntry }));
    }

    return newEntry;
  } catch (e) {
    console.error('Lỗi khi lưu vết thời gian:', e);
    return null;
  }
}

/**
 * Lấy toàn bộ danh sách vết thời gian học tập
 * @param {string} [dateFilter] - Tùy chọn lọc theo ngày 'YYYY-MM-DD' hoặc 'today'
 */
export function getStudyTimeLogs(dateFilter = null) {
  try {
    const raw = localStorage.getItem(STUDY_LOGS_KEY);
    const logs = raw ? JSON.parse(raw) : [];

    if (!dateFilter) return logs;

    const targetDate = dateFilter === 'today' ? getHanoiDateString() : dateFilter;
    return logs.filter((log) => log.hanoiDate === targetDate);
  } catch (e) {
    return [];
  }
}

/**
 * Xóa toàn bộ lịch sử vết thời gian học tập
 */
export function clearStudyTimeLogs() {
  try {
    localStorage.removeItem(STUDY_LOGS_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-study-log-cleared'));
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Tính tổng số phút đã học hôm nay theo giờ Hà Nội
 */
export function getTodayTotalStudyMinutes() {
  const todayLogs = getStudyTimeLogs('today');
  return todayLogs.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);
}

// =========================================================================
// =========================================================================
// TARGET STUDY CLOCK & GOAL SETTINGS (ĐỒNG HỒ MỤC TIÊU HỌC TẬP)
// =========================================================================

export const DEFAULT_TARGET_CLOCK = {
  dailyGoalMinutes: 60,       // Mục tiêu học 60 phút mỗi ngày
  targetEndTime: '23:00',      // Giờ mục tiêu kết thúc phiên học đêm (HH:mm)
  isAlarmEnabled: true,
  lastUpdatedDate: getHanoiDateString()
};

/**
 * Lấy thiết lập đồng hồ mục tiêu
 */
export function getTargetStudyClock() {
  try {
    const raw = localStorage.getItem(TARGET_CLOCK_KEY);
    if (!raw) return DEFAULT_TARGET_CLOCK;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_TARGET_CLOCK, ...parsed };
  } catch (e) {
    return DEFAULT_TARGET_CLOCK;
  }
}

/**
 * Lưu thiết lập đồng hồ mục tiêu
 */
export function saveTargetStudyClock(config) {
  try {
    const updated = {
      ...getTargetStudyClock(),
      ...config,
      lastUpdatedDate: getHanoiDateString()
    };
    localStorage.setItem(TARGET_CLOCK_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-target-clock-change', { detail: updated }));
    }

    return updated;
  } catch (e) {
    return DEFAULT_TARGET_CLOCK;
  }
}

/**
 * Tính toán tiến độ đồng hồ mục tiêu hôm nay
 */
export function calculateTargetClockProgress() {
  const target = getTargetStudyClock();
  const todayMinutes = getTodayTotalStudyMinutes();
  const dailyGoalMinutes = target.dailyGoalMinutes || 60;
  const percent = Math.min(100, Math.round((todayMinutes / Math.max(1, dailyGoalMinutes)) * 100));
  const remainingMinutes = Math.max(0, dailyGoalMinutes - todayMinutes);
  const isGoalAchieved = todayMinutes >= dailyGoalMinutes;

  return {
    todayMinutes,
    dailyGoalMinutes,
    percent,
    remainingMinutes,
    isGoalAchieved,
    targetEndTime: target.targetEndTime || '23:00'
  };
}

// =========================================================================
// REAL-TIME EXAM COUNTDOWN ENGINE (ĐỒNG HỒ ĐẾM NGƯỢC THỜI GIAN THỰC)
// =========================================================================

export const EXAM_NAME_KEY = 'onthi_target_exam_name';
export const EXAM_DATE_KEY = 'onthi_target_exam_date';
export const EXAM_TIME_KEY = 'onthi_target_exam_time';

export const DEFAULT_EXAM_NAME = 'Kỳ Thi Công Chức 2026 (Vòng 1 Kiến Thức Chung)';
export const DEFAULT_EXAM_TIME = '08:00';

/**
 * Lấy ngày thi mặc định an toàn cách ngày hiện tại một số ngày nhất định theo giờ Hà Nội
 */
export function getUpcomingDefaultExamDate(offsetDays = 45) {
  const hanoiToday = getHanoiDateString();
  const [y, m, d] = hanoiToday.split('-').map(Number);
  const target = new Date(Date.UTC(y, m - 1, d + offsetDays));
  const ty = target.getUTCFullYear();
  const tm = String(target.getUTCMonth() + 1).padStart(2, '0');
  const td = String(target.getUTCDate()).padStart(2, '0');
  return `${ty}-${tm}-${td}`;
}

/**
 * Chuyển đổi an toàn ngày YYYY-MM-DD và giờ HH:mm thành timestamp UTC chuẩn theo Giờ Hà Nội (UTC+7)
 */
export function parseHanoiTargetTimestamp(dateStr, timeStr = '08:00') {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return null;
  }
  const [y, m, d] = parts;

  let hours = 8;
  let mins = 0;
  let secs = 0;
  if (timeStr && typeof timeStr === 'string') {
    const tParts = timeStr.split(':').map(Number);
    if (tParts.length >= 1 && !isNaN(tParts[0])) hours = tParts[0];
    if (tParts.length >= 2 && !isNaN(tParts[1])) mins = tParts[1];
    if (tParts.length >= 3 && !isNaN(tParts[2])) secs = tParts[2];
  }

  // Giờ Hà Nội là UTC+7 -> Giờ UTC tương ứng = hours - 7
  return Date.UTC(y, m - 1, d, hours - 7, mins, secs);
}

/**
 * Tính toán chênh lệch thời gian thực tế đến thời điểm đích (ms & các đơn vị ngày, giờ, phút, giây)
 */
export function calculateHanoiCountdown(targetTimestamp) {
  if (!targetTimestamp || isNaN(targetTimestamp)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true };
  }
  const now = Date.now();
  const diffMs = targetTimestamp - now;
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalSeconds, isExpired: false };
}

/**
 * Lấy timestamp UTC của nửa đêm hôm nay (23:59:59.999) theo Giờ Hà Nội (UTC+7)
 */
export function getHanoiMidnightTimestamp() {
  const hanoiToday = getHanoiDateString();
  const [y, m, d] = hanoiToday.split('-').map(Number);
  // 23:59:59.999 tại Hà Nội (UTC+7) tương ứng 16:59:59.999 UTC
  return Date.UTC(y, m - 1, d, 16, 59, 59, 999);
}

/**
 * Lấy cấu hình kỳ thi mục tiêu hiện tại (tự động phát hiện và gia hạn nếu ngày đã qua)
 */
export function getStoredExamTarget() {
  try {
    let name = localStorage.getItem(EXAM_NAME_KEY) || DEFAULT_EXAM_NAME;
    let date = localStorage.getItem(EXAM_DATE_KEY);
    let time = localStorage.getItem(EXAM_TIME_KEY) || DEFAULT_EXAM_TIME;

    if (!date) {
      date = getUpcomingDefaultExamDate(45);
      localStorage.setItem(EXAM_DATE_KEY, date);
    } else {
      const targetTs = parseHanoiTargetTimestamp(date, time);
      // Nếu ngày lưu trong quá khứ, tự động cập nhật sang kỳ thi chu kỳ mới để đồng hồ không bị đứng ở 0
      if (!targetTs || targetTs <= Date.now()) {
        date = getUpcomingDefaultExamDate(45);
        localStorage.setItem(EXAM_DATE_KEY, date);
      }
    }

    return { name, date, time };
  } catch (e) {
    return {
      name: DEFAULT_EXAM_NAME,
      date: getUpcomingDefaultExamDate(45),
      time: DEFAULT_EXAM_TIME
    };
  }
}

/**
 * Lưu cấu hình kỳ thi mục tiêu và phát sự kiện đồng bộ toàn hệ thống
 */
export function saveStoredExamTarget({ name, date, time }) {
  try {
    if (name) localStorage.setItem(EXAM_NAME_KEY, name.trim());
    if (date) localStorage.setItem(EXAM_DATE_KEY, date);
    if (time) localStorage.setItem(EXAM_TIME_KEY, time);

    const updated = {
      name: (name || DEFAULT_EXAM_NAME).trim(),
      date: date || getUpcomingDefaultExamDate(45),
      time: time || DEFAULT_EXAM_TIME
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('onthi-target-exam-changed', { detail: updated }));
    }

    return updated;
  } catch (e) {
    return {
      name: name || DEFAULT_EXAM_NAME,
      date: date || getUpcomingDefaultExamDate(45),
      time: time || DEFAULT_EXAM_TIME
    };
  }
}
