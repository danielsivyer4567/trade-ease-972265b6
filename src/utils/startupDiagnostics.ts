// Startup diagnostics to identify and resolve common app loading issues
import React from 'react';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  suggestion?: string;
}

export class StartupDiagnostics {
  private static results: DiagnosticResult[] = [];

  static async runDiagnostics(): Promise<DiagnosticResult[]> {
    this.results = [];
    
    console.log('🔍 Running startup diagnostics...');

    // Check environment variables
    this.checkEnvironmentVariables();
    
    // Check DOM availability
    this.checkDOM();
    
    // Check React availability
    this.checkReact();
    
    // Check router
    this.checkRouter();
    
    // Check network connectivity
    await this.checkNetworkConnectivity();
    
    // Check local storage
    this.checkLocalStorage();
    
    // Check browser compatibility
    this.checkBrowserCompatibility();

    // Log results
    console.log('📊 Startup diagnostics complete:', this.results);
    
    return this.results;
  }

  private static checkEnvironmentVariables() {
    try {
      const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (hasSupabaseUrl && hasSupabaseKey) {
        this.addResult('Environment Variables', 'pass', 'All required environment variables are configured');
      } else {
        this.addResult('Environment Variables', 'fail', 'Missing required environment variables', 
          'Check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
      }
    } catch (error) {
      this.addResult('Environment Variables', 'fail', 'Error checking environment variables');
    }
  }

  private static checkDOM() {
    try {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        this.addResult('DOM', 'pass', 'Root element found');
      } else {
        this.addResult('DOM', 'fail', 'Root element not found', 
          'Ensure your index.html has a div with id="root"');
      }
    } catch (error) {
      this.addResult('DOM', 'fail', 'Error checking DOM');
    }
  }

  private static checkReact() {
    try {
      if (React) {
        this.addResult('React', 'pass', 'React is available');
      } else {
        this.addResult('React', 'warning', 'React not available');
      }
    } catch (error) {
      this.addResult('React', 'warning', 'Unable to check React availability');
    }
  }

  private static checkRouter() {
    try {
      const currentPath = window.location.pathname;
      this.addResult('Router', 'pass', `Current path: ${currentPath}`);
    } catch (error) {
      this.addResult('Router', 'fail', 'Error checking router');
    }
  }

  private static async checkNetworkConnectivity() {
    try {
      if (navigator.onLine) {
        try {
          // Try to make a simple request to check if we can reach external services
          const response = await fetch('/favicon.ico', { method: 'HEAD' });
          this.addResult('Network', 'pass', 'Network connectivity confirmed');
        } catch (fetchError) {
          this.addResult('Network', 'warning', 'Network available but local resources may not be accessible');
        }
      } else {
        this.addResult('Network', 'warning', 'Offline mode detected', 
          'Some features may not work without internet connectivity');
      }
    } catch (error) {
      this.addResult('Network', 'warning', 'Unable to check network status');
    }
  }

  private static checkLocalStorage() {
    try {
      const testKey = '__startup_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      this.addResult('Local Storage', 'pass', 'Local storage is available');
    } catch (error) {
      this.addResult('Local Storage', 'warning', 'Local storage not available', 
        'Some features like dark mode preferences may not persist');
    }
  }

  private static checkBrowserCompatibility() {
    try {
      const features: Record<string, boolean> = {
        'Fetch API': typeof fetch !== 'undefined',
        'Promises': typeof Promise !== 'undefined',
        'Local Storage': typeof localStorage !== 'undefined'
      };

      // Safely check CSS features
      try {
        if (typeof CSS !== 'undefined' && CSS.supports) {
          features['CSS Grid'] = CSS.supports('display', 'grid');
          features['Custom Properties'] = CSS.supports('--css', 'variables');
        }
      } catch (cssError) {
        // CSS.supports not available, skip these checks
      }

      const unsupported = Object.entries(features)
        .filter(([, supported]) => !supported)
        .map(([feature]) => feature);

      if (unsupported.length === 0) {
        this.addResult('Browser Compatibility', 'pass', 'All required features supported');
      } else {
        this.addResult('Browser Compatibility', 'warning', 
          `Some features not supported: ${unsupported.join(', ')}`,
          'Consider updating your browser for the best experience');
      }
    } catch (error) {
      this.addResult('Browser Compatibility', 'warning', 'Unable to check browser compatibility');
    }
  }

  private static addResult(name: string, status: 'pass' | 'fail' | 'warning', message: string, suggestion?: string) {
    this.results.push({ name, status, message, suggestion });
    
    const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    console.log(`${icon} ${name}: ${message}`);
    if (suggestion) {
      console.log(`   💡 Suggestion: ${suggestion}`);
    }
  }

  static getFailureCount(): number {
    return this.results.filter(r => r.status === 'fail').length;
  }

  static getWarningCount(): number {
    return this.results.filter(r => r.status === 'warning').length;
  }

  static getSummary(): string {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.getFailureCount();
    const warnings = this.getWarningCount();

    return `Diagnostics: ${passed}/${total} passed, ${failed} failed, ${warnings} warnings`;
  }
}

// Auto-run diagnostics in development mode
if (import.meta.env.DEV) {
  StartupDiagnostics.runDiagnostics().then(() => {
    console.log('🎯', StartupDiagnostics.getSummary());
  });
} 