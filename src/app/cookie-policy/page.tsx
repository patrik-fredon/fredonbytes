import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - Fredonbytes',
  description: 'Cookie Policy for Fredonbytes. Learn about how we use cookies and similar technologies on our website.',
  robots: 'index, follow',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Last updated: January 6, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. What Are Cookies?
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. How We Use Cookies
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We use cookies to enhance your browsing experience, analyze website traffic, personalize content, 
                and serve targeted advertisements. Our cookies help us understand how you interact with our website 
                and improve our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Types of Cookies We Use
              </h2>
              
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    🔒 Necessary Cookies
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    These cookies are essential for the website to function properly. They enable basic functions 
                    like page navigation, access to secure areas, and remembering your cookie preferences.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Cannot be disabled:</strong> These cookies are strictly necessary for the website to work.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    📊 Analytics Cookies
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and 
                    reporting information anonymously. This includes page views, time spent on pages, and click patterns.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-sm space-y-1">
                    <li>Google Analytics</li>
                    <li>Website performance monitoring</li>
                    <li>User behavior analysis</li>
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    🎯 Marketing Cookies
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    These cookies are used to deliver relevant advertisements and measure their effectiveness. 
                    They track your browsing habits and are used to build a profile of your interests.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-sm space-y-1">
                    <li>Google Ads and remarketing</li>
                    <li>Social media advertising pixels</li>
                    <li>Conversion tracking</li>
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    ⚙️ Preference Cookies
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                    These cookies allow the website to remember choices you make and provide enhanced, 
                    more personal features. They may be set by us or by third-party providers.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-sm space-y-1">
                    <li>Language and region preferences</li>
                    <li>Dark/light mode settings</li>
                    <li>Form auto-fill preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Third-Party Cookies
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Our website may contain content from third-party services that may set their own cookies. 
                These include:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Google Fonts:</strong> For displaying custom fonts</li>
                <li><strong>Social Media Platforms:</strong> For social sharing and embedded content</li>
                <li><strong>Payment Processors:</strong> For secure payment processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Managing Your Cookie Preferences
              </h2>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Cookie Consent Banner
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                When you first visit our website, you&apos;ll see a cookie consent banner where you can:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-6">
                <li>Accept all cookies</li>
                <li>Accept only necessary cookies</li>
                <li>Customize your preferences for each cookie type</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Browser Settings
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                You can also control cookies through your browser settings:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies</li>
                <li><strong>Firefox:</strong> Preferences &gt; Privacy &amp; Security</li>
                <li><strong>Safari:</strong> Preferences &gt; Privacy</li>
                <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Cookie Retention
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 30 days to 2 years)</li>
                <li><strong>Preference Cookies:</strong> Remain until you change your settings or clear your browser data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Impact of Disabling Cookies
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                If you choose to disable certain cookies, some features of our website may not function properly:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2">
                <li>Contact forms may not remember your information</li>
                <li>Personalized content and recommendations may not work</li>
                <li>Website analytics will be limited</li>
                <li>Targeted advertising will be less relevant</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Updates to This Policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in technology, 
                legislation, or our business practices. We will notify you of any significant changes 
                by updating the &quot;Last updated&quot; date at the top of this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. Contact Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Email:</strong> info@fredonbytes.cloud<br />
                  <strong>Phone:</strong> +420 799 027 984<br />
                  <strong>Address:</strong> Brno, Czech Republic
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}