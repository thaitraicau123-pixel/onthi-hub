// Theme Manager - 10 Messenger/Instagram Inspired Atmospheric Themes with Thematic Icons
// Features: Dynamic Wallpapers, Ambient Glows, Custom Icon Packs, and 3D Touch Palette

export const THEMES = [
  {
    id: 'default',
    name: 'Notion Minimalist',
    subtitle: 'Mặc định • Tinh khiết',
    description: 'Phong cách tối giản kinh điển của Notion với mascot sổ tay và cốc trà cute phong cách Messenger.',
    category: 'Minimal',
    artDetail: '📖 Sổ tay Notion & Cốc trà cute Messenger',
    weatherType: 'minimal-sparkles',
    isDark: false,
    previewGradient: 'from-slate-100 via-white to-blue-50',
    primaryColor: '#2383e2',
    primaryHover: '#1a73e8',
    primaryText: '#ffffff',
    bgClass: 'bg-white',
    canvasBgClass: 'bg-white',
    sidebarBgClass: 'bg-[#f7f6f5]',
    topbarBgClass: 'bg-white/90 backdrop-blur-md',
    cardBgClass: 'bg-white',
    cardAltBgClass: 'bg-[#fbfbfa]',
    textClass: 'text-[#37352f]',
    subtextClass: 'text-[#787774]',
    borderClass: 'border-[#e9e9e8]',
    accentPillClass: 'bg-[#2383e2] text-white',
    accentTagClass: 'notion-tag-blue',
    wallpaperGlow: 'radial-gradient(ellipse at 80% 0%, rgba(35, 131, 226, 0.04) 0%, transparent 60%)',
    icons: {
      logo: '📚',
      workspace: '🎓',
      home: '🏠',
      library: '📚',
      create: '✍️',
      marketplace: '🏪',
      community: '💬',
      analytics: '📊',
      mistakes: '📓',
      leaderboard: '🏆',
      blindbox: '🎁',
      changelog: '✨',
      wallet: '🪙',
      due: '⏰',
      mastered: '🧠',
      newCard: '✨',
      streak: '🔥',
      sparkle: '✨',
      study3D: '🗂️',
      quiz: '🎯',
      match: '🎮'
    }
  },
  {
    id: 'christmas-wonderland',
    name: 'Giáng Sinh Rực Rỡ',
    subtitle: 'Tuyết Rơi • Ông Già Noel & Tuần Lộc',
    description: 'Đại tiệc Giáng Sinh lung linh với tuyết rơi trắng xoá, ông già Noel má hồng, cây thông Noel rực rỡ và tuần lộc mũi đỏ.',
    category: 'Lễ Hội',
    artDetail: '🎅 Ông già Noel, Tuần lộc mũi đỏ & Cây thông lung linh',
    weatherType: 'snow',
    hasSnowCaps: true,
    isDark: true,
    previewGradient: 'from-red-950 via-emerald-950 to-slate-950',
    primaryColor: '#ef4444',
    primaryHover: '#dc2626',
    primaryText: '#ffffff',
    bgClass: 'bg-[#0f1d18]',
    canvasBgClass: 'bg-[#0f1d18]',
    sidebarBgClass: 'bg-[#0a1512]',
    topbarBgClass: 'bg-[#0f1d18]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#152720]',
    cardAltBgClass: 'bg-[#1b322a]',
    textClass: 'text-[#f0fdf4]',
    subtextClass: 'text-[#86efac]',
    borderClass: 'border-[#1e3a2f]',
    accentPillClass: 'bg-[#ef4444] text-white font-bold shadow-red-500/25',
    accentTagClass: 'bg-[#2d1215] text-[#fca5a5] border-[#4c1d24]',
    wallpaperGlow: 'radial-gradient(circle at 80% 0%, rgba(239, 68, 68, 0.22) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.18) 0%, transparent 60%)',
    icons: {
      logo: '🎄',
      workspace: '🎁',
      home: '🎅',
      library: '🎁',
      create: '✨',
      marketplace: '🦌',
      community: '⛄',
      analytics: '📊',
      mistakes: '❄️',
      leaderboard: '🏆',
      blindbox: '🎁',
      changelog: '🎄',
      wallet: '🪙',
      due: '❄️',
      mastered: '⭐',
      newCard: '✨',
      streak: '🔥',
      checkin: '🎁',
      sparkle: '⭐',
      study3D: '🧦',
      quiz: '🎯',
      match: '🔔'
    }
  },
  {
    id: 'halloween-spooky',
    name: 'Đêm Hội Halloween',
    subtitle: 'Bí Ngô Phát Sáng • Ma Nhí & Lửa Ma Trơi',
    description: 'Đêm hội Halloween huyền bí lung linh với bé bí ngô Jack-o\'-lantern phát sáng, ma nhí Boo bay lượn và tàn lửa ma trơi lập lòe.',
    category: 'Lễ Hội',
    artDetail: '🎃 Bí ngô cười phát sáng, Ma nhí Boo & Vạc phù thủy',
    weatherType: 'halloween',
    hasWebDecor: true,
    isDark: true,
    previewGradient: 'from-purple-950 via-orange-950 to-slate-950',
    primaryColor: '#f97316',
    primaryHover: '#ea580c',
    primaryText: '#ffffff',
    bgClass: 'bg-[#0e071e]',
    canvasBgClass: 'bg-[#0e071e]',
    sidebarBgClass: 'bg-[#0a0515]',
    topbarBgClass: 'bg-[#0e071e]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#180e30]',
    cardAltBgClass: 'bg-[#1f123d]',
    textClass: 'text-[#fdf4ff]',
    subtextClass: 'text-[#d8b4fe]',
    borderClass: 'border-[#2d1852]',
    accentPillClass: 'bg-[#f97316] text-white font-bold shadow-orange-500/25',
    accentTagClass: 'bg-[#3b172a] text-[#fb923c] border-[#5e223e]',
    wallpaperGlow: 'radial-gradient(circle at 80% 0%, rgba(249, 115, 22, 0.22) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 60%)',
    icons: {
      logo: '🎃',
      workspace: '🧙‍♀️',
      home: '👻',
      library: '⚰️',
      create: '🧪',
      marketplace: '🍬',
      community: '🦇',
      analytics: '🔮',
      mistakes: '🕸️',
      leaderboard: '🏆',
      blindbox: '🎁',
      changelog: '🎃',
      wallet: '🪙',
      due: '⏳',
      mastered: '⭐',
      newCard: '✨',
      streak: '🕯️',
      checkin: '🍬',
      sparkle: '✨',
      study3D: '📜',
      quiz: '🎯',
      match: '🕷️'
    }
  },
  {
    id: 'lofi-cafe',
    name: 'Cà Phê & Lofi',
    subtitle: 'Ấm cúng • Latte Art',
    description: 'Không gian học tập ấm cúng, hương thơm cà phê sữa và ánh đèn vàng Lofi êm dịu.',
    category: 'Cozy',
    artDetail: '🧋 Trà sữa trân châu & Cốc cafe má hồng',
    weatherType: 'coffee-steam',
    isDark: false,
    previewGradient: 'from-amber-100 via-orange-50 to-stone-200',
    primaryColor: '#8c532b',
    primaryHover: '#734120',
    primaryText: '#ffffff',
    bgClass: 'bg-[#fbf7f0]',
    canvasBgClass: 'bg-[#fbf7f0]',
    sidebarBgClass: 'bg-[#f4ede1]',
    topbarBgClass: 'bg-[#fbf7f0]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#ffffff]',
    cardAltBgClass: 'bg-[#f8f2e6]',
    textClass: 'text-[#422e1b]',
    subtextClass: 'text-[#876d54]',
    borderClass: 'border-[#ebdcc9]',
    accentPillClass: 'bg-[#8c532b] text-white',
    accentTagClass: 'bg-[#f5ecde] text-[#8c532b] border-[#ebdcc9]',
    wallpaperGlow: 'radial-gradient(ellipse at 50% 0%, rgba(140, 83, 43, 0.08) 0%, transparent 70%)',
    icons: {
      logo: '☕',
      workspace: '🥐',
      home: '☕',
      library: '📖',
      create: '🎧',
      marketplace: '🥨',
      community: '☕',
      analytics: '📈',
      mistakes: '📝',
      leaderboard: '🥇',
      blindbox: '🍪',
      changelog: '🍂',
      wallet: '🪙',
      due: '⏳',
      mastered: '💡',
      newCard: '🌱',
      streak: '🕯️',
      sparkle: '✨',
      study3D: '📑',
      quiz: '☕',
      match: '🎲'
    }
  },
  {
    id: 'sakura-blossom',
    name: 'Hoa Anh Đào',
    subtitle: 'Thơ mộng • Sakura Pastel',
    description: 'Cánh hoa anh đào rơi dịu dàng cùng bé mèo trắng cuộn tròn ngủ say và xiên dango 3 màu ngọt ngào.',
    category: 'Nature',
    artDetail: '🐱 Bé Mèo ngủ hoa đào & Xiên dango 3 màu',
    weatherType: 'sakura',
    isDark: false,
    previewGradient: 'from-pink-100 via-rose-50 to-pink-200',
    primaryColor: '#db4d86',
    primaryHover: '#c43a72',
    primaryText: '#ffffff',
    bgClass: 'bg-[#fdf7f9]',
    canvasBgClass: 'bg-[#fdf7f9]',
    sidebarBgClass: 'bg-[#faedf2]',
    topbarBgClass: 'bg-[#fdf7f9]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#ffffff]',
    cardAltBgClass: 'bg-[#fcf0f5]',
    textClass: 'text-[#472233]',
    subtextClass: 'text-[#9c6a81]',
    borderClass: 'border-[#f6d7e4]',
    accentPillClass: 'bg-[#db4d86] text-white',
    accentTagClass: 'bg-[#fcecf3] text-[#db4d86] border-[#f6d7e4]',
    wallpaperGlow: 'radial-gradient(circle at 85% 10%, rgba(219, 77, 134, 0.09) 0%, transparent 60%)',
    icons: {
      logo: '🌸',
      workspace: '🎐',
      home: '🌸',
      library: '🏮',
      create: '🎨',
      marketplace: '🍡',
      community: '🌺',
      analytics: '📊',
      mistakes: '💌',
      leaderboard: '👑',
      blindbox: '🎀',
      changelog: '🌸',
      wallet: '🪙',
      due: '⏰',
      mastered: '🌸',
      newCard: '🍃',
      streak: '💖',
      sparkle: '✨',
      study3D: '📜',
      quiz: '🎯',
      match: '🎴'
    }
  },
  {
    id: 'cosmic-galaxy',
    name: 'Dải Ngân Hà',
    subtitle: 'Huyền bí • Tím Vũ Trụ',
    description: 'Bầu trời vũ trụ bao la huyền ảo với phi hành gia nhí, bé Sao Thổ má hồng và sao băng lướt qua.',
    category: 'Space',
    artDetail: '👨‍🚀 Phi hành gia nhí & Bé Sao Thổ má hồng',
    weatherType: 'stars',
    isDark: true,
    previewGradient: 'from-indigo-900 via-purple-900 to-black',
    primaryColor: '#a855f7',
    primaryHover: '#9333ea',
    primaryText: '#ffffff',
    bgClass: 'bg-[#0f0d1b]',
    canvasBgClass: 'bg-[#0f0d1b]',
    sidebarBgClass: 'bg-[#151128]',
    topbarBgClass: 'bg-[#0f0d1b]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#1b1633]',
    cardAltBgClass: 'bg-[#221c40]',
    textClass: 'text-[#f1eeff]',
    subtextClass: 'text-[#a29bbb]',
    borderClass: 'border-[#2f2757]',
    accentPillClass: 'bg-[#a855f7] text-white shadow-purple-500/20',
    accentTagClass: 'bg-[#2b1f52] text-[#d8b4fe] border-[#43327d]',
    wallpaperGlow: 'radial-gradient(ellipse at 70% 0%, rgba(168, 85, 247, 0.16) 0%, transparent 70%), radial-gradient(circle at 10% 40%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)',
    icons: {
      logo: '🌌',
      workspace: '🪐',
      home: '🚀',
      library: '🛸',
      create: '🌠',
      marketplace: '💎',
      community: '🛰️',
      analytics: '🌌',
      mistakes: '☄️',
      leaderboard: '🏆',
      blindbox: '🔮',
      changelog: '⭐',
      wallet: '🪙',
      due: '☄️',
      mastered: '⭐',
      newCard: '✨',
      streak: '⚡',
      sparkle: '🌟',
      study3D: '🌌',
      quiz: '🪐',
      match: '🕹️'
    }
  },
  {
    id: 'botanical-garden',
    name: 'Trái Bơ Messenger',
    subtitle: 'Avocado Chill • Chuẩn Messenger',
    description: 'Bộ hình nền trái bơ ngái ngủ với má hồng, hạt quả bơ 3D và sắc xanh teal êm dịu chuẩn 100% Messenger.',
    category: 'Messenger Cute',
    artDetail: '🥑 Bé Bơ ngái ngủ má hồng chuẩn Messenger',
    weatherType: 'fireflies',
    isDark: true,
    previewGradient: 'from-emerald-950 via-teal-900 to-slate-950',
    primaryColor: '#34d399',
    primaryHover: '#10b981',
    primaryText: '#0f172a',
    bgClass: 'bg-[#1b2b2e]',
    canvasBgClass: 'bg-[#1b2b2e]',
    sidebarBgClass: 'bg-[#152326]',
    topbarBgClass: 'bg-[#1b2b2e]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#22363a]',
    cardAltBgClass: 'bg-[#284045]',
    textClass: 'text-[#ecf5f3]',
    subtextClass: 'text-[#96bab1]',
    borderClass: 'border-[#2d484e]',
    accentPillClass: 'bg-[#34d399] text-[#0f172a] font-bold shadow-emerald-500/20',
    accentTagClass: 'bg-[#1f3f37] text-[#34d399] border-[#2e5d51]',
    wallpaperGlow: 'radial-gradient(circle at 80% 0%, rgba(52, 211, 153, 0.15) 0%, transparent 60%)',
    icons: {
      logo: '🥑',
      workspace: '🥑',
      home: '🥑',
      library: '🥑',
      create: '🥑',
      marketplace: '🥑',
      community: '🥑',
      analytics: '🥑',
      mistakes: '🥑',
      leaderboard: '🏆',
      blindbox: '🎁',
      changelog: '🥑',
      wallet: '🪙',
      due: '🥑',
      mastered: '🥑',
      newCard: '🥑',
      streak: '💚',
      sparkle: '✨',
      study3D: '🥑',
      quiz: '🥑',
      match: '🥑'
    }
  },
  {
    id: 'sunset-waves',
    name: 'Hoàng Hôn Biển',
    subtitle: 'Nồng nhiệt • Cam Đào',
    description: 'Ánh chiều tà bên bờ sóng biển cùng bé cá voi xanh phun nước hình trái tim và mặt trời ngộ nghĩnh.',
    category: 'Warm',
    artDetail: '🐳 Bé Cá Voi phun tim & Mặt trời kính râm',
    weatherType: 'sunset-dust',
    isDark: false,
    previewGradient: 'from-orange-200 via-rose-100 to-amber-200',
    primaryColor: '#ea580c',
    primaryHover: '#c2410c',
    primaryText: '#ffffff',
    bgClass: 'bg-[#fdf8f5]',
    canvasBgClass: 'bg-[#fdf8f5]',
    sidebarBgClass: 'bg-[#f8ede6]',
    topbarBgClass: 'bg-[#fdf8f5]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#ffffff]',
    cardAltBgClass: 'bg-[#fdf1eb]',
    textClass: 'text-[#432314]',
    subtextClass: 'text-[#9c6a51]',
    borderClass: 'border-[#f6ddd1]',
    accentPillClass: 'bg-[#ea580c] text-white',
    accentTagClass: 'bg-[#feede5] text-[#ea580c] border-[#f6ddd1]',
    wallpaperGlow: 'radial-gradient(circle at 75% 0%, rgba(234, 88, 12, 0.1) 0%, transparent 60%)',
    icons: {
      logo: '🌅',
      workspace: '🌴',
      home: '🏖️',
      library: '🐚',
      create: '⛵',
      marketplace: '🍹',
      community: '🌊',
      analytics: '📊',
      mistakes: '⚓',
      leaderboard: '🏆',
      blindbox: '🍍',
      changelog: '🌅',
      wallet: '🪙',
      due: '🌅',
      mastered: '☀️',
      newCard: '🌟',
      streak: '🔥',
      sparkle: '✨',
      study3D: '🗂️',
      quiz: '🎯',
      match: '🏄'
    }
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    subtitle: 'Tương lai • Cyan Điện Tử',
    description: 'Giao diện công nghệ tương lai với bé robot màn hình CRT retro đáng yêu và trái tim pixel neon phát sáng.',
    category: 'Tech',
    artDetail: '🤖 Robot màn hình CRT & Trái tim Pixel',
    weatherType: 'digital-rain',
    isDark: true,
    previewGradient: 'from-cyan-900 via-slate-900 to-black',
    primaryColor: '#06b6d4',
    primaryHover: '#0891b2',
    primaryText: '#081726',
    bgClass: 'bg-[#090d16]',
    canvasBgClass: 'bg-[#090d16]',
    sidebarBgClass: 'bg-[#0f1524]',
    topbarBgClass: 'bg-[#090d16]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#131b2e]',
    cardAltBgClass: 'bg-[#18233c]',
    textClass: 'text-[#e6f1fb]',
    subtextClass: 'text-[#7e95b3]',
    borderClass: 'border-[#1e2e4a]',
    accentPillClass: 'bg-[#06b6d4] text-[#081726] font-bold shadow-cyan-500/20',
    accentTagClass: 'bg-[#0f2838] text-[#22d3ee] border-[#15465f]',
    wallpaperGlow: 'radial-gradient(circle at 80% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 60%)',
    icons: {
      logo: '⚡',
      workspace: '🤖',
      home: '🛸',
      library: '💾',
      create: '🦾',
      marketplace: '⚡',
      community: '🌐',
      analytics: '📊',
      mistakes: '🚨',
      leaderboard: '🏆',
      blindbox: '💎',
      changelog: '⚡',
      wallet: '🪙',
      due: '🚨',
      mastered: '🔮',
      newCard: '👾',
      streak: '🔋',
      sparkle: '⚡',
      study3D: '⚡',
      quiz: '🎯',
      match: '🕹️'
    }
  },
  {
    id: 'lemon-citrus',
    name: 'Chanh Vàng Năng Động',
    subtitle: 'Sảng khoái • Tràn Đầy Năng Lượng',
    description: 'Sự tươi mát bừng sáng của bé chanh vàng mắt to lấp lánh cùng lát cam mọng nước tràn đầy sức sống.',
    category: 'Vibrant',
    artDetail: '🍋 Bé Chanh mắt to lấp lánh & Lát cam mọng',
    weatherType: 'fizzy-citrus',
    isDark: false,
    previewGradient: 'from-amber-200 via-yellow-100 to-lime-100',
    primaryColor: '#d97706',
    primaryHover: '#b45309',
    primaryText: '#ffffff',
    bgClass: 'bg-[#fefdf4]',
    canvasBgClass: 'bg-[#fefdf4]',
    sidebarBgClass: 'bg-[#f9f7e3]',
    topbarBgClass: 'bg-[#fefdf4]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#ffffff]',
    cardAltBgClass: 'bg-[#fdfbe9]',
    textClass: 'text-[#423412]',
    subtextClass: 'text-[#8c7849]',
    borderClass: 'border-[#f2e6b6]',
    accentPillClass: 'bg-[#d97706] text-white',
    accentTagClass: 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]',
    wallpaperGlow: 'radial-gradient(ellipse at 75% 0%, rgba(217, 119, 6, 0.08) 0%, transparent 60%)',
    icons: {
      logo: '🍋',
      workspace: '🍹',
      home: '☀️',
      library: '🍯',
      create: '✨',
      marketplace: '🍊',
      community: '🍹',
      analytics: '📊',
      mistakes: '🍋',
      leaderboard: '🏆',
      blindbox: '🎁',
      changelog: '🍋',
      wallet: '🪙',
      due: '⏰',
      mastered: '🌟',
      newCard: '✨',
      streak: '⚡',
      sparkle: '✨',
      study3D: '📑',
      quiz: '🎯',
      match: '🎲'
    }
  },
  {
    id: 'nordic-frost',
    name: 'Mùa Đông Bắc Cực',
    subtitle: 'Băng tuyết • Tĩnh lặng',
    description: 'Bầu không khí băng tuyết với bé chim cánh cụt đeo bịt tai len và gấu bắc cực con ngái ngủ.',
    category: 'Calm',
    artDetail: '🐧 Bé Cánh Cụt bịt tai len & Gấu tuyết ngủ',
    weatherType: 'aurora-ice',
    hasSnowCaps: true,
    isDark: false,
    previewGradient: 'from-sky-100 via-blue-50 to-indigo-100',
    primaryColor: '#0284c7',
    primaryHover: '#0369a1',
    primaryText: '#ffffff',
    bgClass: 'bg-[#f3f8fc]',
    canvasBgClass: 'bg-[#f3f8fc]',
    sidebarBgClass: 'bg-[#e6f1f8]',
    topbarBgClass: 'bg-[#f3f8fc]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#ffffff]',
    cardAltBgClass: 'bg-[#eaf4fb]',
    textClass: 'text-[#143249]',
    subtextClass: 'text-[#5a7f9a]',
    borderClass: 'border-[#cfe1ef]',
    accentPillClass: 'bg-[#0284c7] text-white',
    accentTagClass: 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]',
    wallpaperGlow: 'radial-gradient(circle at 80% 0%, rgba(2, 132, 199, 0.08) 0%, transparent 60%)',
    icons: {
      logo: '❄️',
      workspace: '🏔️',
      home: '🧊',
      library: '☃️',
      create: '🌨️',
      marketplace: '💎',
      community: '🐧',
      analytics: '📊',
      mistakes: '🧊',
      leaderboard: '🏆',
      blindbox: '🎁',
      changelog: '❄️',
      wallet: '🪙',
      due: '⏰',
      mastered: '🧊',
      newCard: '✨',
      streak: '❄️',
      sparkle: '✨',
      study3D: '🗂️',
      quiz: '🎯',
      match: '🏂'
    }
  },
  {
    id: 'classic-academia',
    name: 'Thư Viện Cổ Điển',
    subtitle: 'Bút lông • Giấy Da Cổ',
    description: 'Vẻ đẹp tri thức cổ điển với bé cú học giả đeo kính, chồng sách vintage có mặt cười dễ thương.',
    category: 'Classic',
    artDetail: '🦉 Cú học giả đeo kính & Chồng sách cười',
    weatherType: 'autumn-leaves',
    isDark: false,
    previewGradient: 'from-amber-200 via-stone-100 to-amber-300',
    primaryColor: '#854d0e',
    primaryHover: '#713f12',
    primaryText: '#ffffff',
    bgClass: 'bg-[#fbf7ee]',
    canvasBgClass: 'bg-[#fbf7ee]',
    sidebarBgClass: 'bg-[#f3ecdc]',
    topbarBgClass: 'bg-[#fbf7ee]/90 backdrop-blur-md',
    cardBgClass: 'bg-[#fffefb]',
    cardAltBgClass: 'bg-[#f6efe0]',
    textClass: 'text-[#3d2c17]',
    subtextClass: 'text-[#826a4f]',
    borderClass: 'border-[#e4d7c0]',
    accentPillClass: 'bg-[#854d0e] text-white',
    accentTagClass: 'bg-[#fef3c7] text-[#854d0e] border-[#fde68a]',
    wallpaperGlow: 'radial-gradient(ellipse at 50% 0%, rgba(133, 77, 14, 0.08) 0%, transparent 65%)',
    icons: {
      logo: '📜',
      workspace: '🏛️',
      home: '🏛️',
      library: '📚',
      create: '✒️',
      marketplace: '🏺',
      community: '🕯️',
      analytics: '📜',
      mistakes: '📜',
      leaderboard: '🏆',
      blindbox: '📜',
      changelog: '📜',
      wallet: '🪙',
      due: '⏳',
      mastered: '🗝️',
      newCard: '✨',
      streak: '🔥',
      sparkle: '✨',
      study3D: '📖',
      quiz: '🎯',
      match: '♟️'
    }
  }
];

const THEME_STORAGE_KEY = 'onthi_selected_theme_id';
const WEATHER_STORAGE_KEY = 'onthi_weather_effects_enabled';

export function isWeatherEffectsEnabled() {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(WEATHER_STORAGE_KEY);
    return raw !== null ? raw === 'true' : true;
  } catch (e) {
    return true;
  }
}

export function setWeatherEffectsEnabled(enabled) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WEATHER_STORAGE_KEY, String(enabled));
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('onthi-weather-toggle', { detail: enabled }));
}

export function subscribeToWeatherToggle(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => callback(e.detail);
  window.addEventListener('onthi-weather-toggle', handler);
  return () => window.removeEventListener('onthi-weather-toggle', handler);
}

export function getSelectedThemeId() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && THEMES.some(t => t.id === saved)) {
      return saved;
    }
  } catch (e) {}
  return 'default';
}

export function getSelectedTheme() {
  const id = getSelectedThemeId();
  return THEMES.find(t => t.id === id) || THEMES[0];
}

export function applyTheme(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme.id);
  } catch (e) {}

  // Set CSS Variables on document element
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.id);
    root.classList.toggle('dark', !!theme.isDark);
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-primary-hover', theme.primaryHover);
    root.style.setProperty('--theme-border', theme.borderClass);

    // Update meta theme-color for mobile chrome & safari
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.primaryColor);
    }

    // Dispatch global custom event for instant component reactivity
    window.dispatchEvent(new CustomEvent('onthi-theme-change', { detail: theme }));
  }

  return theme;
}

export function subscribeToTheme(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = (e) => {
    callback(e.detail || getSelectedTheme());
  };

  window.addEventListener('onthi-theme-change', handler);
  return () => window.removeEventListener('onthi-theme-change', handler);
}
