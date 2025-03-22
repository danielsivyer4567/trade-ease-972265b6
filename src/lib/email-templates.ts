interface EmailTemplateParams {
  fullName: string
  link: string
  email: string
}

interface ResendEmailTemplate {
  from: string
  to: string
  subject: string
  html: string
}

const FROM_EMAIL = 'TradeEase <no-reply@tradeease.app>'

export function getVerificationEmailTemplate({ fullName, link, email }: EmailTemplateParams): ResendEmailTemplate {
  return {
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your TradeEase account',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email - TradeEase</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 32px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            text-decoration: none;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            margin: 24px 0;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 32px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="https://tradeease.app" class="logo">TradeEase</a>
          </div>
          <h1>Welcome to TradeEase!</h1>
          <p>Hi ${fullName},</p>
          <p>Thank you for signing up for TradeEase. To complete your registration and start using our platform, please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${link}" class="button">Verify Email Address</a>
          </div>
          <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all;"><small>${link}</small></p>
          <p>This verification link will expire in 24 hours.</p>
          <p>If you didn't create an account with TradeEase, you can safely ignore this email.</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TradeEase. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
  }
}

export function getPasswordResetEmailTemplate({ fullName, link, email }: EmailTemplateParams): ResendEmailTemplate {
  return {
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your TradeEase password',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password - TradeEase</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 32px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            text-decoration: none;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            margin: 24px 0;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 32px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="https://tradeease.app" class="logo">TradeEase</a>
          </div>
          <h1>Password Reset Request</h1>
          <p>Hi ${fullName},</p>
          <p>We received a request to reset your password for your TradeEase account. Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${link}" class="button">Reset Password</a>
          </div>
          <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all;"><small>${link}</small></p>
          <p>This password reset link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TradeEase. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
  }
} 