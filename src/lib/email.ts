import { Resend } from 'resend'

const resend = new Resend(process.env.VITE_RESEND_API_KEY)

interface SendEmailParams {
  from?: string
  to: string
  subject: string
  html: string
}

export async function sendEmail({ from, to, subject, html }: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from: from || 'TradeEase <no-reply@tradeease.app>',
      to,
      subject,
      html
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
} 