/**
 * Email utility using nodemailer with SMTP
 * Replaces Resend API with standard SMTP configuration
 */

import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

// Email configuration interface
export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// Email send result interface
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Creates and configures SMTP transporter
 * Uses environment variables for SMTP configuration
 *
 * Default configuration for Forpsi SMTP:
 * - Host: smtp.forpsi.com
 * - Port: 587 (STARTTLS)
 * - Authentication required
 *
 * @see https://support.forpsi.com/kb/a3147/konfigurace-smtp-serveru.aspx
 */
function createTransport(): Transporter {
  const config = {
    host: process.env.SMTP_HOST ?? "smtp.forpsi.com",
    port: parseInt(process.env.SMTP_PORT ?? "587", 10),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false",
      minVersion: "TLSv1.2" as const,
    },
  };

  return nodemailer.createTransport(config);
}

/**
 * Sends an email using SMTP
 * @param options - Email options including from, to, subject, html, and optional replyTo
 * @returns Promise with email result containing success status and messageId or error
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const transporter = createTransport();

    const mailOptions = {
      from: options.from,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
