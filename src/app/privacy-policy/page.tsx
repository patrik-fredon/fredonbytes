import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Fredonbytes',
  description: 'Privacy Policy for Fredonbytes. Learn how we collect, use, and protect your personal information.',
  robots: 'index, follow',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Last updated: January 6, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Fredonbytes (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you visit our website 
                or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Personal Information
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Company information</li>
                <li>Project details and requirements</li>
                <li>Communication preferences</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Technical Information
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>IP address and browser information</li>
                <li>Website usage data and analytics</li>
                <li>Cookies and similar technologies</li>
                <li>Device information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>To provide and improve our services</li>
                <li>To communicate with you about projects and services</li>
                <li>To send marketing communications (with your consent)</li>
                <li>To analyze website usage and optimize user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Cookies and Tracking Technologies
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your browsing experience. You can control 
                cookie preferences through our cookie consent banner or your browser settings.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Types of Cookies We Use:
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Necessary Cookies:</strong> Essential for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                <li><strong>Marketing Cookies:</strong> Used for targeted advertising</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Data Sharing and Disclosure
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Your Rights (GDPR)
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Under GDPR, you have the following rights:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Data Security
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Contact Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                For any privacy-related questions or to exercise your rights, contact us:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Email:</strong> info@fredonbytes.cloud<br />
                  <strong>Phone:</strong> +420 799 027 984<br />
                  <strong>Address:</strong> Brno, Czech Republic
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any significant 
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}