import { Component, type ErrorInfo, type ReactNode } from 'react';
import { GraduationCap, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Route Error:', error, errorInfo);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && this.props.children !== prevProps.children) {
      this.setState({ hasError: false, error: null });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--color-bg, #ffffff)',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#f0f7f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: 'var(--color-primary, #1b4332)',
            }}
          >
            <GraduationCap size={44} strokeWidth={1.8} />
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              color: 'var(--color-primary-dark, #081c15)',
              marginBottom: '0.75rem',
            }}
          >
            Unable to Load Page
          </h1>

          <p
            style={{
              color: 'var(--color-text-light, #666)',
              fontSize: '1rem',
              maxWidth: 500,
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            We encountered a temporary issue while loading this page. Please refresh to reload the latest view.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: 8,
                border: 'none',
                background: 'var(--color-primary, #1b4332)',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} />
              <span>Refresh Page</span>
            </button>

            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.15)',
                background: '#ffffff',
                color: 'var(--color-primary-dark, #081c15)',
                textDecoration: 'none',
              }}
            >
              <Home size={16} />
              <span>Back to Home</span>
            </a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
