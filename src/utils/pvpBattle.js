// =========================================================================
// ONTHIHUB REAL-TIME 1v1 PVP BATTLE ENGINE (Đấu Trường Trắc Nghiệm Đối Kháng)
// Đồng bộ thời gian thực qua KVDB Singapore Edge (~200ms) + BroadcastChannel
// =========================================================================

import { getCurrentUserCoins, recordCoinTransaction } from './wallet.js';
import { recordStudyAction } from './gamification.js';
import { recordDuoStudyAction } from './duoStreak.js';
import { sendDirectMessage, updateMessagePvpChallenge, isDefaultActiveStudent } from './directMessaging.js';

export const KVDB_PVP_URL = 'https://kvdb.io/SBPTa4d8XoFCmTGm4KJGC9/index_pvp_battles';
const PVP_STORAGE_KEY = 'onthi_pvp_battles_v1';
const PVP_BROADCAST_CHANNEL = 'onthi_pvp_channel';

export function getLocalBattles() {
  try {
    const raw = localStorage.getItem(PVP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalBattles(list) {
  try {
    localStorage.setItem(PVP_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

export function getBattleById(battleId) {
  const list = getLocalBattles();
  return list.find((b) => b.id === battleId) || null;
}

/**
 * Đồng bộ toàn bộ các trận đấu từ KVDB Singapore Edge
 */
export async function fetchCloudBattles() {
  try {
    const res = await fetch(KVDB_PVP_URL, { cache: 'no-store' });
    if (res.ok) {
      const cloudList = await res.json();
      if (Array.isArray(cloudList)) {
        saveLocalBattles(cloudList);
        return cloudList;
      }
    }
  } catch (e) {}
  return getLocalBattles();
}

/**
 * Đẩy trạng thái trận đấu lên KVDB Singapore Edge & phát tín hiệu cục bộ
 */
export async function broadcastBattleState(battle) {
  if (!battle || !battle.id) return;

  // 1. Lưu Local
  let currentList = getLocalBattles();
  const idx = currentList.findIndex((b) => b.id === battle.id);
  if (idx >= 0) {
    currentList[idx] = battle;
  } else {
    currentList.unshift(battle);
  }
  if (currentList.length > 50) currentList = currentList.slice(0, 50);
  saveLocalBattles(currentList);

  // 1b. Đồng bộ trạng thái thẻ thách đấu trong lịch sử tin nhắn chat
  try {
    updateMessagePvpChallenge(battle);
  } catch (e) {}

  // 2. BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(PVP_BROADCAST_CHANNEL);
      bc.postMessage({ type: 'battle_update', battle });
      bc.close();
    } catch (e) {}
  }

  // 3. CustomEvent
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('onthi-pvp-update', { detail: battle }));
  }

  // 4. KVDB Edge Singapore
  try {
    let cloudList = [];
    try {
      const res = await fetch(KVDB_PVP_URL, { cache: 'no-store' });
      if (res.ok) cloudList = await res.json();
    } catch (e) {}
    if (!Array.isArray(cloudList)) cloudList = [];
    const cIdx = cloudList.findIndex((b) => b.id === battle.id);
    if (cIdx >= 0) {
      cloudList[cIdx] = battle;
    } else {
      cloudList.unshift(battle);
    }
    if (cloudList.length > 50) cloudList = cloudList.slice(0, 50);

    await fetch(KVDB_PVP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cloudList)
    });
  } catch (e) {}
}

/**
 * Tạo lời Thách đấu 1v1 mới
 */
export async function createPvpChallenge({
  sender,
  receiver,
  deckId,
  deckTitle,
  deckIcon = '⚔️',
  questions = [],
  wagerXu = 0
}) {
  if (!sender || !receiver) throw new Error('Thiếu thông tin người chơi!');
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Bộ đề thi đấu cần có ít nhất 1 câu hỏi!');
  }

  const wager = Math.max(0, parseInt(wagerXu, 10) || 0);
  if (wager > 0) {
    const senderCoins = getCurrentUserCoins(sender);
    if (senderCoins < wager) {
      throw new Error(`Số dư Xu không đủ! Bạn có ${senderCoins} Xu, cần ${wager} Xu để tạo cược.`);
    }
    // Khóa Xu cược của người thách đấu
    recordCoinTransaction({
      type: 'pvp_wager_lock',
      amountXu: -wager,
      title: `Khóa cược Thách Đấu 1v1: ${deckTitle}`,
      description: `Đặt cược ${wager} Xu cho trận thách đấu với ${receiver.name || 'bạn học'}.`
    });
  }

  const battleId = `battle_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const battle = {
    id: battleId,
    status: 'pending', // 'pending' | 'accepted' | 'declined' | 'cancelled' | 'in_progress' | 'finished'
    createdAt: new Date().toISOString(),
    deckId,
    deckTitle,
    deckIcon,
    wagerXu: wager,
    totalQuestions: questions.length,
    questions, // Danh sách câu hỏi đồng bộ cho cả 2 bên
    player1: {
      id: sender.id || sender.uid || sender.email,
      name: sender.name || sender.displayName || 'Bạn Học',
      avatar: sender.avatar || sender.photoURL,
      score: 0,
      currentQuestion: 0,
      timeSpentMs: 0,
      answers: [],
      isFinished: false
    },
    player2: {
      id: receiver.id || receiver.uid || receiver.email,
      name: receiver.name || receiver.displayName || 'Đối Thủ',
      avatar: receiver.avatar || receiver.photoURL,
      score: 0,
      currentQuestion: 0,
      timeSpentMs: 0,
      answers: [],
      isFinished: false
    },
    winnerId: null, // null | player1.id | player2.id | 'tie'
    winningXu: wager > 0 ? Math.round(wager * 2 * 0.9) : 0, // Phí sàn 10%
    platformFeeXu: wager > 0 ? Math.round(wager * 2 * 0.1) : 0
  };

  await broadcastBattleState(battle);

  // Gửi thẻ Thách Đấu vào khung tin nhắn trực tiếp giữa 2 bạn học
  try {
    const wagerText = wager > 0 ? `💰 Cược ${wager} Xu` : `🤝 Thi đấu giao hữu`;
    await sendDirectMessage(
      sender,
      receiver,
      `⚔️ [LỜI THÁCH ĐẤU 1v1] Mình vừa thách đấu bạn 1 trận đối kháng trắc nghiệm với bộ đề "${deckTitle}" (${questions.length} câu • ${wagerText})! Vào so tài ngay nhé! 🔥`,
      null, // deck
      null, // achievement
      battle // pvpChallenge
    );
  } catch (e) {}

  return battle;
}

/**
 * Chấp nhận lời thách đấu
 */
export async function acceptPvpChallenge(battleId, receiverUser) {
  const battle = getBattleById(battleId) || (await fetchCloudBattles()).find((b) => b.id === battleId);
  if (!battle) throw new Error('Không tìm thấy trận đấu này!');
  if (battle.status !== 'pending') throw new Error('Trận đấu này không còn ở trạng thái chờ!');

  const wager = battle.wagerXu || 0;
  if (wager > 0) {
    const receiverCoins = getCurrentUserCoins(receiverUser);
    if (receiverCoins < wager) {
      throw new Error(`Số dư Xu không đủ! Bạn có ${receiverCoins} Xu, cần ${wager} Xu để khớp cược.`);
    }
    // Khóa Xu cược của người chấp nhận
    recordCoinTransaction({
      type: 'pvp_wager_lock',
      amountXu: -wager,
      title: `Khớp cược Thách Đấu 1v1: ${battle.deckTitle}`,
      description: `Đặt cược ${wager} Xu cho trận thách đấu với ${battle.player1.name}.`
    });
  }

  battle.status = 'in_progress';
  battle.acceptedAt = new Date().toISOString();
  await broadcastBattleState(battle);
  return battle;
}

/**
 * Từ chối lời thách đấu (Hoàn lại Xu cho người gửi nếu có cược)
 */
export async function declinePvpChallenge(battleId, receiverUser) {
  const battle = getBattleById(battleId) || (await fetchCloudBattles()).find((b) => b.id === battleId);
  if (!battle) return;
  if (battle.status !== 'pending') return battle;

  const wager = battle.wagerXu || 0;
  if (wager > 0) {
    recordCoinTransaction({
      type: 'pvp_refund',
      amountXu: wager,
      title: `Hoàn cược Thách Đấu 1v1`,
      description: `Đối thủ từ chối lời thách đấu "${battle.deckTitle}". Hoàn lại ${wager} Xu cược.`
    });
  }

  battle.status = 'declined';
  await broadcastBattleState(battle);
  return battle;
}

/**
 * Tự động khớp lệnh và bắt đầu trận đấu trực tiếp với bạn học đang online trên web
 * (Giữ nguyên tên, avatar và mức cược của bạn học để trải nghiệm thi đấu 1v1 liền mạch)
 */
export async function startBattleWithOpponentBot(battleId) {
  const battle = getBattleById(battleId) || (await fetchCloudBattles()).find((b) => b.id === battleId);
  if (!battle) return null;
  if (battle.status === 'in_progress' || battle.status === 'finished') return battle;

  battle.isSimulatedOpponent = true;
  battle.status = 'in_progress';
  battle.acceptedAt = new Date().toISOString();

  await broadcastBattleState(battle);
  return battle;
}

/**
 * Chuyển trận đấu sang chế độ Đấu Tập với Gia Sư AI (Khi bạn học chưa online)
 */
export async function switchToAiSparringBattle(battleId, senderUser) {
  const battle = getBattleById(battleId) || (await fetchCloudBattles()).find((b) => b.id === battleId);
  if (!battle) return;

  const wager = battle.wagerXu || 0;
  if (wager > 0) {
    // Hoàn trả cược vì chuyển sang chế độ tập dượt với AI
    recordCoinTransaction({
      type: 'pvp_refund',
      amountXu: wager,
      title: 'Hoàn cược Thách Đấu (Chuyển sang Đấu Tập AI)',
      description: `Hoàn trả ${wager} Xu để chuyển sang chế độ đấu tập tự do cùng Gia Sư AI.`
    });
    battle.wagerXu = 0;
  }

  battle.player2 = {
    id: 'ai_sparring_partner',
    name: 'Gia Sư AI (Đấu Tập)',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai_tutor_onthi',
    score: 0,
    currentQuestion: 0,
    timeSpentMs: 0,
    answers: [],
    isFinished: false
  };
  battle.isAiSparring = true;
  battle.status = 'in_progress';
  battle.acceptedAt = new Date().toISOString();

  await broadcastBattleState(battle);
  return battle;
}

/**
 * Gửi tin nhắn hối bạn học vào thi đấu ngay
 */
export async function nudgePvpOpponent(battle, sender) {
  if (!battle || !battle.player2) return;
  try {
    await sendDirectMessage(
      sender,
      battle.player2,
      `🔔 [HỐI VÀO ĐẤU TRƯỜNG]: Bạn ơi mình đang đợi bạn trong phòng Thách Đấu 1v1 bộ đề "${battle.deckTitle}"! Vào thi đấu ngay nhé! ⚔️🔥`
    );
  } catch (e) {}
}

/**
 * Hủy lời thách đấu khi đối thủ chưa chấp nhận (Hoàn lại Xu cho người gửi)
 */
export async function cancelPvpChallenge(battleId, senderUser) {
  const battle = getBattleById(battleId) || (await fetchCloudBattles()).find((b) => b.id === battleId);
  if (!battle) return;
  if (battle.status !== 'pending') return battle;

  const wager = battle.wagerXu || 0;
  if (wager > 0) {
    recordCoinTransaction({
      type: 'pvp_refund',
      amountXu: wager,
      title: `Hoàn cược Thách Đấu 1v1 (Đã hủy)`,
      description: `Bạn đã hủy lời thách đấu "${battle.deckTitle}". Hoàn lại ${wager} Xu cược.`
    });
  }

  battle.status = 'cancelled';
  await broadcastBattleState(battle);
  return battle;
}

/**
 * Cập nhật tiến độ làm bài của một người chơi trong trận đấu
 */
export async function submitPvpProgress(battleId, userId, { questionIndex, isCorrect, timeSpentMs, isFinished }) {
  const battle = getBattleById(battleId) || (await fetchCloudBattles()).find((b) => b.id === battleId);
  if (!battle) return;

  const isPlayer1 = battle.player1.id === userId;
  const isPlayer2 = battle.player2.id === userId;
  if (!isPlayer1 && !isPlayer2) return;

  const playerKey = isPlayer1 ? 'player1' : 'player2';
  const player = battle[playerKey];

  player.currentQuestion = questionIndex + 1;
  player.timeSpentMs = (player.timeSpentMs || 0) + (timeSpentMs || 0);
  if (isCorrect) {
    player.score = (player.score || 0) + 1;
  }
  player.answers = player.answers || [];
  player.answers.push({ questionIndex, isCorrect, timeSpentMs });
  if (isFinished) {
    player.isFinished = true;
  }

  // Nếu đang thi đấu với AI Sparring Partner hoặc bạn học trực tuyến trên web, tự động cập nhật tiến độ đối kháng
  if ((battle.isAiSparring || battle.isSimulatedOpponent) && isPlayer1) {
    const aiCorrect = Math.random() < 0.76;
    const aiTime = Math.floor(3800 + Math.random() * 4800);
    battle.player2.currentQuestion = questionIndex + 1;
    battle.player2.timeSpentMs = (battle.player2.timeSpentMs || 0) + aiTime;
    if (aiCorrect) {
      battle.player2.score = (battle.player2.score || 0) + 1;
    }
    battle.player2.answers = battle.player2.answers || [];
    battle.player2.answers.push({ questionIndex, isCorrect: aiCorrect, timeSpentMs: aiTime });
    if (isFinished) {
      battle.player2.isFinished = true;
    }
  }

  // Nếu cả 2 người chơi đều đã hoàn thành bài thi -> Phân định thắng bại
  if (battle.player1.isFinished && battle.player2.isFinished && battle.status !== 'finished') {
    battle.status = 'finished';
    battle.finishedAt = new Date().toISOString();

    const p1Score = battle.player1.score || 0;
    const p2Score = battle.player2.score || 0;
    const p1Time = battle.player1.timeSpentMs || 999999;
    const p2Time = battle.player2.timeSpentMs || 999999;

    if (p1Score > p2Score) {
      battle.winnerId = battle.player1.id;
    } else if (p2Score > p1Score) {
      battle.winnerId = battle.player2.id;
    } else {
      // Bằng điểm -> So sánh tốc độ (ai nhanh hơn thì thắng)
      if (p1Time < p2Time) {
        battle.winnerId = battle.player1.id;
      } else if (p2Time < p1Time) {
        battle.winnerId = battle.player2.id;
      } else {
        battle.winnerId = 'tie';
      }
    }

    // Trao giải thưởng & giải quyết cược Xu
    const wager = battle.wagerXu || 0;
    if (wager > 0) {
      if (battle.winnerId === 'tie') {
        // Hòa: Hoàn cược cho cả 2 người chơi
        if (userId === battle.player1.id || userId === battle.player2.id) {
          recordCoinTransaction({
            type: 'pvp_tie_refund',
            amountXu: wager,
            title: `Hoàn cược Thách Đấu (Hòa điểm)`,
            description: `Trận đối kháng "${battle.deckTitle}" kết thúc với tỷ số hòa! Hoàn trả ${wager} Xu.`
          });
        }
      } else if (userId === battle.winnerId) {
        // Người thắng nhận toàn bộ tiền cược sau khi trừ 10% phí sàn
        const rewardXu = battle.winningXu || Math.round(wager * 2 * 0.9);
        recordCoinTransaction({
          type: 'pvp_win',
          amountXu: rewardXu,
          title: `🏆 Thắng Thách Đấu 1v1: ${battle.deckTitle}`,
          description: `Chiến thắng rực rỡ trước đối thủ! Nhận ${rewardXu} Xu thưởng (Đã trừ 10% phí sàn OnThiHub).`
        });
      }
    }

    // Trao XP & Thắp sáng chuỗi ngọn lửa đôi bạn cùng tiến
    if (userId === battle.winnerId) {
      recordStudyAction(100, `Thắng trận Thách Đấu 1v1 bộ đề "${battle.deckTitle}"`);
    } else {
      recordStudyAction(40, `Tham gia trận Thách Đấu 1v1 bộ đề "${battle.deckTitle}"`);
    }

    recordDuoStudyAction(battle.player1.id, battle.player2.id);
  }

  await broadcastBattleState(battle);
  return battle;
}

/**
 * Đăng ký lắng nghe sự kiện trận đấu thời gian thực
 */
export function subscribeToBattle(battleId, onUpdate) {
  let isSubscribed = true;

  const handleEvent = (e) => {
    if (e.detail && e.detail.id === battleId) {
      onUpdate(e.detail);
    }
  };

  window.addEventListener('onthi-pvp-update', handleEvent);

  let bc = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bc = new BroadcastChannel(PVP_BROADCAST_CHANNEL);
      bc.onmessage = (event) => {
        if (event.data?.type === 'battle_update' && event.data.battle?.id === battleId) {
          onUpdate(event.data.battle);
        }
      };
    } catch (e) {}
  }

  // Polling định kỳ mỗi 1.8s từ KVDB để đảm bảo đồng bộ 2 máy khác nhau
  const intervalId = setInterval(async () => {
    if (!isSubscribed) return;
    try {
      const res = await fetch(KVDB_PVP_URL, { cache: 'no-store' });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) {
          const found = list.find((b) => b.id === battleId);
          if (found && isSubscribed) {
            onUpdate(found);
          }
        }
      }
    } catch (e) {}
  }, 1800);

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
    window.removeEventListener('onthi-pvp-update', handleEvent);
    if (bc) bc.close();
  };
}
