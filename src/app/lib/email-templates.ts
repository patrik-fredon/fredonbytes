/**
 * Email template generation utilities for customer satisfaction form
 */

export interface FormResponseData {
  question_id: string;
  question_text: string;
  answer_value: string | string[];
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
        ? `<ul style="margin: 8px 0; padding-left: 20px;">${response.answer_value.map(val => `<li>${escapeHtml(val)}</li>`).join('')}</ul>`
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
