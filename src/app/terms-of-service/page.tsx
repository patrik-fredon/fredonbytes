import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Fredonbytes',
  description: 'Read our terms of service to understand the legal framework governing the use of Fredonbytes services and website.',
  robots: 'index, follow',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Legal terms governing the use of our services
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Last updated: January 6, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Agreement Overview
              </h2>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                By accessing our website or using our services, you agree to be bound by these terms. Please read them carefully before proceeding.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                By accessing or using the Fredonbytes website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                These terms apply to all visitors, users, and others who access or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Services Description
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Fredonbytes provides comprehensive IT solutions including:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>Software development and web applications</li>
                <li>Graphic design and brand identity services</li>
                <li>SEO and digital marketing solutions</li>
                <li>Social media management</li>
                <li>IT consulting and cybersecurity services</li>
                <li>Related technical support and maintenance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. User Responsibilities
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                When using our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
                <li>Provide accurate and truthful information</li>
                <li>Use our services for lawful purposes only</li>
                <li>Respect intellectual property rights</li>
                <li>Not engage in harmful or disruptive activities</li>
                <li>Maintain the confidentiality of any login credentials</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Prohibited Uses
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                You may not use our services to:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Distribute malware or harmful code</li>
                <li>Engage in unauthorized data collection</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Service Agreements and Contracts
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Specific projects and services will be governed by separate written agreements that detail:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
                <li>Project scope and deliverables</li>
                <li>Timeline and milestones</li>
                <li>Payment terms and conditions</li>
                <li>Intellectual property ownership</li>
                <li>Confidentiality provisions</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                In case of conflict between these Terms of Service and a specific service agreement, the service agreement shall prevail.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Payment Terms
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Pricing and Invoicing
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
                <li>All prices are quoted in USD or EUR as specified</li>
                <li>Invoices are payable within 30 days of issue date</li>
                <li>Late payments may incur additional charges</li>
                <li>We reserve the right to suspend services for overdue accounts</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Refunds and Cancellations
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>Refund policies are specified in individual service agreements</li>
                <li>Work completed prior to cancellation is non-refundable</li>
                <li>Cancellation requests must be submitted in writing</li>
                <li>Custom development work may have different cancellation terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Intellectual Property
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Our Intellectual Property
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                The Fredonbytes website, logo, content, and methodologies are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Client Intellectual Property
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Ownership of deliverables and intellectual property created for clients will be specified in the relevant service agreement. Generally, clients retain ownership of their content and branding materials, while custom development may involve shared or transferred ownership rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Confidentiality
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We understand the importance of protecting confidential information. We commit to:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>Maintaining strict confidentiality of client information</li>
                <li>Using client information only for authorized purposes</li>
                <li>Implementing appropriate security measures</li>
                <li>Not disclosing confidential information to third parties</li>
                <li>Returning or destroying confidential information upon request</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Disclaimers and Limitations
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Service Availability
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                While we strive for high availability, we cannot guarantee uninterrupted access to our website or services. We reserve the right to modify, suspend, or discontinue services with reasonable notice.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Limitation of Liability
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Our liability is limited to the amount paid for the specific service giving rise to the claim. We are not liable for indirect, incidental, or consequential damages, including but not limited to loss of profits, data, or business opportunities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Data Protection and Privacy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We are committed to protecting your privacy and complying with applicable data protection laws, including GDPR. Our data practices are detailed in our Privacy Policy, which forms an integral part of these terms.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                By using our services, you consent to the collection, use, and processing of your data as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. Governing Law and Disputes
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                These terms are governed by the laws of the Czech Republic. Any disputes arising from these terms or our services will be subject to the exclusive jurisdiction of the courts in Brno, Czech Republic.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                We encourage resolving disputes through direct communication before pursuing legal action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective upon posting on our website. We will notify users of material changes via email or website notice.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Your continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                12. Termination
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Either party may terminate the service relationship with appropriate notice as specified in the relevant service agreement. Upon termination:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>All outstanding invoices become immediately due</li>
                <li>Access to our services and systems will be revoked</li>
                <li>Confidentiality obligations remain in effect</li>
                <li>Data return or destruction will be handled as agreed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                13. Contact Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>Fredonbytes</strong><br/>
                  Email: <a href="mailto:legal@fredonbytes.cloud" className="text-blue-600 dark:text-blue-400 hover:underline">legal@fredonbytes.cloud</a><br/>
                  Phone: <a href="tel:+420799027984" className="text-blue-600 dark:text-blue-400 hover:underline">+420 799 027 984</a><br/>
                  Address: Brno, Czech Republic
                </p>
              </div>
            </section>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Legal Notice
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                These terms constitute a legally binding agreement. If you do not agree to these terms, please discontinue use of our website and services immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}