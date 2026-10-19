import React from 'react';
import { AlertCircle, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';

/**
 * High-fidelity Skeleton loader for Notion cards grid
 * Matches CourseCard and Marketplace card geometry for Zero CLS
 */
export function CardGridSkeleton({ count = 6, cols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <div className={`grid ${cols} gap-4 animate-pulse`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#fbfbfa] dark:bg-slate-900/90 rounded-2xl border border-[#e9e9e8] dark:border-white/15 p-4 shadow-2xs flex flex-col justify-between space-y-3"
        >
          {/* Top badges */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
            <div className="h-4 w-14 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
          </div>

          {/* Title lines */}
          <div className="space-y-1.5">
            <div className="h-4 w-5/6 bg-[#e3e2e0] dark:bg-slate-700 rounded-md"></div>
            <div className="h-3 w-4/6 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
          </div>

          {/* Social / stats */}
          <div className="flex items-center space-x-2 pt-1">
            <div className="h-3 w-12 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
            <div className="h-3 w-16 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
          </div>

          {/* Highlights */}
          <div className="space-y-1.5 border-t border-[#f0efed] dark:border-white/10 pt-2">
            <div className="h-2.5 w-full bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
            <div className="h-2.5 w-4/5 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
          </div>

          {/* Footer action buttons */}
          <div className="pt-3 border-t border-[#f0efed] dark:border-white/10 flex items-center justify-between">
            <div className="h-5 w-14 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
            <div className="h-7 w-20 bg-[#e3e2e0] dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * High-fidelity Skeleton loader for Community Posts
 */
export function PostSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-[#e9e9e8] dark:border-white/15 shadow-2xs space-y-3"
        >
          {/* Author row */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#efefed] dark:bg-slate-800"></div>
            <div className="space-y-1 flex-1">
              <div className="h-3.5 w-28 bg-[#e3e2e0] dark:bg-slate-700 rounded-md"></div>
              <div className="h-2.5 w-16 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
            </div>
          </div>

          {/* Content lines */}
          <div className="space-y-1.5">
            <div className="h-3.5 w-full bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
            <div className="h-3.5 w-5/6 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
            <div className="h-3.5 w-2/3 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
          </div>

          {/* Interaction bar */}
          <div className="pt-2 border-t border-[#f0efed] dark:border-white/10 flex items-center space-x-3">
            <div className="h-3 w-14 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
            <div className="h-3 w-16 bg-[#efefed] dark:bg-slate-800 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Standardized Actionable Empty State (Notion Style)
 */
export function ActionableEmptyState({
  icon: Icon,
  badge = 'KHÔNG CÓ DỮ LIỆU',
  title,
  description,
  primaryAction,
  secondaryAction
}) {
  return (
    <div className="text-center py-12 bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-[#e9e9e8] dark:border-white/15 p-6 sm:p-8 text-[#37352f] dark:text-white shadow-2xs space-y-3 animate-fade-in">
      {/* Icon badge */}
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-[#f7f6f5] dark:bg-slate-800 border border-[#e9e9e8] dark:border-white/10 text-[#787774] dark:text-slate-300 flex items-center justify-center mx-auto">
          <Icon className="w-6 h-6" />
        </div>
      )}

      {badge && (
        <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[#787774] dark:text-slate-300 font-bold text-[10px] border border-slate-200 dark:border-white/10">
          {badge}
        </span>
      )}

      {/* Title & Desc */}
      <div className="max-w-md mx-auto space-y-1">
        <h4 className="text-sm sm:text-base font-bold text-[#37352f] dark:text-white">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-[#787774] dark:text-slate-300 font-normal leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="px-3.5 py-1.5 rounded-lg bg-[#f7f6f5] dark:bg-slate-800 hover:bg-[#f0efed] dark:hover:bg-slate-700 border border-[#e9e9e8] dark:border-white/15 text-xs font-medium text-[#37352f] dark:text-white transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              {secondaryAction.icon && <secondaryAction.icon className="w-3.5 h-3.5 text-[#787774] dark:text-slate-300" />}
              <span>{secondaryAction.label}</span>
            </button>
          )}

          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="px-4 py-1.5 rounded-lg bg-[#2383e2] hover:bg-[#1a73e8] text-xs font-medium text-white transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
            >
              {primaryAction.icon && <primaryAction.icon className="w-3.5 h-3.5" />}
              <span>{primaryAction.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Standardized Error State Card with Retry (Notion Style)
 */
export function ErrorStateCard({
  title = 'Có lỗi xảy ra khi tải dữ liệu',
  message = 'Không thể đồng bộ thông tin từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.',
  onRetry
}) {
  return (
    <div className="text-center py-8 bg-[#fdebec] dark:bg-rose-950/60 rounded-2xl border border-[#f9c9cb] dark:border-rose-800/50 p-6 text-[#d44c47] dark:text-rose-300 space-y-2.5 animate-fade-in">
      <div className="w-10 h-10 rounded-lg bg-[#fadad7] dark:bg-rose-900/60 text-[#d44c47] dark:text-rose-300 flex items-center justify-center mx-auto">
        <AlertCircle className="w-5 h-5" />
      </div>

      <div className="max-w-md mx-auto space-y-0.5">
        <h4 className="text-xs sm:text-sm font-bold text-[#d44c47] dark:text-rose-200">
          {title}
        </h4>
        <p className="text-xs text-[#a3322e] dark:text-rose-300/90">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onRetry}
            className="px-3.5 py-1.5 rounded-lg bg-[#d44c47] hover:bg-[#b83833] text-white text-xs font-medium shadow-2xs inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại ngay</span>
          </button>
        </div>
      )}
    </div>
  );
}
