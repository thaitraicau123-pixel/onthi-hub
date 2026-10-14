import React from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fbfbfa] flex items-center justify-center p-4 text-[#37352f]">
          <div className="max-w-md w-full p-6 sm:p-8 bg-white rounded-xl border border-[#e9e9e8] shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-[#37352f]">
              Đã Xảy Ra Sự Cố Nhẹ
            </h2>

            <p className="text-xs text-[#787774] leading-relaxed">
              Hệ thống đã tự động cách ly lỗi để bảo toàn dữ liệu ví và tủ thẻ của bạn.
            </p>

            {this.state.error && (
              <div className="p-3 bg-[#f7f6f5] border border-[#e9e9e8] rounded-lg text-[11px] font-mono text-[#787774] text-left overflow-x-auto max-h-24">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-white hover:bg-black/5 text-[#787774] border border-[#e9e9e8] rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
              >
                <Home className="w-4 h-4" />
                <span>Thử Lại</span>
              </button>

              <button
                onClick={this.handleReload}
                className="px-5 py-2 bg-[#2383e2] hover:bg-[#1a73e8] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <RotateCw className="w-4 h-4" />
                <span>Tải Lại Trang</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
