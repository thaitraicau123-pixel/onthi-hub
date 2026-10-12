import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Store,
  Layers,
  Coins,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { generateFlashcardsWithAI } from '../utils/aiGenerator';
import { getUserQuota, consumeUserQuota } from '../utils/userTier';
import { publishDeckToMarketplace } from '../data/marketplaceData';
import { playSound } from '../utils/storage';

export default function CreateFlashcardModal({
  user,
  onClose,
  onDeckCreated,
  onOpenPricing
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
  const [priceXu, setPriceXu] = useState(20);

  const quota = getUserQuota();

  // AI Generate Handler
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

      if (!title) {
        setTitle(`Bộ Thẻ: ${aiTopic}`);
      }
      setCards(generated);
      consumeUserQuota(1);
      playSound('success');
    } catch (e) {
      alert('Có lỗi xảy ra khi tạo thẻ bằng AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add empty card manually
  const handleAddCard = () => {
    setCards([...cards, { front: '', back: '', tag: '' }]);
  };

  // Remove card
  const handleRemoveCard = (index) => {
    if (cards.length <= 1) return;
    setCards(cards.filter((_, i) => i !== index));
  };

  // Update card field
  const handleCardChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  // Save Deck
  const handleSaveDeck = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bộ thẻ!');
      return;
    }

    const validCards = cards.filter(c => c.front.trim() && c.back.trim());
    if (validCards.length === 0) {
      alert('Bộ thẻ phải có ít nhất 1 thẻ có đầy đủ nội dung mặt trước và mặt sau!');
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
      previewQuiz: validCards.slice(0, 3).map((c, i) => ({
        id: i + 1,
        question: c.front,
        options: [c.back, 'Phương án khác A', 'Phương án khác B', 'Phương án khác C'],
        correct: 0,
        explanation: 'Căn cứ theo nội dung bộ thẻ đã soạn.'
      }))
    };

    // If publishing to Marketplace C2C
    if (publishToMarket) {
      publishDeckToMarketplace({
        title,
        description: description || `Bộ thẻ do ${user?.displayName || 'Cộng đồng'} chia sẻ.`,
        category,
        categoryName: newDeck.categoryLabel,
        priceXu: Math.max(5, parseInt(priceXu, 10) || 10),
        cardCount: validCards.length,
        authorName: user?.displayName || 'Người Học Ẩn Danh',
        authorAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        authorTier: quota.tier,
        sampleCards: validCards.slice(0, 3)
      });
    }

    playSound('success');
    onDeckCreated(newDeck);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Studio Tạo Bộ Thẻ Flashcard Mới
              </h4>
              <p className="text-[11px] text-slate-500">
                Biên soạn thẻ học tập hoặc dùng AI sinh bản thảo thông minh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quota Bar */}
        <div className="px-6 py-2.5 bg-indigo-50/60 border-b border-indigo-100/70 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-indigo-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Hạn mức hôm nay: <strong>{quota.remaining} / {quota.totalAllowed} lượt</strong> (Gói {quota.tierConfig.name})
            </span>
          </div>

          {!quota.canCreate ? (
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="text-[11px] font-bold text-indigo-700 hover:underline"
            >
              Nâng cấp gói để tạo thêm &rarr;
            </button>
          ) : (
            <span className="text-[11px] text-slate-500">
              Điểm danh hàng ngày: +{quota.tierConfig.checkInBonus} lượt
            </span>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Deck Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tiêu đề bộ thẻ:
              </label>
              <input
                type="text"
                placeholder="VD: 50 Điều Luật Công Chức Hay Hỏi Vòng 1..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Chuyên mục:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
              >
                <option value="cong-chuc">🏛️ Thi Công Chức</option>
                <option value="it-tech">💻 Lập Trình & IT</option>
                <option value="ngoai-ngu">🌍 Ngoại Ngữ & Thi Chứng Chỉ</option>
              </select>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveMode('ai')}
              className={`py-2 px-4 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors ${
                activeMode === 'ai'
                  ? 'border-indigo-600 text-indigo-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Trợ Lý AI Soạn Bản Thảo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('manual')}
              className={`py-2 px-4 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors ${
                activeMode === 'manual'
                  ? 'border-indigo-600 text-indigo-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Chỉnh Sửa Thủ Công ({cards.length} Thẻ)</span>
            </button>
          </div>

          {/* AI Generator Panel */}
          {activeMode === 'ai' && (
            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Chủ đề / Từ khóa trọng tâm cần ôn tập:
                </label>
                <input
                  type="text"
                  placeholder="VD: Luật Viên Chức 2010, React 19 Hooks, Từ vựng IELTS Collocations môi trường..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Đoạn ghi chú / Nội dung bài học (tùy chọn):
                </label>
                <textarea
                  rows="3"
                  placeholder="Dán bài giảng, văn bản pháp luật hoặc danh sách từ vựng vào đây nếu có..."
                  value={aiNotes}
                  onChange={(e) => setAiNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-indigo-200 rounded-lg outline-none focus:border-indigo-500 bg-white resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-600 font-medium">Số lượng thẻ:</span>
                  {[3, 5, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setAiCount(num)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        aiCount === num
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600'
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
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang phân tích kiến thức...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Sinh Bản Thảo Thẻ Bằng AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Cards List Editor (Quizlet / Anki style) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Danh Sách Các Thẻ ({cards.length} thẻ):
              </span>
              <button
                type="button"
                onClick={handleAddCard}
                className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm thẻ</span>
              </button>
            </div>

            {cards.map((card, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span className="font-bold text-indigo-600">Thẻ #{idx + 1}</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Tag (VD: Điều 80)"
                      value={card.tag || ''}
                      onChange={(e) => handleCardChange(idx, 'tag', e.target.value)}
                      className="px-2 py-0.5 border border-slate-200 rounded text-[10px] bg-white font-mono"
                    />
                    {cards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCard(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Xóa thẻ này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Mặt trước (Câu hỏi / Thuật ngữ):
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Nhập câu hỏi hoặc từ vựng..."
                      value={card.front}
                      onChange={(e) => handleCardChange(idx, 'front', e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-indigo-500 resize-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                      Mặt sau (Giải thích / Định nghĩa):
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Nhập câu trả lời hoặc căn cứ pháp lý..."
                      value={card.back}
                      onChange={(e) => handleCardChange(idx, 'back', e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-indigo-500 resize-none font-normal"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Marketplace C2C Publish Option */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={publishToMarket}
                onChange={(e) => setPublishToMarket(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="font-bold text-amber-900 flex items-center space-x-1.5">
                <Store className="w-4 h-4 text-amber-600" />
                <span>Đồng thời đăng bán lên Sàn Thương Mại Điện Tử để kiếm Xu</span>
              </span>
            </label>

            {publishToMarket && (
              <div className="pt-2 pl-6 flex items-center space-x-3">
                <span className="text-[11px] text-slate-600">Đặt giá bán bộ thẻ:</span>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={priceXu}
                    onChange={(e) => setPriceXu(e.target.value)}
                    className="w-20 px-2 py-1 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                  />
                  <span className="font-bold text-amber-800">Xu</span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    (~{(priceXu * 1000).toLocaleString()}đ • Phí sàn {quota.tierConfig.marketplaceFee}%)
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Tổng cộng: <strong className="text-slate-800">{cards.length}</strong> thẻ
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
            >
              Hủy Bỏ
            </button>
            <button
              type="button"
              onClick={handleSaveDeck}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{publishToMarket ? 'Lưu & Đăng Bán Ngay' : 'Lưu Vào Tủ Thẻ'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
