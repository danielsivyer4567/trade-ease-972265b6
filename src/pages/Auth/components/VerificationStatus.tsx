
import React from 'react'
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { NavigateFunction } from 'react-router-dom'

interface VerificationStatusProps {
  // Original props
  email?: string;
  verificationSent?: boolean;
  
  // New props for verification flow
  status?: 'idle' | 'verifying' | 'success' | 'error';
  message?: string;
  navigate?: NavigateFunction;
}

export default function VerificationStatus({
  email,
  verificationSent,
  status,
  message,
  navigate
}: VerificationStatusProps) {
  const { loading } = useAuth()

  // If this is used in the verification flow with status
  if (status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
          {status === 'verifying' && (
            <div className="flex flex-col items-center justify-center">
              <Loader className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verifying Your Email</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Email Verified!</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
              <p className="text-gray-600">{message}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => navigate && navigate('/auth')}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Original implementation for showing verification email sent status
  if (!verificationSent) return null

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-4 rounded">
      <div className="flex items-start">
        <Mail className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
        <div>
          <p className="font-medium text-green-800">Verification Email Sent</p>
          <p className="text-green-700 text-sm mt-1">
            We've sent a verification link to {email}.
            Please check your inbox and click the link to activate your account.
          </p>
          <p className="text-green-600 text-sm mt-2">
            {loading ? 'Sending...' : 'Didn\'t receive the email? Check your spam folder.'}
          </p>
        </div>
      </div>
    </div>
  )
}
