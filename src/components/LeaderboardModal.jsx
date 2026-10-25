import React, { useState, useEffect, useMemo } from 'react';
import { X, Trophy, Flame, Target, CheckCircle2, Award, Share2 } from 'lucide-react';
import {
  getStreakInfo,
  getDailyQuests,
  LEADERBOARD_CLOUD_TOPIC,
  KVDB_LEADERBOARD_URL,
  broadcastUserLeaderboardEntry
} from '../utils/gamification';
import { getCurrentUser } from '../utils/firebaseConfig';
import { useModalDismiss } from '../hooks/useModalDismiss';

export default function LeaderboardModal({ onClose, onOpenShareAchievement }) {
  const [activeSubTab, setActiveSubTab] = useState('leaderboard'); // 'leaderboard' | 'quests'
  const streakInfo = getStreakInfo();
  const [quests] = useState(() => getDailyQuests());
  const [cloudEntriesMap, setCloudEntriesMap] = useState({});

  const completedCount = quests.filter(q => q.completed).length;

  useModalDismiss(onClose);

  // Sync real user leaderboard entries from Cloud Relay (KVDB Singapore Edge + ntfy fallback)
  useEffect(() => {
    let isMounted = true;
    if (streakInfo.xp > 0) {
      broadcastUserLeaderboardEntry(streakInfo);
    }

    // 1. Primary: KVDB Singapore Edge
    fetch(KVDB_LEADERBOARD_URL, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        if (!isMounted || !Array.isArray(list)) return;
        setCloudEntriesMap((prev) => {
          const next = { ...prev };
          list.forEach((data) => {
            if (data && data.type === 'leaderboard_sync' && data.clientId && data.xp > 0) {
              if (!next[data.clientId] || data.xp >= next[data.clientId].xp) {
                next[data.clientId] = data;
              }
            }
          });
          return next;
        });
      })
      .catch(() => {});

    // 2. Secondary fallback: ntfy
    fetch(`https://ntfy.sh/${LEADERBOARD_CLOUD_TOPIC}/json?poll=1&since=72h`)
      .then(res => res.text())
      .then(text => {
        if (!isMounted || !text) return;
        const lines = text.trim().split('\n');
        setCloudEntriesMap((prev) => {
          const map = { ...prev };
          lines.forEach(line => {
            try {
              const ev = JSON.parse(line);
              if (ev.event === 'message' && ev.message) {
                const data = JSON.parse(ev.message);
                if (data.type === 'leaderboard_sync' && data.clientId && data.xp > 0) {
                  if (!map[data.clientId] || data.xp >= map[data.clientId].xp) {
                    map[data.clientId] = data;
                  }
                }
              }
            } catch {}
          });
          return map;
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rankedUsers = useMemo(() => {
    const currentUser = getCurrentUser();
    const myId = currentUser?.uid || currentUser?.email || localStorage.getItem('onthi_studyroom_client_id_v3') || 'local_user';
    const myName = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Bạn (Học viên)');
    const myAvatar = currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(myName)}`;

    const combined = { ...cloudEntriesMap };
    if (streakInfo.xp > 0 || Object.keys(combined).length === 0) {
      combined[myId] = {
        clientId: myId,
        name: `${myName} (Bạn)`,
        avatar: myAvatar,
        xp: streakInfo.xp || 0,
        streak: streakInfo.streak || 0,
        badge: streakInfo.level || 'Học Viên Mới 🌱',
        goal: 'Chinh phục kỳ thi 2026',
        isCurrentUser: true
      };
    }

    return Object.values(combined)
      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
      .slice(0, 10)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [cloudEntriesMap, streakInfo]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 dark:border-white/10 animate-spring-3d cursor-default"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <h4 className="text-base font-black">Bảng Vàng & Nhiệm Vụ Thực Tế</h4>
              <p className="text-xs text-amber-100">Xếp hạng học viên thật theo điểm XP & chuỗi Streak</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs text-white bg-white/15 hover:bg-white/25 rounded-xl transition-colors cursor-pointer border border-white/20"
            title="Đóng (hoặc nhấn Esc, bấm ra ngoài)"
          >
            <span className="font-semibold">Đóng</span>
            <kbd className="text-[10px] font-mono bg-white/20 px-1 py-0.5 rounded text-white">Esc</kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="px-5 pt-3 pb-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-100 dark:border-white/10 flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeSubTab === 'leaderboard'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Bảng Xếp Hạng Thực Tế</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quests')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeSubTab === 'quests'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Nhiệm Vụ Ngày ({completedCount}/4)</span>
          </button>
        </div>

        {/* User Streak Card */}
        <div className="p-4 bg-gradient-to-b from-orange-50/60 to-white dark:from-slate-800/40 dark:to-slate-900 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-orange-200 dark:border-orange-500/30 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                <Flame className="w-6 h-6 text-white fill-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-black text-slate-900 dark:text-white">{streakInfo.streak} Ngày</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                    Chuỗi Streak 🔥
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Cấp bậc: <strong className="text-indigo-600 dark:text-indigo-400">{streakInfo.level}</strong> ({streakInfo.xp} XP)
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-1.5 shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block">Kỷ lục cá nhân:</span>
                <strong className="text-xs text-slate-800 dark:text-slate-200">{streakInfo.highestStreak} ngày</strong>
              </div>

              {onOpenShareAchievement && (
                <button
                  type="button"
                  onClick={() => {
                    const currentUser = getCurrentUser();
                    const myName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Học Viên ÔnThiHub';
                    onOpenShareAchievement({
                      type: 'streak',
                      title: 'Chuỗi Ngày Học Tập ÔnThiHub 2026',
                      streak: streakInfo.streak,
                      rank: streakInfo.level || 'Học Viên Bền Bỉ',
                      candidateName: myName,
                      certCode: `STREAK-${streakInfo.streak}D-${Math.floor(1000 + Math.random() * 9000)}`
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[10px] font-black flex items-center space-x-1 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <Award className="w-3 h-3" />
                  <span>Khoe Kỷ Lục</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TAB 1: REAL LEADERBOARD */}
        {activeSubTab === 'leaderboard' && (
          <div className="p-5 overflow-y-auto flex-1 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
              Bảng Xếp Hạng Học Viên Thực Tế (Không Bot):
            </span>

            {rankedUsers.map((u) => {
              const isTop1 = u.rank === 1;
              const isTop2 = u.rank === 2;
              const isTop3 = u.rank === 3;

              return (
                <div
                  key={u.clientId || u.rank}
                  className={`p-3 rounded-2xl border flex items-center space-x-3 transition-all ${
                    isTop1
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/50 shadow-sm'
                      : isTop2
                      ? 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-white/10'
                      : isTop3
                      ? 'bg-orange-50/50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-700/50'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="w-7 text-center font-black text-sm">
                    {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${u.rank}`}
                  </div>

                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {u.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
                        {u.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {u.goal || 'Đang ôn luyện trên ÔnThiHub'}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <strong className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 block">
                      {(u.xp || 0).toLocaleString()} XP
                    </strong>
                    <span className="text-[10px] text-slate-400 font-medium">
                      🔥 {u.streak || 0} ngày
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: DAILY QUESTS */}
        {activeSubTab === 'quests' && (
          <div className="p-5 overflow-y-auto flex-1 space-y-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Tiến Độ Hôm Nay:</span>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-300">Hoàn thành nhiệm vụ học tập thật để tích lũy XP!</p>
              </div>
              <span className="text-sm font-black text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl shadow-xs border border-indigo-200 dark:border-indigo-700/50">
                {completedCount}/4 Đạt
              </span>
            </div>

            {quests.map((q) => (
              <div
                key={q.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  q.completed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-100'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    q.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {q.completed ? <CheckCircle2 className="w-5 h-5" /> : <Target className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold">{q.title}</h5>
                    <p className="text-[11px] text-slate-400">{q.desc}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 block">+{q.xp} XP</span>
                  {q.completed ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Đã Hoàn Thành</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">Chưa Đạt</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
          Điểm XP được tính trực tiếp từ số thẻ bạn đã lật, bài thi thử và thời gian học thực tế.
        </div>
      </div>
    </div>
  );
}
