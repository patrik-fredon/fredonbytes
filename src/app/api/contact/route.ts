import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import * as z from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

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
  privacy: z.boolean()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)
    
    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission - Fredonbytes</title>
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
              <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">fredonbytes.cloud</p>
            </div>
            
            <div class="content">
              <div class="section">
                <div class="label">Contact Information</div>
                <div class="value">
                  <strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}<br>
                  <strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a><br>
                  <strong>Phone:</strong> <a href="tel:${validatedData.phone}">${validatedData.phone}</a>
                  ${validatedData.company ? `<br><strong>Company:</strong> ${validatedData.company}` : ''}
                </div>
              </div>

              <div class="section">
                <div class="label">Project Details</div>
                <div class="value">
                  <strong>Type:</strong> ${validatedData.projectType}<br>
                  <strong>Budget:</strong> ${validatedData.budget}<br>
                  <strong>Timeline:</strong> ${validatedData.timeline}
                </div>
              </div>

              <div class="section">
                <div class="label">Project Description</div>
                <div class="value">${validatedData.message.replace(/\n/g, '<br>')}</div>
              </div>

              ${validatedData.requirements && validatedData.requirements.length > 0 ? `
                <div class="section">
                  <div class="label">Additional Requirements</div>
                  <div class="value">
                    <div class="requirements">
                      ${validatedData.requirements.map(req => `<span class="tag">${req}</span>`).join('')}
                    </div>
                  </div>
                </div>
              ` : ''}

              <div class="section">
                <div class="label">Preferences</div>
                <div class="value">
                  Newsletter subscription: ${validatedData.newsletter ? 'Yes' : 'No'}<br>
                  Privacy policy accepted: ${validatedData.privacy ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            <div class="footer">
              <p>This message was sent from the contact form on fredonbytes.cloud</p>
              <p>Please respond within 24 hours as promised on the website.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email to company
    const companyEmail = await resend.emails.send({
      from: 'Contact Form <noreply@fredonbytes.cloud>',
      to: ['info@fredonbytes.cloud'],
      subject: `New Contact Form Submission from ${validatedData.firstName} ${validatedData.lastName}`,
      html: emailHtml,
      replyTo: validatedData.email
    })

    // Send confirmation email to customer
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You - Fredonbytes</title>
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
              <h1 style="margin: 0; font-size: 24px;">Thank You, ${validatedData.firstName}!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your message has been received</p>
            </div>
            
            <div class="content">
              <div class="highlight">
                <h3 style="margin: 0 0 15px 0; color: #059669;">✓ Message Delivered Successfully</h3>
                <p style="margin: 0;">We've received your inquiry about <strong>${validatedData.projectType}</strong> and will respond within 24 hours.</p>
              </div>

              <h3>What happens next?</h3>
              <ol>
                <li><strong>Review (within 2 hours):</strong> Our team will review your requirements</li>
                <li><strong>Response (within 24 hours):</strong> We'll reach out to discuss your project</li>
                <li><strong>Consultation:</strong> Free strategy session to understand your needs</li>
                <li><strong>Proposal:</strong> Detailed project proposal and timeline</li>
              </ol>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="margin: 0 0 10px 0;">Your Project Summary:</h4>
                <p style="margin: 5px 0;"><strong>Type:</strong> ${validatedData.projectType}</p>
                <p style="margin: 5px 0;"><strong>Budget:</strong> ${validatedData.budget}</p>
                <p style="margin: 5px 0;"><strong>Timeline:</strong> ${validatedData.timeline}</p>
              </div>

              <p>In the meantime, feel free to:</p>
              <ul>
                <li>Check out our <a href="https://lib.fredonbytes.cloud">project portfolio</a></li>
                <li>Follow us on social media for updates</li>
                <li>Call us directly at <a href="tel:+420799027984">+420 799 027 984</a></li>
              </ul>

              <div style="text-align: center;">
                <a href="https://fredonbytes.cloud" class="cta">Visit Our Website</a>
              </div>
            </div>

            <div class="footer">
              <p><strong>Fredonbytes</strong> - Your All-in-One IT Powerhouse</p>
              <p>Brno, Czech Republic | info@fredonbytes.cloud | +420 799 027 984</p>
              <p style="font-size: 12px; margin-top: 15px;">
                Code. Create. Conquer.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const customerEmail = await resend.emails.send({
      from: 'Fredonbytes <noreply@fredonbytes.cloud>',
      to: [validatedData.email],
      subject: 'Thank you for contacting Fredonbytes - We\'ll be in touch soon!',
      html: customerEmailHtml
    })

    // If newsletter subscription is requested, add to list (you would implement this with your newsletter service)
    if (validatedData.newsletter) {
      // Add to newsletter list
      console.log(`Adding ${validatedData.email} to newsletter list`)
    }

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        companyEmailId: companyEmail.data?.id,
        customerEmailId: customerEmail.data?.id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form submission error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}