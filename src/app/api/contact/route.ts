import { createHash, randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import { sendEmail } from "@/app/lib/email";
import {
  generateAdminContactNotificationHTML,
  generateAdminContactNotificationText,
  generateCustomerConfirmationHTML,
  generateCustomerConfirmationText,
  type ContactEmailData,
} from "@/app/lib/email-templates";
import { sanitizeString, sanitizeStringArray } from "@/app/lib/input-sanitization";
import { supabase } from "@/app/lib/supabase";

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  projectType: z.string().min(1),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  message: z.string().min(10),
  requirements: z.array(z.string()).optional(),
  newsletter: z.boolean().optional(),
  privacy: z.boolean(),
  locale: z.string().default('en'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactSchema.parse(body);

    // Sanitize user inputs to prevent XSS attacks
    const sanitizedData = {
      ...validatedData,
      firstName: sanitizeString(validatedData.firstName),
      lastName: sanitizeString(validatedData.lastName),
      phone: sanitizeString(validatedData.phone),
      company: validatedData.company ? sanitizeString(validatedData.company) : undefined,
      projectType: sanitizeString(validatedData.projectType),
      budget: sanitizeString(validatedData.budget),
      timeline: sanitizeString(validatedData.timeline),
      message: sanitizeString(validatedData.message),
      requirements: validatedData.requirements ? sanitizeStringArray(validatedData.requirements) : undefined,
    };

    // Generate unique session ID for survey linking
    const sessionId = randomUUID();

    // Get client IP address and user agent for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rawUserAgent = request.headers.get('user-agent') || 'unknown';
    // Sanitize user agent to prevent XSS attacks
    const userAgent = sanitizeString(rawUserAgent);

    // Hash IP address for privacy (SHA-256)
    const ipAddressHash = createHash('sha256').update(ipAddress).digest('hex');

    // Generate survey link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fredonbytes.cloud';
    const surveyLink = `${siteUrl}/survey/${sessionId}`;

    // Store contact submission in database
    const { data: contactSubmission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        session_id: sessionId,
        first_name: sanitizedData.firstName,
        last_name: sanitizedData.lastName,
        email: validatedData.email, // Email not sanitized - already validated by Zod
        phone: sanitizedData.phone,
        company: sanitizedData.company || null,
        project_type: sanitizedData.projectType,
        budget: sanitizedData.budget,
        timeline: sanitizedData.timeline,
        message: sanitizedData.message,
        requirements: sanitizedData.requirements || null,
        newsletter_opt_in: validatedData.newsletter || false,
        privacy_accepted: validatedData.privacy,
        locale: validatedData.locale,
        ip_address_hash: ipAddressHash,
        user_agent: userAgent,
        survey_sent: false,
        survey_completed: false,
      })
      .select()
      .single();

    if (dbError || !contactSubmission) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store contact submission');
    }

    // Handle newsletter subscription
    if (validatedData.newsletter) {
      const { error: newsletterError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: validatedData.email, // Email not sanitized - already validated by Zod
          first_name: sanitizedData.firstName,
          last_name: sanitizedData.lastName,
          locale: validatedData.locale,
          active: true,
          source: 'contact_form',
        })
        .select()
        .single();

      // Ignore duplicate email errors (constraint violation)
      if (newsletterError && !newsletterError.message.includes('duplicate')) {
        console.error('Newsletter subscription error:', newsletterError);
      }
    }

    // Prepare email data
    const emailData: ContactEmailData = {
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      email: validatedData.email, // Email not sanitized - already validated by Zod
      phone: sanitizedData.phone,
      company: sanitizedData.company,
      projectType: sanitizedData.projectType,
      budget: sanitizedData.budget,
      timeline: sanitizedData.timeline,
      message: sanitizedData.message,
      requirements: sanitizedData.requirements,
      surveyLink,
      locale: validatedData.locale,
    };

    // Get translations for email subjects
    const { getTranslations } = await import('next-intl/server');
    const t = await getTranslations({ locale: validatedData.locale, namespace: 'emails' });

    // Send customer confirmation email with survey link
    const customerEmailHtml = await generateCustomerConfirmationHTML(emailData);
    const customerEmailText = await generateCustomerConfirmationText(emailData);

    const customerEmail = await sendEmail({
      from: 'Fredonbytes <noreply@fredonbytes.cloud>',
      to: validatedData.email,
      subject: t('customer.subject'),
      html: customerEmailHtml,
      text: customerEmailText,
    });

    // Send admin notification email
    const adminEmailHtml = await generateAdminContactNotificationHTML(emailData);
    const adminEmailText = await generateAdminContactNotificationText(emailData);

    const adminEmail = await sendEmail({
      from: 'Contact Form <noreply@fredonbytes.cloud>',
      to: 'info@fredonbytes.cloud',
      subject: `New Contact Form Submission from ${sanitizedData.firstName} ${sanitizedData.lastName}`,
      html: adminEmailHtml,
      text: adminEmailText,
      replyTo: validatedData.email,
    });

    // Create survey session for linking
    const { error: surveySessionError } = await supabase
      .from('survey_sessions')
      .insert({
        session_id: sessionId,
        contact_submission_id: contactSubmission.id,
        locale: validatedData.locale,
        ip_address_hash: ipAddressHash,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (surveySessionError) {
      console.error('Survey session creation error:', surveySessionError);
      // Don't fail the request if survey session creation fails
    }

    // Update survey_sent flag
    await supabase
      .from('contact_submissions')
      .update({ survey_sent: true })
      .eq('session_id', sessionId);

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        session_id: sessionId,
        customerEmailId: customerEmail.messageId,
        adminEmailId: adminEmail.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Disable caching for POST endpoint
export const dynamic = 'force-dynamic';
