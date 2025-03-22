import { Mail, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface VerificationStatusProps {
  email?: string
  verificationSent?: boolean
  status?: 'verifying' | 'success' | 'error'
  message?: string
  onResend?: () => Promise<void>
}

export default function VerificationStatus({
  email,
  verificationSent,
  status = 'verifying',
  message,
  onResend
}: VerificationStatusProps) {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate('/dashboard')
  }

  if (verificationSent) {
    return (
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription className="text-base">
            We've sent a verification link to{' '}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Please check your email and click the verification link to continue.</p>
            <p className="mt-2">Didn't receive the email? Check your spam folder.</p>
          </div>
          {onResend && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onResend}
            >
              Resend verification email
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (status === 'verifying') {
    return (
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
          <CardTitle>Verifying Email</CardTitle>
          <CardDescription className="text-base">
            Please wait while we verify your email address...
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (status === 'success') {
    return (
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <CardTitle>Email Verified</CardTitle>
          <CardDescription className="text-base">
            {message || 'Your email has been verified successfully!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleContinue}>
            Continue to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
          <CardTitle>Verification Failed</CardTitle>
          <CardDescription className="text-base">
            {message || 'There was an error verifying your email. Please try again.'}
          </CardDescription>
        </CardHeader>
        {onResend && (
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={onResend}
            >
              Resend verification email
            </Button>
          </CardContent>
        )}
      </Card>
    )
  }

  return null
}
