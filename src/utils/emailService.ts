import { supabase } from "@/integrations/supabase/client";

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  templateVariables?: Record<string, any>;
}

/**
 * Sends an email using the Mailgun service via Supabase Edge Function
 */
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('mailgun-email-sender', {
      body: {
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        from: options.from,
        templateVariables: options.templateVariables
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sends a verification email for new user signup
 */
export const sendVerificationEmail = async (email: string, verificationLink: string): Promise<{ success: boolean; error?: string }> => {
  return sendEmail({
    to: email,
    subject: "Verify your Trade Ease account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to Trade Ease!</h1>
        <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with Trade Ease, you can safely ignore this email.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Trade Ease. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

/**
 * Sends a welcome email after successful verification
 */
export const sendWelcomeEmail = async (email: string, name?: string): Promise<{ success: boolean; error?: string }> => {
  return sendEmail({
    to: email,
    subject: "Welcome to Trade Ease!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to Trade Ease!</h1>
        <p>Hello ${name || 'there'},</p>
        <p>Thank you for joining Trade Ease! Your account has been successfully verified and is now ready to use.</p>
        <p>With Trade Ease, you can:</p>
        <ul>
          <li>Simplify your business operations</li>
          <li>Track jobs and projects efficiently</li>
          <li>Manage customer relationships</li>
          <li>And much more!</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${window.location.origin}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Get Started Now</a>
        </div>
        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Trade Ease. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

/**
 * Sends a password reset email
 */
export const sendPasswordResetEmail = async (email: string, resetLink: string): Promise<{ success: boolean; error?: string }> => {
  return sendEmail({
    to: email,
    subject: "Reset your Trade Ease password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
        <p>We received a request to reset your password for your Trade Ease account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Trade Ease. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

/**
 * Sends a material order email to a supplier
 */
export const sendMaterialOrderEmail = async (
  supplierEmail: string, 
  userEmail: string,
  jobNumber: string,
  jobTitle: string,
  customerName: string,
  orderDetails: string
): Promise<{ success: boolean; error?: string }> => {
  // Send to supplier
  const supplierResult = await sendEmail({
    to: supplierEmail,
    subject: `Material Order - Job #${jobNumber} - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Material Order Request</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Job #:</strong> ${jobNumber}</p>
          <p><strong>Title:</strong> ${jobTitle}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
        </div>
        <div style="white-space: pre-wrap;">${orderDetails}</div>
      </div>
    `
  });
  
  if (!supplierResult.success) {
    return supplierResult;
  }
  
  // Send confirmation to user
  return sendEmail({
    to: userEmail,
    subject: `Material Order Confirmation - Job #${jobNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Material Order Sent</h2>
        <p>Your material order has been sent to the supplier.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Job #:</strong> ${jobNumber}</p>
          <p><strong>Title:</strong> ${jobTitle}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Supplier:</strong> ${supplierEmail}</p>
        </div>
        <p>Order details:</p>
        <div style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${orderDetails}</div>
      </div>
    `
  });
};
