/**
 * BuiThai AI Studio (PromptMMO) - ntfy.sh & Web Audio Instant Push Notification Module
 * Đẩy thông báo tức thì về điện thoại & trình duyệt của Admin Bùi Thái (Non-blocking, 0% Treo)
 * Kèm âm thanh thông báo xúc giác Web Audio API (0MB) và Web Notification
 */

(function () {
  'use strict';

  const DEFAULT_TOPIC = 'buithai_studio_0986019623';
  const STORAGE_KEY = 'buithai_ntfy_topic_v1';

  // Âm thanh thông báo Web Audio API (Chime/Bell 0MB)
  function playNotificationChime(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'deposit') {
        // Âm tiền leng keng vui tươi (Ding-ding)
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now); // A5
        osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1320, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      } else if (type === 'success') {
        // Âm thành công du dương
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      } else {
        // Âm ping nhẹ
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      }

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      // Bỏ qua nếu trình duyệt chặn autoplay
    }
  }

  // Hiển thị Web Notification nếu được cấp quyền
  function showDesktopNotification(title, body) {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: '/favicon.svg'
        });
      }
    } catch (e) {}
  }

  window.BuiThaiNtfy = {
    getTopic: function () {
      try {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_TOPIC;
      } catch (e) {
        return DEFAULT_TOPIC;
      }
    },

    setTopic: function (topic) {
      topic = (topic || '').trim() || DEFAULT_TOPIC;
      try {
        localStorage.setItem(STORAGE_KEY, topic);
      } catch (e) {}
      return topic;
    },

    getSubscribeUrl: function () {
      return `https://ntfy.sh/${this.getTopic()}`;
    },

    /**
     * Gửi notification đến ntfy.sh bất đồng bộ với Timeout 1.8s (Không bao giờ làm nghẽn UI)
     */
    sendNotification: async function ({ title, message, priority = 'default', tags = [], clickUrl = '', actions = [] }) {
      const topic = this.getTopic();

      // Phát âm thanh chime cục bộ ngay lập tức để người dùng có phản hồi tức thì
      if (tags && tags.includes('moneybag')) {
        playNotificationChime('deposit');
      } else {
        playNotificationChime('success');
      }

      // Hiện Desktop Notification nếu có quyền
      showDesktopNotification(title, message);

      let priorityLevel = 3;
      if (priority === 'urgent' || priority === 'max') priorityLevel = 5;
      else if (priority === 'high') priorityLevel = 4;
      else if (priority === 'low' || priority === 'min') priorityLevel = 1;

      // Gửi ngầm không đợi (Fire-and-forget với AbortController chống nghẽn)
      (async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const payload = {
            topic: topic,
            title: title || 'Bùi Thái Prompt & Skill Studio',
            message: message || '',
            priority: priorityLevel,
            tags: tags || []
          };

          if (clickUrl) payload.click = clickUrl;
          if (actions && actions.length) payload.actions = actions;

          await fetch('https://ntfy.sh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          console.log(`[BuiThaiNtfy] Đã gửi thông báo thành công đến topic '${topic}'`);
        } catch (err) {
          // Bắt lỗi âm thầm, không ảnh hưởng đến luồng chính
          console.info('[BuiThaiNtfy] ntfy.sh offline hoặc timeout:', err.name);
        }
      })();

      return true;
    },

    /**
     * Bắn thông báo khi khách yêu cầu nạp Xu qua Techcombank (6688686866688)
     */
    notifyDepositRequest: function (topup) {
      if (!topup) return;
      const amount = topup.amount || 0;
      const customer = topup.userName ? `${topup.userName} (${topup.userEmail || ''})` : (topup.userEmail || 'Khách hàng');
      const memo = topup.memo || '';
      const bank = topup.bank || 'Techcombank (6688686866688)';

      const currentOrigin = (typeof window !== 'undefined' && window.location.origin) || 'https://promptmmo.vercel.app';
      const adminUrl = currentOrigin + '/#admin';

      return this.sendNotification({
        title: `💰 [BÙI THÁI STUDIO] YÊU CẦU NẠP +${amount.toLocaleString('vi-VN')} XU CẦN DUYỆT!`,
        message: `Khách: ${customer}\nSố tiền: ${amount.toLocaleString('vi-VN')} VNĐ (+${amount.toLocaleString('vi-VN')} Xu)\nSTK: 6688686866688 - BUI THAI\nNội dung: ${memo}\n👉 Bấm để vào Admin Duyệt Xu tức thì!`,
        priority: 'urgent',
        tags: ['moneybag', 'bell', 'rotating_light', 'white_check_mark'],
        clickUrl: adminUrl
      });
    },

    /**
     * Bắn thông báo khi có đơn hàng mới (mở khóa Prompt Toolkit)
     */
    notifyNewOrder: function (order) {
      if (!order) return;
      const orderId = order.id || order.orderCode || 'Đơn mới';
      const productName = order.productName || (order.items && order.items[0] && order.items[0].name) || 'Kỹ năng Prompt AI';
      const amount = order.total || order.amount || 0;
      const customer = order.userEmail || (order.customer && order.customer.email) || 'Khách hàng';

      const currentOrigin = (typeof window !== 'undefined' && window.location.origin) || 'https://promptmmo.vercel.app';
      const adminUrl = currentOrigin + '/#admin';

      return this.sendNotification({
        title: `🛒 [Bùi Thái Studio] Đơn #${orderId} (ĐÃ TRỪ XU)`,
        message: `Khách ${customer} vừa mở khóa: "${productName}"\nGiá trị: ${amount.toLocaleString('vi-VN')} Xu.\nKho vũ khí đã cấp bản quyền vĩnh viễn!`,
        priority: 'high',
        tags: ['shopping_cart', 'tada', 'sparkles'],
        clickUrl: adminUrl
      });
    },

    /**
     * Bắn thông báo khi Admin duyệt nạp Xu
     */
    notifyApprovedDeposit: function (topup) {
      if (!topup) return;
      const amount = topup.amount || 0;
      const customer = topup.userEmail || 'Khách hàng';

      return this.sendNotification({
        title: `✅ [Bùi Thái Studio] ĐÃ DUYỆT NẠP +${amount.toLocaleString('vi-VN')} XU!`,
        message: `Đã cộng thành công ${amount.toLocaleString('vi-VN')} Xu vào ví của tài khoản ${customer}.`,
        priority: 'default',
        tags: ['white_check_mark', 'sparkles']
      });
    },

    /**
     * Phát âm thanh chime Web Audio API 0MB (deposit, success, ping)
     */
    playChime: function (type) {
      playNotificationChime(type || 'deposit');
    },

    /**
     * Kéo danh sách nạp Xu ĐÃ ĐƯỢC DUYỆT từ kênh ntfy.sh
     * Giúp mọi thiết bị của khách hàng và Admin nhận tiền Xu tức thì không cần Firestore
     */
    fetchApprovedTopups: async function () {
      const topic = this.getTopic();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(`https://ntfy.sh/${topic}/json?poll=1`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) return [];
        const text = await res.text();
        const lines = text.trim().split('\n').filter(Boolean);
        const approvals = [];

        lines.forEach(l => {
          try {
            const item = JSON.parse(l);
            if (item.event === 'message') {
              const title = item.title || '';
              const msg = item.message || '';
              const isDepositRequest = (title.includes('YÊU CẦU NẠP') || title.includes('CẦN DUYỆT')) && !title.includes('ĐÃ DUYỆT');
              const isApproval = !isDepositRequest && (title.includes('ĐÃ DUYỆT') || title.includes('DA DUYET') || msg.includes('Đã cộng thành công'));

              if (isApproval) {
                const amountMatch = title.match(/\+([\d.]+)\s*XU/i) || msg.match(/cộng thành công\s*([\d.]+)\s*Xu/i);
                const emailMatch = msg.match(/tài khoản\s*([^\s.]+@[^\s.]+\.[^\s.]+)/i) ||
                                   msg.match(/tài khoản\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i) ||
                                   msg.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);

                const amount = amountMatch ? parseInt(amountMatch[1].replace(/\./g, ''), 10) : 0;
                const userEmail = emailMatch ? emailMatch[1].replace(/[.,]$/, '').trim().toLowerCase() : '';

                if (amount > 0 && userEmail) {
                  approvals.push({
                    id: item.id || ('APP-' + item.time),
                    amount: amount,
                    userEmail: userEmail,
                    time: item.time || Math.floor(Date.now() / 1000),
                    createdAt: new Date((item.time || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
                    title: title,
                    message: msg
                  });
                }
              }
            }
          } catch (e) {}
        });

        return approvals;
      } catch (err) {
        console.warn('[BuiThaiNtfy] fetchApprovedTopups error:', err);
        return [];
      }
    },

    /**
     * Kéo danh sách yêu cầu nạp Xu thời gian thực từ kênh ntfy.sh
     * Giúp Admin trên máy tính thấy ngay các lệnh nạp từ điện thoại/máy khách
     */
    fetchRecentTopupRequests: async function () {
      const topic = this.getTopic();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(`https://ntfy.sh/${topic}/json?poll=1`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) return [];
        const text = await res.text();
        const lines = text.trim().split('\n').filter(Boolean);
        const topups = [];

        lines.forEach(l => {
          try {
            const item = JSON.parse(l);
            const title = item.title || '';
            const msg = item.message || '';
            const isDepositRequest = (title.includes('YÊU CẦU NẠP') || title.includes('CẦN DUYỆT')) && !title.includes('ĐÃ DUYỆT');

            if (item.event === 'message' && isDepositRequest) {
              const emailMatch = msg.match(/Khách:.*?\((.*?)\)/) || msg.match(/Khách:\s*([^\n\r]+)/);
              const nameMatch = msg.match(/Khách:\s*([^(]+)/);
              const amountMatch = msg.match(/Số tiền:\s*([\d.]+)/) || title.match(/\+([\d.]+)\s*XU/);
              const memoMatch = msg.match(/Nội dung:\s*([^\n\r]+)/);

              const amount = amountMatch ? parseInt(amountMatch[1].replace(/\./g, ''), 10) : 0;
              const userEmail = emailMatch ? emailMatch[1].trim() : 'khachhang@gmail.com';
              const userName = nameMatch ? nameMatch[1].trim() : userEmail.split('@')[0];
              const memo = memoMatch ? memoMatch[1].trim() : 'NAPXU';
              const topupId = 'TOPUP-NTFY-' + (item.id || item.time);

              topups.push({
                id: topupId,
                amount: amount,
                userEmail: userEmail,
                userName: userName,
                memo: memo,
                bank: 'Techcombank (6688686866688)',
                accountNumber: '6688686866688',
                accountName: 'BUI THAI',
                method: 'Techcombank VietQR 24/7',
                status: 'pending_approval',
                statusText: 'Chờ Admin duyệt',
                createdAt: new Date(item.time * 1000).toISOString(),
                rawNtfyId: item.id
              });
            }
          } catch (e) {}
        });

        return topups;
      } catch (err) {
        console.warn('[BuiThaiNtfy] fetchRecentTopupRequests error:', err);
        return [];
      }
    },

    /**
     * Kiểm tra kết nối ntfy
     */
    testNotification: async function () {
      const topic = this.getTopic();
      return this.sendNotification({
        title: `🚀 [Bùi Thái Studio] Kiểm tra thông báo thành công!`,
        message: `Chào anh Bùi Thái! Kênh ntfy "${topic}" đã kết nối. Khi có khách nạp Xu Techcombank 6688686866688 hoặc mở khóa Prompt, chuông sẽ reo ngay!`,
        priority: 'high',
        tags: ['fire', 'bell', 'white_check_mark']
      });
    }
  };

  window.ShopVietNtfy = window.BuiThaiNtfy;
  console.log('[BuiThaiNtfy] Module thông báo ntfy.sh siêu tốc sẵn sàng. Topic:', window.BuiThaiNtfy.getTopic());
})();
