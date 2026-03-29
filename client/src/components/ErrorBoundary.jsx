import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const isDev = import.meta.env.DEV;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        // Optionally log the error to your backend
        console.error('[ErrorBoundary] Caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                            Beklenmeyen Bir Hata Oluştu
                        </h2>
                        <p className="text-slate-500 text-sm mb-6">
                            Bu sayfa yüklenirken bir sorun ile karşılaşıldı. 
                            Lütfen sayfayı yenileyin veya sorun devam ederse 
                            Bilgi İşlem birimiyle iletişime geçin.
                        </p>
                        {isDev && this.state.error && (
                            <details className="mb-4 text-left bg-red-50 border border-red-200 rounded-lg p-3">
                                <summary className="text-xs font-semibold text-red-700 cursor-pointer">
                                    Teknik Detay (Geliştirici)
                                </summary>
                                <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40 whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Tekrar Dene
                            </button>
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                            >
                                Ana Sayfaya Dön
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
