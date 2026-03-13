import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { name: string; children: ReactNode; }
interface State { hasError: boolean; }

export class ModuleErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Module [${this.props.name}] failed to render:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '15px', border: '1px solid #ffcccb', backgroundColor: '#fff5f5', color: '#d32f2f', borderRadius: '4px' }}>
          <strong>Service Offline:</strong> {this.props.name} is currently unavailable.
        </div>
      );
    }
    return this.props.children;
  }
}