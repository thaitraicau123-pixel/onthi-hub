/**
 * lib/downloads.js
 * Pure entitlement, allow-list, and path-sanitization helpers for protected downloads.
 */

import path from 'node:path';

export const DOWNLOAD_CATALOG = {
  'Metropolis_1998_Source_Starter.zip': {
    relPath: 'downloads/Metropolis_1998_Source_Starter.zip',
    productIds: ['source-metropolis-1998-city-builder'],
    contentType: 'application/zip'
  },
  'diet-soda-3d-landing.html': {
    relPath: 'downloads/diet-soda-3d-landing.html',
    productIds: ['template-diet-soda-3d-landing', 'template-combo-6-luxury-web-vault'],
    contentType: 'text/html; charset=utf-8'
  },
  'flowstate-1file-template.html': {
    relPath: 'downloads/flowstate-1file-template.html',
    productIds: ['template-flowstate-fluid-webgl', 'template-combo-6-luxury-web-vault'],
    contentType: 'text/html; charset=utf-8'
  },
  'lumora-1file-template.html': {
    relPath: 'downloads/lumora-1file-template.html',
    productIds: ['template-lumora-studio-liquid', 'template-combo-6-luxury-web-vault'],
    contentType: 'text/html; charset=utf-8'
  },
  'template-laocoon-bronze-time.html': {
    relPath: 'downloads/template-laocoon-bronze-time.html',
    productIds: ['template-laocoon-bronze-time-3d', 'template-combo-6-luxury-web-vault'],
    contentType: 'text/html; charset=utf-8'
  },
  'marcus-vane-1file-template.html': {
    relPath: 'downloads/marcus-vane-1file-template.html',
    productIds: ['template-marcus-vane-cinematic-portfolio', 'template-combo-6-luxury-web-vault'],
    contentType: 'text/html; charset=utf-8'
  },
  'OpenDesign_Starter_Free_Kit.zip': {
    relPath: 'downloads/OpenDesign_Starter_Free_Kit.zip',
    productIds: ['free-starter-opendesign-kit'],
    contentType: 'application/zip'
  },
  'Dungeon_Co_Ve_Thach_2D_Starter.zip': {
    relPath: 'downloads/Dungeon_Co_Ve_Thach_2D_Starter.zip',
    productIds: ['source-dungeon-co-ve-thach-2d', 'prompt-soul-knight-heroes-monsters-200'],
    contentType: 'application/zip'
  },
  'SePay_VietQR_Wallet_Starter.zip': {
    relPath: 'downloads/SePay_VietQR_Wallet_Starter.zip',
    productIds: ['source-sepay-wallet-saas-starter'],
    contentType: 'application/zip'
  },
  'Gemini_Glass_Workspace_Kit.zip': {
    relPath: 'downloads/Gemini_Glass_Workspace_Kit.zip',
    productIds: ['source-gemini-ai-workspace-kit'],
    contentType: 'application/zip'
  },
  'BuiThai_AI_AllInOne_ZeroSetup_Vault.zip': {
    relPath: 'downloads/BuiThai_AI_AllInOne_ZeroSetup_Vault.zip',
    productIds: ['skill-combo-allinone'],
    contentType: 'application/zip'
  },
  'BuiThai_AI_Sovereign_Studio_ZeroSetup.html': {
    relPath: 'downloads/BuiThai_AI_Sovereign_Studio_ZeroSetup.html',
    productIds: ['skill-combo-allinone'],
    contentType: 'text/html; charset=utf-8'
  },
  'TRON_BO_560_MASTER_PROMPTS_BUI_THAI_STUDIO.md': {
    relPath: 'downloads/TRON_BO_560_MASTER_PROMPTS_BUI_THAI_STUDIO.md',
    productIds: ['skill-combo-allinone'],
    contentType: 'text/markdown; charset=utf-8'
  },
  'OpenJarvis_AutoInstall_1Click_Vault.zip': {
    relPath: 'downloads/OpenJarvis_AutoInstall_1Click_Vault.zip',
    productIds: ['skill-openjarvis-local-ai', 'skill-combo-allinone'],
    contentType: 'application/zip'
  },
  'Cam_Nang_200_Prompt_Vu_Khi_Pixel_Soul_Knight.docx': {
    relPath: 'downloads/Cam_Nang_200_Prompt_Vu_Khi_Pixel_Soul_Knight.docx',
    productIds: ['prompt-soul-knight-200-weapons', 'skill-combo-allinone'],
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  'CAM_NANG_200_PROMPT_VU_KHI_SOUL_KNIGHT.md': {
    relPath: 'downloads/CAM_NANG_200_PROMPT_VU_KHI_SOUL_KNIGHT.md',
    productIds: ['prompt-soul-knight-200-weapons', 'skill-combo-allinone'],
    contentType: 'text/markdown; charset=utf-8'
  },
  'Cam_Nang_Sprite_Sheet_Soul_Knight_4_Anh_Hung_200_Quai_Vat.docx': {
    relPath: 'downloads/Cam_Nang_Sprite_Sheet_Soul_Knight_4_Anh_Hung_200_Quai_Vat.docx',
    productIds: ['prompt-soul-knight-heroes-monsters-200', 'skill-combo-allinone'],
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  'CAM_NANG_SPRITE_SHEET_SOUL_KNIGHT_4_HEROES_200_MONSTERS.md': {
    relPath: 'downloads/CAM_NANG_SPRITE_SHEET_SOUL_KNIGHT_4_HEROES_200_MONSTERS.md',
    productIds: ['prompt-soul-knight-heroes-monsters-200', 'skill-combo-allinone'],
    contentType: 'text/markdown; charset=utf-8'
  },
  'Bo_Prompt_Tao_Nhan_Vat_Chibi_Pixel_Art_Soul_Knight.md': {
    relPath: 'downloads/Bo_Prompt_Tao_Nhan_Vat_Chibi_Pixel_Art_Soul_Knight.md',
    productIds: ['prompt-soul-knight-chibi-characters', 'skill-combo-allinone'],
    contentType: 'text/markdown; charset=utf-8'
  },
  'Cam_Nang_Prompt_Pixel_Art_TopDown_V2.docx': {
    relPath: 'downloads/Cam_Nang_Prompt_Pixel_Art_TopDown_V2.docx',
    productIds: ['prompt-pixel-art-topdown-v2', 'skill-combo-allinone'],
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  'Cam_Nang_Prompt_Pixel_Art_TopDown_Stardew_V2.docx': {
    relPath: 'downloads/Cam_Nang_Prompt_Pixel_Art_TopDown_Stardew_V2.docx',
    productIds: ['prompt-pixel-art-topdown-v2', 'skill-combo-allinone'],
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  'TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.docx': {
    relPath: 'downloads/TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.docx',
    productIds: ['skill-pixel-vfx-engine', 'skill-combo-allinone'],
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  'TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.doc': {
    relPath: 'downloads/TRON_BO_246_MASTER_PROMPTS_GAME_PIXEL_VFX_SOUND_FX.doc',
    productIds: ['skill-pixel-vfx-engine', 'skill-combo-allinone'],
    contentType: 'application/msword'
  },
  'README_HUONG_DAN_SU_DUNG.txt': {
    relPath: 'downloads/README_HUONG_DAN_SU_DUNG.txt',
    productIds: ['skill-combo-allinone', 'skill-openjarvis-local-ai', 'source-metropolis-1998-city-builder'],
    contentType: 'text/plain; charset=utf-8'
  },
  'MASTER_PROMPTS.md': {
    relPath: 'MASTER_PROMPTS.md',
    productIds: ['skill-combo-allinone'],
    contentType: 'text/markdown; charset=utf-8'
  }
};

/**
 * Normalizes and validates a requested download filename against the explicit allowlist.
 * Rejects path traversal attempts (../, ..\, null bytes, URLs, unknown files).
 */
export function sanitizeDownloadFileName(rawFile) {
  const input = String(rawFile || '').trim();
  if (!input || input.includes('\0') || input.includes('..') || input.includes('\\')) {
    return null;
  }
  const stripped = input.replace(/^\/?(downloads\/)?/i, '');
  if (!stripped || stripped.includes('/')) {
    return null;
  }
  if (!Object.prototype.hasOwnProperty.call(DOWNLOAD_CATALOG, stripped)) {
    return null;
  }
  return stripped;
}

export function resolveDownloadAsset(rootDir, rawFile) {
  const fileName = sanitizeDownloadFileName(rawFile);
  if (!fileName) return null;
  const meta = DOWNLOAD_CATALOG[fileName];
  const resolvedRoot = path.resolve(String(rootDir || '.'));
  const absPath = path.resolve(resolvedRoot, meta.relPath);
  if (!absPath.startsWith(resolvedRoot + path.sep)) {
    return null;
  }
  return {
    fileName,
    relPath: meta.relPath,
    absPath,
    productIds: meta.productIds.slice(),
    contentType: meta.contentType
  };
}

export function isAdminEmail(email, envAdminEmails = '') {
  const clean = String(email || '').trim().toLowerCase();
  if (!clean) return false;
  if (clean === 'thaitraicau123@gmail.com') return true;
  const list = String(envAdminEmails || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(clean);
}

/**
 * Checks whether an authenticated email is entitled to download a specific catalog file.
 */
export function verifyDownloadEntitlement({
  email,
  isAdmin = false,
  fileName,
  productId = '',
  orders = [],
  purchasedIds = []
}) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const safeFile = sanitizeDownloadFileName(fileName);
  if (!safeFile) {
    return { allowed: false, status: 404, reason: 'file_not_found' };
  }
  if (!cleanEmail) {
    return { allowed: false, status: 401, reason: 'auth_required' };
  }
  if (isAdmin) {
    return { allowed: true, status: 200, reason: 'admin_override', matchedOrderId: 'ADMIN' };
  }

  const entry = DOWNLOAD_CATALOG[safeFile];
  const allowedProductIds = new Set(entry.productIds || []);
  const requestedProd = String(productId || '').trim();
  if (requestedProd && allowedProductIds.has(requestedProd)) {
    allowedProductIds.add(requestedProd);
  }

  if (Array.isArray(purchasedIds)) {
    for (const pid of purchasedIds) {
      if (allowedProductIds.has(String(pid || '').trim())) {
        return { allowed: true, status: 200, reason: 'purchased_id', matchedOrderId: pid };
      }
    }
  }

  if (Array.isArray(orders)) {
    for (const order of orders) {
      if (!order || typeof order !== 'object') continue;
      const oEmail = String(order.userEmail || (order.customer && order.customer.email) || '').trim().toLowerCase();
      if (oEmail && oEmail !== cleanEmail) continue;
      const status = String(order.status || '').toLowerCase();
      const isCompleted = status === 'completed' || Boolean(order.unlockedAt);
      if (!isCompleted) continue;

      const directId = String(order.productId || '').trim();
      if (directId && allowedProductIds.has(directId)) {
        return { allowed: true, status: 200, reason: 'completed_order', matchedOrderId: order.id || order.orderCode || directId };
      }
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          const itemId = String((item && (item.id || item.productId)) || '').trim();
          if (itemId && allowedProductIds.has(itemId)) {
            return { allowed: true, status: 200, reason: 'completed_order_item', matchedOrderId: order.id || order.orderCode || itemId };
          }
        }
      }
    }
  }

  return { allowed: false, status: 403, reason: 'entitlement_required' };
}
