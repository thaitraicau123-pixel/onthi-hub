import React, { useState, useMemo, useEffect } from 'react';
import { COURSES_DATA } from '../data/coursesData';
import { useModalDismiss } from '../hooks/useModalDismiss';

/**
 * CheatSheetModal v3.0 — Phao Cứu Sinh 1 Trang (Tóm tắt Mốc số liệu + Active Recall + In A4 chuẩn + Đọc Audio)
 */
export function CheatSheetModal({ onClose, initialCourseId, allCourses = [] }) {
  const { handleBackdropClick } = useModalDismiss(onClose, true);

  const courseList = useMemo(() => {
    const base = allCourses && allCourses.length > 0 ? allCourses : COURSES_DATA;
    return base.filter(c => c && c.cards && c.cards.length > 0);
  }, [allCourses]);

  const [selectedCourseId, setSelectedCourseId] = useState(
    initialCourseId || courseList[0]?.id || 'pldc'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'numbers' | 'starred' | 'core'
  const [copiedId, setCopiedId] = useState(null);
  const [activeRecallMode, setActiveRecallMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState({});
  const [speaking, setSpeaking] = useState(false);

  const selectedCourse = useMemo(() => {
    return courseList.find(c => c.id === selectedCourseId) || courseList[0];
  }, [selectedCourseId, courseList]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const starredIds = useMemo(() => {
    try {
      const raw = localStorage.getItem('onthi_starred_cards_v1');
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return new Set(Array.isArray(parsed) ? parsed : Object.keys(parsed).filter(k => parsed[k]));
    } catch {
      return new Set();
    }
  }, []);

  // Trích xuất các câu hỏi có con số/mốc thời gian/tỷ lệ % và tạo bản tóm tắt cô đọng
  const processedItems = useMemo(() => {
    if (!selectedCourse?.cards) return [];
    const numberRegex = /(\d+\s*(năm|tháng|ngày|giờ|tuổi|%|phần trăm|lần|bậc|cấp|điều|khoản|điểm|triệu|tỷ|ngàn|nghìn))/i;

    return selectedCourse.cards.map((card, idx) => {
      const fullText = `${card.front || ''} ${card.back || ''} ${card.detail || ''}`;
      const hasNumber = numberRegex.test(fullText) || /\b\d+\b/.test(card.back || '');
      const isStarred = starredIds.has(card.id) || starredIds.has(`${selectedCourse.id}_${card.id}`);
      const isCore = idx < 20 || hasNumber || isStarred;

      // Tìm tất cả cụm số nổi bật trong đáp án
      const numberMatches = (card.back || '').match(/\d+\s*(?:năm|tháng|ngày|giờ|tuổi|%|lần|bậc|cấp|triệu|tỷ)?/gi) || [];

      return {
        ...card,
        index: idx + 1,
        hasNumber,
        isStarred,
        isCore,
        numberBadges: [...new Set(numberMatches.map(m => m.trim()).filter(Boolean))].slice(0, 3),
      };
    }).filter(item => {
      if (filterType === 'numbers' && !item.hasNumber) return false;
      if (filterType === 'starred' && !item.isStarred) return false;
      if (filterType === 'core' && !item.isCore) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (item.front || '').toLowerCase().includes(q) ||
          (item.back || '').toLowerCase().includes(q) ||
          (item.detail || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCourse, filterType, searchQuery, starredIds]);

  const toggleRevealItem = (id) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Mở cửa sổ in A4 độc lập sạch đẹp (không bị vướng giao diện Modal)
  const handlePrint = () => {
    if (!selectedCourse) return;
    const printWin = window.open('', '_blank', 'width=900,height=750');
    if (!printWin) {
      window.print();
      return;
    }

    const rowsHtml = processedItems.map((item, idx) => `
      <div class="item">
        <div class="q-row">
          <span class="idx">#${idx + 1}</span>
          <span class="q">${(item.front || '').replace(/</g, '&lt;')}</span>
        </div>
        <div class="a">👉 ${(item.back || '').replace(/</g, '&lt;')}</div>
        ${item.detail ? `<div class="d">💡 ${(item.detail || '').replace(/</g, '&lt;')}</div>` : ''}
      </div>
    `).join('');

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <title>Cheatsheet - ${selectedCourse.title} | OnThiHub v3.0</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 20px; font-size: 12px; line-height: 1.45; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-end; }
          .header h1 { font-size: 18px; text-transform: uppercase; }
          .header .meta { font-size: 11px; color: #475569; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
          .item { border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 9px; break-inside: avoid; page-break-inside: avoid; background: #fff; }
          .q-row { font-weight: 700; margin-bottom: 3px; color: #0f172a; }
          .idx { color: #0284c7; margin-right: 4px; font-weight: 800; }
          .a { color: #047857; font-weight: 700; margin-bottom: 2px; }
          .d { color: #475569; font-size: 11px; font-style: italic; }
          @media print {
            body { padding: 8px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>📄 TÓM TẮT TRỌNG TÂM 1 TRANG: ${selectedCourse.icon || ''} ${selectedCourse.title}</h1>
            <div class="meta">Tổng hợp ${processedItems.length} mục trọng tâm — Hệ thống OnThiHub v3.0</div>
          </div>
          <button class="no-print" onclick="window.print()" style="padding:8px 16px;background:#0284c7;color:#fff;border:none;border-radius:6px;font-weight:bold;cursor:pointer;">🖨️ In ngay / Lưu PDF</button>
        </div>
        <div class="grid">${rowsHtml}</div>
        <script>setTimeout(() => { window.print(); }, 350);</script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleCopyAll = () => {
    const text = [
      `📌 TÓM TẮT TRỌNG TÂM: ${selectedCourse?.title?.toUpperCase()} (${processedItems.length} MỤC) - OnThiHub v3.0`,
      `====================================================`,
      ...processedItems.map((item, i) => `${i + 1}. ${item.front}\n   👉 Đáp án: ${item.back}${item.detail ? `\n   💡 Ghi nhớ: ${item.detail}` : ''}`)
    ].join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId('ALL');
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ đọc giọng nói tự động.');
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const subset = processedItems.slice(0, 20);
    const fullReadText = subset
      .map((item, i) => `Mục ${i + 1}: ${item.front}. Đáp án là: ${item.back}.`)
      .join(' ');
    const utterance = new SpeechSynthesisUtterance(fullReadText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.05;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(5, 8, 22, 0.85)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', overflowY: 'auto'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '1000px', maxHeight: '92vh',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '24px',
          boxShadow: '0 25px 70px rgba(0,0,0,0.75)', color: '#fff',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          background: 'linear-gradient(90deg, rgba(14,165,233,0.18), rgba(99,102,241,0.18))',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '23px', boxShadow: '0 8px 20px rgba(14,165,233,0.35)'
            }}>
              📄
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>
                  Phao Cứu Sinh 1 Trang (Cheatsheet v3.0)
                </h2>
                <span style={{
                  padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800,
                  background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.5)', color: '#6ee7b7'
                }}>
                  ACTIVE RECALL + IN A4
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Cô đọng toàn bộ mốc thời gian, con số, điều khoản dễ nhầm & tự che đáp án để nhẩm bài trước giờ G
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setActiveRecallMode(v => !v);
                setRevealedIds({});
              }}
              style={{
                padding: '8px 13px', borderRadius: '10px',
                border: activeRecallMode ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.18)',
                background: activeRecallMode ? 'rgba(245,158,11,0.22)' : 'rgba(255,255,255,0.06)',
                color: activeRecallMode ? '#fde68a' : '#e2e8f0',
                fontWeight: 800, fontSize: '12px', cursor: 'pointer'
              }}
              title="Làm mờ đáp án để tự nhẩm trong đầu, bấm vào thẻ để lật xem"
            >
              {activeRecallMode ? '🙈 Đang Che Đáp Án (Bấm thẻ để mở)' : '🧠 Tự Kiểm Tra (Che Đáp Án)'}
            </button>

            <button
              onClick={handleToggleSpeech}
              style={{
                padding: '8px 13px', borderRadius: '10px',
                border: '1px solid rgba(168,85,247,0.4)',
                background: speaking ? 'rgba(239,68,68,0.25)' : 'rgba(168,85,247,0.18)',
                color: speaking ? '#fca5a5' : '#e9d5ff',
                fontWeight: 800, fontSize: '12px', cursor: 'pointer'
              }}
            >
              {speaking ? '⏹️ Dừng Đọc' : '🔊 Nghe Tóm Tắt'}
            </button>

            <button
              onClick={handleCopyAll}
              style={{
                padding: '8px 13px', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.35)',
                background: copiedId === 'ALL' ? 'rgba(16,185,129,0.25)' : 'rgba(56,189,248,0.12)',
                color: copiedId === 'ALL' ? '#6ee7b7' : '#bae6fd', fontWeight: 700, fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {copiedId === 'ALL' ? '✅ Đã chép!' : '📋 Copy Toàn Bộ'}
            </button>

            <button
              onClick={handlePrint}
              style={{
                padding: '8px 14px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff',
                fontWeight: 800, fontSize: '12px', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(14,165,233,0.4)'
              }}
            >
              🖨️ Xuất PDF / In A4
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#cbd5e1', width: '34px', height: '34px', borderRadius: '10px',
                cursor: 'pointer', fontSize: '16px', fontWeight: 700
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{
          padding: '12px 22px', background: 'rgba(15,23,42,0.75)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between'
        }}>
          {/* Chọn môn */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {courseList.map(course => {
              const active = course.id === selectedCourse?.id;
              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  style={{
                    padding: '6px 11px', borderRadius: '10px',
                    border: active ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                    background: active ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)',
                    color: active ? '#e0f2fe' : '#94a3b8',
                    fontSize: '12px', fontWeight: active ? 800 : 600, cursor: 'pointer'
                  }}
                >
                  {course.icon} {course.title}
                </button>
              );
            })}
          </div>

          {/* Bộ lọc nhanh + Tìm kiếm */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { id: 'all', label: `📚 Tất cả (${selectedCourse?.cards?.length || 0})` },
              { id: 'numbers', label: '🔢 Mốc số & Thời hạn' },
              { id: 'core', label: '🔥 Trọng tâm hay hỏi' },
              { id: 'starred', label: '⭐ Đã gắn sao' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                style={{
                  padding: '6px 10px', borderRadius: '8px',
                  border: filterType === tab.id ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.08)',
                  background: filterType === tab.id ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.03)',
                  color: filterType === tab.id ? '#e0e7ff' : '#94a3b8',
                  fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}

            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 Lọc nhanh từ khóa..."
              style={{
                padding: '6px 11px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(0,0,0,0.25)', color: '#fff',
                fontSize: '12px', outline: 'none', minWidth: '165px'
              }}
            />
          </div>
        </div>

        {/* Nội dung bảng tóm tắt */}
        <div style={{ padding: '18px 22px', overflowY: 'auto', flex: 1 }}>
          {processedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              Không tìm thấy mục tóm tắt nào khớp với bộ lọc hiện tại. Hãy chuyển sang tab &ldquo;📚 Tất cả&rdquo;!
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(295px, 1fr))',
              gap: '10px'
            }}>
              {processedItems.map((item) => {
                const isRevealed = !activeRecallMode || !!revealedIds[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (activeRecallMode) toggleRevealItem(item.id);
                    }}
                    style={{
                      padding: '12px 14px', borderRadius: '12px',
                      background: item.hasNumber
                        ? 'linear-gradient(135deg, rgba(14,165,233,0.11), rgba(30,41,59,0.75))'
                        : 'rgba(30,41,59,0.55)',
                      border: item.hasNumber
                        ? '1px solid rgba(56,189,248,0.32)'
                        : '1px solid rgba(255,255,255,0.07)',
                      display: 'flex', flexDirection: 'column', gap: '6px',
                      cursor: activeRecallMode ? 'pointer' : 'default',
                      transition: 'transform 0.15s ease, border-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4 }}>
                        <span style={{
                          display: 'inline-block', padding: '1px 6px', borderRadius: '5px',
                          background: 'rgba(56,189,248,0.18)', color: '#38bdf8',
                          fontSize: '10px', fontWeight: 800, marginRight: '6px'
                        }}>
                          #{item.index}
                        </span>
                        {item.front}
                      </div>
                      {item.hasNumber && (
                        <span style={{
                          flexShrink: 0, fontSize: '10px', padding: '2px 6px',
                          borderRadius: '6px', background: 'rgba(245,158,11,0.18)',
                          color: '#fbbf24', fontWeight: 800
                        }}>
                          🔢 Số liệu
                        </span>
                      )}
                    </div>

                    {/* Đáp án chốt hạ (Hỗ trợ chế độ Active Recall làm mờ) */}
                    <div style={{
                      padding: '7px 10px', borderRadius: '8px',
                      background: 'rgba(16,185,129,0.12)',
                      borderLeft: '3px solid #10b981',
                      fontSize: '12.5px', fontWeight: 800, color: '#6ee7b7',
                      filter: isRevealed ? 'none' : 'blur(6px)',
                      userSelect: isRevealed ? 'text' : 'none',
                      transition: 'filter 0.2s ease'
                    }}>
                      👉 {item.back}
                    </div>

                    {!isRevealed && (
                      <div style={{ fontSize: '10.5px', color: '#fbbf24', fontWeight: 700 }}>
                        👆 Chạm vào thẻ để kiểm tra đáp án
                      </div>
                    )}

                    {/* Giải thích ngắn */}
                    {item.detail && isRevealed && (
                      <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
                        💡 {item.detail}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default CheatSheetModal;
