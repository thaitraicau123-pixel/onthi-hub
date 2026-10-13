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
        <div className="min-h-screen bg-[#240618] flex items-center justify-center p-4 text-white">
          <div className="max-w-md w-full p-6 sm:p-8 bg-[#2d0a20] rounded-3xl border border-[#f02c85]/30 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-[#f02c85] border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-white">
              Đã Xảy Ra Sự Cố Nhẹ
            </h2>

            <p className="text-xs text-rose-200/80 leading-relaxed font-medium">
              Hệ thống đã tự động cách ly lỗi để bảo toàn dữ liệu ví và tủ thẻ của bạn.
            </p>

            {this.state.error && (
              <div className="p-3 bg-black/40 rounded-xl text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-24">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                <Home className="w-4 h-4" />
                <span>Thử Lại</span>
              </button>

              <button
                onClick={this.handleReload}
                className="px-5 py-2 btn-wayground-sunset text-white rounded-xl text-xs font-black shadow-lg shadow-pink-900/30 transition-all flex items-center space-x-1.5"
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
