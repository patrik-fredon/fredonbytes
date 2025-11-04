import { createHash, randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import { validateCsrfToken, CSRF_TOKEN_HEADER_NAME } from "@/lib/csrf";
import { sendEmail } from "@/lib/email";
import {
  generateAdminContactNotificationHTML,
  generateAdminContactNotificationText,
  generateCustomerConfirmationHTML,
  generateCustomerConfirmationText,
  type ContactEmailData,
} from "@/lib/email-templates";
import { sanitizeString, sanitizeStringArray } from "@/lib/input-sanitization";
import { supabase } from "@/lib/supabase";

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
  locale: z.string().default("en"),
});

export async function POST(request: NextRequest) {
  try {
    // CSRF validation
    const csrfTokenFromHeader = request.headers.get(CSRF_TOKEN_HEADER_NAME);
    const csrfTokenFromCookie = request.cookies.get("csrf_token")?.value;

    if (
      !validateCsrfToken(
        csrfTokenFromHeader || null,
        csrfTokenFromCookie || null,
      )
    ) {
      return NextResponse.json(
        {
          error: "CSRF validation failed",
          message: "Invalid or missing CSRF token",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    // Validate the request body
    const validatedData = contactSchema.parse(body);

    // Sanitize user inputs to prevent XSS attacks
    const sanitizedData = {
      ...validatedData,
      firstName: sanitizeString(validatedData.firstName),
      lastName: sanitizeString(validatedData.lastName),
      phone: sanitizeString(validatedData.phone),
      company: validatedData.company
        ? sanitizeString(validatedData.company)
        : undefined,
      projectType: sanitizeString(validatedData.projectType),
      budget: sanitizeString(validatedData.budget),
      timeline: sanitizeString(validatedData.timeline),
      message: sanitizeString(validatedData.message),
      requirements: validatedData.requirements
        ? sanitizeStringArray(validatedData.requirements)
        : undefined,
    };

    // Generate unique session ID for survey linking
    const sessionId = randomUUID();

    // Get client IP address and user agent for tracking
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rawUserAgent = request.headers.get("user-agent") || "unknown";
    // Sanitize user agent to prevent XSS attacks
    const userAgent = sanitizeString(rawUserAgent);

    // Hash IP address for privacy (SHA-256)
    const ipAddressHash = createHash("sha256").update(ipAddress).digest("hex");

    // Generate survey link
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://fredonbytes.cloud";
    const surveyLink = `${siteUrl}/survey/${sessionId}`;

    // Prepare database operations for parallel execution
    const surveyQuestionnaireId = "22222222-2222-2222-2222-222222222222";

    const contactInsertPromise = (supabase as any)
      .from("contact_submissions")
      .insert({
        first_name: sanitizedData.firstName,
        last_name: sanitizedData.lastName,
        email: validatedData.email,
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

    const newsletterPromise = validatedData.newsletter
      ? (supabase as any)
          .from("newsletter_subscribers")
          .insert({
            email: validatedData.email,
            first_name: sanitizedData.firstName,
            last_name: sanitizedData.lastName,
            locale: validatedData.locale,
            active: true,
            source: "contact_form",
          })
          .select()
          .single()
      : Promise.resolve({ data: null, error: null });

    const sessionInsertPromise = (supabase as any)
      .from("sessions")
      .insert({
        session_id: sessionId,
        questionnaire_id: surveyQuestionnaireId,
        locale: validatedData.locale,
        ip_address_hash: ipAddressHash,
        user_agent: userAgent,
        email: validatedData.email,
        newsletter_optin: validatedData.newsletter || false,
      });

    // Execute all inserts in parallel
    const [contactResult, newsletterResult, sessionResult] = await Promise.all(
      [contactInsertPromise, newsletterPromise, sessionInsertPromise],
    );

    // Handle contact submission error
    if (contactResult.error || !contactResult.data) {
      console.error("Database error:", contactResult.error);
      throw new Error("Failed to store contact submission");
    }

    const contactSubmission = contactResult.data;

    // Log newsletter subscription errors (ignore duplicates)
    if (
      newsletterResult.error &&
      !newsletterResult.error.message.includes("duplicate")
    ) {
      console.error("Newsletter subscription error:", newsletterResult.error);
    }

    // Log session creation errors (non-critical)
    if (sessionResult.error) {
      console.error("Session creation error:", sessionResult.error);
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
    const { getTranslations } = await import("next-intl/server");
    const t = await getTranslations({
      locale: validatedData.locale,
      namespace: "emails",
    });

    // Send customer confirmation email with survey link
    const customerEmailHtml = await generateCustomerConfirmationHTML(emailData);
    const customerEmailText = await generateCustomerConfirmationText(emailData);

    const customerEmail = await sendEmail({
      from: "Fredonbytes <info@fredonbytes.com>",
      to: validatedData.email,
      subject: t("customer.subject"),
      html: customerEmailHtml,
      text: customerEmailText,
    });

    if (!customerEmail.success) {
      console.error("Failed to send customer email:", customerEmail.error);
      throw new Error(
        `Failed to send confirmation email: ${customerEmail.error}`,
      );
    }

    // Send admin notification email
    const adminEmailHtml =
      await generateAdminContactNotificationHTML(emailData);
    const adminEmailText =
      await generateAdminContactNotificationText(emailData);

    const adminEmail = await sendEmail({
      from: "Contact Form <info@fredonbytes.com>",
      to: "info@fredonbytes.cloud",
      subject: `New Contact Form Submission from ${sanitizedData.firstName} ${sanitizedData.lastName}`,
      html: adminEmailHtml,
      text: adminEmailText,
      replyTo: validatedData.email,
    });

    if (!adminEmail.success) {
      console.error("Failed to send admin email:", adminEmail.error);
      throw new Error(`Failed to send admin notification: ${adminEmail.error}`);
    }

    // Link session to contact submission if session was created successfully
    if (!sessionResult.error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("contact_submissions")
        .update({
          session_id: sessionId,
          survey_sent: true,
        })
        .eq("id", (contactSubmission as any).id);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        session_id: sessionId,
        customerEmailId: customerEmail.messageId,
        adminEmailId: adminEmail.messageId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form submission error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Disable caching for POST endpoint
export const dynamic = "force-dynamic";
