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
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';
import { generateFlashcardsWithAI, calculateOptimalCardCount } from '../utils/aiGenerator';
import { getUserQuota, consumeUserQuota, performDailyCheckIn } from '../utils/userTier';
import { publishDeckToMarketplace } from '../data/marketplaceData';
import { checkDeckDuplication } from '../utils/duplicateChecker';
import { playSound } from '../utils/storage';
import confetti from 'canvas-confetti';

const INSTANT_STUDIO_PRESETS = [
  {
    id: 'cbcc-2026',
    title: 'Bộ Thẻ Trọng Tâm Luật Cán Bộ, Công Chức 2026',
    category: 'cong-chuc',
    topic: 'Trọng tâm Luật Cán bộ, công chức 2008 & Luật sửa đổi 2019',
    badge: '🏛️ Thi Công Chức Vòng 1',
    highlight: 'Hỏi - Đáp Trực Diện',
    notes: `1. Nghĩa vụ của cán bộ, công chức đối với Đảng, Nhà nước và nhân dân: Trung thành với Đảng, Nhà nước; tôn trọng và tận tụy phục vụ nhân dân; chấp hành nghiêm chỉnh đường lối, chủ trương chính sách.
2. Thời gian tập sự: 12 tháng đối với ngạch chuyên viên hoặc tương đương; 06 tháng đối với ngạch cán sự hoặc nhân viên.
3. Các hình thức kỷ luật đối với công chức không giữ chức vụ lãnh đạo: Khiển trách, Cảnh cáo, Hạ bậc lương, Buộc thôi việc (không còn hình thức giáng chức hoặc cách chức).
4. Nguyên tắc quản lý cán bộ, công chức: Bảo đảm sự lãnh đạo của Đảng; kết hợp giữa tiêu chuẩn chức danh với vị trí việc làm; thực hiện nguyên tắc tập trung dân chủ.`,
    extractionMode: 'qa',
    answerLength: 'balanced',
    cardCount: 4
  },
  {
    id: 'ielts-75',
    title: 'IELTS 7.5+ Master Collocations: Technology & Environment',
    category: 'ngoai-ngu',
    topic: 'High-Yield Collocations for IELTS Speaking & Writing Band 7.5+',
    badge: '🌍 IELTS Band 7.5+',
    highlight: 'Kèm Ngữ Cảnh & Ví Dụ',
    notes: `1. Mitigate environmental degradation: Giảm thiểu sự suy thoái môi trường. Example: Governments must subsidize green energy to mitigate environmental degradation.
2. Spur technological innovation: Thúc đẩy đổi mới công nghệ mang tính đột phá. Example: AI advancements have spurred technological innovation across healthcare.
3. Exert a detrimental impact on: Gây ảnh hưởng tiêu cực sâu sắc lên điều gì đó. Example: Unchecked screen time exerts a detrimental impact on cognitive development.
4. Paradigm shift: Một sự thay đổi mang tính cách mạng về tư duy / mô hình. Example: Remote work represents a fundamental paradigm shift in modern employment.`,
    extractionMode: 'auto',
    answerLength: 'detailed',
    cardCount: 4
  },
  {
    id: 'system-design',
    title: 'System Design & Backend Architecture Flashcards',
    category: 'it-tech',
    topic: 'Phỏng vấn System Design: Caching, Concurrency & Database Scaling',
    badge: '💻 IT & System Design',
    highlight: 'Chuẩn Phỏng Vấn Tech',
    notes: `1. Cache-Aside (Lazy Loading) Pattern là gì và hoạt động ra sao?
Đáp án: Ứng dụng đọc dữ liệu trực tiếp từ Cache trước; nếu Cache Miss thì truy vấn Database rồi ghi ngược lại vào Cache. Ưu điểm: Chỉ cache dữ liệu thực sự cần; Nhược điểm: Cache Miss lần đầu tốn thời gian.
2. Cache Stampede (Thundering Herd) là gì và cách phòng chống?
Đáp án: Xảy ra khi một Key hot hết hạn (TTL) khiến hàng nghìn request đồng thời ập vào Database. Khắc phục: Sử dụng Mutex Lock / Promise Coalescing hoặc Probabilistic Early Expiration (XFetch).
3. Database Sharding vs Partitioning khác nhau thế nào?
Đáp án: Partitioning chia nhỏ bảng trong cùng một Database Engine (Horizontal/Vertical). Sharding chia dữ liệu ra nhiều server vật lý hoặc node Database độc lập để mở rộng theo chiều ngang.
4. CAP Theorem phát biểu điều gì trong hệ thống phân tán?
Đáp án: Một hệ thống phân tán chỉ có thể đồng thời thỏa mãn tối đa 2 trong 3 yếu tố: C (Consistency - Nhất quán), A (Availability - Sẵn sàng), P (Partition Tolerance - Chịu chia cắt mạng).`,
    extractionMode: 'qa',
    answerLength: 'balanced',
    cardCount: 4
  },
  {
    id: 'y-duoc-2023',
    title: 'Trọng Tâm Điểm Mới Luật Khám Chữa Bệnh Số 15/2023/QH15',
    category: 'cong-chuc',
    topic: 'Luật Khám bệnh, chữa bệnh 2023 & Quy chế chuyên môn ngành Y',
    badge: '🏥 Công Chức Ngành Y',
    highlight: 'Quy Chế & Đánh Giá NL',
    notes: `1. Giấy phép hành nghề khám bệnh, chữa bệnh có thời hạn bao lâu theo Luật 2023?
Đáp án: Giấy phép hành nghề có thời hạn 05 năm (thay vì cấp một lần vô thời hạn như Luật 2009). Để gia hạn phải cập nhật kiến thức y khoa liên tục (CME).
2. Điều kiện để được cấp mới giấy phép hành nghề khám chữa bệnh từ năm 2024?
Đáp án: Người hành nghề phải trải qua kỳ kiểm tra đánh giá năng lực hành nghề do Hội đồng Y khoa Quốc gia tổ chức (ngoại trừ một số giai đoạn chuyển tiếp).
3. Quyền được từ chối khám bệnh, chữa bệnh của người hành nghề trong trường hợp nào?
Đáp án: Khi việc khám chữa bệnh trái quy định pháp luật hoặc đạo đức nghề nghiệp; khi người bệnh hoặc thân nhân có hành vi xâm hại thân thể, nhân phẩm của nhân viên y tế (trừ trường hợp cấp cứu).
4. Phân cấp chuyên môn kỹ thuật trong khám chữa bệnh gồm mấy cấp?
Đáp án: Gồm 3 cấp: Cấp khám bệnh chữa bệnh ban đầu, Cấp khám bệnh chữa bệnh cơ bản, và Cấp khám bệnh chữa bệnh chuyên sâu.`,
    extractionMode: 'qa',
    answerLength: 'detailed',
    cardCount: 4
  }
];

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
  const [generatingStep, setGeneratingStep] = useState(0);
  const [activePresetId, setActivePresetId] = useState(null);

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

  const handleApplyPreset = (preset) => {
    setActivePresetId(preset.id);
    setTitle(preset.title);
    setCategory(preset.category);
    setAiTopic(preset.topic);
    setAiNotes(preset.notes);
    setExtractionMode(preset.extractionMode);
    setAnswerLength(preset.answerLength);
    setAiCount(preset.cardCount);
    playSound('click');
  };

  const handleClearPreset = () => {
    setActivePresetId(null);
    setTitle('');
    setAiTopic('');
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
    setGeneratingStep(0);
    const stepInterval = setInterval(() => {
      setGeneratingStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1200);

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
      clearInterval(stepInterval);
      setIsGenerating(false);
      setGeneratingStep(0);
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
        authorName: user?.displayName || 'Ban Quản Trị OnThiHub',
        authorEmail: user?.email || 'thaitraicau123@gmail.com',
        authorAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        authorTier: quota.tier,
        isCustomUserDeck: Boolean(user?.displayName),
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16 text-[#37352f] dark:text-white">
      
      {/* NOTION PAGE HEADER */}
      <div className="space-y-3 pb-2 border-b border-[#e9e9e8] dark:border-white/15">
        <div className="text-4xl select-none">✍️</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#37352f] dark:text-white tracking-tight">
              Studio Biên Soạn & Tạo Flashcard AI
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#787774] dark:text-slate-300 leading-relaxed">
              Tạo nhanh bộ thẻ từ tài liệu, câu hỏi hoặc ghi chú bằng AI, hoặc nhập thủ công theo chuẩn Anki.
            </p>
          </div>

          {/* Quota Indicator Pill */}
          <div className="bg-[#fbf3db] dark:bg-amber-950/60 px-3.5 py-2 rounded-xl border border-[#f4e4b7] dark:border-amber-700/50 flex items-center space-x-3 text-xs shrink-0 shadow-2xs">
            <div>
              <span className="text-[10px] text-[#787774] dark:text-amber-300/80 block">Hạn mức AI hôm nay:</span>
              <strong className="text-xs text-[#37352f] dark:text-amber-200 font-bold">{quota.remaining} / {quota.totalAllowed} lượt</strong>
            </div>
            {!quota.isCheckedInToday && (
              <button
                type="button"
                onClick={handleCheckIn}
                className="px-2.5 py-1 bg-[#2e2e2e] dark:bg-amber-500 hover:bg-[#1a1a1a] dark:hover:bg-amber-400 text-white dark:text-slate-950 rounded-md text-[11px] font-semibold shadow-2xs flex items-center space-x-1 cursor-pointer"
              >
                <Gift className="w-3 h-3" />
                <span>Điểm Danh (+{quota.tierConfig.checkInBonus})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FORM WORKSPACE (Notion White Card) */}
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-[#e9e9e8] dark:border-white/15 shadow-2xs space-y-6 text-[#37352f] dark:text-white">
        
        {/* Error Banner */}
        {formError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/50 rounded-2xl flex items-center justify-between text-xs text-rose-800 dark:text-rose-200 font-bold animate-fade-in">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
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
            <label className="text-xs font-semibold text-[#37352f] dark:text-slate-200 block mb-1">
              Tiêu đề bộ thẻ:
            </label>
            <input
              type="text"
              placeholder="VD: 50 Điều Luật Công Chức Hay Hỏi Vòng 1..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] bg-white dark:bg-slate-800 font-medium text-[#37352f] dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#37352f] dark:text-slate-200 block mb-1">Chuyên mục:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-[#e9e9e8] dark:border-white/15 rounded-lg outline-none focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] bg-white dark:bg-slate-800 font-medium text-[#37352f] dark:text-white"
            >
              <option value="cong-chuc">🏛️ Thi Công Chức / Viên Chức</option>
              <option value="it-tech">💻 Lập Trình & Phỏng Vấn IT</option>
              <option value="ngoai-ngu">🌍 Ngoại Ngữ & Chứng Chỉ</option>
            </select>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#e9e9e8] dark:border-white/15">
          <button
            type="button"
            onClick={() => setActiveMode('ai')}
            className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
              activeMode === 'ai'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400'
                : 'border-transparent text-[#787774] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#2383e2] dark:text-sky-400" />
            <span>Soạn Thảo Tự Động</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all cursor-pointer ${
              activeMode === 'manual'
                ? 'border-[#2383e2] text-[#2383e2] dark:text-sky-400'
                : 'border-transparent text-[#787774] dark:text-slate-400 hover:text-[#37352f] dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-[#787774] dark:text-slate-400" />
            <span>Tự Soạn Thủ Công ({cards.length} Thẻ)</span>
          </button>
        </div>

        {/* AI Generator Panel */}
        {activeMode === 'ai' && (
          <div className="p-5 bg-[#fbfbfa] dark:bg-slate-800/60 rounded-xl border border-[#e9e9e8] dark:border-white/10 space-y-4 text-xs">
            
            {/* Streamlined Status Indicator */}
            <div className="flex items-center justify-between pb-2 border-b border-[#e9e9e8] dark:border-white/10">
              <div className="flex items-center space-x-2 text-[#787774] dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-medium text-xs text-[#37352f] dark:text-white">Trích xuất thẻ thông minh từ chủ đề hoặc bài giảng</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50 text-[10px] font-semibold">
                Sẵn sàng
              </span>
            </div>

            <div>
              <label className="font-semibold text-[#37352f] block mb-1">
                Chủ đề / Từ khóa trọng tâm cần ôn tập:
              </label>
              <input
                type="text"
                placeholder="VD: Luật Viên Chức 2010, React 19 Hooks, Từ vựng IELTS Collocations môi trường..."
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#e9e9e8] rounded-lg outline-none focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] bg-white font-medium text-[#37352f]"
              />

              {/* Quick Topic Starter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] text-[#787774] font-medium">Gợi ý chủ đề hot:</span>
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
                    className="px-2 py-0.5 text-[10px] font-medium bg-white hover:bg-[#e9e9e8] border border-[#e9e9e8] text-[#37352f] rounded-md transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Instant Studio Starter Packs (1-Click Rich Presets) */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#37352f] flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#2383e2]" />
                    <span>Bộ Mẫu Trải Nghiệm 1-Click (Tự Động Nạp Đầy Đủ Dữ Liệu):</span>
                  </span>
                  {activePresetId && (
                    <button
                      type="button"
                      onClick={handleClearPreset}
                      className="text-[10px] text-rose-600 hover:text-rose-700 font-medium underline"
                    >
                      Xóa mẫu đã chọn ✕
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INSTANT_STUDIO_PRESETS.map((preset) => {
                    const isSelected = activePresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-2.5 rounded-lg text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white border-[#2383e2] ring-1 ring-[#2383e2]'
                            : 'bg-white hover:bg-[#f7f6f5] border-[#e9e9e8] text-[#37352f]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="notion-tag notion-tag-blue text-[10px]">
                            {preset.badge}
                          </span>
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${
                            isSelected ? 'bg-[#2383e2] text-white' : 'bg-[#e9e9e8] text-[#787774]'
                          }`}>
                            {isSelected ? '✓ Đang Dùng' : '1-Click Nạp'}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#37352f] line-clamp-1">
                          {preset.title}
                        </div>
                        <div className="text-[10px] text-[#787774] mt-1 line-clamp-1 flex items-center space-x-1">
                          <span>🎯 {preset.highlight}</span>
                          <span>•</span>
                          <span>{preset.cardCount} thẻ tối ưu</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                <label className="font-semibold text-[#37352f] block text-xs">
                  Đoạn ghi chú / Nội dung bài học (tùy chọn):
                </label>

                <div className="flex items-center space-x-1.5">
                  {notesCharCount > 0 && (
                    <span className="text-[10px] font-mono text-[#787774] bg-white px-2 py-0.5 rounded-md border border-[#e9e9e8]">
                      {notesCharCount} ký tự • {notesWordCount} từ
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handlePasteNotes}
                    className="px-2 py-0.5 text-[10px] font-medium text-[#2383e2] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                    title="Dán nhanh văn bản từ clipboard"
                  >
                    📋 Dán nhanh
                  </button>

                  {notesCharCount > 0 && (
                    <button
                      type="button"
                      onClick={handleClearNotes}
                      className="px-2 py-0.5 text-[10px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                      title="Xóa đoạn ghi chú này"
                    >
                      🧹 Xóa
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsExpandedNotes(!isExpandedNotes)}
                    className="px-2 py-0.5 text-[10px] font-medium text-[#787774] bg-white hover:bg-[#e9e9e8] border border-[#e9e9e8] rounded-md transition-colors"
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
                className="w-full px-3.5 py-2.5 text-xs border border-[#e9e9e8] rounded-lg outline-none focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] bg-white text-[#37352f] transition-all"
              ></textarea>

              {/* Real-time Density & Quality Guidance */}
              <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#787774]">
                <span>{getRecommendation().text}</span>
                {notesCharCount > 0 && (
                  <span className="text-[10px] font-semibold text-[#2383e2]">
                    {notesCharCount < 120 ? '• 1 Ý ngắn gọn' : notesCharCount < 450 ? '• Độ dài chuẩn' : notesCharCount < 1200 ? '• Chi tiết' : '• Chuyên sâu'}
                  </span>
                )}
              </div>
            </div>

            {/* Extraction Mode Selector */}
            <div className="p-3 bg-[#f7f6f5] rounded-lg border border-[#e9e9e8] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#37352f] flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>Quy Tắc Nhận Diện Kiến Thức:</span>
                </span>
                <span className="text-[10px] text-[#2383e2] font-semibold">
                  {extractionMode === 'auto'
                    ? 'AI tự nhận diện thông minh'
                    : extractionMode === 'qa'
                    ? 'Đã có sẵn Hỏi & Đáp (Tách Front - Back)'
                    : extractionMode === 'questions_only'
                    ? 'Danh sách câu hỏi (AI tự giải đáp)'
                    : 'Bài giảng / Lý thuyết (AI tự sinh câu hỏi)'}
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
                    className={`p-2 rounded-lg text-left border transition-all ${
                      extractionMode === m.id
                        ? 'bg-[#37352f] text-white border-[#37352f] shadow-xs'
                        : 'bg-white border-[#e9e9e8] text-[#37352f] hover:bg-black/5'
                    }`}
                  >
                    <div className="flex items-center space-x-1 font-semibold text-[11px]">
                      <span>{m.icon}</span>
                      <span className="truncate">{m.label}</span>
                    </div>
                    <div className={`text-[9px] mt-0.5 font-normal truncate ${extractionMode === m.id ? 'text-slate-200' : 'text-[#787774]'}`}>
                      {m.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Length Selector */}
            <div className="p-3 bg-[#f7f6f5] rounded-lg border border-[#e9e9e8] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#37352f] flex items-center gap-1.5">
                  <span>📏</span>
                  <span>Độ Dài Câu Trả Lời (Mặt Sau):</span>
                </span>
                <span className="text-[10px] text-[#2383e2] font-semibold">
                  {answerLength === 'detailed'
                    ? 'Chi tiết (50 - 100 từ • Đầy đủ căn cứ & ví dụ)'
                    : answerLength === 'concise'
                    ? 'Ngắn gọn (10 - 25 từ • 1-2 dòng ôn phản xạ)'
                    : 'Vừa đủ (25 - 50 từ • Chuẩn Anki SM-2)'}
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
                    className={`p-2.5 rounded-lg text-left border transition-all ${
                      answerLength === item.id
                        ? 'bg-[#37352f] text-white border-[#37352f] shadow-xs'
                        : 'bg-white border-[#e9e9e8] text-[#37352f] hover:bg-black/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 font-semibold text-xs">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${
                        answerLength === item.id
                          ? 'bg-white/20 text-white'
                          : 'bg-[#e9e9e8] text-[#787774]'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                    <div className={`text-[10px] mt-1 font-normal truncate ${
                      answerLength === item.id ? 'text-slate-200' : 'text-[#787774]'
                    }`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Toggle & Input */}
            <div className="p-3 bg-white rounded-lg border border-[#e9e9e8] space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                  className="text-xs font-semibold text-[#2383e2] hover:underline flex items-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showCustomPrompt ? 'Ẩn Lời Nhắc Tùy Chỉnh (Custom Prompt) ▲' : '✍️ Thêm Lời Nhắc Tùy Chỉnh Cho AI (Custom Prompt) ▼'}</span>
                  {customPrompt.trim() && (
                    <span className="notion-tag notion-tag-green text-[9px] font-semibold ml-1">Đã Bật</span>
                  )}
                </button>
                <span className="text-[10px] text-[#787774] hidden sm:inline">Ép khuôn AI theo phong cách của bạn</span>
              </div>

              {showCustomPrompt && (
                <div className="pt-2 border-t border-[#e9e9e8] space-y-2 animate-fade-in">
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Giữ nguyên câu hỏi có sẵn, viết câu trả lời ngắn dưới 25 từ, bổ sung căn cứ pháp lý và mẹo nhớ vui..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#f7f6f5] border border-[#e9e9e8] rounded-lg outline-none focus:border-[#2383e2] text-[#37352f] resize-none"
                  />

                  {/* Quick suggestion chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-[#787774] font-medium">Gợi ý nhanh:</span>
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
                        className="px-2 py-0.5 text-[10px] font-medium bg-white hover:bg-[#e9e9e8] border border-[#e9e9e8] text-[#37352f] rounded-md transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                    {customPrompt && (
                      <button
                        type="button"
                        onClick={() => setCustomPrompt('')}
                        className="px-2 py-0.5 text-[10px] font-medium text-rose-600 hover:text-rose-700 underline ml-auto"
                      >
                        Xóa lời nhắc
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SỐ LƯỢNG THẺ - Flexible Selector & Stepper */}
            <div className="p-3.5 rounded-lg bg-[#f7f6f5] border border-[#e9e9e8] space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[#37352f] font-semibold text-xs">Số lượng thẻ cần tạo:</span>
                  <span className="notion-tag notion-tag-blue text-[10px] font-semibold">
                    {aiCount === 'auto' ? `Tự động đề xuất (${getRecommendation().count} thẻ)` : `Đã chọn: ${aiCount} thẻ`}
                  </span>
                </div>

                {/* Stepper +/- */}
                <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                  <span className="text-[10px] text-[#787774] mr-1">Tùy biến:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = aiCount === 'auto' ? getRecommendation().count : Number(aiCount) || 3;
                      const next = Math.max(1, current - 1);
                      setAiCount(next);
                      playSound('click');
                    }}
                    className="w-6 h-6 rounded-md bg-white hover:bg-[#e9e9e8] border border-[#e9e9e8] text-[#37352f] font-semibold text-xs flex items-center justify-center transition-colors"
                    title="Giảm 1 thẻ"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="min-w-8 text-center font-mono font-semibold text-xs text-[#37352f]">
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
                    className="w-6 h-6 rounded-md bg-white hover:bg-[#e9e9e8] border border-[#e9e9e8] text-[#37352f] font-semibold text-xs flex items-center justify-center transition-colors"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    aiCount === 'auto'
                      ? 'bg-[#37352f] text-white shadow-xs'
                      : 'bg-white border border-[#e9e9e8] text-[#37352f] hover:bg-black/5'
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
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      aiCount === num
                        ? 'bg-[#37352f] text-white shadow-xs'
                        : 'bg-white border border-[#e9e9e8] text-[#37352f] hover:bg-black/5'
                    }`}
                  >
                    {num} thẻ
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic AI Multi-Step Animated Progress Indicator */}
            {isGenerating && (
              <div className="p-4 bg-[#f7f6f5] rounded-lg border border-[#e9e9e8] space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-[#37352f] font-semibold">
                    <Sparkles className="w-4 h-4 text-[#2383e2] animate-spin" />
                    <span>Trí Tuệ Nhân Tạo Đang Xử Lý & Trích Xuất Flashcard...</span>
                  </div>
                  <span className="notion-tag notion-tag-blue text-[11px] font-semibold">
                    {generatingStep === 0 ? 'Bước 1/3 (35%)' : generatingStep === 1 ? 'Bước 2/3 (75%)' : 'Bước 3/3 (95%)'}
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 bg-[#e9e9e8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2383e2] transition-all duration-700 rounded-full"
                    style={{ width: generatingStep === 0 ? '35%' : generatingStep === 1 ? '75%' : '95%' }}
                  ></div>
                </div>

                {/* Steps Visual List */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-0.5">
                  <div className={`p-2 rounded-md flex items-center space-x-1.5 transition-colors ${
                    generatingStep >= 0 ? 'bg-white text-[#37352f] font-semibold border border-[#e9e9e8]' : 'text-[#787774] opacity-60'
                  }`}>
                    <span className={generatingStep === 0 ? 'animate-bounce text-[#2383e2]' : 'text-emerald-600 font-semibold'}>
                      {generatingStep > 0 ? '✓' : '1.'}
                    </span>
                    <span className="truncate">Phân tích ngữ cảnh & tài liệu</span>
                  </div>

                  <div className={`p-2 rounded-md flex items-center space-x-1.5 transition-colors ${
                    generatingStep >= 1 ? 'bg-white text-[#37352f] font-semibold border border-[#e9e9e8]' : 'text-[#787774] opacity-60'
                  }`}>
                    <span className={generatingStep === 1 ? 'animate-bounce text-[#2383e2]' : generatingStep > 1 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                      {generatingStep > 1 ? '✓' : '2.'}
                    </span>
                    <span className="truncate">Trích xuất cặp Hỏi-Đáp SM-2</span>
                  </div>

                  <div className={`p-2 rounded-md flex items-center space-x-1.5 transition-colors ${
                    generatingStep >= 2 ? 'bg-white text-[#37352f] font-semibold border border-[#e9e9e8]' : 'text-[#787774] opacity-60'
                  }`}>
                    <span className={generatingStep === 2 ? 'animate-bounce text-[#2383e2]' : 'text-slate-400'}>
                      {generatingStep === 2 ? '⚡' : '3.'}
                    </span>
                    <span className="truncate">Đóng gói & định dạng Anki</span>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Action Button */}
            <div className="pt-1 flex items-center justify-end">
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating || !quota.canCreate}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white font-semibold rounded-lg shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang hoàn thiện thẻ ({generatingStep === 0 ? 'Phân tích' : generatingStep === 1 ? 'Trích xuất' : 'Đóng gói'})...</span>
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
            <span className="text-xs sm:text-sm font-semibold text-[#37352f]">
              Danh Sách Các Thẻ ({cards.length} thẻ):
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleOpenPreview}
                className="px-3 py-1.5 text-xs font-semibold text-[#2383e2] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs"
                title="Xem trước trải nghiệm học 3D trước khi lưu"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>👁️ Xem Trước 3D</span>
              </button>

              <button
                type="button"
                onClick={handleSwapAllCards}
                className="px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs"
                title="Đảo toàn bộ Mặt trước thành Mặt sau và ngược lại"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-700" />
                <span>⇄ Đảo Toàn Bộ</span>
              </button>

              <button
                type="button"
                onClick={handleExportCards}
                className="px-3 py-1.5 text-xs font-medium text-[#787774] bg-[#f7f6f5] hover:bg-[#e9e9e8] border border-[#e9e9e8] rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs"
                title="Copy dạng TSV để dán vào Excel hoặc Anki"
              >
                <Download className="w-3.5 h-3.5 text-[#787774]" />
                <span>📋 Xuất TSV</span>
              </button>

              <button
                type="button"
                onClick={() => setShowImporterModal(true)}
                className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center space-x-1.5 border border-indigo-200 transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                <span>📥 Dán Excel/Quizlet</span>
              </button>

              <button
                type="button"
                onClick={handleAddCard}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2383e2] hover:bg-[#1a73e8] rounded-lg flex items-center space-x-1 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm thẻ</span>
              </button>
            </div>
          </div>

          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#fbfbfa] rounded-lg border border-[#e9e9e8] hover:border-[#2383e2] transition-colors space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="notion-tag notion-tag-blue text-xs font-semibold">Thẻ #{idx + 1}</span>
                  <input
                    type="text"
                    placeholder="Tag (VD: Điều 80)"
                    value={card.tag || ''}
                    onChange={(e) => handleCardChange(idx, 'tag', e.target.value)}
                    className="px-2.5 py-1 border border-[#e9e9e8] rounded-md text-[11px] bg-white text-[#37352f]"
                  />
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleSwapCard(idx)}
                    className="p-1.5 text-[#787774] hover:text-[#2383e2] hover:bg-blue-50 rounded-md transition-colors"
                    title="Đảo mặt trước & mặt sau của thẻ này"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicateCard(idx)}
                    className="p-1.5 text-[#787774] hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Nhân bản thẻ này"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveCard(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-black/5 disabled:opacity-30 rounded-md transition-colors"
                    title="Di chuyển lên trên"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveCard(idx, 'down')}
                    disabled={idx === cards.length - 1}
                    className="p-1.5 text-[#787774] hover:text-[#37352f] hover:bg-black/5 disabled:opacity-30 rounded-md transition-colors"
                    title="Di chuyển xuống dưới"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(idx)}
                      className="p-1.5 text-[#787774] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors ml-1"
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
                    <label className="text-[10px] font-semibold text-[#787774] uppercase block">
                      Mặt trước (Câu hỏi / Thuật ngữ):
                    </label>
                    <span className={`text-[10px] font-mono ${card.front.length > 120 ? 'text-amber-700 font-semibold' : 'text-[#787774]'}`}>
                      {card.front.length} ký tự
                    </span>
                  </div>
                  <textarea
                    rows={card.front.length > 100 ? 3 : 2}
                    placeholder="Nhập câu hỏi hoặc từ vựng..."
                    value={card.front}
                    onChange={(e) => handleCardChange(idx, 'front', e.target.value)}
                    className="w-full p-2.5 border border-[#e9e9e8] rounded-lg bg-white outline-none focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] resize-y min-h-[52px] font-medium text-[#37352f]"
                  />
                  {card.front.length > 120 && (
                    <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                      <span>💡</span>
                      <span>Mẹo Anki: Câu hỏi nên ngắn gọn (&lt;100 ký tự) để phản xạ tức thì.</span>
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-semibold text-[#787774] uppercase block">
                      Mặt sau (Giải thích / Định nghĩa):
                    </label>
                    <span className={`text-[10px] font-mono ${card.back.length > 300 ? 'text-amber-700 font-semibold' : 'text-[#787774]'}`}>
                      {card.back.length} ký tự
                    </span>
                  </div>
                  <textarea
                    rows={card.back.length > 150 ? 4 : 2}
                    placeholder="Nhập câu trả lời hoặc căn cứ pháp lý..."
                    value={card.back}
                    onChange={(e) => handleCardChange(idx, 'back', e.target.value)}
                    className="w-full p-2.5 border border-[#e9e9e8] rounded-lg bg-white outline-none focus:border-[#2383e2] focus:ring-1 focus:ring-[#2383e2] resize-y min-h-[52px] text-[#37352f]"
                  />
                  {card.back.length > 300 && (
                    <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
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
            <div className={`p-3.5 rounded-lg border text-xs flex items-center justify-between gap-3 ${
              liveDupCheck.similarityScore >= 55
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : liveDupCheck.similarityScore >= 30
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
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
                  <span className="font-semibold block">
                    {liveDupCheck.similarityScore >= 55
                      ? `Cảnh Báo Trùng Lặp ${liveDupCheck.similarityScore}% (Có Nguy Cơ Đạo Văn)`
                      : liveDupCheck.similarityScore >= 30
                      ? `Tương Đồng ${liveDupCheck.similarityScore}% so với bộ "${liveDupCheck.matchedDeck?.title}"`
                      : `Bộ Thẻ Độc Bản (${liveDupCheck.similarityScore}% trùng) - Hoàn Toàn Hợp Lệ!`}
                  </span>
                  <span className="text-[11px] opacity-80 block mt-0.5">
                    {liveDupCheck.reason}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-white border border-current shrink-0">
                {liveDupCheck.similarityScore}% MATCH
              </span>
            </div>
          );
        })()}

        {/* Marketplace Publish Option */}
        <div className="p-4 rounded-lg border border-[#e9e9e8] bg-[#f7f6f5] space-y-2 text-xs">
          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={publishToMarket}
              onChange={(e) => setPublishToMarket(e.target.checked)}
              className="w-4 h-4 rounded text-[#2383e2] focus:ring-[#2383e2]"
            />
            <span className="font-semibold text-[#37352f] flex items-center space-x-1.5">
              <Store className="w-4 h-4 text-[#2383e2]" />
              <span>Đồng thời đăng bán lên Sàn Thương Mại Điện Tử C2C để kiếm Xu</span>
            </span>
          </label>

          {publishToMarket && (
            <div className="pt-2 pl-6 flex items-center space-x-3">
              <span className="text-[11px] text-[#787774]">Đặt giá bán bộ thẻ:</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  min="2"
                  max="500"
                  value={priceXu}
                  onChange={(e) => setPriceXu(e.target.value)}
                  className="w-20 px-2.5 py-1 text-xs font-semibold border border-[#e9e9e8] rounded-md bg-white text-[#37352f]"
                />
                <span className="font-semibold text-[#37352f]">Xu</span>
                <span className="text-[11px] text-[#787774]">
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
            className="px-6 py-2.5 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs flex items-center space-x-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{publishToMarket ? 'Lưu & Đăng Bán Kiếm Xu' : 'Lưu Vào Tủ Thẻ Của Tôi'}</span>
          </button>
        </div>

      </div>



      {/* Modal Nhập Nhanh Từ Excel / Quizlet / Văn Bản */}
      {showImporterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-xl border border-[#e9e9e8] shadow-2xl p-6 text-[#37352f] space-y-4 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e9e9e8] pb-3 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#2383e2]/10 text-[#2383e2] flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#37352f]">
                    Nhập Thẻ Nhanh Từ Excel / Quizlet / Văn Bản
                  </h4>
                  <span className="text-[10px] text-[#787774] block">
                    Copy và dán trực tiếp từ bảng tính hoặc đề cương
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImporterModal(false)}
                className="p-1.5 rounded-md text-[#787774] hover:text-[#37352f] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Separator Controls & Sample Insert */}
            <div className="space-y-3 shrink-0 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <span className="font-medium text-[#787774]">Dấu phân cách:</span>
                  <select
                    value={importSeparator}
                    onChange={(e) => setImportSeparator(e.target.value)}
                    className="px-2.5 py-1 text-xs font-medium border border-[#e9e9e8] rounded-md bg-white text-[#37352f] outline-none"
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
                    className="px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-[#2383e2] font-medium text-[10px] border border-blue-200 transition-colors"
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
                    className="px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium text-[10px] border border-purple-200 transition-colors"
                  >
                    Mẫu Q&A ( - )
                  </button>
                </div>
              </div>

              {/* Append vs Replace Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <label className="flex items-center space-x-1.5 cursor-pointer font-medium text-xs text-[#37352f]">
                  <input
                    type="checkbox"
                    checked={importAppendMode}
                    onChange={(e) => setImportAppendMode(e.target.checked)}
                    className="rounded text-[#2383e2] focus:ring-[#2383e2]"
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
                className="w-full flex-1 p-3.5 text-xs font-mono border border-[#e9e9e8] rounded-lg outline-none focus:border-[#2383e2] bg-white text-[#37352f] resize-none"
              ></textarea>
            </div>

            {/* Live Parsing Preview */}
            {(() => {
              const previewParsed = parseImportedCards(importRawText, importSeparator);
              return (
                <div className="shrink-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={previewParsed.length > 0 ? 'text-emerald-700 font-semibold' : 'text-[#787774]'}>
                      {previewParsed.length > 0
                        ? `✅ Đã nhận diện: ${previewParsed.length} thẻ hợp lệ`
                        : 'ℹ️ Chưa nhận diện được thẻ nào (hãy dán văn bản ở trên)'}
                    </span>
                    {previewParsed.length > 0 && (
                      <span className="text-[11px] text-[#787774]">
                        Xem trước mẫu thẻ đầu tiên:
                      </span>
                    )}
                  </div>

                  {previewParsed.length > 0 && (
                    <div className="p-2.5 bg-[#f7f6f5] rounded-lg border border-[#e9e9e8] text-[11px] space-y-1">
                      <p className="font-semibold text-[#37352f] truncate">
                        🏷️ Mặt trước: {previewParsed[0].front}
                      </p>
                      <p className="text-[#787774] truncate">
                        💡 Mặt sau: {previewParsed[0].back}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#e9e9e8]">
                    <button
                      type="button"
                      onClick={() => setShowImporterModal(false)}
                      className="px-4 py-2 rounded-lg border border-[#e9e9e8] bg-white hover:bg-black/5 text-[#787774] text-xs font-medium transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      disabled={previewParsed.length === 0}
                      onClick={handleApplyImport}
                      className="px-5 py-2 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-white text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center space-x-1.5 transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in text-[#37352f]">
            <div className="relative w-full max-w-lg bg-white rounded-xl border border-[#e9e9e8] shadow-2xl p-6 space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#e9e9e8] pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#2383e2]/10 text-[#2383e2] flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#37352f]">Xem Trước Thẻ Học Thực Tế 3D</h4>
                    <span className="text-[11px] text-[#2383e2] font-semibold">
                      Thẻ số {previewCardIndex + 1} / {validCards.length}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 rounded-md text-[#787774] hover:text-[#37352f] hover:bg-black/5 transition-colors"
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
                className="w-full h-64 sm:h-72 cursor-pointer perspective-1000 select-none group focus:outline-none"
                role="button"
                tabIndex={0}
                aria-label={isPreviewFlipped ? "Đang xem mặt sau, bấm để lật lại" : "Đang xem mặt trước, bấm để lật xem đáp án"}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setIsPreviewFlipped(!isPreviewFlipped);
                    playSound('flip');
                  }
                }}
              >
                <div
                  className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                    isPreviewFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front Side */}
                  <div
                    className={`absolute inset-0 backface-hidden rounded-xl p-6 shadow-md border border-[#e9e9e8] bg-white text-[#37352f] flex flex-col justify-between transition-opacity duration-200 ${
                      isPreviewFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                    }`}
                  >
                    {/* Top card info */}
                    <div className="flex items-center justify-between">
                      <span className="notion-tag notion-tag-blue text-[10px] font-semibold">
                        Mặt Trước (Câu Hỏi)
                      </span>

                      {currentCard.tag && (
                        <span className="text-[10px] text-[#787774] bg-[#f7f6f5] px-2 py-0.5 rounded-md">
                          #{currentCard.tag}
                        </span>
                      )}
                    </div>

                    {/* Main content */}
                    <div className="my-auto text-center px-2 sm:px-4 max-h-[140px] overflow-y-auto">
                      <p className="font-semibold text-sm sm:text-base leading-relaxed text-[#37352f]">
                        {currentCard.front || 'Chưa nhập câu hỏi'}
                      </p>
                    </div>

                    {/* Bottom hint */}
                    <div className="text-center">
                      <span className="text-[10px] text-[#787774]">
                        👆 Chạm hoặc bấm [Space] để lật đáp án
                      </span>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div
                    className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl p-6 shadow-md border border-[#e9e9e8] bg-[#fbfbfa] text-[#37352f] flex flex-col justify-between transition-opacity duration-200 ${
                      isPreviewFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {/* Top card info */}
                    <div className="flex items-center justify-between">
                      <span className="notion-tag notion-tag-green text-[10px] font-semibold">
                        Mặt Sau (Đáp Án)
                      </span>

                      {currentCard.tag && (
                        <span className="text-[10px] text-[#787774] bg-white px-2 py-0.5 rounded-md border border-[#e9e9e8]">
                          #{currentCard.tag}
                        </span>
                      )}
                    </div>

                    {/* Main content */}
                    <div className="my-auto text-left px-2 sm:px-4 max-h-[140px] overflow-y-auto">
                      <p className="text-sm leading-relaxed text-[#37352f] whitespace-pre-line">
                        {currentCard.back || 'Chưa nhập đáp án'}
                      </p>
                    </div>

                    {/* Bottom hint */}
                    <div className="text-center">
                      <span className="text-[10px] text-[#787774]">
                        👆 Chạm để lật lại mặt trước
                      </span>
                    </div>
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
                  className="px-4 py-2 bg-white hover:bg-black/5 border border-[#e9e9e8] disabled:opacity-40 text-[#787774] font-medium text-xs rounded-lg flex items-center space-x-1 transition-colors"
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
                  className="px-4 py-2 bg-[#2383e2] hover:bg-[#1a73e8] text-white font-medium text-xs rounded-lg flex items-center space-x-1 transition-colors shadow-xs"
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
                  className="px-4 py-2 bg-white hover:bg-black/5 border border-[#e9e9e8] disabled:opacity-40 text-[#787774] font-medium text-xs rounded-lg flex items-center space-x-1 transition-colors"
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
