import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SWMSDebugTest() {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});

  const runTest = (testName: string, testFn: () => boolean) => {
    try {
      const result = testFn();
      setTestResults(prev => ({ ...prev, [testName]: result }));
      return result;
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      setTestResults(prev => ({ ...prev, [testName]: false }));
      return false;
    }
  };

  const runAllTests = () => {
    // Test localStorage
    runTest('localStorage', () => {
      try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        return value === 'value';
      } catch {
        return false;
      }
    });

    // Test navigation
    runTest('navigation', () => {
      return typeof navigate === 'function';
    });

    // Test framer-motion
    runTest('framer-motion', () => {
      try {
        const { motion } = require('framer-motion');
        return typeof motion !== 'undefined';
      } catch {
        return false;
      }
    });

    // Test IntersectionObserver
    runTest('IntersectionObserver', () => {
      return typeof IntersectionObserver !== 'undefined';
    });

    // Test FileReader
    runTest('FileReader', () => {
      return typeof FileReader !== 'undefined';
    });
  };

  const TestItem = ({ name, result }: { name: string; result?: boolean }) => (
    <div className="flex items-center justify-between p-2 border rounded">
      <span>{name}</span>
      {result === undefined ? (
        <span className="text-gray-500">Not tested</span>
      ) : result ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-red-500" />
      )}
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/credentials')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Credentials
          </Button>
          <h1 className="text-2xl font-bold">SWMS Generator Debug Test</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Compatibility Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runAllTests} className="w-full">
              Run All Tests
            </Button>
            
            <div className="space-y-2">
              <TestItem name="localStorage Support" result={testResults.localStorage} />
              <TestItem name="React Navigation" result={testResults.navigation} />
              <TestItem name="Framer Motion" result={testResults['framer-motion']} />
              <TestItem name="IntersectionObserver" result={testResults.IntersectionObserver} />
              <TestItem name="FileReader API" result={testResults.FileReader} />
            </div>

            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Quick Navigation Tests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/calculators/ai-swms-creator')}
                >
                  Go to SWMS Landing Page
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/calculators/ai-swms')}
                >
                  Go to SWMS Generator
                </Button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">Debug Information</h3>
              <div className="text-sm space-y-1">
                <div>User Agent: {navigator.userAgent}</div>
                <div>Current URL: {window.location.href}</div>
                <div>React Version: {React.version}</div>
                <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}