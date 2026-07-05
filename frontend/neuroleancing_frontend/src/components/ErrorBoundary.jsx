import React from 'react';

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('Neurolance Error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="min-h-screen flex items-center justify-center px-4"
                    style={{ background: 'var(--bg-base)' }}
                >
                    <div className="card max-w-md w-full text-center p-10">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-loud)' }}>
                            Something went wrong
                        </h2>
                        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                            {this.state.error?.message || 'An unexpected error occurred.'}
                        </p>
                        <button
                            className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
