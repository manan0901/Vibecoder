import nodemailer from 'nodemailer';

// Email configuration interface
interface EmailConfig {
  service: string;
  user: string;
  pass: string;
  from: string;
}

// Email template interface
interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

// Get email configuration from environment
const emailConfig: EmailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || 'VibeCoder Marketplace <noreply@vibecodeseller.com>',
};

// Create transporter
let transporter: nodemailer.Transporter | null = null;

function createTransporter(): nodemailer.Transporter {
  if (!emailConfig.user || !emailConfig.pass) {
    throw new Error('Email configuration is incomplete. Please set EMAIL_USER and EMAIL_PASS environment variables.');
  }

  return nodemailer.createTransport({
    service: emailConfig.service,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });
}

// Initialize transporter
export function initializeEmailService(): void {
  try {
    transporter = createTransporter();
    console.log('✅ Email service initialized successfully');
  } catch (error) {
    console.log('⚠️ Email service initialization failed:', error instanceof Error ? error.message : 'Unknown error');
    console.log('📧 Email functionality will be disabled');
  }
}

// Send email function
export async function sendEmail(
  to: string | string[],
  template: EmailTemplate,
  options?: {
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: any[];
  }
): Promise<boolean> {
  if (!transporter) {
    console.log('⚠️ Email service not initialized, skipping email send');
    return false;
  }

  try {
    const mailOptions = {
      from: emailConfig.from,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      cc: options?.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
      bcc: options?.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
      attachments: options?.attachments,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

// Email templates
export const emailTemplates = {
  // Welcome email template
  welcome: (firstName: string): EmailTemplate => ({
    subject: 'Welcome to VibeCoder Marketplace!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to VibeCoder!</h1>
        <p>Hi ${firstName},</p>
        <p>Welcome to VibeCoder Marketplace - the premier platform for Indian developers to buy and sell coding projects!</p>
        <p>Your account has been created successfully. You can now:</p>
        <ul>
          <li>Browse and purchase amazing coding projects</li>
          <li>Sell your own projects to the community</li>
          <li>Connect with fellow developers</li>
        </ul>
        <p>Get started by exploring our marketplace:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Explore Marketplace</a>
        </div>
        <p>Happy coding!</p>
        <p>The VibeCoder Team</p>
      </div>
    `,
    text: `Welcome to VibeCoder Marketplace! Hi ${firstName}, your account has been created successfully. Visit ${process.env.FRONTEND_URL} to get started.`,
  }),

  // Email verification template
  emailVerification: (firstName: string, verificationLink: string): EmailTemplate => ({
    subject: 'Verify Your Email - VibeCoder Marketplace',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Verify Your Email</h1>
        <p>Hi ${firstName},</p>
        <p>Please verify your email address to complete your VibeCoder account setup.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        </div>
        <p>If you didn't create this account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>The VibeCoder Team</p>
      </div>
    `,
    text: `Hi ${firstName}, please verify your email by clicking this link: ${verificationLink}`,
  }),

  // Password reset template
  passwordReset: (firstName: string, resetLink: string): EmailTemplate => ({
    subject: 'Reset Your Password - VibeCoder Marketplace',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
        <p>Hi ${firstName},</p>
        <p>You requested to reset your password for your VibeCoder account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>The VibeCoder Team</p>
      </div>
    `,
    text: `Hi ${firstName}, reset your password by clicking this link: ${resetLink}`,
  }),
};

// Send welcome email
export async function sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
  return await sendEmail(email, emailTemplates.welcome(firstName));
}

// Send email verification
export async function sendEmailVerification(email: string, firstName: string, verificationToken: string): Promise<boolean> {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  return await sendEmail(email, emailTemplates.emailVerification(firstName, verificationLink));
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<boolean> {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  return await sendEmail(email, emailTemplates.passwordReset(firstName, resetLink));
}

// Test email configuration
export async function testEmailConfiguration(): Promise<boolean> {
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return false;
  }
}
