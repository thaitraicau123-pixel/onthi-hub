/**
 * BuiThai AI Studio - Home View Module
 * Open-Design Studio Workbench + Apple Liquid Glass Catalog (3-Col Uniform Grid)
 */

window.ShopVietViews = window.ShopVietViews || {};

window.ShopVietViews.home = (function () {
  'use strict';

  function normalizeVoucherCode(str) {
    if (!str) return '';
    return String(str)
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
      .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
      .trim()
      .toUpperCase();
  }
  window.ShopVietNormalizeVoucher = normalizeVoucherCode;

  // ==================== OPEN-DESIGN WORKBENCH STATE & DATA ====================
  var workbenchState = {
    project: 'metropolis',
    tab: 'preview',
    sceneIndex: 0,
    fileIndex: 0
  };
  var currentPriceSort = 'featured';

  var WORKBENCH_PROJECTS = {
    metropolis: {
      key: 'metropolis',
      id: 'source-metropolis-1998-city-builder',
      title: 'Metropolis 1998 — Thành phố Isometric 3D',
      subtitle: 'React 19 · Three.js · TypeScript · Nội thất Cutaway',
      price: 15000,
      zipName: 'Metropolis_1998_Source_Starter.zip',
      zipSize: '27 KB',
      fileCount: '18 files',
      demoUrl: '/demo/metropolis-1998/',
      stack: ['React 19', 'TypeScript 5.8', 'Three.js', 'Tailwind CSS v4', 'Vite 6'],
      scenes: [
        { label: 'Title Screen', src: '/assets/aistudio/r1-title_bb056220.png', caption: 'Màn hình khởi động Oakwood · HUD kính mờ & phím tắt tương tác' },
        { label: 'Daylight City', src: '/assets/aistudio/r1-day_0b668521.png', caption: 'Chu kỳ ánh sáng ban ngày · Giao thông & cư dân di chuyển thời gian thực' },
        { label: 'Night Neon', src: '/assets/aistudio/r1-night_bfd6b447.png', caption: 'Chế độ ban đêm · Đèn đường và cửa sổ phát sáng tự động' },
        { label: 'Interior Cutaway', src: '/assets/aistudio/r1-cutaway_5ff36592.png', caption: 'Chế độ X-Ray Cutaway [X] · Bóc tách mái xem nội thất bên trong' },
        { label: 'Apartment Block', src: '/assets/aistudio/r6-apartment_499ccb5c.png', caption: 'Mở rộng phân khu chung cư & hệ thống năng lượng lưới điện' },
        { label: 'Rain Weather', src: '/assets/aistudio/r6-rain_ffab6a8e.png', caption: 'Hiệu ứng thời tiết mưa rơi & phản xạ ánh sáng đô thị' },
        { label: 'Snow Winter', src: '/assets/aistudio/r6-snow_d4afa5c9.png', caption: 'Hiệu ứng tuyết rơi mùa đông & bảng điều khiển xây dựng 10 công cụ' }
      ],
      files: [
        {
          path: 'src/App.tsx',
          lang: 'TSX',
          code: [
            "import { useEffect, useRef, useState } from 'react';",
            "import { TitleOverlay } from './components/TitleOverlay';",
            "import { GameHud } from './components/GameHud';",
            "import { CityEngine, CitySnapshot } from './game/CityEngine';",
            "",
            "export function App() {",
            "  const canvasRef = useRef<HTMLCanvasElement | null>(null);",
            "  const engineRef = useRef<CityEngine | null>(null);",
            "  const [started, setStarted] = useState(false);",
            "  const [snap, setSnap] = useState<CitySnapshot | null>(null);",
            "",
            "  useEffect(() => {",
            "    if (!canvasRef.current) return;",
            "    const engine = new CityEngine(canvasRef.current, setSnap);",
            "    engineRef.current = engine;",
            "    return () => engine.dispose();",
            "  }, []);",
            "",
            "  return (",
            "    <main className=\"relative h-screen w-screen overflow-hidden bg-[#0b1018]\">",
            "      <canvas ref={canvasRef} className=\"block h-full w-full\" />",
            "      {!started && <TitleOverlay onStart={() => setStarted(true)} />}",
            "      {started && snap && <GameHud snapshot={snap} engine={engineRef.current} />}",
            "    </main>",
            "  );",
            "}"
          ].join('\n')
        },
        {
          path: 'src/game/CityEngine.ts',
          lang: 'TS',
          code: [
            "import * as THREE from 'three';",
            "import { BUILDING_CATALOG, ToolType } from './catalog';",
            "",
            "export class CityEngine {",
            "  private scene = new THREE.Scene();",
            "  private camera: THREE.OrthographicCamera;",
            "  private renderer: THREE.WebGLRenderer;",
            "  public cutawayMode = false;",
            "",
            "  constructor(canvas: HTMLCanvasElement, onUpdate: (s: CitySnapshot) => void) {",
            "    const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);",
            "    this.camera = new THREE.OrthographicCamera(-14 * aspect, 14 * aspect, 14, -14, 0.1, 200);",
            "    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });",
            "    this.renderer.shadowMap.enabled = true;",
            "    this.seedOakwoodDistrict();",
            "    onUpdate(this.getSnapshot());",
            "  }",
            "",
            "  public toggleCutaway() {",
            "    this.cutawayMode = !this.cutawayMode;",
            "    this.roofGroup.visible = !this.cutawayMode;",
            "  }",
            "}"
          ].join('\n')
        },
        {
          path: 'src/components/GameHud.tsx',
          lang: 'TSX',
          code: [
            "import { BUILDING_CATALOG, ToolType } from '../game/catalog';",
            "",
            "export function GameHud({ snapshot, onSelectTool, onToggleCutaway }) {",
            "  return (",
            "    <div className=\"pointer-events-none fixed inset-0 flex flex-col justify-between p-4\">",
            "      <header className=\"pointer-events-auto flex items-center justify-between rounded-2xl bg-slate-950/75 px-4 py-2.5 backdrop-blur-xl border border-white/10\">",
            "        <div className=\"flex gap-6 text-xs font-mono tabular-nums text-white\">",
            "          <span>TREASURY ${snapshot.treasury.toLocaleString()}</span>",
            "          <span>CITIZENS {snapshot.citizens}/{snapshot.capacity}</span>",
            "          <span>JOY {snapshot.joy}%</span>",
            "        </div>",
            "        <button onClick={onToggleCutaway} className=\"rounded-lg bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300\">",
            "          CUTAWAY [X]",
            "        </button>",
            "      </header>",
            "    </div>",
            "  );",
            "}"
          ].join('\n')
        },
        {
          path: 'src/game/catalog.ts',
          lang: 'TS',
          code: [
            "export type ToolType = 'inspect' | 'road' | 'park' | 'home' | 'apartment' | 'diner' | 'market' | 'office' | 'power' | 'bulldoze';",
            "",
            "export const BUILDING_CATALOG = [",
            "  { id: 'road', label: 'Asphalt Road', cost: 25, category: 'infra' },",
            "  { id: 'home', label: 'Suburban Home', cost: 180, residents: 6 },",
            "  { id: 'apartment', label: 'Brick Apartment', cost: 520, residents: 24 },",
            "  { id: 'diner', label: 'Retro 98 Diner', cost: 260, income: 35 },",
            "  { id: 'power', label: 'Power Station', cost: 750, powerCap: 32 }",
            "] as const;"
          ].join('\n')
        },
        {
          path: 'package.json',
          lang: 'JSON',
          code: [
            '{',
            '  "name": "metropolis-1998-starter",',
            '  "version": "1.0.0",',
            '  "scripts": {',
            '    "dev": "vite --port 3000",',
            '    "build": "tsc && vite build"',
            '  },',
            '  "dependencies": {',
            '    "react": "^19.0.0",',
            '    "react-dom": "^19.0.0",',
            '    "three": "^0.174.0"',
            '  },',
            '  "devDependencies": {',
            '    "@tailwindcss/vite": "^4.0.0",',
            '    "typescript": "^5.8.2",',
            '    "vite": "^6.2.0"',
            '  }',
            '}'
          ].join('\n')
        }
      ],
      quickstart: [
        'unzip Metropolis_1998_Source_Starter.zip -d metropolis-1998',
        'cd metropolis-1998',
        'npm install',
        'npm run dev'
      ]
    },
    dietsoda: {
      key: 'dietsoda',
      id: 'template-diet-soda-3d-landing',
      title: 'Diet Soda 3D — WebGL Product Showcase',
      subtitle: 'Single-File HTML · Model-Viewer GLB · 3D Can Morph',
      price: 15000,
      zipName: 'diet-soda-3d-landing.html',
      zipSize: '185 KB',
      fileCount: 'HTML + GLB Assets',
      demoUrl: '/demo/diet-soda/',
      stack: ['Model-Viewer 3D', 'GLB PBR Mesh', 'GSAP ScrollTrigger', 'Vanilla CSS/JS'],
      scenes: [
        { label: 'Blueberry Soda', src: '/demo/diet-soda/assets/Blue_Soda.png', caption: 'Phối cảnh lon Diet Soda vị Việt quất · Vật liệu kim loại phản xạ' },
        { label: 'Green Lime', src: '/demo/diet-soda/assets/Green_Soda.png', caption: 'Chuyển màu tương tác vị Chanh Xanh · Hoạt ảnh xoay 60fps' }
      ],
      files: [
        {
          path: 'index.html',
          lang: 'HTML',
          code: [
            '<model-viewer',
            '  id="sodaCanViewer"',
            '  src="./assets/deit_soda2.glb"',
            '  camera-controls',
            '  auto-rotate',
            '  exposure="1.15"',
            '  shadow-intensity="1">',
            '</model-viewer>'
          ].join('\n')
        },
        {
          path: 'flavor-switch.js',
          lang: 'JS',
          code: [
            'function switchSodaFlavor(mode) {',
            '  const body = document.body;',
            '  const tex = mode === "lime" ? "./assets/green_base_color.jpg" : "./assets/blue_base_color.jpg";',
            '  applyCanTexture(tex);',
            '  body.dataset.flavor = mode;',
            '}'
          ].join('\n')
        }
      ],
      quickstart: [
        '# Giải nén bộ Diet Soda 3D cùng thư mục assets/',
        'npx serve . -l 3000'
      ]
    },
    flowstate: {
      key: 'flowstate',
      id: 'template-flowstate-focus',
      title: 'Flowstate Focus — Ambient WebGL Workspace',
      subtitle: 'Zero-Dependency HTML · Web Audio Synth · Focus Timer',
      price: 9000,
      zipName: 'flowstate-1file-template.html',
      zipSize: '42 KB',
      fileCount: 'Single-File Template',
      demoUrl: '/demo/flowstate/',
      stack: ['Canvas 2D / WebGL', 'Web Audio API', 'Pomodoro Engine', 'Single HTML'],
      scenes: [
        { label: 'Ambient Flow', src: '/assets/aistudio/r1-night_bfd6b447.png', caption: 'Không gian làm việc tập trung sâu · Âm thanh tổng hợp 0MB' }
      ],
      files: [
        {
          path: 'flowstate.html',
          lang: 'JS',
          code: [
            '// Bộ tổng hợp tiếng ồn nâu & mưa dịu bằng Web Audio API (0KB external)',
            'const ctx = new AudioContext();',
            'const gain = ctx.createGain();',
            'gain.gain.value = 0.12;',
            'noiseNode.connect(filter).connect(gain).connect(ctx.destination);'
          ].join('\n')
        }
      ],
      quickstart: [
        '# Mở trực tiếp file HTML trên Chrome / Edge hoặc chạy qua Live Server',
        'npx serve ./demo/flowstate -l 3000'
      ]
    }
  };

  // ==================== HELPERS ====================
  function renderSafeProductImage(prod, imgClass, fallbackClass) {
    imgClass = imgClass || 'w-full h-full object-cover';
    fallbackClass = fallbackClass || 'w-full h-full p-5 flex items-center justify-center';
    if (!prod) return '';
    const iconSvg = (window.ShopVietData && typeof window.ShopVietData.getBrandIcon === 'function')
      ? window.ShopVietData.getBrandIcon(prod.iconType)
      : '';

    let rawUrl = (prod.imageUrl || prod.image || '').trim();
    if (!rawUrl || rawUrl.indexOf('unsplash.com') !== -1) {
      return `<div class="${fallbackClass}">${iconSvg}</div>`;
    }

    if (rawUrl.startsWith('<svg') || rawUrl.startsWith('<?xml')) {
      return `<div class="${fallbackClass} overflow-hidden">${rawUrl}</div>`;
    }

    let safeSrc = rawUrl;
    if (safeSrc.startsWith('data:image/svg+xml;utf8,') || safeSrc.startsWith('data:image/svg+xml,')) {
      const prefix = safeSrc.startsWith('data:image/svg+xml;utf8,') ? 'data:image/svg+xml;utf8,' : 'data:image/svg+xml,';
      const svgBody = safeSrc.substring(prefix.length);
      safeSrc = prefix + svgBody.replace(/"/g, '%22').replace(/#/g, '%23');
    } else {
      safeSrc = safeSrc.replace(/"/g, '&quot;');
    }

    return `<img src="${safeSrc}" alt="${(prod.name || '').replace(/"/g, '&quot;')}" referrerpolicy="no-referrer" loading="lazy" class="${imgClass}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" /><div style="display:none;" class="${fallbackClass}">${iconSvg}</div>`;
  }

  function renderThumbnail(prod) {
    const rawUrl = (prod.imageUrl || prod.image || '').trim();
    const hasImage = Boolean(rawUrl && rawUrl.indexOf('unsplash.com') === -1 && !rawUrl.startsWith('<svg') && !rawUrl.startsWith('<?xml'));

    if (hasImage) {
      return `
        <div class="relative w-full aspect-[16/10] bg-[#0B0F17] rounded-xl overflow-hidden border border-slate-900/10 dark:border-white/10">
          ${renderSafeProductImage(prod, 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]', 'w-full h-full p-6 flex items-center justify-center bg-[#0F172A]')}
          <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none"></div>
          ${prod.discount ? `<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-semibold text-white tabular-nums border border-white/15">${prod.discount}</span>` : ''}
        </div>
      `;
    }

    const iconSvg = (window.ShopVietData && typeof window.ShopVietData.getBrandIcon === 'function')
      ? window.ShopVietData.getBrandIcon(prod.iconType)
      : '';

    return `
      <div class="relative w-full aspect-[16/10] bg-gradient-to-br from-[#0F141F] via-[#131B2B] to-[#0A0E16] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-slate-900/10 dark:border-white/10">
        <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center p-3 shadow-lg group-hover:scale-105 transition-transform duration-300">
          ${iconSvg}
        </div>
        ${prod.discount ? `<span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[11px] font-semibold text-white tabular-nums border border-white/15">${prod.discount}</span>` : ''}
      </div>
    `;
  }

  function detectDevice() {
    var width = (typeof window !== 'undefined')
      ? (window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || (document.body && document.body.clientWidth) || 1200)
      : 1200;
    var userAgent = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
    var isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    if (width < 640 || (isMobileUA && width < 768)) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  function getEffectiveViewMode() {
    var device = detectDevice();
    if (device === 'mobile') return 'compact';
    return 'standard';
  }

  var activeExpanderCardEl = null;
  var activeExpanderProdId = null;

  function formatMoney(amount) {
    if (window.ShopVietState && typeof window.ShopVietState.formatCurrency === 'function') {
      return window.ShopVietState.formatCurrency(amount);
    }
    if (window.ShopVietData && typeof window.ShopVietData.formatMoney === 'function') {
      return window.ShopVietData.formatMoney(amount);
    }
    return Number(amount || 0).toLocaleString('vi-VN') + ' Xu';
  }

  function handleBuyNowClick(event, prodId) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }
    if (window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.open === 'function') {
      window.ShopVietViews.modal.open(prodId);
    }
  }

  function createFallbackOrder(product, qty, voucher, finalAmount) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var suffix = '';
    for (var i = 0; i < 4; i++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    var rawCode = 'DJ2026' + suffix;
    var orderCode = '#' + rawCode;
    var subtotal = (product.price || 0) * qty;
    var discount = voucher ? (voucher.discountAmount || 0) : 0;
    var totalAmount = (typeof finalAmount === 'number') ? finalAmount : Math.max(0, subtotal - discount);
    var orderDate = new Date();

    var vietqrConfig = {
      bankId: '970422',
      bin: '970422',
      bankName: 'MBBank (Ngân hàng TMCP Quân Đội)',
      shortName: 'MBBank',
      accountNumber: '0986019623',
      accountName: 'BUI THAI',
      memoPrefix: 'NAPXU',
      brandColor: '#0071E3'
    };
    if (window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.getActiveVietQRConfig === 'function') {
      vietqrConfig = window.ShopVietViews.modal.getActiveVietQRConfig();
    } else if (window.ShopVietState && typeof window.ShopVietState.getVietQRConfig === 'function') {
      vietqrConfig = window.ShopVietState.getVietQRConfig();
    }

    return {
      id: orderCode,
      orderCode: orderCode,
      rawCode: rawCode,
      memo: rawCode,
      items: [{
        id: product.id,
        name: product.name,
        category: product.tag || product.category || 'Mã nguồn & Prompt',
        price: product.price,
        originalPrice: product.oldPrice || product.price,
        quantity: qty,
        iconType: product.iconType
      }],
      totalItems: qty,
      subtotal: subtotal,
      discount: discount,
      amount: totalAmount,
      voucherCode: voucher ? voucher.code : null,
      appliedVoucher: voucher ? voucher.code : null,
      paymentMethod: (vietqrConfig.shortName || 'MBBank') + ' (VietQR 24/7)',
      bankName: vietqrConfig.bankName,
      accountNumber: vietqrConfig.accountNumber,
      accountName: vietqrConfig.accountName,
      bin: vietqrConfig.bin || vietqrConfig.bankId || '970422',
      createdAt: orderDate.toISOString(),
      createdAtFormatted: orderDate.getHours().toString().padStart(2, '0') + ':' +
                          orderDate.getMinutes().toString().padStart(2, '0') + ' ' +
                          orderDate.getDate().toString().padStart(2, '0') + '/' +
                          (orderDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                          orderDate.getFullYear(),
      status: 'pending',
      expiresInSeconds: 600
    };
  }

  function openMobileExpander(prodId, cardEl) {
    var prod = null;
    if (window.ShopVietData && typeof window.ShopVietData.getProductById === 'function') {
      prod = window.ShopVietData.getProductById(prodId);
    }
    if (!prod && window.ShopVietState && typeof window.ShopVietState.getCustomProducts === 'function') {
      var list = window.ShopVietState.getCustomProducts();
      if (Array.isArray(list)) prod = list.find(function (p) { return p.id === prodId; });
    }
    if (!prod) return;

    var overlay = document.getElementById('mobileCardExpander');
    var card = document.getElementById('mobileExpanderCard');
    var content = document.getElementById('mobileExpanderContent');
    var barPrice = document.getElementById('mobileExpanderBarPrice');
    var goBtn = document.getElementById('mobileExpanderGoBtn');
    var closeBtn = document.getElementById('mobileExpanderCloseBtn');
    var backdrop = document.getElementById('mobileExpanderBackdrop');
    if (!overlay || !card || !content) return;

    activeExpanderCardEl = cardEl || document.querySelector('[data-product-card][data-product-id="' + prodId + '"]');
    activeExpanderProdId = prodId;

    var formattedPrice = formatMoney(prod.price);
    var rawOldPrice = prod.oldPrice || prod.originalPrice;
    var formattedOldPrice = rawOldPrice ? formatMoney(rawOldPrice) : '';
    var categoryLabel = prod.category || prod.tag || 'Mã nguồn & Công cụ AI';
    var currentQty = 1;
    var appliedVoucher = null;

    var benefitsList = Array.isArray(prod.benefits) && prod.benefits.length > 0
      ? prod.benefits
      : (Array.isArray(prod.features) && prod.features.length > 0
        ? prod.features
        : [
            'Mở khóa tự động qua Ví Xu · tải xuống ngay',
            'Kèm đầy đủ file cấu hình / mã nguồn gốc để tự phát triển',
            'Bảo hành kỹ thuật và cập nhật miễn phí trọn đời'
          ]);

    var rawGuide = prod.usageGuide || prod.desc || 'Sản phẩm số được mở khóa tự động ngay sau khi thanh toán bằng Ví Xu.';
    var guideLines = Array.isArray(rawGuide)
      ? rawGuide
      : String(rawGuide).split('\n').map(function (s) { return s.trim(); }).filter(Boolean);

    content.innerHTML = `
      <div class="u328-hero">
        <span class="u328-cat">${categoryLabel}</span>
        <div class="w-20 h-20 my-2 relative flex items-center justify-center rounded-2xl overflow-hidden border border-white/15 bg-slate-900">
          ${renderSafeProductImage(prod, 'w-full h-full object-cover', 'w-full h-full p-4 flex items-center justify-center')}
        </div>
        <h2 class="u328-ttl">${prod.name || 'Sản phẩm số'}</h2>
        <p class="text-xs text-slate-300 mt-1">${prod.warranty || 'Mở khóa tức thì · Vĩnh viễn'}</p>
      </div>

      <div class="u328-body">
        <div class="bg-[#0F141F] border border-white/10 rounded-xl p-3.5 space-y-2">
          <h4 class="text-xs font-semibold text-slate-200 uppercase tracking-wider">Quyền lợi bao gồm</h4>
          <ul class="space-y-1.5 text-xs text-slate-300">
            ${benefitsList.map(function (feat) {
              return `<li class="flex items-start gap-2"><span class="text-[#3B9EFF] font-bold">·</span><span>${feat}</span></li>`;
            }).join('')}
          </ul>
        </div>

        <div class="bg-[#0F141F] border border-white/10 rounded-xl p-3.5 space-y-2">
          <h4 class="text-xs font-semibold text-slate-200 uppercase tracking-wider">Mô tả &amp; Hướng dẫn</h4>
          <div class="text-xs text-slate-300 leading-relaxed space-y-1">
            ${guideLines.map(function (line) { return `<p>${line}</p>`; }).join('')}
          </div>
        </div>

        <div class="bg-[#0F141F] border border-[#3B9EFF]/30 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div class="text-[11px] text-slate-400">Giá mở khóa</div>
            <div class="flex items-baseline gap-2 mt-0.5 tabular-nums">
              <span class="text-xl font-bold text-[#3B9EFF]" id="expanderUnitPromoPrice">${formattedPrice}</span>
              ${formattedOldPrice ? `<span class="text-xs text-slate-400 line-through">${formattedOldPrice}</span>` : ''}
            </div>
          </div>
          ${prod.discount ? `<span class="text-xs font-semibold text-white bg-white/10 px-2.5 py-1 rounded-lg">${prod.discount}</span>` : ''}
        </div>

        <div class="bg-[#0F141F] border border-white/10 rounded-xl p-3.5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-200">Số lượng</span>
            <div class="flex items-center bg-slate-900 border border-white/10 rounded-xl p-0.5">
              <button type="button" id="expanderQtyMinus" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white cursor-pointer" aria-label="Giảm số lượng">-</button>
              <span id="expanderQtyDisplay" class="w-10 text-center text-xs font-mono font-bold text-white tabular-nums">1</span>
              <button type="button" id="expanderQtyPlus" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white cursor-pointer" aria-label="Tăng số lượng">+</button>
            </div>
          </div>

          <div class="pt-2 border-t border-white/10 space-y-1.5">
            <label for="expanderCouponInput" class="text-xs font-semibold text-slate-300 block">Mã giảm giá (Voucher)</label>
            <div class="flex items-center gap-2">
              <input type="text" id="expanderCouponInput" placeholder="VD: GIAM10K..." oninput="this.value = window.ShopVietNormalizeVoucher ? window.ShopVietNormalizeVoucher(this.value) : this.value.toUpperCase();" class="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/15 font-mono text-xs uppercase font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0071E3]" />
              <button type="button" id="expanderApplyCouponBtn" class="px-3.5 py-2 bg-[#0071E3] hover:bg-[#0062C4] text-white font-semibold text-xs rounded-xl transition shrink-0 cursor-pointer">Áp dụng</button>
            </div>
            <div id="expanderCouponStatus" class="text-[11px] font-medium hidden"></div>
          </div>

          <div id="expanderPriceBreakdown" class="hidden pt-2 border-t border-white/10 text-xs space-y-1 text-slate-400 tabular-nums">
            <div class="flex justify-between">
              <span>Tạm tính (<span id="expanderBreakdownQty">1</span>):</span>
              <span id="expanderBreakdownSubtotal" class="font-mono text-slate-200">0 Xu</span>
            </div>
            <div class="flex justify-between text-emerald-400">
              <span>Giảm voucher:</span>
              <span id="expanderBreakdownDiscount" class="font-mono font-bold">-0 Xu</span>
            </div>
          </div>
        </div>
      </div>
    `;

    function recalcAndRefresh() {
      var subtotal = (prod.price || 0) * currentQty;
      var discountAmount = 0;
      if (appliedVoucher) {
        if (appliedVoucher.percent) discountAmount = Math.round(subtotal * (appliedVoucher.percent / 100));
        else discountAmount = Math.min(subtotal, Number(appliedVoucher.value || appliedVoucher.amount || 0));
        appliedVoucher.discountAmount = discountAmount;
      }
      var finalTotal = Math.max(0, subtotal - discountAmount);
      var qtyDisplay = document.getElementById('expanderQtyDisplay');
      if (qtyDisplay) qtyDisplay.textContent = currentQty;
      if (barPrice) barPrice.textContent = formatMoney(finalTotal);

      var breakdownEl = document.getElementById('expanderPriceBreakdown');
      var breakdownQty = document.getElementById('expanderBreakdownQty');
      var breakdownSubtotal = document.getElementById('expanderBreakdownSubtotal');
      var breakdownDiscount = document.getElementById('expanderBreakdownDiscount');
      if (breakdownEl) {
        if (appliedVoucher || currentQty > 1) {
          breakdownEl.classList.remove('hidden');
          if (breakdownQty) breakdownQty.textContent = currentQty;
          if (breakdownSubtotal) breakdownSubtotal.textContent = formatMoney(subtotal);
          if (breakdownDiscount) breakdownDiscount.textContent = '-' + formatMoney(discountAmount);
        } else {
          breakdownEl.classList.add('hidden');
        }
      }
    }

    var minusBtn = document.getElementById('expanderQtyMinus');
    var plusBtn = document.getElementById('expanderQtyPlus');
    if (minusBtn) minusBtn.onclick = function (e) { if (e) e.stopPropagation(); if (currentQty > 1) { currentQty--; recalcAndRefresh(); } };
    if (plusBtn) plusBtn.onclick = function (e) { if (e) e.stopPropagation(); if (currentQty < 99) { currentQty++; recalcAndRefresh(); } };

    function handleApplyCoupon() {
      var input = document.getElementById('expanderCouponInput');
      var msgEl = document.getElementById('expanderCouponStatus');
      var btn = document.getElementById('expanderApplyCouponBtn');
      if (!input) return;
      var rawCode = normalizeVoucherCode(input.value);
      if (!rawCode) {
        if (msgEl) { msgEl.className = 'text-[11px] font-medium text-amber-400 block'; msgEl.textContent = 'Vui lòng nhập mã giảm giá.'; }
        return;
      }
      var vouchers = (window.ShopVietState && typeof window.ShopVietState.getVouchers === 'function') ? window.ShopVietState.getVouchers() : [];
      var v = vouchers.find(function (item) { return item && item.code && normalizeVoucherCode(item.code) === rawCode; });
      if (!v) {
        var staticVouchers = {
          'GIAM10K': { code: 'GIAM10K', type: 'order_discount', value: 10000, isUsed: false },
          'AI2026': { code: 'AI2026', type: 'percent_discount', percent: 15, isUsed: false },
          'THAIBUI': { code: 'THAIBUI', type: 'order_discount', value: 20000, isUsed: false }
        };
        if (staticVouchers[rawCode]) v = staticVouchers[rawCode];
      }
      if (!v || v.isUsed) {
        if (msgEl) { msgEl.className = 'text-[11px] font-medium text-rose-400 block'; msgEl.textContent = !v ? 'Mã giảm giá không hợp lệ.' : 'Mã này đã được sử dụng.'; }
        return;
      }
      appliedVoucher = v;
      recalcAndRefresh();
      if (msgEl) {
        msgEl.className = 'text-[11px] font-semibold text-emerald-400 flex items-center justify-between gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 mt-1.5';
        msgEl.innerHTML = '<span>Đã áp dụng mã <strong class="font-mono">' + v.code + '</strong></span><button type="button" id="expanderRemoveCouponBtn" class="text-rose-400 underline text-[10px]">Gỡ</button>';
        var rb = document.getElementById('expanderRemoveCouponBtn');
        if (rb) rb.onclick = function () { appliedVoucher = null; input.value = ''; input.disabled = false; btn.disabled = false; msgEl.className = 'hidden'; recalcAndRefresh(); };
      }
      input.disabled = true;
      btn.disabled = true;
    }

    var couponBtn = document.getElementById('expanderApplyCouponBtn');
    if (couponBtn) couponBtn.onclick = handleApplyCoupon;
    var couponInput = document.getElementById('expanderCouponInput');
    if (couponInput) couponInput.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } };

    recalcAndRefresh();

    if (goBtn) {
      goBtn.onclick = function (e) {
        if (e) e.stopPropagation();
        var subtotal = (prod.price || 0) * currentQty;
        var discountAmount = appliedVoucher ? (appliedVoucher.discountAmount || 0) : 0;
        var finalTotal = Math.max(0, subtotal - discountAmount);
        var order = (window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.createOrder === 'function')
          ? window.ShopVietViews.modal.createOrder(prod, currentQty, appliedVoucher)
          : createFallbackOrder(prod, currentQty, appliedVoucher, finalTotal);
        if (window.ShopVietState) window.ShopVietState.currentOrder = order;
        closeMobileExpander(function () {
          if (window.ShopVietViews && window.ShopVietViews.modal) window.ShopVietViews.modal.open(activeExpanderProdId);
        });
      };
    }
    if (closeBtn) closeBtn.onclick = function (e) { if (e) e.stopPropagation(); closeMobileExpander(); };
    if (backdrop) backdrop.onclick = function (e) { if (e) e.stopPropagation(); closeMobileExpander(); };

    document.body.style.overflow = 'hidden';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    card.scrollTop = 0;
    card.style.top = '0px';
    card.style.left = '0px';
    card.style.width = '100vw';
    card.style.height = '100dvh';
    card.style.borderRadius = '0px';
    overlay.classList.add('is-in');
  }

  function closeMobileExpander(callback) {
    var overlay = document.getElementById('mobileCardExpander');
    var card = document.getElementById('mobileExpanderCard');
    if (!overlay || !card) return;
    overlay.classList.remove('is-in', 'is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeExpanderCardEl = null;
    activeExpanderProdId = null;
    if (typeof callback === 'function') callback();
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var overlay = document.getElementById('mobileCardExpander');
        if (overlay && overlay.classList.contains('is-open')) closeMobileExpander();
      }
    });
  }

  function openPromptPreview(prodId) {
    if (window.ShopVietViews && window.ShopVietViews.modal && typeof window.ShopVietViews.modal.open === 'function') {
      window.ShopVietViews.modal.open(prodId);
    }
  }
  function closePromptPreview() {
    var modalEl = document.getElementById('promptPreviewModal');
    if (modalEl) { modalEl.style.display = 'none'; modalEl.innerHTML = ''; }
  }
  function copyPromptSnippet(prodId) {
    var data = window.ShopVietData || {};
    var prod = (data.products || []).find(function (p) { return p.id === prodId; }) || null;
    if (!prod || !navigator.clipboard) return;
    navigator.clipboard.writeText(prod.previewPrompt || '').catch(function () {});
  }

  // ==================== COMBO CALCULATOR ====================
  var selectedComboSet = new Set();
  function toggleComboItem(prodId, isChecked) {
    if (isChecked) selectedComboSet.add(prodId);
    else selectedComboSet.delete(prodId);
    renderComboStatus();
  }
  function renderComboStatus() {
    var pill = document.getElementById('comboStatusPill');
    if (!pill) return;
    var count = selectedComboSet.size;
    if (count === 0) {
      pill.innerHTML = '<span class="text-xs text-[#6E6E73] dark:text-[#9CA3AF]">Chọn từ 2 gói trở lên để tự động tính ưu đãi combo</span>';
      return;
    }
    var data = window.ShopVietData || {};
    var totalRaw = 0;
    selectedComboSet.forEach(function (id) {
      var p = (data.products || []).find(function (x) { return x.id === id; });
      if (p) totalRaw += (p.price || 0);
    });
    var discountPercent = count === 2 ? 20 : (count >= 3 ? 30 : 0);
    var finalPrice = totalRaw - Math.round(totalRaw * discountPercent / 100);
    pill.innerHTML = `
      <div class="flex flex-wrap items-center gap-2.5 lg-glass px-3.5 py-2 rounded-xl tabular-nums">
        <span class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF]">Đã chọn ${count} gói</span>
        <span class="text-xs text-slate-400 line-through">${Number(totalRaw).toLocaleString('vi-VN')} Xu</span>
        ${discountPercent ? `<span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">-${discountPercent}%</span>` : ''}
        <span class="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">${Number(finalPrice).toLocaleString('vi-VN')} Xu</span>
        <button onclick="ShopVietViews.home.checkoutCombo()" class="lg-btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">Mở khóa</button>
      </div>
    `;
  }
  function checkoutCombo() {
    if (selectedComboSet.size === 0) return;
    var firstId = Array.from(selectedComboSet)[0];
    if (window.ShopVietViews && window.ShopVietViews.modal) window.ShopVietViews.modal.open(firstId);
  }

  // ==================== OPEN-DESIGN STUDIO WORKBENCH RENDERER ====================
  function escapeCode(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderWorkbenchHTML() {
    var proj = WORKBENCH_PROJECTS[workbenchState.project] || WORKBENCH_PROJECTS.metropolis;
    var activeScene = proj.scenes[workbenchState.sceneIndex] || proj.scenes[0];
    var activeFile = proj.files[workbenchState.fileIndex] || proj.files[0];

    var bodyHtml = '';
    if (workbenchState.tab === 'preview') {
      bodyHtml = `
        <div class="space-y-3">
          <div class="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#06080D] border border-white/10">
            <img
              src="${activeScene.src}"
              alt="${proj.title} — ${activeScene.label}"
              referrerpolicy="no-referrer"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none"></div>
            <div class="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-3">
              <div>
                <div class="text-[11px] font-mono text-[#3B9EFF]">${activeScene.label}</div>
                <p class="text-xs text-slate-200 mt-0.5 line-clamp-1">${activeScene.caption}</p>
              </div>
              <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="shrink-0 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold border border-white/15 transition-colors whitespace-nowrap">
                Demo Live ↗
              </a>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            ${proj.scenes.map(function (sc, idx) {
              var active = idx === workbenchState.sceneIndex;
              return `
                <button
                  type="button"
                  onclick="ShopVietViews.home.setWorkbenchScene(${idx})"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${active ? 'bg-[#0071E3] text-white font-semibold' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'}"
                >${sc.label}</button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (workbenchState.tab === 'code') {
      bodyHtml = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 h-[300px] sm:h-[330px]">
          <div class="md:col-span-4 rounded-xl bg-white/[0.03] border border-white/10 p-2 overflow-y-auto space-y-1">
            <div class="px-2 py-1 text-[11px] font-medium text-slate-400">Cây thư mục dự án</div>
            ${proj.files.map(function (f, idx) {
              var active = idx === workbenchState.fileIndex;
              return `
                <button
                  type="button"
                  onclick="ShopVietViews.home.setWorkbenchFile(${idx})"
                  class="w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono flex items-center justify-between gap-2 cursor-pointer transition-colors ${active ? 'bg-[#0071E3]/25 text-[#3B9EFF] border border-[#3B9EFF]/40 font-semibold' : 'text-slate-300 hover:bg-white/5'}"
                >
                  <span class="truncate">${f.path}</span>
                  <span class="text-[10px] text-slate-500 shrink-0">${f.lang}</span>
                </button>
              `;
            }).join('')}
          </div>
          <div class="md:col-span-8 rounded-xl bg-[#05070B] border border-white/10 flex flex-col overflow-hidden">
            <div class="px-3.5 py-2 border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span class="text-slate-200">${activeFile.path}</span>
              <span>${proj.zipName}</span>
            </div>
            <pre class="p-3.5 text-[11.5px] leading-relaxed font-mono text-slate-200 overflow-auto flex-1"><code>${escapeCode(activeFile.code)}</code></pre>
          </div>
        </div>
      `;
    } else {
      bodyHtml = `
        <div class="space-y-3 h-[300px] sm:h-[330px] overflow-y-auto pr-1">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div class="p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <div class="text-slate-400 text-[11px]">Gói tải về</div>
              <div class="text-white font-semibold mt-1 truncate font-mono">${proj.zipName}</div>
            </div>
            <div class="p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <div class="text-slate-400 text-[11px]">Dung lượng &amp; cấu trúc</div>
              <div class="text-white font-semibold mt-1 tabular-nums">${proj.fileCount} · ${proj.zipSize}</div>
            </div>
            <div class="p-3 rounded-xl bg-white/[0.04] border border-white/10 col-span-2 sm:col-span-1">
              <div class="text-slate-400 text-[11px]">Quyền sử dụng</div>
              <div class="text-white font-semibold mt-1">Tự do sửa &amp; deploy</div>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
            <div class="text-xs font-semibold text-white">Công nghệ tích hợp</div>
            <div class="text-xs text-slate-300 leading-relaxed">${proj.stack.join(' · ')}</div>
          </div>

          <div class="p-3.5 rounded-xl bg-[#05070B] border border-white/10 space-y-2">
            <div class="text-xs font-semibold text-[#3B9EFF]">Chạy trên máy cá nhân (30 giây)</div>
            <pre class="text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto"><code>${proj.quickstart.join('\n')}</code></pre>
          </div>
        </div>
      `;
    }

    return `
      <div id="odWorkbenchPanel" class="bg-[#0C1018] text-white rounded-3xl p-4 sm:p-5 border border-white/10 shadow-2xl flex flex-col justify-between gap-4 h-full">
        <!-- Workbench Header Controls -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
          <!-- Project Switcher -->
          <div class="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 max-w-full overflow-x-auto" role="tablist" aria-label="Chọn dự án mẫu">
            <button type="button" onclick="ShopVietViews.home.setWorkbenchProject('metropolis')" class="px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${workbenchState.project === 'metropolis' ? 'bg-[#0071E3] text-white font-semibold' : 'text-slate-300 hover:text-white'}">
              Metropolis 1998 · 15k
            </button>
            <button type="button" onclick="ShopVietViews.home.setWorkbenchProject('dietsoda')" class="px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${workbenchState.project === 'dietsoda' ? 'bg-[#0071E3] text-white font-semibold' : 'text-slate-300 hover:text-white'}">
              Diet Soda 3D · 15k
            </button>
            <button type="button" onclick="ShopVietViews.home.setWorkbenchProject('flowstate')" class="px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${workbenchState.project === 'flowstate' ? 'bg-[#0071E3] text-white font-semibold' : 'text-slate-300 hover:text-white'}">
              Flowstate WebGL
            </button>
          </div>

          <!-- View Tabs -->
          <div class="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 shrink-0" role="tablist" aria-label="Chế độ xem Workbench">
            <button type="button" onclick="ShopVietViews.home.setWorkbenchTab('preview')" class="px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${workbenchState.tab === 'preview' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'}">
              Preview
            </button>
            <button type="button" onclick="ShopVietViews.home.setWorkbenchTab('code')" class="px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${workbenchState.tab === 'code' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'}">
              Source Tree
            </button>
            <button type="button" onclick="ShopVietViews.home.setWorkbenchTab('spec')" class="px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${workbenchState.tab === 'spec' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'}">
              Spec &amp; Stack
            </button>
          </div>
        </div>

        <!-- Workbench Body -->
        <div>${bodyHtml}</div>

        <!-- Workbench Action Footer -->
        <div class="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white truncate">${proj.title}</div>
            <div class="text-xs text-slate-400 truncate">${proj.subtitle}</div>
          </div>
          <div class="flex items-center gap-2.5 shrink-0">
            <span class="text-base font-bold text-[#3B9EFF] tabular-nums">${Number(proj.price).toLocaleString('vi-VN')} Xu</span>
            <button
              type="button"
              onclick="ShopVietViews.modal.open('${proj.id}')"
              class="lg-btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              Mở khóa &amp; Tải ZIP
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function refreshWorkbenchDOM() {
    var mount = document.getElementById('odWorkbenchMount');
    if (mount) {
      mount.innerHTML = renderWorkbenchHTML();
    }
  }

  // ==================== CATALOG SORT & MATCH HELPERS ====================
  function isProductMatchingTag(p, tag) {
    if (!tag || tag === 'Tất cả') return true;
    var tLower = tag.toLowerCase();
    var idLower = (p.id || '').toLowerCase();
    var pTagLower = (p.tag || '').toLowerCase();
    var pGroupLower = (p.filterGroup || '').toLowerCase();
    var pCatLower = (p.category || '').toLowerCase();

    if (tag === 'Mã nguồn') {
      return p.tag === 'Mã nguồn' || p.filterGroup === 'Mã nguồn' || idLower.startsWith('source-');
    }
    if (p.tag === tag || p.filterGroup === tag || p.category === tag || p.categoryId === tag) return true;
    if (Array.isArray(p.tags) && p.tags.some(function (t) { return t && t.toLowerCase().includes(tLower); })) return true;
    if (tag === 'Template web' && (idLower.includes('template') || idLower.includes('soda') || idLower.includes('source-') || pTagLower.includes('template') || pGroupLower.includes('template') || pCatLower.includes('template'))) return true;
    if (tag === 'Skill' && (idLower.startsWith('skill') || pTagLower.includes('skill') || pCatLower.includes('skill'))) return true;
    if (tag === 'Prompt Video' && (idLower.includes('video') || idLower.includes('phonk') || pTagLower.includes('video') || pCatLower.includes('video'))) return true;
    return false;
  }

  function sortProductsList(list) {
    var arr = (list || []).slice();
    if (currentPriceSort === 'price-asc') {
      arr.sort(function (a, b) { return (Number(a.price) || 0) - (Number(b.price) || 0); });
    } else if (currentPriceSort === 'price-desc') {
      arr.sort(function (a, b) { return (Number(b.price) || 0) - (Number(a.price) || 0); });
    }
    return arr;
  }

  function renderProductCard(prod, isMatch) {
    var isOutOfStock = prod.status === 'out_of_stock' || prod.stock <= 0;
    var formattedPrice = window.ShopVietState ? window.ShopVietState.formatCurrency(prod.price) : `${Number(prod.price || 0).toLocaleString('vi-VN')} Xu`;
    var formattedOldPrice = prod.oldPrice ? (window.ShopVietState ? window.ShopVietState.formatCurrency(prod.oldPrice) : `${Number(prod.oldPrice).toLocaleString('vi-VN')} Xu`) : '';
    var metaSecondary = prod.zipFileSize
      ? ('Mã nguồn ZIP · ' + prod.zipFileSize)
      : (prod.module || 'Mở khóa tức thì · Vĩnh viễn');

    return `
      <article
        data-product-card="true"
        data-product-id="${prod.id}"
        data-product-price="${Number(prod.price) || 0}"
        data-product-tag="${prod.tag || ''}"
        data-product-category="${prod.filterGroup || prod.category || ''}"
        data-product-name="${(prod.name || '').replace(/"/g, '&quot;')}"
        class="u292-t ${isMatch ? '' : 'out'} lg-glass rounded-2xl p-4 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 group cursor-pointer"
        style="${isMatch ? '' : 'display: none;'}"
        onclick="ShopVietViews.modal.open('${prod.id}')"
      >
        <div>
          ${renderThumbnail(prod)}

          <div class="mt-3.5 space-y-1.5">
            <div class="flex items-center gap-1.5 text-xs text-[#6E6E73] dark:text-[#9CA3AF] truncate">
              <span class="font-medium text-[#0071E3] dark:text-[#3B9EFF]">${prod.tag || prod.filterGroup || 'Sản phẩm số'}</span>
              <span aria-hidden="true">·</span>
              <span class="truncate">${metaSecondary}</span>
            </div>

            <h3 class="line-clamp-2 text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] group-hover:text-[#0071E3] dark:group-hover:text-[#3B9EFF] transition-colors leading-snug font-display">
              ${prod.name}
            </h3>

            <p class="line-clamp-2 text-xs text-[#6E6E73] dark:text-[#9CA3AF] leading-relaxed">
              ${prod.desc || ''}
            </p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between gap-2">
          <div class="flex flex-col tabular-nums shrink-0">
            <span class="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7] whitespace-nowrap">${formattedPrice}</span>
            ${formattedOldPrice ? `<span class="text-[11px] text-[#6E6E73] dark:text-[#9CA3AF] line-through whitespace-nowrap">${formattedOldPrice}</span>` : ''}
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            ${prod.demoUrl ? `
              <button
                type="button"
                onclick="event.stopPropagation(); if(window.ShopVietViews && window.ShopVietViews.modal && window.ShopVietViews.modal.openGameDemo) { window.ShopVietViews.modal.openGameDemo('${prod.demoUrl}', '${prod.id}'); } else { window.open('${prod.demoUrl}', '_blank'); }"
                class="px-2.5 py-2 rounded-xl text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="${prod.demoTitle || 'Xem bản demo trực tiếp'}"
              >Demo</button>
            ` : ''}

            ${isOutOfStock ? `
              <button disabled onclick="event.stopPropagation()" class="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 text-xs font-medium cursor-not-allowed whitespace-nowrap">Hết hàng</button>
            ` : `
              <button
                type="button"
                onclick="event.stopPropagation(); ShopVietViews.home.handleBuyNowClick(event, '${prod.id}', this)"
                class="lg-btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >${prod.ctaText ? prod.ctaText.replace(/[⚡🎮👑]+/g, '').trim() : 'Mở khóa'}</button>
            `}
          </div>
        </div>
      </article>
    `;
  }

  return {
    setWorkbenchProject: function (projKey) {
      if (!WORKBENCH_PROJECTS[projKey]) return;
      workbenchState.project = projKey;
      workbenchState.sceneIndex = 0;
      workbenchState.fileIndex = 0;
      refreshWorkbenchDOM();
    },

    setWorkbenchTab: function (tabKey) {
      if (['preview', 'code', 'spec'].indexOf(tabKey) === -1) return;
      workbenchState.tab = tabKey;
      refreshWorkbenchDOM();
    },

    setWorkbenchScene: function (idx) {
      workbenchState.sceneIndex = Math.max(0, parseInt(idx, 10) || 0);
      refreshWorkbenchDOM();
    },

    setWorkbenchFile: function (idx) {
      workbenchState.fileIndex = Math.max(0, parseInt(idx, 10) || 0);
      refreshWorkbenchDOM();
    },

    setPriceSort: function (sortKey) {
      currentPriceSort = sortKey || 'featured';
      var appMount = document.getElementById('appMount');
      if (appMount) {
        var sy = window.scrollY;
        appMount.innerHTML = this.render();
        window.scrollTo(0, sy);
      }
    },

    render: function (params) {
      params = params || {};
      const data = window.ShopVietData || { categories: [], products: [], filterTags: [] };
      const currentFilter = window.ShopVietState ? (window.ShopVietState.state.activeFilter || 'Tất cả') : 'Tất cả';
      const searchQuery = window.ShopVietState ? (window.ShopVietState.state.searchQuery || '') : '';
      const currentViewMode = getEffectiveViewMode();
      let gridColClasses = currentViewMode === 'compact' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

      let allProducts = [];
      if (window.ShopVietState && typeof window.ShopVietState.getCustomProducts === 'function' && window.ShopVietState.getCustomProducts().length > 0) {
        allProducts = window.ShopVietState.getCustomProducts();
      } else if (window.ShopVietData && Array.isArray(window.ShopVietData.products)) {
        allProducts = window.ShopVietData.products;
      }

      let searchProducts = allProducts || [];
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        searchProducts = searchProducts.filter(function (p) {
          return (p.name && p.name.toLowerCase().includes(query)) ||
                 (p.desc && p.desc.toLowerCase().includes(query)) ||
                 (p.tag && p.tag.toLowerCase().includes(query));
        });
      }
      searchProducts = sortProductsList(searchProducts);
      const matchingProducts = searchProducts.filter(function (p) { return isProductMatchingTag(p, currentFilter); });
      const filterTags = (data.filterTags && data.filterTags.length > 0)
        ? data.filterTags
        : ['Tất cả', 'Mã nguồn', 'Template web', 'Skill', 'Prompt Video'];

      return `
        <div class="space-y-12 sm:space-y-16">

          <!-- ==================== OPEN-DESIGN STUDIO WORKBENCH SPLIT HERO ==================== -->
          <section class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

              <!-- Left Column (5 Cols): Studio Thesis + Direct Primary CTA + Hairline Metrics -->
              <div class="lg:col-span-5 lg-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
                <div class="space-y-4">
                  <div class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF] tracking-wide">
                    Open-Design Studio · Mã nguồn &amp; Prompt thực chiến
                  </div>

                  <h1
                    id="heroTitleText"
                    data-static-i18n="true"
                    class="font-display font-bold text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.12] tracking-tight"
                    style="font-size: clamp(2rem, 3.2vw, 2.85rem); text-wrap: balance;"
                  >
                    Tải Mã Nguồn <span class="text-[#0071E3] dark:text-[#3B9EFF]">Studio 3D</span> &amp; Prompt Thực Chiến
                  </h1>

                  <p id="heroDescText" class="text-sm sm:text-[15px] text-[#6E6E73] dark:text-[#9CA3AF] leading-relaxed">
                    Mở khóa trọn gói mã nguồn <strong>Metropolis 1998 (React + Three.js)</strong> hoặc bộ Landing 3D với giá <strong>15.000 Xu</strong>. Tải file <code class="font-mono text-xs px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-[#F5F5F7]">.zip</code> về giải nén, chạy <code class="font-mono text-xs px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-[#F5F5F7]">npm run dev</code> và tự do phát triển tiếp.
                  </p>

                  <div class="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onclick="ShopVietViews.modal.open('source-metropolis-1998-city-builder')"
                      class="lg-btn-primary px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Mở khóa Metropolis 1998 · 15.000 Xu
                    </button>
                    <a
                      href="/demo/metropolis-1998/"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="px-4 py-3 rounded-xl text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7] bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 transition-colors whitespace-nowrap"
                    >
                      Mở Studio Demo ↗
                    </a>
                  </div>
                </div>

                <!-- 3 Clean Tabular Metrics -->
                <div class="mt-8 pt-5 border-t border-slate-900/10 dark:border-white/10 grid grid-cols-3 gap-4 tabular-nums">
                  <div>
                    <div class="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">18 Files</div>
                    <div class="text-xs text-[#6E6E73] dark:text-[#9CA3AF]">React + Three.js</div>
                  </div>
                  <div>
                    <div class="text-base sm:text-lg font-bold text-[#0071E3] dark:text-[#3B9EFF]">15.000 Xu</div>
                    <div class="text-xs text-[#6E6E73] dark:text-[#9CA3AF]">Mở khóa trọn đời</div>
                  </div>
                  <div>
                    <div class="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">VietQR 5s</div>
                    <div class="text-xs text-[#6E6E73] dark:text-[#9CA3AF]">Giao file tự động</div>
                  </div>
                </div>
              </div>

              <!-- Right Column (7 Cols): Interactive Open-Design Studio Workbench -->
              <div id="odWorkbenchMount" class="lg:col-span-7">
                ${renderWorkbenchHTML()}
              </div>
            </div>

            <!-- 4-Column Full-Width Capability Strip -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onclick="if(window.openDepositModal) window.openDepositModal(); else if(window.ShopVietViews && window.ShopVietViews.modal) window.ShopVietViews.modal.openDepositModal();"
                class="text-left lg-glass rounded-2xl p-4 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF]">01 · Ví Xu VietQR</div>
                <div class="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">Nạp tự động 24/7</div>
                <p class="text-xs text-[#6E6E73] dark:text-[#9CA3AF] mt-1">MBBank 0986019623 khớp lệnh chỉ trong vài giây.</p>
              </button>

              <button
                type="button"
                onclick="ShopVietViews.modal.open('source-metropolis-1998-city-builder')"
                class="text-left lg-glass rounded-2xl p-4 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF]">02 · Mã nguồn sạch</div>
                <div class="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">Tải .ZIP về tự code</div>
                <p class="text-xs text-[#6E6E73] dark:text-[#9CA3AF] mt-1">Cấu trúc Vite + TS chuẩn, giải nén chạy ngay.</p>
              </button>

              <button
                type="button"
                onclick="ShopVietViews.home.filterByTag('Mã nguồn')"
                class="text-left lg-glass rounded-2xl p-4 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF]">03 · Giá minh bạch</div>
                <div class="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">Chỉ từ 9k – 15k Xu</div>
                <p class="text-xs text-[#6E6E73] dark:text-[#9CA3AF] mt-1">Sở hữu vĩnh viễn trên tài khoản cá nhân.</p>
              </button>

              <button
                type="button"
                onclick="window.ShopVietState ? window.ShopVietState.navigate('dashboard', { tab: 'orders' }) : (window.location.hash = '#dashboard?tab=orders')"
                class="text-left lg-glass rounded-2xl p-4 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF]">04 · Đồng bộ Cloud</div>
                <div class="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">Quản lý đơn hàng</div>
                <p class="text-xs text-[#6E6E73] dark:text-[#9CA3AF] mt-1">Tải lại mã nguồn &amp; hỗ trợ 1-1 qua Zalo.</p>
              </button>
            </div>
          </section>

          <!-- ==================== UNIFIED CATALOG TOOLBAR & 3-COLUMN GRID ==================== -->
          <section id="productsSection" class="u292 space-y-6 pt-2 scroll-mt-24">

            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-900/10 dark:border-white/10">
              <div>
                <h2 id="u205FeaturedTitle" class="font-display font-bold text-2xl sm:text-3xl text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
                  Kho Mã Nguồn &amp; Bộ Prompt
                </h2>
                <p class="text-xs sm:text-sm text-[#6E6E73] dark:text-[#9CA3AF] mt-1">
                  ${searchQuery
                    ? `Đang lọc theo từ khóa "<strong class="text-[#1D1D1F] dark:text-white">${searchQuery}</strong>" · `
                    : 'Bản quyền sử dụng vĩnh viễn · '}
                  <span class="tabular-nums font-semibold text-[#0071E3] dark:text-[#3B9EFF]">
                    <span id="u292CountVal">${matchingProducts.length}</span> sản phẩm sẵn có
                  </span>
                </p>
              </div>

              <!-- Search + Sort -->
              <div class="flex flex-wrap items-center gap-2.5">
                <form id="heroSearchForm" onsubmit="ShopVietViews.home.handleSearchSubmit(event)" class="flex items-center lg-glass rounded-xl p-1 min-w-[240px] sm:min-w-[280px]">
                  <svg class="w-4 h-4 text-[#6E6E73] dark:text-[#9CA3AF] ml-2.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                  <input
                    id="heroSearchInput"
                    type="text"
                    value="${searchQuery}"
                    placeholder="Tìm mã nguồn, prompt, 3D..."
                    class="bg-transparent text-xs sm:text-sm text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#6E6E73] dark:placeholder-[#9CA3AF] focus:outline-none px-2.5 py-1.5 flex-1 min-w-0"
                  />
                  ${searchQuery ? `
                    <button type="button" onclick="ShopVietViews.home.clearSearch()" class="p-1 text-[#6E6E73] hover:text-[#1D1D1F] dark:hover:text-white cursor-pointer" title="Xóa tìm kiếm">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  ` : ''}
                  <button type="submit" class="px-3 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0062C4] text-white text-xs font-semibold cursor-pointer whitespace-nowrap">Tìm</button>
                </form>

                <label for="productPriceSort" class="sr-only">Sắp xếp theo giá</label>
                <select
                  id="productPriceSort"
                  onchange="ShopVietViews.home.setPriceSort(this.value)"
                  class="lg-glass rounded-xl px-3 py-2 text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
                >
                  <option value="featured" ${currentPriceSort === 'featured' ? 'selected' : ''}>Sắp xếp: Nổi bật</option>
                  <option value="price-asc" ${currentPriceSort === 'price-asc' ? 'selected' : ''}>Giá: Thấp → Cao</option>
                  <option value="price-desc" ${currentPriceSort === 'price-desc' ? 'selected' : ''}>Giá: Cao → Thấp</option>
                </select>
              </div>
            </div>

            <!-- Consolidated Single-Row Category Filter Toolbar -->
            <div class="u292-fs flex items-center gap-1.5 overflow-x-auto pb-1" role="toolbar" aria-label="Bộ lọc danh mục sản phẩm">
              ${filterTags.map(function (tag) {
                var isSelected = tag === currentFilter;
                return `
                  <button
                    type="button"
                    role="button"
                    aria-pressed="${isSelected ? 'true' : 'false'}"
                    data-tag="${tag}"
                    onclick="ShopVietViews.home.filterByTag('${tag}')"
                    class="u292-f ${isSelected ? 'is-active' : ''}"
                  >${tag}</button>
                `;
              }).join('')}
            </div>

            <!-- Combo Calculator Strip (Preserved IDs) -->
            <div id="dynamicComboBar" class="lg-glass rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div class="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Ưu đãi Combo nhiều gói · Giảm 20% – 30%</div>
                <p class="text-xs text-[#6E6E73] dark:text-[#9CA3AF] mt-0.5">Chọn từ 2 gói giảm 20%, từ 3 gói giảm 30% trên tổng hóa đơn Xu.</p>
              </div>
              <div id="comboStatusPill" class="flex flex-wrap items-center gap-2">
                <span class="text-xs text-[#6E6E73] dark:text-[#9CA3AF]">Chọn từ 2 gói trở lên để tự động tính ưu đãi combo</span>
              </div>
            </div>

            <!-- Uniform 3-Column Liquid Glass Product Grid -->
            <div id="productListGrid" class="u292-g grid ${gridColClasses} gap-6 transition-all duration-300">
              ${searchProducts.map(function (prod) {
                var isMatch = isProductMatchingTag(prod, currentFilter);
                return renderProductCard(prod, isMatch);
              }).join('')}

              <div id="u292EmptyState" class="u292-empty col-span-full py-16 text-center space-y-3 lg-glass rounded-2xl" style="${matchingProducts.length === 0 ? '' : 'display: none; opacity: 0;'}">
                <h3 class="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Không tìm thấy sản phẩm phù hợp</h3>
                <p class="text-xs text-[#6E6E73] dark:text-[#9CA3AF] max-w-sm mx-auto">Thử từ khóa khác hoặc chuyển bộ lọc về "Tất cả".</p>
                <button type="button" onclick="ShopVietViews.home.clearSearch()" class="lg-btn-primary mt-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">
                  Xem toàn bộ kho hàng
                </button>
              </div>
            </div>

          </section>

          <!-- ==================== 3-STEP LOCAL DELIVERY STRIP ==================== -->
          <section class="lg-glass rounded-3xl p-6 sm:p-8">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 pb-4 border-b border-slate-900/10 dark:border-white/10">
              <div>
                <h2 class="font-display font-bold text-xl sm:text-2xl text-[#1D1D1F] dark:text-[#F5F5F7]">Quy trình nhận mã nguồn &amp; tự phát triển</h2>
                <p class="text-xs sm:text-sm text-[#6E6E73] dark:text-[#9CA3AF] mt-1">Từ lúc mở khóa đến khi chạy dự án trên máy cá nhân chỉ mất chưa đầy 2 phút.</p>
              </div>
              <button type="button" onclick="ShopVietViews.modal.open('source-metropolis-1998-city-builder')" class="text-xs font-semibold text-[#0071E3] dark:text-[#3B9EFF] hover:underline cursor-pointer whitespace-nowrap">
                Thử ngay với Metropolis 1998 →
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-1.5">
                <div class="text-xs font-mono font-semibold text-[#0071E3] dark:text-[#3B9EFF]">01. Chọn gói phù hợp</div>
                <h3 class="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Xem thử Demo &amp; Source Tree</h3>
                <p class="text-xs text-[#6E6E73] dark:text-[#9CA3AF] leading-relaxed">Kiểm tra trước cấu trúc thư mục, công nghệ sử dụng và bản demo thực tế ngay trên Studio Workbench.</p>
              </div>
              <div class="space-y-1.5">
                <div class="text-xs font-mono font-semibold text-[#0071E3] dark:text-[#3B9EFF]">02. Nạp Xu VietQR</div>
                <h3 class="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Mở khóa tự động bằng Ví Xu</h3>
                <p class="text-xs text-[#6E6E73] dark:text-[#9CA3AF] leading-relaxed">Chuyển khoản VietQR MBBank 0986019623 theo nội dung cấp sẵn, hệ thống cộng Xu và mở khóa vĩnh viễn.</p>
              </div>
              <div class="space-y-1.5">
                <div class="text-xs font-mono font-semibold text-[#0071E3] dark:text-[#3B9EFF]">03. Tải .ZIP &amp; Mở rộng</div>
                <h3 class="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Giải nén &amp; chạy local</h3>
                <p class="text-xs text-[#6E6E73] dark:text-[#9CA3AF] leading-relaxed">Tải file <code class="font-mono">.zip</code> về máy, chạy <code class="font-mono">npm install &amp;&amp; npm run dev</code> và tiếp tục tùy biến theo ý muốn.</p>
              </div>
            </div>
          </section>

        </div>
      `;
    },

    filterByTag: function (tag) {
      if (!window.ShopVietState) return;
      const currentFilter = window.ShopVietState.state.activeFilter || 'Tất cả';
      if (currentFilter === tag) return;
      window.ShopVietState.state.activeFilter = tag;

      document.querySelectorAll('.u292-f').forEach(function (btn) {
        var btnTag = btn.getAttribute('data-tag');
        var isSelected = btnTag === tag;
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        btn.classList.toggle('is-active', isSelected);
      });

      const grid = document.getElementById('productListGrid');
      const emptyState = document.getElementById('u292EmptyState');
      const countValEl = document.getElementById('u292CountVal');
      if (!grid) {
        const appMount = document.getElementById('appMount');
        if (appMount) appMount.innerHTML = this.render();
        return;
      }

      function checkCardMatches(card, filterTag) {
        if (!filterTag || filterTag === 'Tất cả') return true;
        const cTag = card.getAttribute('data-product-tag') || '';
        const cCat = card.getAttribute('data-product-category') || '';
        const cName = (card.getAttribute('data-product-name') || '').toLowerCase();
        const cId = (card.getAttribute('data-product-id') || '').toLowerCase();
        if (filterTag === 'Mã nguồn') {
          return cTag === 'Mã nguồn' || cCat === 'Mã nguồn' || cId.startsWith('source-');
        }
        if (cTag === filterTag || cCat === filterTag) return true;
        if (cCat && cCat.toLowerCase().includes(filterTag.toLowerCase())) return true;
        if (filterTag === 'Template web' && (cId.includes('template') || cId.includes('soda') || cId.startsWith('source-') || cName.includes('template') || cTag.toLowerCase().includes('template') || cCat.toLowerCase().includes('template'))) return true;
        if (filterTag === 'Skill' && (cId.startsWith('skill') || cTag.toLowerCase().includes('skill') || cCat.toLowerCase().includes('skill'))) return true;
        if (filterTag === 'Prompt Video' && (cId.includes('video') || cId.includes('phonk') || cTag.toLowerCase().includes('video') || cCat.toLowerCase().includes('video'))) return true;
        return false;
      }

      const cards = Array.from(grid.querySelectorAll('.u292-t'));
      let visibleCount = 0;
      cards.forEach(function (card) {
        const matches = checkCardMatches(card, tag);
        if (matches) {
          visibleCount++;
          card.classList.remove('out');
          card.style.display = '';
          card.style.opacity = '';
          card.style.transform = '';
        } else {
          card.classList.add('out');
          card.style.display = 'none';
        }
      });

      if (countValEl) countValEl.textContent = String(visibleCount);
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? '' : 'none';
        emptyState.style.opacity = visibleCount === 0 ? '1' : '0';
      }
    },

    handleSearchSubmit: function (e) {
      if (e) e.preventDefault();
      const input = document.getElementById('heroSearchInput');
      const query = input ? input.value : '';
      if (window.ShopVietState) {
        window.ShopVietState.state.searchQuery = query;
        const appMount = document.getElementById('appMount');
        if (appMount) {
          appMount.innerHTML = this.render();
          const target = document.getElementById('productsSection');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },

    clearSearch: function () {
      if (window.ShopVietState) {
        window.ShopVietState.state.searchQuery = '';
        window.ShopVietState.state.activeFilter = 'Tất cả';
        currentPriceSort = 'featured';
        const appMount = document.getElementById('appMount');
        if (appMount) appMount.innerHTML = this.render();
      }
    },

    afterRender: function () {
      this.initRealtimeListener();
      if (typeof this.initDeviceViewMode === 'function') this.initDeviceViewMode();
      if (window._shopviet_pending_highlight) {
        window._shopviet_pending_highlight = false;
        this.highlightProductCards();
      }
    },

    renderProducts: function () {
      const currentView = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.currentView) || 'home';
      if (currentView === 'home') {
        const appMount = document.getElementById('appMount');
        if (appMount) {
          const currentScrollY = window.scrollY;
          appMount.innerHTML = this.render();
          window.scrollTo(0, currentScrollY);
        }
      } else if (window.ShopVietState && typeof window.ShopVietState.renderCurrentRoute === 'function') {
        window.ShopVietState.renderCurrentRoute(true);
      }
    },

    initRealtimeListener: function () {
      if (window._shopviet_home_realtime_bound) return;
      window._shopviet_home_realtime_bound = true;
      const self = this;
      window.addEventListener('shopviet_realtime_update', function () {
        self.triggerHeaderLivePulse();
        const currentView = (window.ShopVietState && window.ShopVietState.state && window.ShopVietState.state.currentView) || 'home';
        if (currentView === 'home') {
          self.renderProducts();
          setTimeout(function () { self.highlightProductCards(); }, 80);
        } else {
          window._shopviet_pending_highlight = true;
        }
      });
    },

    triggerHeaderLivePulse: function () {
      const syncIcon = document.getElementById('cloudSyncHeaderIcon');
      if (syncIcon) {
        syncIcon.classList.add('animate-spin');
        setTimeout(function () { syncIcon.classList.remove('animate-spin'); }, 1200);
      }
    },

    showRealtimeUpdateToast: function (message) {
      if (window.ShopVietState && typeof window.ShopVietState.showToast === 'function') {
        window.ShopVietState.showToast(message || 'Đã cập nhật dữ liệu mới nhất.', 'success');
      }
    },

    highlightProductCards: function () {
      const cards = document.querySelectorAll('[data-product-card="true"]');
      cards.forEach(function (card) { card.classList.add('ring-2', 'ring-[#0071E3]/60'); });
      setTimeout(function () {
        cards.forEach(function (card) { card.classList.remove('ring-2', 'ring-[#0071E3]/60'); });
      }, 1400);
    },

    triggerRealtimeUpdate: function (detail) {
      window.dispatchEvent(new CustomEvent('shopviet_realtime_update', { detail: detail || {} }));
    },

    detectDevice: detectDevice,
    getEffectiveViewMode: getEffectiveViewMode,

    initDeviceViewMode: function () {
      this.setViewMode(getEffectiveViewMode(), true);
    },

    setViewMode: function (mode) {
      var validModes = ['expanded', 'standard', 'compact'];
      if (!validModes.includes(mode)) mode = 'standard';
      if (typeof window !== 'undefined' && window.ShopVietState && window.ShopVietState.state) {
        window.ShopVietState.state.viewMode = mode;
      }
      var grid = document.getElementById('productListGrid');
      if (grid) {
        grid.classList.remove('grid-cols-2', 'lg:grid-cols-5', 'lg:grid-cols-2', 'md:grid-cols-2');
        if (mode === 'compact') {
          grid.classList.add('grid-cols-1', 'sm:grid-cols-2');
        } else {
          grid.classList.add('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
        }
      }
    },

    initU205RipplingTitle: function () {},
    handleBuyNowClick: handleBuyNowClick,
    openMobileExpander: openMobileExpander,
    openPromptPreview: openPromptPreview,
    closePromptPreview: closePromptPreview,
    copyPromptSnippet: copyPromptSnippet,
    toggleComboItem: toggleComboItem,
    renderComboStatus: renderComboStatus,
    checkoutCombo: checkoutCombo,
    closeMobileExpander: closeMobileExpander,
    renderSafeProductImage: renderSafeProductImage
  };

  if (typeof window !== 'undefined') {
    window.ShopVietViews.renderSafeProductImage = renderSafeProductImage;
    window.ShopVietViews.detectDevice = detectDevice;
    window.ShopVietViews.getEffectiveViewMode = getEffectiveViewMode;
    window.ShopVietViews.handleBuyNowClick = handleBuyNowClick;
    window.ShopVietViews.openMobileExpander = openMobileExpander;
    window.ShopVietViews.closeMobileExpander = closeMobileExpander;
    window.ShopVietViews.initU205RipplingTitle = window.ShopVietViews.home.initU205RipplingTitle;
  }
})();
