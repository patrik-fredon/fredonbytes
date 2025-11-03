/**
 * Email template generation utilities for customer satisfaction form
 */

export interface FormResponseData {
  question_id: string;
  question_text: string;
  answer_value: string | string[] | number;
  answer_type: string;
}

export interface AdminNotificationData {
  session_id: string;
  timestamp: string;
  responses: FormResponseData[];
}

/**
 * Generates HTML email template for admin notification
 * @param data - Survey response data including session_id, timestamp, and responses
 * @returns HTML string for email body
 */
export function generateAdminNotificationHTML(data: AdminNotificationData): string {
  const { session_id, timestamp, responses } = data;

  // Format timestamp for display
  const formattedDate = new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  });

  // Generate response sections
  const responsesHtml = responses
    .map((response, index) => {
      const answerDisplay = Array.isArray(response.answer_value)
        ? `<ul style="margin: 8px 0; padding-left: 20px;">${response.answer_value.map(val => `<li>${escapeHtml(String(val))}</li>`).join('')}</ul>`
        : `<p style="margin: 8px 0;">${escapeHtml(String(response.answer_value))}</p>`;

      return `
        <div class="response" style="background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #3b82f6; border-radius: 6px;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="background: #3b82f6; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 12px;">${index + 1}</span>
            <h3 style="margin: 0; color: #1e293b; font-size: 16px;">${escapeHtml(response.question_text)}</h3>
          </div>
          <div style="color: #475569; font-size: 14px;">
            ${answerDisplay}
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: #94a3b8;">
            Type: ${response.answer_type}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Satisfaction Survey Results - FredonBytes</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 40px 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 0;
            opacity: 0.95;
            font-size: 16px;
          }
          .content {
            background: #f8fafc;
            padding: 30px;
            border-radius: 0 0 12px 12px;
          }
          .info-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border: 1px solid #e2e8f0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f1f5f9;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #64748b;
            font-size: 14px;
          }
          .info-value {
            color: #1e293b;
            font-size: 14px;
            font-family: 'Courier New', monospace;
          }
          .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
          }
          .footer p {
            margin: 5px 0;
          }
          .badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Customer Satisfaction Survey</h1>
            <p>New submission received<span class="badge">NEW</span></p>
          </div>

          <div class="content">
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Session ID:</span>
                <span class="info-value">${escapeHtml(session_id)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Submitted:</span>
                <span class="info-value">${formattedDate}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Total Responses:</span>
                <span class="info-value">${responses.length} question${responses.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <h2 class="section-title">Survey Responses</h2>
            ${responsesHtml}

            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin-top: 30px;">
              <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">💡 Next Steps</h3>
              <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                <li>Review the customer feedback</li>
                <li>Identify areas for improvement</li>
                <li>Follow up with the customer if needed</li>
                <li>Update satisfaction metrics in your dashboard</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p><strong>FredonBytes</strong> - Customer Satisfaction System</p>
            <p>This email was automatically generated from fredonbytes.cloud</p>
            <p style="font-size: 12px; margin-top: 15px; color: #94a3b8;">
              Session ID: ${escapeHtml(session_id)}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param text - Text to escape
 * @returns Escaped text safe for HTML
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}


// Contact form email template interfaces
export interface ContactEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  requirements?: string[];
  surveyLink?: string;
  locale: string;
}

/**
 * Get email translations for a specific locale using next-intl
 * @param locale - The locale code (en, cs, de)
 * @returns Promise with translation function
 */
async function getEmailTranslations(locale: string) {
  const { getTranslations } = await import('next-intl/server');
  return await getTranslations({ locale, namespace: 'emails' });
}

/**
 * Generates HTML email template for customer confirmation
 * @param data - Contact form data including customer details and survey link
 * @returns Promise with HTML string for email body
 */
export async function generateCustomerConfirmationHTML(data: ContactEmailData): Promise<string> {
  const t = await getEmailTranslations(data.locale);
  const surveySection = data.surveyLink
    ? `
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
        <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">📊 ${t('customer.surveyInvitation')}</h3>
        <a href="${data.surveyLink}" class="cta" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 10px 0; font-weight: 600;">
          ${t('customer.surveyButton')}
        </a>
      </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t('customer.thankYou')} - ${t('common.companyName')}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; }
          .cta { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">${t('customer.greeting')}, ${escapeHtml(data.firstName)}!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${t('customer.thankYou')}</p>
          </div>

          <div class="content">
            <div class="highlight">
              <h3 style="margin: 0 0 15px 0; color: #059669;">✓ ${t('customer.confirmationMessage')}</h3>
              <p style="margin: 0;">${t('customer.responseTime')}</p>
            </div>

            ${surveySection}

            <h3>${t('customer.whatHappensNext')}</h3>
            <ol>
              <li>${t('customer.steps.review')}</li>
              <li>${t('customer.steps.response')}</li>
              <li>${t('customer.steps.consultation')}</li>
              <li>${t('customer.steps.proposal')}</li>
            </ol>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px 0;">${t('customer.projectSummary')}</h4>
              <p style="margin: 5px 0;"><strong>${t('admin.projectDetails')}:</strong> ${escapeHtml(data.projectType)}</p>
              <p style="margin: 5px 0;"><strong>Budget:</strong> ${escapeHtml(data.budget)}</p>
              <p style="margin: 5px 0;"><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
            </div>

            <p>${t('customer.inTheMeantime')}</p>
            <ul>
              ${t.raw('customer.suggestions').map((s: string) => `<li>${s}</li>`).join('')}
            </ul>

            <div style="text-align: center;">
              <a href="https://fredonbytes.cloud" class="cta">${t('customer.visitWebsite')}</a>
            </div>
          </div>

          <div class="footer">
            <p><strong>${t('common.companyName')}</strong> - ${t('common.tagline')}</p>
            <p>${t('common.location')} | info@fredonbytes.cloud | +420 799 027 984</p>
            <p style="font-size: 12px; margin-top: 15px;">
              Code. Create. Conquer.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generates plain text version of customer confirmation email
 * @param data - Contact form data
 * @returns Promise with plain text string for email body
 */
export async function generateCustomerConfirmationText(data: ContactEmailData): Promise<string> {
  const t = await getEmailTranslations(data.locale);
  const surveySection = data.surveyLink
    ? `\n\n${t('customer.surveyInvitation')}\n${t('customer.surveyButton')}: ${data.surveyLink}\n`
    : '';

  return `
${t('customer.greeting')}, ${data.firstName}!

${t('customer.thankYou')}

✓ ${t('customer.confirmationMessage')}
${t('customer.responseTime')}
${surveySection}

${t('customer.whatHappensNext')}

1. ${t('customer.steps.review')}
2. ${t('customer.steps.response')}
3. ${t('customer.steps.consultation')}
4. ${t('customer.steps.proposal')}

${t('customer.projectSummary')}
- ${t('admin.projectDetails')}: ${data.projectType}
- Budget: ${data.budget}
- Timeline: ${data.timeline}

${t('customer.inTheMeantime')}
- Check out our project portfolio: https://fredonbytes.cloud
- Follow us on social media for updates
- Call us directly at +420 799 027 984

---
${t('common.companyName')} - ${t('common.tagline')}
${t('common.location')} | info@fredonbytes.cloud | +420 799 027 984
Code. Create. Conquer.
  `.trim();
}

/**
 * Generates HTML email template for admin notification about contact form submission
 * @param data - Contact form data
 * @returns HTML string for email body
 */
export async function generateAdminContactNotificationHTML(data: ContactEmailData): Promise<string> {
  const t = await getEmailTranslations(data.locale);
  const requirementsHtml =
    data.requirements && data.requirements.length > 0
      ? `
        <div class="section">
          <div class="label">${t('admin.additionalRequirements')}</div>
          <div class="value">
            <div class="requirements">
              ${data.requirements.map((req) => `<span class="tag">${escapeHtml(req)}</span>`).join('')}
            </div>
          </div>
        </div>
      `
      : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t('admin.newSubmission')} - ${t('common.companyName')}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 25px; }
          .label { font-weight: 600; color: #475569; margin-bottom: 5px; }
          .value { background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #3b82f6; }
          .requirements { display: flex; flex-wrap: wrap; gap: 8px; }
          .tag { background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 16px; font-size: 14px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">${t('admin.newSubmission')}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">fredonbytes.cloud</p>
          </div>

          <div class="content">
            <div class="section">
              <div class="label">${t('admin.contactInfo')}</div>
              <div class="value">
                <strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}<br>
                <strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a><br>
                <strong>Phone:</strong> <a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>
                ${data.company ? `<br><strong>Company:</strong> ${escapeHtml(data.company)}` : ''}
              </div>
            </div>

            <div class="section">
              <div class="label">${t('admin.projectDetails')}</div>
              <div class="value">
                <strong>Type:</strong> ${escapeHtml(data.projectType)}<br>
                <strong>Budget:</strong> ${escapeHtml(data.budget)}<br>
                <strong>Timeline:</strong> ${escapeHtml(data.timeline)}
              </div>
            </div>

            <div class="section">
              <div class="label">${t('admin.projectDescription')}</div>
              <div class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
            </div>

            ${requirementsHtml}

            <div class="section">
              <div class="label">${t('admin.preferences')}</div>
              <div class="value">
                ${t('admin.newsletterSubscription')}: ${data.requirements?.includes('newsletter') ? t('admin.yes') : t('admin.no')}<br>
                ${t('admin.privacyAccepted')}: ${t('admin.yes')}
              </div>
            </div>
          </div>

          <div class="footer">
            <p>${t('admin.footerNote')}</p>
            <p>${t('admin.respondWithin')}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Survey thank you email data interface
 */
export interface SurveyThankYouData {
  firstName: string;
  email: string;
  locale: string;
}

/**
 * Generates HTML email template for survey completion thank you
 * @param data - Survey completion data including customer details
 * @returns Promise with HTML string for email body
 */
export async function generateSurveyThankYouHTML(data: SurveyThankYouData): Promise<string> {
  const t = await getEmailTranslations(data.locale);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t('survey.thankYou')} - ${t('common.companyName')}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 40px 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 ${t('survey.thankYou')}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${t('survey.feedbackReceived')}</p>
          </div>

          <div class="content">
            <p>${t('survey.greeting')}, ${escapeHtml(data.firstName)}!</p>
            
            <div class="highlight">
              <h3 style="margin: 0 0 15px 0; color: #059669;">✓ ${t('survey.completionMessage')}</h3>
              <p style="margin: 0;">${t('survey.feedbackValue')}</p>
            </div>

            <h3>${t('survey.whatNext')}</h3>
            <ul>
              <li>${t('survey.reviewFeedback')}</li>
              <li>${t('survey.improveServices')}</li>
              <li>${t('survey.followUp')}</li>
            </ul>

            <p>${t('survey.gratitude')}</p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fredonbytes.cloud" style="background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block;">${t('customer.visitWebsite')}</a>
            </div>
          </div>

          <div class="footer">
            <p><strong>${t('common.companyName')}</strong> - ${t('common.tagline')}</p>
            <p>${t('common.location')} | info@fredonbytes.cloud | +420 799 027 984</p>
            <p style="font-size: 12px; margin-top: 15px;">
              Code. Create. Conquer.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generates plain text version of survey thank you email
 * @param data - Survey completion data
 * @returns Promise with plain text string for email body
 */
export async function generateSurveyThankYouText(data: SurveyThankYouData): Promise<string> {
  const t = await getEmailTranslations(data.locale);

  return `
🎉 ${t('survey.thankYou')}

${t('survey.greeting')}, ${data.firstName}!

${t('survey.feedbackReceived')}

✓ ${t('survey.completionMessage')}
${t('survey.feedbackValue')}

${t('survey.whatNext')}

1. ${t('survey.reviewFeedback')}
2. ${t('survey.improveServices')}
3. ${t('survey.followUp')}

${t('survey.gratitude')}

Visit us: https://fredonbytes.cloud

---
${t('common.companyName')} - ${t('common.tagline')}
${t('common.location')} | info@fredonbytes.cloud | +420 799 027 984
Code. Create. Conquer.
  `.trim();
}

/**
 * Generates plain text version of admin notification email
 * @param data - Contact form data
 * @returns Plain text string for email body
 */
export async function generateAdminContactNotificationText(data: ContactEmailData): Promise<string> {
  const t = await getEmailTranslations(data.locale);
  const requirementsText =
    data.requirements && data.requirements.length > 0
      ? `\n${t('admin.additionalRequirements')}:\n${data.requirements.map((req) => `- ${req}`).join('\n')}\n`
      : '';

  return `
${t('admin.newSubmission')}
fredonbytes.cloud

${t('admin.contactInfo')}:
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
${data.company ? `Company: ${data.company}` : ''}

${t('admin.projectDetails')}:
Type: ${data.projectType}
Budget: ${data.budget}
Timeline: ${data.timeline}

${t('admin.projectDescription')}:
${data.message}
${requirementsText}

${t('admin.preferences')}:
${t('admin.newsletterSubscription')}: ${data.requirements?.includes('newsletter') ? t('admin.yes') : t('admin.no')}
${t('admin.privacyAccepted')}: ${t('admin.yes')}

---
${t('admin.footerNote')}
${t('admin.respondWithin')}
  `.trim();
}
