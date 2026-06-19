import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL UI CRASH:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border-t-8 border-rose-600">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10 text-rose-600 animate-pulse" />
            </div>
            
            <h1 className="text-2xl font-black text-[#0F172A] mb-4 uppercase tracking-tight">System Interruption</h1>
            <p className="text-slate-500 font-bold text-sm mb-10 leading-relaxed">
              We encountered a UI rendering exception. This usually happens due to corrupted browser cache or a temporary session conflict.
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/20 flex items-center justify-center gap-2 hover:bg-rose-700 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Hard Refresh System
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all"
              >
                <Home className="w-4 h-4" /> Return to Command Hub
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Diagnostic Code</p>
               <pre className="text-[9px] text-slate-400 mt-2 bg-slate-50 p-4 rounded-xl overflow-x-auto text-left">
                  {this.state.error?.message || 'Unknown Exception'}
               </pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
