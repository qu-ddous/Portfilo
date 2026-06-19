import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-[#E74C3C]" />
            </div>
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Something went wrong</h2>
            <p className="text-[#7F8C8D] mb-6">
              {this.state.error?.message || "An unexpected error occurred while rendering this component."}
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
