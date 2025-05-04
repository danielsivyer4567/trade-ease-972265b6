import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch React errors
 * and display a friendly error message
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console or an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
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
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="w-full max-w-3xl mx-auto mt-8">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="text-sm text-gray-600">
              <p>We encountered an unexpected error while rendering this component.</p>
              <p className="mt-2">Don't worry! This doesn't affect your data and you can continue using other parts of the application.</p>
            </div>
            
            {this.state.error && (
              <div className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                <p className="font-semibold">Error: {this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600">View technical details</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-4 border-t bg-gray-50 p-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={this.resetErrorBoundary}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 