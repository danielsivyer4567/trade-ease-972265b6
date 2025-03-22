import React from 'react'
import { Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface VerificationStatusProps {
  email: string
  verificationSent: boolean
}

export default function VerificationStatus({
  email,
  verificationSent
}: VerificationStatusProps) {
  const { loading } = useAuth()

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
