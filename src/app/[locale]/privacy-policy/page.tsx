import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Fredonbytes',
  description: 'Learn how Fredonbytes collects, uses, and protects your personal information. Our comprehensive privacy policy explains your rights and our data practices.',
  robots: 'index, follow',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              How we collect, use, and protect your information
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Last updated: January 6, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Summary
              </h2>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Personal Information
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We may collect the following personal information when you contact us or use our services:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>Name and contact information (email address, phone number)</li>
                <li>Company information and job title</li>
                <li>Project requirements and preferences</li>
                <li>Communication history and correspondence</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Technical Information
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We automatically collect certain technical information when you visit our website:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referral source and exit pages</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We use your personal information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>To respond to your inquiries and provide our services</li>
                <li>To communicate with you about your projects</li>
                <li>To improve our website and services</li>
                <li>To send you newsletters and updates (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Cookies and Tracking Technologies
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We use cookies and similar technologies to enhance your browsing experience:
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Essential Cookies
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Required for basic website functionality and cannot be disabled.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Analytics Cookies
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Help us understand how visitors interact with our website to improve user experience.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Marketing Cookies
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                Used to deliver relevant advertisements and measure campaign effectiveness.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>With trusted service providers who assist in delivering our services</li>
                <li>When required by law or to protect our legal rights</li>
                <li>In connection with a business transfer or acquisition</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Data Security
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal data:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Staff training on data protection practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Your Rights
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Under applicable data protection laws, you have the following rights:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Data Retention
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                We retain your personal data only as long as necessary for the purposes outlined in this policy or as required by law. 
                Generally, we retain client information for 7 years after the completion of services for business and legal purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. International Transfers
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                As we are based in the Czech Republic (EU), your data is processed within the European Economic Area. 
                Any transfers outside the EEA will be subject to appropriate safeguards and legal protections.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Updates to This Policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website 
                and updating the &ldquo;Last updated&rdquo; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. Contact Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                If you have any questions about this privacy policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>Fredonbytes</strong><br/>
                  Email: <a href="mailto:privacy@fredonbytes.cloud" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@fredonbytes.cloud</a><br/>
                  Phone: <a href="tel:+420799027984" className="text-blue-600 dark:text-blue-400 hover:underline">+420 799 027 984</a><br/>
                  Address: Brno, Czech Republic
                </p>
              </div>
            </section>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                Questions?
              </h3>
              <p className="text-green-800 dark:text-green-200 text-sm">
                We&apos;re committed to transparency and protecting your privacy. If you have any questions or concerns about how we handle your data, 
                don&apos;t hesitate to reach out to us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}