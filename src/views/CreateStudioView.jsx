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
  ArrowDownToLine,
  Minus,
  ArrowUpDown,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  Download,
  RotateCw,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { generateFlashcardsWithAI, calculateOptimalCardCount } from '../utils/aiGenerator';
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
  const [aiCount, setAiCount] = useState('auto'); // 'auto' | number
  const [isExpandedNotes, setIsExpandedNotes] = useState(false);
  const [extractionMode, setExtractionMode] = useState('auto'); // 'auto' | 'qa' | 'questions_only' | 'summary'
  const [answerLength, setAnswerLength] = useState('balanced'); // 'detailed' | 'balanced' | 'concise'
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
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

  // Live 3D Card Preview state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewCardIndex, setPreviewCardIndex] = useState(0);
  const [isPreviewFlipped, setIsPreviewFlipped] = useState(false);

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

  const notesCharCount = aiNotes.length;
  const notesWordCount = aiNotes.trim() ? aiNotes.trim().split(/\s+/).filter(Boolean).length : 0;

  const getRecommendation = () => {
    if (notesCharCount === 0) return { count: 3, text: '💡 Nhập chủ đề hoặc dán tài liệu để hệ thống trích xuất thẻ' };
    if (notesCharCount < 120) return { count: 1, text: '💡 Đoạn văn ngắn (1 ý) • Đề xuất: 1 - 2 thẻ' };
    if (notesCharCount < 450) return { count: 3, text: '💡 Độ dài lý tưởng • Đề xuất: 2 - 4 thẻ súc tích' };
    if (notesCharCount < 1200) return { count: 5, text: '💡 Tài liệu chi tiết • Đề xuất: 4 - 6 thẻ toàn diện' };
    if (notesCharCount < 2500) return { count: 8, text: '💡 Bài giảng dài • Đề xuất: 8 - 12 thẻ' };
    return { count: 12, text: '💡 Giáo trình dài • Đề xuất: 12 - 20 thẻ' };
  };

  const handlePasteNotes = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setAiNotes(prev => prev ? `${prev}\n${text.trim()}` : text.trim());
        playSound('click');
      }
    } catch (e) {
      alert('Vui lòng cấp quyền truy cập Clipboard hoặc dùng phím Ctrl + V để dán.');
    }
  };

  const handleClearNotes = () => {
    setAiNotes('');
    playSound('click');
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

    const targetCount = aiCount === 'auto' ? getRecommendation().count : Number(aiCount) || 5;

    setIsGenerating(true);
    try {
      const generated = await generateFlashcardsWithAI({
        topic: aiTopic,
        rawText: aiNotes,
        cardCount: targetCount,
        customPrompt,
        extractionMode,
        answerLength
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

  const handleSwapCard = (index) => {
    const updated = [...cards];
    const temp = updated[index].front;
    updated[index].front = updated[index].back;
    updated[index].back = temp;
    setCards(updated);
    playSound('flip');
  };

  const handleSwapAllCards = () => {
    if (!cards.some(c => c.front.trim() || c.back.trim())) return;
    const updated = cards.map(c => ({
      ...c,
      front: c.back,
      back: c.front
    }));
    setCards(updated);
    playSound('flip');
  };

  const handleDuplicateCard = (index) => {
    const cardToDup = { ...cards[index] };
    const updated = [...cards];
    updated.splice(index + 1, 0, cardToDup);
    setCards(updated);
    playSound('click');
  };

  const handleMoveCard = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cards.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...cards];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setCards(updated);
    playSound('click');
  };

  const handleClearEmptyCards = () => {
    const filtered = cards.filter(c => c.front.trim() || c.back.trim());
    if (filtered.length > 0) {
      setCards(filtered);
      playSound('click');
    }
  };

  const handleExportCards = async () => {
    const valid = cards.filter(c => c.front.trim() || c.back.trim());
    if (valid.length === 0) {
      alert('Chưa có thẻ nào để xuất!');
      return;
    }
    const tsv = valid.map(c => `${c.front}\t${c.back}\t${c.tag || ''}`).join('\n');
    try {
      await navigator.clipboard.writeText(tsv);
      playSound('success');
      alert(`📋 Đã copy ${valid.length} thẻ định dạng TSV (chuẩn Anki/Quizlet) vào Clipboard!`);
    } catch (e) {
      alert('Không thể copy vào clipboard: ' + e.message);
    }
  };

  const handleOpenPreview = () => {
    const valid = cards.filter(c => c.front.trim() || c.back.trim());
    if (valid.length === 0) {
      alert('Vui lòng nhập ít nhất 1 thẻ để xem trước trải nghiệm học!');
      return;
    }
    setPreviewCardIndex(0);
    setIsPreviewFlipped(false);
    setShowPreviewModal(true);
    playSound('flip');
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

              {/* Quick Topic Starter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                <span className="text-[10px] text-[#7a5a6b] font-bold">Gợi ý chủ đề hot:</span>
                {[
                  { label: '🏛️ Nghị định 138/2020', topic: 'Nghị định 138/2020/NĐ-CP về tuyển dụng công chức', cat: 'cong-chuc' },
                  { label: '⚖️ Luật CBCC 2026', topic: 'Trọng tâm Luật Cán bộ, công chức 2008 (sđbs 2019)', cat: 'cong-chuc' },
                  { label: '💻 System Design & IT', topic: '50 Câu hỏi phỏng vấn System Design & React Virtual DOM', cat: 'it-tech' },
                  { label: '🌍 IELTS 7.5 Academic', topic: 'Từ vựng học thuật IELTS band 7.5 chủ đề Công nghệ & Môi trường', cat: 'ngoai-ngu' }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setAiTopic(chip.topic);
                      setCategory(chip.cat);
                      if (!title) setTitle(`Bộ Thẻ: ${chip.topic}`);
                      playSound('click');
                    }}
                    className="px-2 py-0.5 text-[10px] font-bold bg-[#fcf7ec] hover:bg-pink-50 border border-[#eadfcb] hover:border-[#f02c85]/40 text-[#28071a] rounded-lg transition-colors shadow-2xs"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                <label className="font-black text-[#28071a] block text-xs">
                  Đoạn ghi chú / Nội dung bài học (tùy chọn):
                </label>

                <div className="flex items-center space-x-1.5">
                  {notesCharCount > 0 && (
                    <span className="text-[10px] font-mono font-bold text-[#7a5a6b] bg-[#fcf7ec] px-2 py-0.5 rounded-md border border-[#eadfcb]">
                      {notesCharCount} ký tự • {notesWordCount} từ
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handlePasteNotes}
                    className="px-2 py-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors shadow-2xs"
                    title="Dán nhanh văn bản từ clipboard"
                  >
                    📋 Dán nhanh
                  </button>

                  {notesCharCount > 0 && (
                    <button
                      type="button"
                      onClick={handleClearNotes}
                      className="px-2 py-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                      title="Xóa đoạn ghi chú này"
                    >
                      🧹 Xóa
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsExpandedNotes(!isExpandedNotes)}
                    className="px-2 py-0.5 text-[10px] font-bold text-[#7a5a6b] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors"
                    title={isExpandedNotes ? "Thu nhỏ ô nhập lại" : "Mở rộng ô nhập to hơn để dễ đọc"}
                  >
                    {isExpandedNotes ? "Thu nhỏ ↕" : "Mở rộng ↕"}
                  </button>
                </div>
              </div>

              <textarea
                rows={isExpandedNotes ? 9 : 4}
                placeholder="Dán câu hỏi, bài giảng hoặc ghi chú ôn tập vào đây. Hệ thống sẽ phân tích độ dài và trích xuất thành bộ thẻ câu hỏi - đáp án sắc bén..."
                value={aiNotes}
                onChange={(e) => setAiNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] bg-[#fcf7ec] font-medium text-[#28071a] transition-all"
              ></textarea>

              {/* Real-time Density & Quality Guidance */}
              <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#7a5a6b]">
                <span>{getRecommendation().text}</span>
                {notesCharCount > 0 && (
                  <span className="text-[10px] font-bold text-[#f02c85]">
                    {notesCharCount < 120 ? '• 1 Ý ngắn gọn' : notesCharCount < 450 ? '• Độ dài chuẩn' : notesCharCount < 1200 ? '• Chi tiết' : '• Chuyên sâu'}
                  </span>
                )}
              </div>
            </div>

            {/* Extraction Mode Selector (Phân biệt Câu hỏi vs Trả lời vs Lý thuyết) */}
            <div className="p-3 bg-[#fcf7ec]/80 rounded-2xl border border-[#eadfcb] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-black text-[#28071a] flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Quy Tắc Nhận Diện Kiến Thức:</span>
                </span>
                <span className="text-[10px] text-[#f02c85] font-black">
                  {extractionMode === 'auto'
                    ? '✨ AI tự nhận diện thông minh'
                    : extractionMode === 'qa'
                    ? '❓ Đã có sẵn Hỏi & Đáp (Tách Front - Back)'
                    : extractionMode === 'questions_only'
                    ? '💡 Danh sách câu hỏi (AI tự giải đáp)'
                    : '📖 Bài giảng / Lý thuyết (AI tự sinh câu hỏi)'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'auto', label: 'Tự Động', desc: 'AI tự phân tích', icon: '✨' },
                  { id: 'qa', label: 'Có Sẵn Hỏi-Đáp', desc: 'Tách rõ Front/Back', icon: '❓' },
                  { id: 'questions_only', label: 'Chỉ Câu Hỏi', desc: 'AI tự tìm đáp án', icon: '💡' },
                  { id: 'summary', label: 'Lý Thuyết Thuần', desc: 'AI tự sinh câu hỏi', icon: '📖' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setExtractionMode(m.id);
                      playSound('click');
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      extractionMode === m.id
                        ? 'bg-gradient-to-r from-[#f02c85] to-[#c71767] text-white border-[#f02c85] shadow-xs'
                        : 'bg-white border-[#eadfcb] text-[#28071a] hover:bg-[#faf4e6]'
                    }`}
                  >
                    <div className="flex items-center space-x-1 font-black text-[11px]">
                      <span>{m.icon}</span>
                      <span className="truncate">{m.label}</span>
                    </div>
                    <div className={`text-[9px] mt-0.5 font-medium truncate ${extractionMode === m.id ? 'text-pink-100' : 'text-[#7a5a6b]'}`}>
                      {m.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Length Selector: Chi tiết, Vừa đủ, Ngắn gọn */}
            <div className="p-3 bg-[#fcf7ec]/80 rounded-2xl border border-[#eadfcb] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-black text-[#28071a] flex items-center gap-1.5">
                  <span>📏</span>
                  <span>Độ Dài Câu Trả Lời (Mặt Sau):</span>
                </span>
                <span className="text-[10px] text-[#f02c85] font-black">
                  {answerLength === 'detailed'
                    ? '📝 Chi tiết (50 - 100 từ • Đầy đủ căn cứ & ví dụ)'
                    : answerLength === 'concise'
                    ? '⚡ Ngắn gọn (10 - 25 từ • 1-2 dòng ôn phản xạ)'
                    : '⚖️ Vừa đủ (25 - 50 từ • Chuẩn Anki SM-2)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: 'detailed',
                    label: 'Chi Tiết',
                    desc: 'Giải thích sâu & căn cứ',
                    icon: '📝',
                    badge: '50-100 từ'
                  },
                  {
                    id: 'balanced',
                    label: 'Vừa Đủ',
                    desc: 'Chuẩn Anki SM-2',
                    icon: '⚖️',
                    badge: 'Khuyên dùng'
                  },
                  {
                    id: 'concise',
                    label: 'Ngắn Gọn',
                    desc: 'Ôn phản xạ siêu tốc',
                    icon: '⚡',
                    badge: '10-25 từ'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAnswerLength(item.id);
                      playSound('click');
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      answerLength === item.id
                        ? 'bg-gradient-to-r from-[#f02c85] to-[#c71767] text-white border-[#f02c85] shadow-xs'
                        : 'bg-white border-[#eadfcb] text-[#28071a] hover:bg-[#faf4e6]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 font-black text-xs">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        answerLength === item.id
                          ? 'bg-white/20 text-white'
                          : 'bg-[#f4ebd7] text-[#7a5a6b]'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                    <div className={`text-[10px] mt-1 font-medium truncate ${
                      answerLength === item.id ? 'text-pink-100' : 'text-[#7a5a6b]'
                    }`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Toggle & Input */}
            <div className="p-3 bg-white rounded-2xl border border-[#eadfcb] space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                  className="text-xs font-black text-[#f02c85] hover:text-[#d11c6d] flex items-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showCustomPrompt ? 'Ẩn Lời Nhắc Tùy Chỉnh (Custom Prompt) ▲' : '✍️ Thêm Lời Nhắc Tùy Chỉnh Cho AI (Custom Prompt) ▼'}</span>
                  {customPrompt.trim() && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black ml-1">Đã Bật</span>
                  )}
                </button>
                <span className="text-[10px] text-[#7a5a6b] font-medium hidden sm:inline">Ép khuôn AI theo phong cách của bạn</span>
              </div>

              {showCustomPrompt && (
                <div className="pt-2 border-t border-[#f4ecd8] space-y-2 animate-fade-in">
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Giữ nguyên câu hỏi có sẵn, viết câu trả lời ngắn dưới 25 từ, bổ sung căn cứ pháp lý và mẹo nhớ vui..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#fcf7ec] border border-[#eadfcb] rounded-xl outline-none focus:border-[#f02c85] font-medium text-[#28071a] resize-none"
                  />

                  {/* Quick suggestion chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-[#7a5a6b] font-bold">Gợi ý nhanh:</span>
                    {[
                      '📌 Giữ nguyên câu hỏi có sẵn',
                      '⚡ Trả lời súc tích < 30 từ',
                      '🎯 Thêm căn cứ & bẫy trắc nghiệm',
                      '💡 Kèm mẹo nhớ phản xạ nhanh'
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setCustomPrompt(prev => prev ? `${prev}, ${chip}` : chip);
                          playSound('click');
                        }}
                        className="px-2 py-0.5 text-[10px] font-bold bg-[#fcf7ec] hover:bg-pink-50 border border-[#eadfcb] hover:border-[#f02c85]/40 text-[#28071a] rounded-lg transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                    {customPrompt && (
                      <button
                        type="button"
                        onClick={() => setCustomPrompt('')}
                        className="px-2 py-0.5 text-[10px] font-bold text-rose-600 hover:text-rose-700 underline ml-auto"
                      >
                        Xóa lời nhắc
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SỐ LƯỢNG THẺ - Flexible Selector & Stepper */}
            <div className="p-3.5 rounded-2xl bg-[#fcf7ec]/70 border border-[#eadfcb] space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[#28071a] font-black text-xs">Số lượng thẻ cần tạo:</span>
                  <span className="text-[10px] font-bold text-[#f02c85] px-2 py-0.5 bg-pink-50 border border-pink-200 rounded-full">
                    {aiCount === 'auto' ? `Tự động đề xuất (${getRecommendation().count} thẻ)` : `Đã chọn: ${aiCount} thẻ`}
                  </span>
                </div>

                {/* Stepper +/- for fine-tuning any number from 1 to 30 */}
                <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                  <span className="text-[10px] font-bold text-[#7a5a6b] mr-1">Tùy biến:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = aiCount === 'auto' ? getRecommendation().count : Number(aiCount) || 3;
                      const next = Math.max(1, current - 1);
                      setAiCount(next);
                      playSound('click');
                    }}
                    className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 border border-[#eadfcb] text-[#28071a] font-black text-xs flex items-center justify-center transition-colors shadow-2xs"
                    title="Giảm 1 thẻ"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="min-w-8 text-center font-mono font-black text-xs text-[#28071a]">
                    {aiCount === 'auto' ? `${getRecommendation().count} (A)` : aiCount}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const current = aiCount === 'auto' ? getRecommendation().count : Number(aiCount) || 3;
                      const next = Math.min(30, current + 1);
                      setAiCount(next);
                      playSound('click');
                    }}
                    className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 border border-[#eadfcb] text-[#28071a] font-black text-xs flex items-center justify-center transition-colors shadow-2xs"
                    title="Tăng 1 thẻ"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Quick Presets Row */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setAiCount('auto');
                    playSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                    aiCount === 'auto'
                      ? 'bg-gradient-to-r from-[#f02c85] to-[#c71767] text-white shadow-sm'
                      : 'bg-white border border-[#eadfcb] text-[#28071a] hover:bg-slate-50'
                  }`}
                  title="Hệ thống tự động đo độ dài văn bản để tạo số thẻ tối ưu nhất"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Tự Động ({getRecommendation().count} thẻ)</span>
                </button>

                {[1, 2, 3, 5, 8, 12, 15].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setAiCount(num);
                      playSound('click');
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      aiCount === num
                        ? 'bg-[#f02c85] text-white shadow-sm'
                        : 'bg-white border border-[#eadfcb] text-[#28071a] hover:bg-slate-50'
                    }`}
                  >
                    {num} thẻ
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-1 flex items-center justify-end">
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating || !quota.canCreate}
                className="w-full sm:w-auto px-7 py-3 btn-wayground-sunset text-white font-black rounded-2xl shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 transition-transform transform hover:scale-105 active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang trích xuất thẻ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Tạo Bản Thảo Thẻ ({aiCount === 'auto' ? `${getRecommendation().count} thẻ` : `${aiCount} thẻ`})</span>
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
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleOpenPreview}
                className="px-3 py-1.5 text-xs font-black text-[#f02c85] bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl flex items-center space-x-1.5 transition-colors shadow-2xs"
                title="Xem trước trải nghiệm học 3D trước khi lưu"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>👁️ Xem Trước 3D</span>
              </button>

              <button
                type="button"
                onClick={handleSwapAllCards}
                className="px-3 py-1.5 text-xs font-black text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center space-x-1.5 transition-colors shadow-2xs"
                title="Đảo toàn bộ Mặt trước thành Mặt sau và ngược lại"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-700" />
                <span>⇄ Đảo Toàn Bộ</span>
              </button>

              <button
                type="button"
                onClick={handleExportCards}
                className="px-3 py-1.5 text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl flex items-center space-x-1.5 transition-colors shadow-2xs"
                title="Copy dạng TSV để dán vào Excel hoặc Anki"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>📋 Xuất TSV</span>
              </button>

              <button
                type="button"
                onClick={() => setShowImporterModal(true)}
                className="px-3 py-1.5 text-xs font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl flex items-center space-x-1.5 border border-indigo-200 transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                <span>📥 Dán Excel/Quizlet</span>
              </button>

              <button
                type="button"
                onClick={handleAddCard}
                className="px-3.5 py-1.5 text-xs font-black text-white bg-[#f02c85] hover:bg-[#dc1f74] rounded-xl flex items-center space-x-1 transition-colors shadow-xs"
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
                <div className="flex items-center space-x-2">
                  <span className="font-black text-[#f02c85] text-xs">Thẻ #{idx + 1}</span>
                  <input
                    type="text"
                    placeholder="Tag (VD: Điều 80)"
                    value={card.tag || ''}
                    onChange={(e) => handleCardChange(idx, 'tag', e.target.value)}
                    className="px-2.5 py-1 border border-[#eadfcb] rounded-lg text-[10px] bg-[#fcf7ec] font-bold text-[#28071a]"
                  />
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleSwapCard(idx)}
                    className="p-1.5 text-[#7a5a6b] hover:text-[#f02c85] hover:bg-pink-50 rounded-lg transition-colors"
                    title="Đảo mặt trước & mặt sau của thẻ này"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicateCard(idx)}
                    className="p-1.5 text-[#7a5a6b] hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Nhân bản thẻ này"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveCard(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-[#7a5a6b] hover:text-[#28071a] hover:bg-slate-100 disabled:opacity-30 rounded-lg transition-colors"
                    title="Di chuyển lên trên"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveCard(idx, 'down')}
                    disabled={idx === cards.length - 1}
                    className="p-1.5 text-[#7a5a6b] hover:text-[#28071a] hover:bg-slate-100 disabled:opacity-30 rounded-lg transition-colors"
                    title="Di chuyển xuống dưới"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(idx)}
                      className="p-1.5 text-[#7a5a6b] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                      title="Xóa thẻ này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-[#7a5a6b] uppercase block">
                      Mặt trước (Câu hỏi / Thuật ngữ):
                    </label>
                    <span className={`text-[10px] font-mono ${card.front.length > 120 ? 'text-amber-600 font-black' : 'text-[#7a5a6b]'}`}>
                      {card.front.length} ký tự
                    </span>
                  </div>
                  <textarea
                    rows={card.front.length > 100 ? 3 : 2}
                    placeholder="Nhập câu hỏi hoặc từ vựng..."
                    value={card.front}
                    onChange={(e) => handleCardChange(idx, 'front', e.target.value)}
                    className="w-full p-2.5 border border-[#eadfcb] rounded-xl bg-[#fcf7ec] outline-none focus:border-[#f02c85] resize-y min-h-[52px] font-bold text-[#28071a]"
                  />
                  {card.front.length > 120 && (
                    <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1 font-semibold">
                      <span>💡</span>
                      <span>Mẹo Anki: Câu hỏi nên ngắn gọn (&lt;100 ký tự) để phản xạ tức thì.</span>
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-[#7a5a6b] uppercase block">
                      Mặt sau (Giải thích / Định nghĩa):
                    </label>
                    <span className={`text-[10px] font-mono ${card.back.length > 300 ? 'text-amber-600 font-black' : 'text-[#7a5a6b]'}`}>
                      {card.back.length} ký tự
                    </span>
                  </div>
                  <textarea
                    rows={card.back.length > 150 ? 4 : 2}
                    placeholder="Nhập câu trả lời hoặc căn cứ pháp lý..."
                    value={card.back}
                    onChange={(e) => handleCardChange(idx, 'back', e.target.value)}
                    className="w-full p-2.5 border border-[#eadfcb] rounded-xl bg-[#fcf7ec] outline-none focus:border-[#f02c85] resize-y min-h-[52px] font-medium text-[#28071a]"
                  />
                  {card.back.length > 300 && (
                    <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1 font-semibold">
                      <span>💡</span>
                      <span>Mẹo Anki: Nội dung dài nên tách thành gạch đầu dòng hoặc chia thành nhiều thẻ nhỏ.</span>
                    </p>
                  )}
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

      {/* Interactive 3D Study Preview Modal */}
      {showPreviewModal && (() => {
        const validCards = cards.filter(c => c.front.trim() || c.back.trim());
        const currentCard = validCards[previewCardIndex] || validCards[0];
        if (!currentCard) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-[#28071a]">
            <div className="relative w-full max-w-lg bg-[#fcf7ec] rounded-3xl border-2 border-[#eadfcb] shadow-2xl p-6 space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#eadfcb] pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff5f38] to-[#f02c85] text-white flex items-center justify-center font-bold shadow-md shadow-pink-900/30">
                    <Eye className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#28071a]">Xem Trước Thẻ Học Thực Tế 3D</h4>
                    <span className="text-[11px] text-[#f02c85] font-black">
                      Thẻ số {previewCardIndex + 1} / {validCards.length}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3D Interactive Flip Card */}
              <div
                onClick={() => {
                  setIsPreviewFlipped(!isPreviewFlipped);
                  playSound('flip');
                }}
                className="w-full h-64 sm:h-72 cursor-pointer perspective-1000 select-none"
              >
                <div
                  className={`relative w-full h-full rounded-3xl p-6 shadow-xl border-2 transition-transform duration-500 transform-style-3d flex flex-col justify-between ${
                    isPreviewFlipped
                      ? 'bg-gradient-to-br from-[#28071a] to-[#430c2c] border-[#f02c85] text-white rotate-y-180'
                      : 'bg-white border-[#eadfcb] text-[#28071a]'
                  }`}
                >
                  {/* Top card info */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      isPreviewFlipped
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-400/30'
                        : 'bg-[#fcf7ec] text-[#f02c85] border border-[#eadfcb]'
                    }`}>
                      {isPreviewFlipped ? 'Mặt Sau (Đáp Án)' : 'Mặt Trước (Câu Hỏi)'}
                    </span>

                    {currentCard.tag && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        isPreviewFlipped ? 'text-pink-200/80 bg-white/10' : 'text-[#7a5a6b] bg-[#fcf7ec]'
                      }`}>
                        #{currentCard.tag}
                      </span>
                    )}
                  </div>

                  {/* Main content */}
                  <div className="my-auto text-center px-2 sm:px-4">
                    <p className={`font-black text-sm sm:text-base leading-relaxed ${
                      isPreviewFlipped ? 'text-pink-100 whitespace-pre-line text-left' : 'text-[#28071a]'
                    }`}>
                      {isPreviewFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>

                  {/* Bottom hint */}
                  <div className="text-center">
                    <span className={`text-[10px] font-medium ${
                      isPreviewFlipped ? 'text-pink-300/70' : 'text-[#7a5a6b]'
                    }`}>
                      👆 Chạm để lật mặt thẻ
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewCardIndex(prev => Math.max(0, prev - 1));
                    setIsPreviewFlipped(false);
                    playSound('click');
                  }}
                  disabled={previewCardIndex === 0}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-[#eadfcb] disabled:opacity-40 text-[#28071a] font-black text-xs rounded-xl flex items-center space-x-1 shadow-2xs transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Thẻ Trước</span>
                </button>

                {/* Flip button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPreviewFlipped(!isPreviewFlipped);
                    playSound('flip');
                  }}
                  className="px-4 py-2 bg-[#f02c85] hover:bg-[#dc1f74] text-white font-black text-xs rounded-xl flex items-center space-x-1 shadow-xs transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{isPreviewFlipped ? 'Lật Mặt Trước' : 'Lật Mặt Sau'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreviewCardIndex(prev => Math.min(validCards.length - 1, prev + 1));
                    setIsPreviewFlipped(false);
                    playSound('click');
                  }}
                  disabled={previewCardIndex === validCards.length - 1}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-[#eadfcb] disabled:opacity-40 text-[#28071a] font-black text-xs rounded-xl flex items-center space-x-1 shadow-2xs transition-colors"
                >
                  <span>Thẻ Tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
