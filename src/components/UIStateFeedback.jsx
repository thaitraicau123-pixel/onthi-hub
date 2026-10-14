import React from 'react';
import { AlertCircle, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';

/**
 * High-fidelity Skeleton loader for cards grid
 * Matches CourseCard and Marketplace card geometry for Zero CLS
 */
export function CardGridSkeleton({ count = 6, cols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <div className={`grid ${cols} gap-5 animate-pulse`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4"
        >
          {/* Top badges */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 bg-[#eadfcb]/60 rounded-lg"></div>
            <div className="h-5 w-16 bg-[#eadfcb]/60 rounded-full"></div>
          </div>

          {/* Title lines */}
          <div className="space-y-2">
            <div className="h-5 w-5/6 bg-[#eadfcb]/80 rounded-md"></div>
            <div className="h-4 w-4/6 bg-[#eadfcb]/50 rounded-md"></div>
          </div>

          {/* Social / stats */}
          <div className="flex items-center space-x-3 pt-2">
            <div className="h-4 w-14 bg-[#eadfcb]/60 rounded-md"></div>
            <div className="h-4 w-20 bg-[#eadfcb]/40 rounded-md"></div>
          </div>

          {/* Highlights */}
          <div className="space-y-2 border-t border-[#eadfcb]/40 pt-3">
            <div className="h-3 w-full bg-[#eadfcb]/40 rounded-md"></div>
            <div className="h-3 w-4/5 bg-[#eadfcb]/40 rounded-md"></div>
          </div>

          {/* Footer action buttons */}
          <div className="pt-4 border-t border-[#eadfcb] flex items-center justify-between">
            <div className="h-6 w-16 bg-[#eadfcb]/70 rounded-md"></div>
            <div className="h-9 w-28 bg-[#eadfcb]/80 rounded-xl"></div>
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
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#fcf7ec] rounded-3xl p-5 sm:p-6 border border-[#eadfcb] shadow-sm space-y-4"
        >
          {/* Author row */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#eadfcb]/80"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-32 bg-[#eadfcb]/80 rounded-md"></div>
              <div className="h-3 w-20 bg-[#eadfcb]/50 rounded-md"></div>
            </div>
          </div>

          {/* Content lines */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-[#eadfcb]/60 rounded-md"></div>
            <div className="h-4 w-5/6 bg-[#eadfcb]/60 rounded-md"></div>
            <div className="h-4 w-2/3 bg-[#eadfcb]/40 rounded-md"></div>
          </div>

          {/* Interaction bar */}
          <div className="pt-3 border-t border-[#eadfcb]/50 flex items-center space-x-4">
            <div className="h-4 w-16 bg-[#eadfcb]/50 rounded-md"></div>
            <div className="h-4 w-20 bg-[#eadfcb]/50 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Standardized Actionable Empty State
 * Guarantees every empty screen provides a clear recovery or exploratory path
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
    <div className="text-center py-14 sm:py-16 bg-[#fcf7ec] rounded-3xl border border-[#eadfcb] p-6 sm:p-8 text-[#28071a] shadow-sm space-y-4 animate-fade-in">
      {/* Icon badge */}
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-amber-100 border border-pink-200 text-[#f02c85] flex items-center justify-center mx-auto shadow-xs">
          <Icon className="w-8 h-8 opacity-90" />
        </div>
      )}

      {badge && (
        <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-pink-100 text-[#f02c85] border border-pink-200">
          {badge}
        </span>
      )}

      {/* Title & Desc */}
      <div className="max-w-md mx-auto space-y-1.5">
        <h4 className="text-base sm:text-lg font-black text-[#28071a] leading-snug">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-[#7a5a6b] font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#eadfcb] hover:bg-[#f6ebd5] text-xs font-black text-[#28071a] transition-all shadow-xs flex items-center space-x-1.5"
            >
              {secondaryAction.icon && <secondaryAction.icon className="w-3.5 h-3.5" />}
              <span>{secondaryAction.label}</span>
            </button>
          )}

          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="px-5 py-2.5 rounded-xl btn-wayground-sunset text-xs font-black text-white transition-all shadow-md flex items-center space-x-1.5 transform hover:scale-105 active:scale-95"
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
 * Standardized Error State Card with Retry
 */
export function ErrorStateCard({
  title = 'Có lỗi xảy ra khi tải dữ liệu',
  message = 'Không thể đồng bộ thông tin từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.',
  onRetry
}) {
  return (
    <div className="text-center py-12 bg-rose-50/80 rounded-3xl border border-rose-200 p-6 sm:p-8 text-rose-950 shadow-sm space-y-3.5 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs border border-rose-200">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="max-w-md mx-auto space-y-1">
        <h4 className="text-sm sm:text-base font-black text-rose-950">
          {title}
        </h4>
        <p className="text-xs text-rose-800/80 font-medium">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md inline-flex items-center space-x-1.5 transition-transform transform hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại ngay</span>
          </button>
        </div>
      )}
    </div>
  );
}
