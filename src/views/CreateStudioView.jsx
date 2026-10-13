import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Save,
  Store,
  Layers,
  Coins,
  FileText,
  Gift,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Key,
  ExternalLink,
  Cpu,
  X,
  FileSpreadsheet,
  ClipboardPaste,
  ArrowDownToLine
} from 'lucide-react';
import { generateFlashcardsWithAI } from '../utils/aiGenerator';
import { getUserQuota, consumeUserQuota, performDailyCheckIn } from '../utils/userTier';
import { publishDeckToMarketplace } from '../data/marketplaceData';
import { checkDeckDuplication } from '../utils/duplicateChecker';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function CreateStudioView({
  user,
  onDeckCreated,
  onOpenPricing,
  onSwitchTab
}) {
  const [activeMode, setActiveMode] = useState('ai'); // 'ai' | 'manual'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('cong-chuc');

  // AI inputs
  const [aiTopic, setAiTopic] = useState('');
  const [aiNotes, setAiNotes] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Cards state
  const [cards, setCards] = useState([
    { front: '', back: '', tag: '' },
    { front: '', back: '', tag: '' }
  ]);

  // Marketplace publish options
  const [publishToMarket, setPublishToMarket] = useState(false);
  const [priceXu, setPriceXu] = useState(3);

  const [quota, setQuota] = useState(() => getUserQuota());
  const [formError, setFormError] = useState('');

  // Bulk Flashcards Importer state
  const [showImporterModal, setShowImporterModal] = useState(false);
  const [importRawText, setImportRawText] = useState('');
  const [importSeparator, setImportSeparator] = useState('auto'); // 'auto' | 'tab' | 'dash' | 'colon'
  const [importAppendMode, setImportAppendMode] = useState(true);

  // Parse raw text into flashcard objects
  const parseImportedCards = (text, sepMode) => {
    if (!text || !text.trim()) return [];
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const parsed = [];

    for (const line of lines) {
      let front = '';
      let back = '';
      let tag = '';

      if (sepMode === 'tab' || (sepMode === 'auto' && line.includes('\t'))) {
        const parts = line.split('\t');
        front = parts[0]?.trim() || '';
        back = parts[1]?.trim() || '';
        tag = parts[2]?.trim() || '';
      } else if (sepMode === 'dash' || (sepMode === 'auto' && (line.includes(' - ') || line.includes(' — ') || line.includes(' – ')))) {
        const delimiter = line.includes(' - ') ? ' - ' : line.includes(' — ') ? ' — ' : ' – ';
        const parts = line.split(delimiter);
        front = parts[0]?.trim() || '';
        back = parts.slice(1).join(' - ').trim();
      } else if (sepMode === 'colon' || (sepMode === 'auto' && line.includes(':'))) {
        const firstColon = line.indexOf(':');
        front = line.substring(0, firstColon).trim();
        back = line.substring(firstColon + 1).trim();
      } else if (line.includes(';')) {
        const parts = line.split(';');
        front = parts[0]?.trim() || '';
        back = parts.slice(1).join(';').trim();
      }

      if (front && back) {
        parsed.push({ front, back, tag });
      }
    }

    return parsed;
  };

  const handleApplyImport = () => {
    const parsed = parseImportedCards(importRawText, importSeparator);
    if (parsed.length === 0) {
      alert('Không nhận diện được thẻ nào từ văn bản đã dán. Vui lòng kiểm tra lại định dạng hoặc chọn dấu phân cách phù hợp!');
      return;
    }

    if (importAppendMode) {
      const existing = cards.filter(c => c.front.trim() && c.back.trim());
      setCards([...existing, ...parsed]);
    } else {
      setCards(parsed);
    }

    playSound('success');
    setShowImporterModal(false);
    setImportRawText('');
    alert(`🎉 Đã nhập thành công ${parsed.length} thẻ flashcard vào danh sách!`);
  };

  const refreshQuota = () => {
    setQuota(getUserQuota());
  };

  const handleCheckIn = () => {
    const res = performDailyCheckIn();
    if (res.success) {
      playSound('success');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.2 } });
      alert(res.message);
      refreshQuota();
    } else {
      alert(res.message);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      alert('Vui lòng nhập chủ đề hoặc từ khóa cần tạo thẻ!');
      return;
    }
    if (!quota.canCreate) {
      alert('Bạn đã hết lượt tạo thẻ hôm nay. Hãy nâng cấp gói hoặc điểm danh để nhận thêm lượt nhé!');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateFlashcardsWithAI({
        topic: aiTopic,
        rawText: aiNotes,
        cardCount: aiCount
      });

      if (Array.isArray(generated) && generated.length > 0) {
        if (!title) {
          setTitle(`Bộ Thẻ: ${aiTopic}`);
        }
        setCards(generated);
        consumeUserQuota(1);
        refreshQuota();
        playSound('success');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
      } else {
        alert('Không nhận được dữ liệu thẻ từ AI. Vui lòng thử lại với chủ đề khác!');
      }
    } catch (e) {
      alert('Có lỗi xảy ra khi tạo thẻ bằng AI: ' + (e.message || 'Lỗi mạng'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCard = () => {
    setCards([...cards, { front: '', back: '', tag: '' }]);
  };

  const handleRemoveCard = (index) => {
    if (cards.length <= 1) return;
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleCardChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  const handleSaveDeck = (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      playSound('flip');
      setFormError('Vui lòng nhập tiêu đề bộ thẻ!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const validCards = cards.filter(c => c.front.trim() && c.back.trim());
    if (validCards.length === 0) {
      playSound('flip');
      setFormError('Bộ thẻ phải có ít nhất 1 thẻ có đầy đủ nội dung mặt trước và mặt sau!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const newDeck = {
      id: 'custom_' + Date.now(),
      title,
      description: description || `Bộ tài liệu ôn tập gồm ${validCards.length} thẻ ghi nhớ.`,
      category,
      categoryLabel: category === 'cong-chuc' ? 'Công Chức' : category === 'it-tech' ? 'IT Lập Trình' : 'Ngoại Ngữ',
      price: 0,
      originalPrice: 99000,
      badge: 'Bộ Thẻ Tự Tạo',
      rating: 5.0,
      reviewsCount: 1,
      studentsCount: 1,
      format: ['Anki Deck', 'Tự Tạo'],
      highlights: [`${validCards.length} Thẻ ôn tập do người học tự biên soạn`],
      previewCards: validCards,
      previewQuiz: validCards.slice(0, 5).map((c, i) => {
        const otherBacks = validCards.filter((_, idx) => idx !== i).map(o => o.back.split('\n')[0]);
        const distractors = otherBacks.slice(0, 3);
        while (distractors.length < 3) {
          distractors.push(`Phương án mở rộng ${String.fromCharCode(65 + distractors.length)}`);
        }
        const rawOptions = [c.back.split('\n')[0], ...distractors];
        const shuffled = rawOptions
          .map((opt, origIdx) => ({ opt, isCorrect: origIdx === 0 }))
          .sort(() => Math.random() - 0.5);
        const correctIndex = shuffled.findIndex(item => item.isCorrect);

        return {
          id: i + 1,
          question: c.front,
          options: shuffled.map(item => item.opt),
          correct: correctIndex,
          explanation: c.back
        };
      })
    };

    const dupCheck = checkDeckDuplication({
      title,
      description,
      cards: validCards
    });

    if (publishToMarket && dupCheck.isDuplicate) {
      if (!confirm(`⚠️ CẢNH BÁO TRÙNG LẶP (${dupCheck.similarityScore}%):\n${dupCheck.reason}\n\nNếu tiếp tục đăng bán, Admin có thể từ chối duyệt hoặc đánh dấu đạo văn. Bạn có chắc chắn muốn đăng không?`)) {
        return;
      }
    }

    if (publishToMarket) {
      publishDeckToMarketplace({
        title,
        description: description || `Bộ thẻ do ${user?.displayName || 'Cộng đồng'} chia sẻ.`,
        category,
        categoryName: newDeck.categoryLabel,
        priceXu: Math.max(2, parseInt(priceXu, 10) || 3),
        cardCount: validCards.length,
        authorName: user?.displayName || 'Người Học Ẩn Danh',
        authorAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        authorTier: quota.tier,
        similarityScore: dupCheck.similarityScore,
        cards: validCards,
        previewCards: validCards,
        sampleCards: validCards,
        previewQuiz: newDeck.previewQuiz
      });
    }

    playSound('success');
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    onDeckCreated(newDeck);
    onSwitchTab('library');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      
      {/* STUDIO HEADER (Wayground Warm Cream Container) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#fcf7ec] p-6 rounded-3xl border border-[#eadfcb] shadow-md text-[#28071a]">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#f02c85] bg-pink-100/70 px-3 py-1 rounded-full border border-pink-200">
            AI CREATOR STUDIO
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#28071a] mt-2">
            Studio Biên Soạn & Tạo Flashcard AI
          </h2>
          <p className="text-xs text-[#7a5a6b] mt-0.5 font-medium">
            Dùng AI hỗ trợ tạo nhanh bản thảo hoặc tự tay nhập từng thẻ ghi nhớ theo chuẩn Anki.
          </p>
        </div>

        {/* Quota Indicator Pill */}
        <div className="bg-white p-3 rounded-2xl border border-[#eadfcb] flex items-center space-x-3 text-xs shadow-xs">
          <div>
            <span className="text-[11px] text-[#7a5a6b] block font-bold">Hạn mức tạo hôm nay:</span>
            <strong className="text-sm text-[#28071a] font-black">{quota.remaining} / {quota.totalAllowed} lượt</strong>
          </div>
          {!quota.isCheckedInToday && (
            <button
              onClick={handleCheckIn}
              className="px-3 py-1.5 bg-[#f02c85] hover:bg-[#dc1f74] text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Điểm Danh (+{quota.tierConfig.checkInBonus})</span>
            </button>
          )}
        </div>
      </div>

      {/* FORM WORKSPACE (Wayground Warm Ivory Card) */}
      <div className="bg-[#fcf7ec] rounded-3xl p-6 sm:p-8 border border-[#eadfcb] shadow-xl space-y-6 text-[#28071a]">
        
        {/* Error Banner */}
        {formError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800 font-bold animate-fade-in">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
            <button
              type="button"
              onClick={() => setFormError('')}
              className="p-1 text-rose-400 hover:text-rose-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-black text-[#28071a] block mb-1">
              Tiêu đề bộ thẻ:
            </label>
            <input
              type="text"
              placeholder="VD: 50 Điều Luật Công Chức Hay Hỏi Vòng 1..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] bg-white font-bold text-[#28071a]"
            />
          </div>

          <div>
            <label className="text-xs font-black text-[#28071a] block mb-1">Chuyên mục:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] bg-white font-bold text-[#28071a]"
            >
              <option value="cong-chuc">🏛️ Thi Công Chức / Viên Chức</option>
              <option value="it-tech">💻 Lập Trình & Phỏng Vấn IT</option>
              <option value="ngoai-ngu">🌍 Ngoại Ngữ & Chứng Chỉ</option>
            </select>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#eadfcb]">
          <button
            type="button"
            onClick={() => setActiveMode('ai')}
            className={`py-3 px-5 text-xs sm:text-sm font-black border-b-2 flex items-center space-x-2 transition-all ${
              activeMode === 'ai'
                ? 'border-[#f02c85] text-[#f02c85]'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#f02c85]" />
            <span>Soạn Thảo Tự Động</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className={`py-3 px-5 text-xs sm:text-sm font-black border-b-2 flex items-center space-x-2 transition-all ${
              activeMode === 'manual'
                ? 'border-[#f02c85] text-[#f02c85]'
                : 'border-transparent text-[#7a5a6b] hover:text-[#28071a]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#7a5a6b]" />
            <span>Tự Soạn Thủ Công ({cards.length} Thẻ)</span>
          </button>
        </div>

        {/* AI Generator Panel */}
        {activeMode === 'ai' && (
          <div className="p-5 bg-white rounded-2xl border border-[#eadfcb] space-y-4 text-xs shadow-xs">
            
            {/* Streamlined Status Indicator */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-[#7a5a6b]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-[11px] text-[#28071a]">Trích xuất thẻ thông minh từ chủ đề hoặc bài giảng</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Sẵn sàng
              </span>
            </div>

            <div>
              <label className="font-black text-[#28071a] block mb-1">
                Chủ đề / Từ khóa trọng tâm cần ôn tập:
              </label>
              <input
                type="text"
                placeholder="VD: Luật Viên Chức 2010, React 19 Hooks, Từ vựng IELTS Collocations môi trường..."
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] bg-[#fcf7ec] font-bold text-[#28071a]"
              />
            </div>

            <div>
              <label className="font-black text-[#28071a] block mb-1">
                Đoạn ghi chú / Nội dung bài học (tùy chọn):
              </label>
              <textarea
                rows="3"
                placeholder="Dán bài giảng, văn bản pháp luật hoặc danh sách từ vựng vào đây nếu có..."
                value={aiNotes}
                onChange={(e) => setAiNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] bg-[#fcf7ec] font-medium text-[#28071a] resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center space-x-2">
                <span className="text-[#7a5a6b] font-bold">Số lượng thẻ:</span>
                {[3, 5, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAiCount(num)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black ${
                      aiCount === num
                        ? 'bg-[#f02c85] text-white shadow-sm'
                        : 'bg-[#fcf7ec] border border-[#eadfcb] text-[#28071a]'
                    }`}
                  >
                    {num} thẻ
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating || !quota.canCreate}
                className="px-6 py-3 btn-wayground-sunset text-white font-black rounded-2xl shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 transition-transform transform hover:scale-105 active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang trích xuất thẻ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Tạo Bản Thảo Thẻ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Cards Editor List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-black text-[#28071a]">
              Danh Sách Các Thẻ ({cards.length} thẻ):
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowImporterModal(true)}
                className="px-3.5 py-1.5 text-xs font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl flex items-center space-x-1.5 border border-indigo-200 transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                <span>📥 Dán Nhanh Excel / Quizlet</span>
              </button>
              <button
                type="button"
                onClick={handleAddCard}
                className="px-3.5 py-1.5 text-xs font-black text-[#f02c85] bg-pink-100/60 hover:bg-pink-100 rounded-xl flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm thẻ</span>
              </button>
            </div>
          </div>

          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-2xl border border-[#eadfcb] hover:border-[#f02c85] transition-colors space-y-3 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-[#f02c85] text-xs">Thẻ #{idx + 1}</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Tag (VD: Điều 80)"
                    value={card.tag || ''}
                    onChange={(e) => handleCardChange(idx, 'tag', e.target.value)}
                    className="px-2.5 py-1 border border-[#eadfcb] rounded-lg text-[10px] bg-[#fcf7ec] font-bold text-[#28071a]"
                  />
                  {cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(idx)}
                      className="p-1 text-[#7a5a6b] hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#7a5a6b] uppercase block mb-1">
                    Mặt trước (Câu hỏi / Thuật ngữ):
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Nhập câu hỏi hoặc từ vựng..."
                    value={card.front}
                    onChange={(e) => handleCardChange(idx, 'front', e.target.value)}
                    className="w-full p-2.5 border border-[#eadfcb] rounded-xl bg-[#fcf7ec] outline-none focus:border-[#f02c85] resize-none font-bold text-[#28071a]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#7a5a6b] uppercase block mb-1">
                    Mặt sau (Giải thích / Định nghĩa):
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Nhập câu trả lời hoặc căn cứ pháp lý..."
                    value={card.back}
                    onChange={(e) => handleCardChange(idx, 'back', e.target.value)}
                    className="w-full p-2.5 border border-[#eadfcb] rounded-xl bg-[#fcf7ec] outline-none focus:border-[#f02c85] resize-none font-medium text-[#28071a]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Duplicate / Plagiarism Detector */}
        {title.trim().length > 3 && (() => {
          const liveDupCheck = checkDeckDuplication({ title, description, cards });
          return (
            <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
              liveDupCheck.similarityScore >= 55
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : liveDupCheck.similarityScore >= 30
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-start space-x-2.5">
                {liveDupCheck.similarityScore >= 55 ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : liveDupCheck.similarityScore >= 30 ? (
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-black block">
                    {liveDupCheck.similarityScore >= 55
                      ? `⚠️ Cảnh Báo Trùng Lặp ${liveDupCheck.similarityScore}% (Có Nguy Cơ Đạo Văn)`
                      : liveDupCheck.similarityScore >= 30
                      ? `ℹ️ Tương Đồng ${liveDupCheck.similarityScore}% so với bộ "${liveDupCheck.matchedDeck?.title}"`
                      : `✅ Bộ Thẻ Độc Bản (${liveDupCheck.similarityScore}% trùng) - Hoàn Toàn Hợp Lệ!`}
                  </span>
                  <span className="text-[11px] opacity-80 font-medium block mt-0.5">
                    {liveDupCheck.reason}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-white/70 border border-current shrink-0">
                {liveDupCheck.similarityScore}% MATCH
              </span>
            </div>
          );
        })()}

        {/* Marketplace Publish Option */}
        <div className="p-4 rounded-2xl border border-amber-300 bg-amber-100/50 space-y-2 text-xs">
          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={publishToMarket}
              onChange={(e) => setPublishToMarket(e.target.checked)}
              className="w-4 h-4 rounded text-[#f02c85] focus:ring-[#f02c85]"
            />
            <span className="font-black text-[#28071a] flex items-center space-x-1.5">
              <Store className="w-4 h-4 text-[#f02c85]" />
              <span>Đồng thời đăng bán lên Sàn Thương Mại Điện Tử C2C để kiếm Xu</span>
            </span>
          </label>

          {publishToMarket && (
            <div className="pt-2 pl-6 flex items-center space-x-3">
              <span className="text-[11px] text-[#7a5a6b] font-bold">Đặt giá bán bộ thẻ:</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  min="2"
                  max="500"
                  value={priceXu}
                  onChange={(e) => setPriceXu(e.target.value)}
                  className="w-20 px-2.5 py-1 text-xs font-black border border-[#eadfcb] rounded-lg bg-white text-[#28071a]"
                />
                <span className="font-black text-[#28071a]">Xu</span>
                <span className="text-[11px] text-[#7a5a6b] font-semibold">
                  (~{(priceXu * 1000).toLocaleString()}đ • Phí sàn {quota.tierConfig.marketplaceFee}%)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSaveDeck}
            className="px-8 py-3.5 btn-wayground-sunset text-white rounded-2xl text-xs sm:text-sm font-black shadow-xl flex items-center space-x-2 transition-transform transform hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{publishToMarket ? 'Lưu & Đăng Bán Kiếm Xu' : 'Lưu Vào Tủ Thẻ Của Tôi'}</span>
          </button>
        </div>

      </div>



      {/* Modal Nhập Nhanh Từ Excel / Quizlet / Văn Bản */}
      {showImporterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#fcf7ec] rounded-3xl border-2 border-[#eadfcb] shadow-2xl p-6 text-[#28071a] space-y-4 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eadfcb] pb-3 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-[#28071a]">
                    Nhập Thẻ Nhanh Từ Excel / Quizlet / Văn Bản
                  </h4>
                  <span className="text-[10px] text-indigo-700 font-bold block">
                    Copy và dán trực tiếp từ bảng tính hoặc đề cương
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImporterModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Separator Controls & Sample Insert */}
            <div className="space-y-3 shrink-0 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-[#7a5a6b]">Dấu phân cách:</span>
                  <select
                    value={importSeparator}
                    onChange={(e) => setImportSeparator(e.target.value)}
                    className="px-2.5 py-1 text-xs font-bold border border-[#eadfcb] rounded-lg bg-white text-[#28071a] outline-none"
                  >
                    <option value="auto">Tự động phát hiện (Auto)</option>
                    <option value="tab">Dấu Tab (Excel / Quizlet / Google Sheets)</option>
                    <option value="dash">Dấu gạch ngang ( - )</option>
                    <option value="colon">Dấu hai chấm ( : )</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => {
                      setImportRawText(`comprehend\thiểu rõ, lĩnh hội sâu sắc\tTừ vựng C1
resilience\tkhả năng phục hồi, kiên cường\tTừ vựng C1
collaborate\thợp tác, cùng làm việc\tGiao tiếp
meticulous\ttỉ mỉ, cẩn trọng từng chi tiết\tIELTS 7.0`);
                      setImportSeparator('tab');
                    }}
                    className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-[10px] border border-indigo-200 transition-colors"
                  >
                    Mẫu Tab (Excel)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportRawText(`Thời hiệu xử lý kỷ luật khiển trách là bao lâu? - 02 năm kể từ thời điểm có hành vi vi phạm.
Cơ quan có thẩm quyền ban hành Nghị định? - Chính phủ ban hành Nghị định theo Luật Ban hành VBQPPL.
Nguyên tắc tuyển dụng công chức gồm những gì? - Công khai, minh bạch, khách quan, cạnh tranh lành mạnh.`);
                      setImportSeparator('dash');
                    }}
                    className="px-2 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#f02c85] font-bold text-[10px] border border-pink-200 transition-colors"
                  >
                    Mẫu Q&A ( - )
                  </button>
                </div>
              </div>

              {/* Append vs Replace Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-xs text-[#28071a]">
                  <input
                    type="checkbox"
                    checked={importAppendMode}
                    onChange={(e) => setImportAppendMode(e.target.checked)}
                    className="rounded text-[#f02c85] focus:ring-[#f02c85]"
                  />
                  <span>Thêm nối tiếp vào danh sách thẻ hiện có (Không xóa các thẻ cũ)</span>
                </label>
              </div>
            </div>

            {/* Input Textarea */}
            <div className="flex-1 flex flex-col min-h-[160px]">
              <textarea
                rows="8"
                value={importRawText}
                onChange={(e) => setImportRawText(e.target.value)}
                placeholder={`Dán nội dung vào đây. Mỗi dòng là 1 thẻ. Ví dụ:\nMặt trước\tMặt sau\tTag\nHoặc:\nCâu hỏi khái niệm - Định nghĩa trả lời`}
                className="w-full flex-1 p-3.5 text-xs font-mono border border-[#eadfcb] rounded-2xl outline-none focus:border-[#f02c85] bg-white text-[#28071a] resize-none"
              ></textarea>
            </div>

            {/* Live Parsing Preview */}
            {(() => {
              const previewParsed = parseImportedCards(importRawText, importSeparator);
              return (
                <div className="shrink-0 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={previewParsed.length > 0 ? 'text-emerald-700' : 'text-slate-500'}>
                      {previewParsed.length > 0
                        ? `✅ Đã nhận diện: ${previewParsed.length} thẻ hợp lệ`
                        : 'ℹ️ Chưa nhận diện được thẻ nào (hãy dán văn bản ở trên)'}
                    </span>
                    {previewParsed.length > 0 && (
                      <span className="text-[11px] text-[#7a5a6b]">
                        Xem trước mẫu thẻ đầu tiên:
                      </span>
                    )}
                  </div>

                  {previewParsed.length > 0 && (
                    <div className="p-2.5 bg-white rounded-xl border border-[#eadfcb] text-[11px] space-y-1">
                      <p className="font-bold text-[#28071a] truncate">
                        🏷️ Mặt trước: {previewParsed[0].front}
                      </p>
                      <p className="text-[#7a5a6b] truncate">
                        💡 Mặt sau: {previewParsed[0].back}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#eadfcb]">
                    <button
                      type="button"
                      onClick={() => setShowImporterModal(false)}
                      className="px-4 py-2 rounded-xl border border-[#eadfcb] bg-white hover:bg-[#faebd0] text-[#28071a] text-xs font-bold"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      disabled={previewParsed.length === 0}
                      onClick={handleApplyImport}
                      className="px-5 py-2 rounded-xl btn-wayground-sunset text-white text-xs font-black shadow-md disabled:opacity-50 flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                      <span>Nạp {previewParsed.length} Thẻ Vào Bộ Đề</span>
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
}
