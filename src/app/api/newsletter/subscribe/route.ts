import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { CSRF_TOKEN_HEADER_NAME, validateCsrfToken } from "@/lib/csrf";
import { sanitizeString } from "@/lib/input-sanitization";
import { supabase } from "@/lib/supabase";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  locale: z.string().default("en"),
  source: z.string().default("website"),
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
    const validatedData = newsletterSchema.parse(body);

    // Sanitize inputs
    const sanitizedData = {
      email: validatedData.email.toLowerCase().trim(), // Email doesn't need sanitization, just normalization
      first_name: validatedData.first_name
        ? sanitizeString(validatedData.first_name)
        : null,
      last_name: validatedData.last_name
        ? sanitizeString(validatedData.last_name)
        : null,
      locale: validatedData.locale,
      source: sanitizeString(validatedData.source),
    };

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id, active, unsubscribed_at")
      .eq("email", sanitizedData.email)
      .maybeSingle();

    if (existingSubscriber) {
      // If subscriber exists and is active
      if ((existingSubscriber as { active: boolean }).active) {
        return NextResponse.json(
          {
            success: true,
            message: "Already subscribed to newsletter",
          },
          { status: 200 },
        );
      }

      // If subscriber exists but unsubscribed, reactivate
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          active: true,
          unsubscribed_at: null,
          first_name: sanitizedData.first_name,
          last_name: sanitizedData.last_name,
        } as never)
        .eq("id", (existingSubscriber as { id: string }).id);

      if (updateError) {
        console.error(
          "Error reactivating newsletter subscription:",
          updateError,
        );
        throw new Error("Failed to reactivate subscription");
      }

      // Send welcome back email for reactivated subscriber
      try {
        const { sendEmail } = await import("@/lib/email");
        const { generateNewsletterWelcomeHTML, generateNewsletterWelcomeText } =
          await import("@/lib/email-templates");
        const { getTranslations } = await import("next-intl/server");

        const t = await getTranslations({
          locale: sanitizedData.locale,
          namespace: "emails",
        });

        const emailHtml = await generateNewsletterWelcomeHTML({
          email: sanitizedData.email,
          firstName: sanitizedData.first_name || undefined,
          lastName: sanitizedData.last_name || undefined,
          locale: sanitizedData.locale,
        });

        const emailText = await generateNewsletterWelcomeText({
          email: sanitizedData.email,
          firstName: sanitizedData.first_name || undefined,
          lastName: sanitizedData.last_name || undefined,
          locale: sanitizedData.locale,
        });

        const { domainConfig } = await import("@/lib/domain-config");

        await sendEmail({
          from: `Fredonbytes Newsletter <${domainConfig.supportEmail}>`,
          to: sanitizedData.email,
          subject: t("newsletter.subject"),
          html: emailHtml,
          text: emailText,
        });

        console.log("Newsletter reactivation email sent successfully");
      } catch (emailError) {
        console.error(
          "Error sending newsletter reactivation email:",
          emailError,
        );
        // Don't fail the request if email fails
      }

      return NextResponse.json(
        {
          success: true,
          message: "Newsletter subscription reactivated",
        },
        { status: 200 },
      );
    }

    // Create new subscriber
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: sanitizedData.email,
        first_name: sanitizedData.first_name,
        last_name: sanitizedData.last_name,
        locale: sanitizedData.locale,
        active: true,
        source: sanitizedData.source,
      } as never);

    if (insertError) {
      console.error("Error creating newsletter subscription:", insertError);
      throw new Error("Failed to subscribe to newsletter");
    }

    // Send welcome email to new subscriber
    try {
      const { sendEmail } = await import("@/lib/email");
      const { generateNewsletterWelcomeHTML, generateNewsletterWelcomeText } =
        await import("@/lib/email-templates");
      const { getTranslations } = await import("next-intl/server");

      const t = await getTranslations({
        locale: sanitizedData.locale,
        namespace: "emails",
      });

      const emailHtml = await generateNewsletterWelcomeHTML({
        email: sanitizedData.email,
        firstName: sanitizedData.first_name || undefined,
        lastName: sanitizedData.last_name || undefined,
        locale: sanitizedData.locale,
      });

      const emailText = await generateNewsletterWelcomeText({
        email: sanitizedData.email,
        firstName: sanitizedData.first_name || undefined,
        lastName: sanitizedData.last_name || undefined,
        locale: sanitizedData.locale,
      });

      const { domainConfig } = await import("@/lib/domain-config");

      await sendEmail({
        from: `Fredonbytes Newsletter <${domainConfig.supportEmail}>`,
        to: sanitizedData.email,
        subject: t("newsletter.subject"),
        html: emailHtml,
        text: emailText,
      });

      console.log("Newsletter welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending newsletter welcome email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid data",
          message: error.errors[0]?.message || "Validation failed",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Failed to subscribe",
      },
      { status: 500 },
    );
  }
}

// Disable caching for POST endpoint
export const dynamic = "force-dynamic";
