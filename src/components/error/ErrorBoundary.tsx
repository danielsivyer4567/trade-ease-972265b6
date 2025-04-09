
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error information
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI
      return this.props.fallback || (
        <Card className="mx-auto my-8 max-w-2xl bg-red-50 border-red-200">
          <CardHeader className="bg-red-100 border-b border-red-200">
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <p className="text-red-700 font-medium mb-2">Error:</p>
              <pre className="bg-white p-4 rounded border border-red-200 text-sm overflow-auto max-h-40">
                {this.state.error?.toString()}
              </pre>
            </div>
            
            {this.state.errorInfo && (
              <div className="mb-4">
                <p className="text-red-700 font-medium mb-2">Component Stack:</p>
                <pre className="bg-white p-4 rounded border border-red-200 text-sm overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            
            <Button 
              onClick={this.resetErrorBoundary}
              variant="destructive"
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
