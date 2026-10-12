import React, { useState } from 'react';
import { X, Trophy, Flame, Award, Sparkles, TrendingUp, Users, Target, CheckCircle2, Gift, Play } from 'lucide-react';
import { getStreakInfo, LEADERBOARD_USERS, getDailyQuests } from '../utils/gamification';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function LeaderboardModal({ onClose }) {
  const [activeSubTab, setActiveSubTab] = useState('leaderboard'); // 'leaderboard' | 'quests'
  const streakInfo = getStreakInfo();
  const [quests, setQuests] = useState(() => getDailyQuests());

  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-spring-3d">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <h4 className="text-base font-black">Bảng Vàng & Nhiệm Vụ</h4>
              <p className="text-xs text-amber-100">Cạnh tranh XP & Duy trì chuỗi Streak mỗi ngày</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="px-5 pt-3 pb-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeSubTab === 'leaderboard'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Bảng Xếp Hạng Top 5</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quests')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeSubTab === 'quests'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Nhiệm Vụ Ngày ({completedCount}/4)</span>
          </button>
        </div>

        {/* User Streak Card */}
        <div className="p-4 bg-gradient-to-b from-orange-50/60 to-white border-b border-slate-100">
          <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-orange-200 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                <Flame className="w-6 h-6 text-white fill-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-black text-slate-900">{streakInfo.streak} Ngày</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    Chuỗi Streak 🔥
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cấp bậc: <strong className="text-indigo-600">{streakInfo.level}</strong> ({streakInfo.xp} XP)
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block">Kỷ lục cao nhất:</span>
              <strong className="text-xs text-slate-800">{streakInfo.highestStreak} ngày liên tiếp</strong>
            </div>
          </div>
        </div>

        {/* TAB 1: LEADERBOARD */}
        {activeSubTab === 'leaderboard' && (
          <div className="p-5 overflow-y-auto flex-1 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
              Top 5 Học Bá Chăm Chỉ Nhất Tuần Này:
            </span>

            {LEADERBOARD_USERS.map((user) => {
              const isTop1 = user.rank === 1;
              const isTop2 = user.rank === 2;
              const isTop3 = user.rank === 3;

              return (
                <div
                  key={user.rank}
                  className={`p-3 rounded-2xl border flex items-center space-x-3 transition-all ${
                    isTop1
                      ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                      : isTop2
                      ? 'bg-slate-50 border-slate-300'
                      : isTop3
                      ? 'bg-orange-50/50 border-orange-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="w-7 text-center font-black text-sm">
                    {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${user.rank}`}
                  </div>

                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                        {user.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate">
                      Mục tiêu: {user.goal}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <strong className="text-xs sm:text-sm font-black text-amber-600 block">
                      {user.xp.toLocaleString()} XP
                    </strong>
                    <span className="text-[10px] text-slate-400 font-medium">
                      🔥 {user.streak} ngày
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
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-900">Tiến Độ Hôm Nay:</span>
                <p className="text-[11px] text-indigo-600">Hoàn thành 4/4 nhiệm vụ để nhận rương thưởng +10 Xu!</p>
              </div>
              <span className="text-sm font-black text-indigo-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-indigo-200">
                {completedCount}/4 Đạt
              </span>
            </div>

            {quests.map((q) => (
              <div
                key={q.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  q.completed
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    q.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {q.completed ? <CheckCircle2 className="w-5 h-5" /> : <Target className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold">{q.title}</h5>
                    <p className="text-[11px] text-slate-400">{q.desc}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-amber-600 block">+{q.xp} XP</span>
                  {q.completed ? (
                    <span className="text-[10px] font-bold text-emerald-600">Đã Hoàn Thành</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">Chưa Đạt</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Top 3 hàng tuần sẽ được thưởng <strong>+50 Xu</strong> vào ví vào 23:59 Chủ Nhật!
        </div>

      </div>
    </div>
  );
}

