import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Fredonbytes',
  description: 'Terms of Service for Fredonbytes. Learn about the terms and conditions for using our website and services.',
  robots: 'index, follow',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Last updated: January 6, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                By accessing and using the Fredonbytes website and services, you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Description of Service
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Fredonbytes provides comprehensive IT solutions including software development, web design, 
                mobile app development, SEO, digital marketing, and related services (&quot;Services&quot;).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Use License
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Permission is granted to temporarily access the materials on Fredonbytes&apos; website for 
                personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Service Terms
              </h2>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Project Agreements
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>All projects require a signed agreement before work begins</li>
                <li>Project scope, timeline, and deliverables will be clearly defined</li>
                <li>Changes to project scope may result in additional costs</li>
                <li>Client approval is required at designated milestones</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Payment Terms
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li>Payment terms will be specified in individual project agreements</li>
                <li>Late payments may incur additional charges</li>
                <li>Refunds are subject to the terms outlined in project agreements</li>
                <li>All prices are exclusive of applicable taxes unless stated otherwise</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Upon full payment, clients will own the rights to custom work created specifically for them. 
                However, Fredonbytes retains rights to:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>General methodologies, concepts, and techniques</li>
                <li>Pre-existing intellectual property and frameworks</li>
                <li>The right to showcase completed work in our portfolio</li>
                <li>Any improvements to our general knowledge and expertise</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Client Responsibilities
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Clients are responsible for:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Providing accurate and complete information</li>
                <li>Timely feedback and approvals</li>
                <li>Providing necessary access to systems and accounts</li>
                <li>Ensuring they have rights to any materials they provide</li>
                <li>Backup of their data and systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Disclaimer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                The materials on Fredonbytes&apos; website are provided on an &apos;as is&apos; basis. Fredonbytes makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including without limitation, 
                implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
                of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Limitations of Liability
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                In no event shall Fredonbytes or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use the materials on Fredonbytes&apos; website, even if Fredonbytes or an authorized representative has been 
                notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Privacy Policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the 
                website, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. Termination
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We may terminate or suspend your access to our services immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                11. Governing Law
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of the Czech Republic.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                12. Contact Information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
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
                13. Changes to Terms
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}