import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in SALVÔ:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B4F8A] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white text-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="w-16 h-16 bg-amber-100 text-[#E8552B] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-black text-slate-900">
                SALVÔ
              </h2>
              <p className="text-xs text-slate-600">
                Detectamos um erro temporário na visualização dos dados. Você pode reiniciar o guia com os dados padrões com 1 clique.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-500 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3.5 bg-[#FFC72C] hover:bg-[#f3bd24] text-[#0B4F8A] font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Limpar Cache e Reiniciar Aplicativo</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
